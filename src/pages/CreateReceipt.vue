<template>
  <q-page :style-fn="pageOptions" class="column q-px-xs">
    <div
      class="background-image"
      :style="{
        backgroundImage:
          'url(' +
          getImage(userStore.getUser.pictures.find((e) => e.type == 1)?.name) +
          ')',
      }"
    ></div>
    <div
      class="col column background-image"
      :style="{
        backgroundImage:
          'url(' +
          getImage(userStore.getUser.pictures.find((e) => e.type == 2)?.name) +
          ')',
      }"
    >
      <ReceiptHeader :receipt="receipt" ref="header" />
      <ReceiptBody
        :items="items"
        @addRow="addRow"
        :receipt="receipt"
        @itemFilled="fillItem"
      />
      <ReceiptSummery :receipt="receipt" :items="items" ref="summery" />
    </div>
  </q-page>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import useUtility from "src/composables/utility";
import useBackend from "src/composables/backend";
import { emitter } from "src/boot/eventEmitter";
import useApp from "src/composables/app";
import { useRoute } from "vue-router";
import ReceiptHeader from "../components/ReceiptHeader.vue";
import ReceiptBody from "src/components/ReceiptBody.vue";
import ReceiptSummery from "src/components/ReceiptSummery.vue";
import { useUserStore } from "src/stores/user";

const { loading, localStorage } = useQuasar();
const { pageOptions } = useUtility();
const { createReceipt, findReceipt } = useBackend();
const { errorNotify, successNotify, getImage } = useApp();
const route = useRoute();
const header = ref(null);
const summery = ref(null);
const userStore = useUserStore();
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
  })
    .then((data) => {
      receipt.value = data;
      preserveItems();
      preserveUsers();
      successNotify("Success", { timeout: 500 });
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
const resetData = () => {
  receipt.value = null;
  items.value = [...Array(10).keys()].map((e) => ({
    key: e + 1,
    name: "",
    quantity: "",
    price: "",
  }));
};

onMounted(() => {
  if (route.params.id) {
    loading.show();
    findReceipt(route.params.id)
      .then((data) => {
        receipt.value = data;
        data.items.forEach((e, key) => {
          const temp = e;
          temp.quantity = temp.pivot.quantity;
          temp.price = temp.pivot.price;
          temp.key = key + 1;
          items.value.splice(key, 1, temp);
        });
      })
      .finally(() => {
        loading.hide();
      });
  }

  emitter.on("createReceipt", submit);
  emitter.on("addNewReceipt", resetData);
});
onBeforeUnmount(() => {
  emitter.off("createReceipt", submit);
  emitter.off("addNewReceipt", resetData);
});
</script>

<style lang="scss" scoped>
.background-image {
  height: 120px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
