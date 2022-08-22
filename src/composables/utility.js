import { copyToClipboard, Notify } from "quasar";

export default function useUtility() {
  return {
    removeFalsyProperty: (object) => {
      const keys = Object.keys(object);
      keys.forEach((key) => {
        if (!object[key]) object[key] = undefined;
      });
      return object;
    },
    readPicture: (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = ({ target }) => {
          target = target;
          resolve(target.result);
        };
        reader.onerror = (e) => {
          reject(e);
        };
      });
    },
    buildForm: (data) => {
      const keys = Object.keys(data);
      const formData = new FormData();
      keys.forEach((key) => {
        if (data[key] != undefined && !Array.isArray(data[key]))
          formData.append(key, data[key]);
        else if (Array.isArray(data[key])) {
          data[key].forEach((e, index) => {
            formData.append(`${key}[${index}]`, e);
          });
        }
      });
      return formData;
    },
    pageOptions: (offset, height) => ({
      height: height - offset + "px",
    }),
    formatCurrency: (number) => {
      return new Intl.NumberFormat("en-US", {
        // style: "currency",
        // currency: "MMK",

        // These options are needed to round to whole numbers if that's what you want.
        minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
      }).format(number);
    },
    toImageUrl: (url) => {
      return process.env.ASSETS_URL + "/" + url;
    },
    isAdmin: (user) => {
      return user.roles?.map((e) => e.name).includes("admin");
    },
    getQR: (url) => {
      return (
        "https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=" + url
      );
    },
    downloadImage: async (url, name) => {
      const image = await fetch(url);
      const imageBlog = await image.blob();
      const imageURL = URL.createObjectURL(imageBlog);

      const link = document.createElement("a");
      link.href = imageURL;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    copyLinkToClipboard: (content) => {
      copyToClipboard(content).then((_) => {
        Notify.create({
          message: `${content} ကို copy လိုက်ပါပြီ။ Paste ချရန်အသင့်ပါ`,
          type: "info",
        });
      });
    },
    isSuperAdmin: (user) => {
      return user.roles?.map((e) => e.name).includes("super admin");
    },
  };
}
