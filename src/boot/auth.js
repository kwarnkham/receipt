import { LocalStorage } from "quasar";
import { boot } from "quasar/wrappers";
import { useUserStore } from "src/stores/user";
import { api } from "./axios";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ router }) => {
  const token = LocalStorage.getItem("token");
  if (token) {
    const userStore = useUserStore();
    api.defaults.headers.common["Authorization"] = "Bearer " + token;
    try {
      user = await api({
        method: "GET",
        url: "user",
      }).then(({ data }) => {
        userStore.setUser(data);
      });
    } catch (error) {
      if (error.response?.status == 401) {
        LocalStorage.remove("token");
      }
    }
  }

  router.beforeEach((to, from, next) => {
    const token = LocalStorage.getItem("token");
    if (to.meta.requireAuth && !token) {
      next({ name: "login" });
    } else {
      next();
    }
  });
});
