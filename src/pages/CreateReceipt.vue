<template>
  <q-page :style-fn="pageOptions" class="column q-px-xs" id="receipt-page">
    <img
      :src="getImage(user?.pictures.find((e) => e.type == 1)?.name)"
      height="120"
      alt="logo"
    />
    <div class="col column relative-position">
      <img
        :src="getImage(user?.pictures.find((e) => e.type == 2)?.name)"
        alt="background"
        class="absolute fit z-neg-1"
      />
      <ReceiptHeader :receipt="receipt" ref="header" />
      <ReceiptBody
        :items="items"
        @addRow="addRow"
        :receipt="receipt"
        @itemFilled="fillItem"
        :user="user"
      />
      <ReceiptSummery
        :receipt="receipt"
        :items="items"
        ref="summery"
        class="q-my-xs"
      />
    </div>
  </q-page>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useQuasar, date } from "quasar";
import useUtility from "src/composables/utility";
import useBackend from "src/composables/backend";
import { emitter } from "src/boot/eventEmitter";
import useApp from "src/composables/app";
import { useRoute, useRouter } from "vue-router";
import ReceiptHeader from "../components/ReceiptHeader.vue";
import ReceiptBody from "src/components/ReceiptBody.vue";
import ReceiptSummery from "src/components/ReceiptSummery.vue";
import { useUserStore } from "src/stores/user";
import PrintViewDialog from "src/components/PrintViewDialog.vue";
import PrintAddressDialog from "src/components/PrintAddressDialog.vue";
const { getDateDiff, formatDate, addToDate } = date;

const router = useRouter();
const { loading, localStorage } = useQuasar();
const { pageOptions } = useUtility();
const { createReceipt, findReceipt } = useBackend();
const { errorNotify, successNotify, getImage, warningNotify, isAdmin } =
  useApp();
const { findUser } = useBackend();
const route = useRoute();
const header = ref(null);
const summery = ref(null);
const userStore = useUserStore();
const subscription = userStore.getUser.latest_subscription;
const viewedAsUser = ref(null);
const user = computed(() => viewedAsUser.value ?? userStore.getUser);

const { dialog } = useQuasar();
const addRow = () => {
  items.value.push({
    key: items.value.length + 1,
    name: "",
    quantity: "",
    price: "",
  });
};
const submit = () => {
  if (receipt.value) return;
  if (
    !header.value.name ||
    !header.value.orderDate ||
    !header.value.mobile ||
    !header.value.address ||
    !orderItems.value.length
  ) {
    errorNotify("Not enough data");
    return;
  }

  loading.show();
  createReceipt({
    date: header.value.orderDate,
    customer_name: header.value.name,
    customer_phone: header.value.mobile,
    customer_address: header.value.address,
    discount: summery.value.discount,
    deposit: summery.value.deposit,
    items: orderItems.value,
    note: header.value.note || undefined,
  })
    .then((data) => {
      receipt.value = data;
      preserveItems();
      preserveUsers();
      successNotify("Success", { timeout: 500 });
      router.push({ name: "receipt", params: { id: data.id } });
    })
    .finally(() => {
      loading.hide();
    });
};
const preserveItems = () => {
  const knownItems =
    localStorage.getItem(userStore.getUser.id + "knownItems") ?? [];
  if (knownItems.length == 0)
    localStorage.set(
      userStore.getUser.id + "knownItems",
      orderItems.value.map((e) => ({ name: e.name, price: e.price }))
    );
  else {
    localStorage.set(
      userStore.getUser.id + "knownItems",
      [
        ...orderItems.value.map((e) => ({ name: e.name, price: e.price })),
        ...knownItems,
      ].filter(
        (value, index, self) =>
          index === self.findIndex((e) => e.name === value.name)
      )
    );
  }
};

const preserveUsers = () => {
  const knownUsers =
    localStorage.getItem(userStore.getUser.id + "knownUsers") ?? [];

  if (knownUsers.length == 0)
    localStorage.set(userStore.getUser.id + "knownUsers", [
      {
        mobile: header.value.mobile,
        name: header.value.name,
        address: header.value.address,
      },
    ]);
  else {
    localStorage.set(
      userStore.getUser.id + "knownUsers",
      [
        {
          mobile: header.value.mobile,
          name: header.value.name,
          address: header.value.address,
        },
        ...knownUsers,
      ].filter(
        (value, index, self) =>
          index === self.findIndex((e) => e.mobile === value.mobile)
      )
    );
  }
};
const fillItem = (item) => {
  const index = items.value.findIndex((e) => e.key == item.key);
  if (index >= 0) items.value.splice(index, 1, item);
};
const receipt = ref(null);

const items = ref(
  [...Array(20).keys()].map((e) => ({
    key: e + 1,
    name: "",
    quantity: "",
    price: "",
  }))
);
const orderItems = computed(() =>
  items.value.filter((e) => e.name && e.price && e.quantity)
);
// const resetData = () => {
//   receipt.value = null;
//   items.value = [...Array(10).keys()].map((e) => ({
//     key: e + 1,
//     name: "",
//     quantity: "",
//     price: "",
//   }));
// };

const notifyUserNearExpiration = () => {
  if (isAdmin(userStore.getUser)) return;
  const now = Date.now();
  if (getDateDiff(now, subscription.created_at) > subscription.duration - 7) {
    const lastNotified = localStorage.getItem("lastNotified");
    if (!lastNotified || getDateDiff(now, lastNotified, "hours") >= 24) {
      warningNotify(
        "Your account will expired after " +
          formatDate(
            addToDate(subscription.created_at, {
              days: subscription.duration,
            }),
            "DD/MM/YYYY"
          ),
        { position: "center" }
      );
      localStorage.set("lastNotified", now);
    }
  }
};

const showPrintView = () => {
  dialog({
    component: PrintViewDialog,
    componentProps: {
      receipt: receipt.value,
    },
  });
};

const showPrintAddressView = () => {
  dialog({
    component: PrintAddressDialog,
    componentProps: {
      receipt: receipt.value,
    },
  });
};

onMounted(() => {
  notifyUserNearExpiration();
  if (route.params.id) {
    loading.show();
    findReceipt(route.params.id)
      .then((data) => {
        if (data) {
          receipt.value = data;
          data.items.forEach((e, key) => {
            const temp = e;
            temp.quantity = temp.pivot.quantity;
            temp.price = temp.pivot.price;
            temp.key = key + 1;
            items.value.splice(key, 1, temp);
          });
        }
      })
      .finally(() => {
        loading.hide();
      });
  }

  if (route.query.user) {
    findUser(route.query.user).then((data) => {
      viewedAsUser.value = data;
    });
  }

  emitter.on("createReceipt", submit);
  // emitter.on("addNewReceipt", resetData);
  emitter.on("print", showPrintView);
  emitter.on("printAddress", showPrintAddressView);
});
onBeforeUnmount(() => {
  emitter.off("createReceipt", submit);
  // emitter.off("addNewReceipt", resetData);
  emitter.off("print", showPrintView);
  emitter.off("printAddress", showPrintAddressView);
});
</script>
