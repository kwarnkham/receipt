import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useUserStore } from "src/stores/user";

export default function useApp() {
  const { notify, localStorage } = useQuasar();
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
    preserveToken: ({ user, token }) => {
      localStorage.set("token", token);
      api.defaults.headers.common["Authorization"] = "Bearer " + token;
      userStore.setUser(user);
    },
    getImage: (name) => {
      if (!name) return;
      return process.env.ASSET_URL + "/" + name;
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
  };
}
