import { useQuasar, date } from "quasar";
import { api } from "src/boot/axios";
import { useUserStore } from "src/stores/user";
const { formatDate } = date;
export default function useApp () {
  const { notify, localStorage, platform } = useQuasar();
  const userStore = useUserStore();

  return {
    validateNumber: (value) => !isNaN(Number(value)),
    infoNotify: (message) => {
      notify({
        message,
        type: "info",
      });
    },
    errorNotify: (message) => {
      notify({
        message,
        type: "negative",
      });
    },
    successNotify: (message, options = {}) => {
      notify({
        message,
        type: "positive",
        ...options,
      });
    },
    warningNotify: (message, options = {}) => {
      notify({
        message,
        type: "warning",
        ...options,
      });
    },
    preserveToken: ({ user, token }) => {
      localStorage.set("token", token);
      api.defaults.headers.common["Authorization"] = "Bearer " + token;
      userStore.setUser(user);
    },
    getImage: (name) => {
      if (!name) return;
      return process.env.ASSETS_URL + "/" + name;
    },
    parseOrderStatus: (status) => {
      status = Number(status);
      switch (status) {
        case 1:
          return "Pending";
        case 2:
          return "Confirmed";
        case 3:
          return "Dispatched";
        case 4:
          return "Completed";
        case 5:
          return "Canceled";
        default:
          console.warn("unknown order status");
          return status;
      }
    },
    isAdmin: (user) => {
      return user.roles?.map((e) => e.name).includes("admin");
    },
    getPaymentLogo: (type) => {
      switch (type) {
        case 1:
          return "kpay-logo.png";
        case 2:
          return "wavepay-logo.png";
        case 3:
          return "paynow-logo.png";
      }
    },
    callNumber: (number) => {
      window.open("tel:" + number, "_self");
    },
    contactFacebook: (id) => {
      if (platform.is.ios) window.open("fb://profile/" + id);
      else window.open("fb://page/" + id, "_self");
    },
    downloadCSV: (data, fileName) => {
      const replaceCommaWithSpace = (dataObject) => {
        Object.keys(dataObject).forEach(key => {
          if (typeof dataObject[key] === 'string') {
            dataObject[key] = dataObject[key].replaceAll(',', ' ')
          }
        })
      }
      data = data.map(e => {
        e.items = e.items.map(item => {
          item.price = item.pivot.price
          item.quantity = item.pivot.quantity
          item.amount = item.price * item.quantity;
          replaceCommaWithSpace(item)
          return item;
        })
        replaceCommaWithSpace(e)
        e.date = formatDate(e.date, "DD-MM-YYYY")
        e.total = e.items.reduce((carry, item) => carry + item.amount, 0)
        e.grand_total = e.total - (Number(e.deposit) + Number(e.discount))
        return e;
      })

      const toCsvReadyArray = (data, keys) => [
        keys.map(e => e.split('_').map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(' ')),
        ...(data.map(el => keys.map(key => el[key])).map(e => e.map(el => el ?? '""')))
      ]

      const toReadyCsvContent = (data, keys) => {
        data = toCsvReadyArray(data, keys).map(e => e.map(el => {
          if (Array.isArray(el)) {
            return toCsvReadyArray(el, ['name', 'price', 'quantity', 'amount'])
          } else {
            return el
          }
        }))
        let temp = '';
        data.forEach(e => {
          e.forEach((el, index) => {
            if (Array.isArray(el)) {
              el.forEach((element, key) => {
                if (key > 0)
                  for (let i = 0; i < index; i++) {
                    temp += '"",'
                  }
                element.forEach((item, key) => {
                  temp += item;
                  if (key + 1 == element.length) temp += '\n';
                  else temp += ','
                })
              })
            } else {
              temp += el;
            }
            if (index + 1 < e.length)
              temp += ',';
            else temp += '\n'
          })
        })
        // data.forEach(function(infoArray, index) {
        //   dataString = infoArray.join(';');
        //   csvContent += index < data.length ? dataString + '\n' : dataString;
        // });
        return temp
      };



      // const keys = ['code', 'customer_name', 'customer_phone', 'customer_address', 'date', 'deposit', 'discount', 'items'];
      // const heading = keys.map(e => e.split('_').map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(' '))
      // keys.map(key => data[0][key])

      const content = toReadyCsvContent(data, ['code', 'customer_name', 'customer_phone', 'customer_address', 'date', 'deposit', 'discount', 'total', 'grand_total', 'items']);
      const a = document.createElement('a');
      const mimeType = 'text/csv;encoding:utf-8';
      if (navigator.msSaveBlob) { // IE10
        navigator.msSaveBlob(new Blob([content], {
          type: mimeType
        }), fileName);
      } else if (URL && 'download' in a) { //html5 A[download]
        a.href = URL.createObjectURL(new Blob([content], {
          type: mimeType
        }));
        a.setAttribute('download', fileName);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      // else {
      //   location.href = 'data:application/octet-stream,' + encodeURIComponent(content); // only this mime type is supported
      // }
    }
  };
}
