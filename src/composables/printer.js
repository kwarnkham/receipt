import domtoimage from "dom-to-image";
import { ref } from "vue";

export default function usePrinter (width = 360) {
  const height = ref(0)
  const printCharacteristic = ref(null)

  const sendTextData = (input) => {
    return new Promise((resolve, reject) => {
      // Get the bytes for the text
      const encoder = new TextEncoder("utf-8");
      // Add line feed + carriage return chars to text
      const text = encoder.encode(input + '\u000A\u000D');
      printCharacteristic.value.writeValue(text).then(() => {
        resolve()
      }).catch(() => {
        printCharacteristic.value = null
        reject()
      });
    })
  }
  const generateImageData = async (node) => {
    height.value = node.clientHeight;
    const dataUrl = await domtoimage.toPng(node)

    const printTarget = new Image();
    printTarget.src = dataUrl;

    // Use the canvas to get image data
    const canvas = document.createElement("canvas");
    // Canvas dimensions need to be a multiple of 40 for this printer
    canvas.width = width;
    canvas.height = height.value;
    const context = canvas.getContext("2d");
    context.drawImage(printTarget, 0, 0, canvas.width, canvas.height);
    return context.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    ).data
  }
  const getDarkPixel = (x, y, imageData) => {
    // Return the pixels that will be printed black
    let red = imageData[(width * y + x) * 4];
    let green = imageData[(width * y + x) * 4 + 1];
    let blue = imageData[(width * y + x) * 4 + 2];
    return red + green + blue > 0 ? 1 : 0;
  }
  const getImagePrintData = (imageData) => {
    if (imageData == null) {
      console.log("No image to print!");
      return new Uint8Array([]);
    }
    // Each 8 pixels in a row is represented by a byte
    let printData = new Uint8Array((width / 8) * height.value + 8);
    // Set the header bytes for printing the image
    printData[0] = 29; // Print raster bitmap
    printData[1] = 118; // Print raster bitmap
    printData[2] = 48; // Print raster bitmap
    printData[3] = 0; // Normal 203.2 DPI
    printData[4] = width / 8; // Number of horizontal data bits (LSB)
    printData[5] = 0; // Number of horizontal data bits (MSB)
    printData[6] = height.value % 256; // Number of vertical data bits (LSB)
    printData[7] = height.value / 256; // Number of vertical data bits (MSB)
    let offset = 7;
    // Loop through image rows in bytes
    for (let i = 0; i < height.value; ++i) {
      for (let k = 0; k < width / 8; ++k) {
        let k8 = k * 8;
        //  Pixel to bit position mapping
        printData[++offset] =
          getDarkPixel(k8 + 0, i, imageData) * 128 +
          getDarkPixel(k8 + 1, i, imageData) * 64 +
          getDarkPixel(k8 + 2, i, imageData) * 32 +
          getDarkPixel(k8 + 3, i, imageData) * 16 +
          getDarkPixel(k8 + 4, i, imageData) * 8 +
          getDarkPixel(k8 + 5, i, imageData) * 4 +
          getDarkPixel(k8 + 6, i, imageData) * 2 +
          getDarkPixel(k8 + 7, i, imageData);
      }
    }
    return printData;
  }
  const sendImageData = async (node) => {
    const imageData = await generateImageData(node)
    let index = 0;
    let imagePrintData = getImagePrintData(imageData);
    const sendNextImageDataBatch = async (resolve, reject) => {
      const max = 512 / 2;
      if (index + max < imagePrintData.length) {
        try {
          await printCharacteristic.value.writeValue(imagePrintData.slice(index, index + max))
        } catch (error) {
          printCharacteristic.value = null
        }
        index += max;
        sendNextImageDataBatch(resolve, reject);
      } else {
        // Send the last bytes
        if (index < imagePrintData.length) {
          try {
            await printCharacteristic.value
              .writeValue(imagePrintData.slice(index, imagePrintData.length))
          } catch (error) {
            printCharacteristic.value = null
          }
          resolve();
        } else {
          resolve();
        }
      }
    }
    return new Promise((resolve, reject) => {
      sendNextImageDataBatch(resolve, reject);
    });

  }
  const sendPrinterData = (node) => {
    return new Promise((resolve, reject) => {
      if (!printCharacteristic.value) {
        navigator.bluetooth
          .requestDevice({
            filters: [
              {
                services: ["000018f0-0000-1000-8000-00805f9b34fb"],
              },
            ],
          })
          .then((device) => {
            console.log("> Found " + device.name);
            console.log("Connecting to GATT Server...");
            return device.gatt.connect();
          })
          .then((server) =>
            server.getPrimaryService("000018f0-0000-1000-8000-00805f9b34fb")
          )
          .then((service) =>
            service.getCharacteristic(
              "00002af1-0000-1000-8000-00805f9b34fb"
            )
          )
          .then((characteristic) => {
            // Cache the characteristic
            printCharacteristic.value = characteristic
            sendImageData(node).then(() => {
              resolve()
            });
          })
      } else {
        sendImageData(node).then(() => {
          resolve()
        });
      }
    })

  }
  return {
    generateImageData,
    getDarkPixel,
    getImagePrintData,
    sendImageData,
    sendPrinterData,
    sendTextData
  }
}

