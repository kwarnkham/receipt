import { Dialog, LocalStorage } from "quasar";
import { boot } from "quasar/wrappers";
import { useUserStore } from "src/stores/user";
import { api } from "./axios";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
  const userStore = useUserStore();

  if (userStore.getUser) {
    const knownUsersKey = userStore.getUser.id + "knownUsers";
    const knownItemsKey = userStore.getUser.id + "knownItems";
    let knownUsers = LocalStorage.getItem(knownUsersKey);
    let knownItems = LocalStorage.getItem(knownItemsKey);

    if (!knownUsers) {
      knownUsers = await api({
        method: "GET",
        url: "customer/known",
      }).then(({ data }) => data);
      LocalStorage.set(knownUsersKey, knownUsers);
    }

    if (!knownItems) {
      knownItems = await api({
        method: "GET",
        url: "item/known",
      }).then(({ data }) => data);
      LocalStorage.set(knownItemsKey, knownItems);
    }
  }
});
