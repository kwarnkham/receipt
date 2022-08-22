<template>
  <div>
    <div
      class="logo"
      :style="{
        backgroundImage:
          'url(' +
          getImage(userStore.getUser.pictures.find((e) => e.type == 1)?.name) +
          ')',
      }"
    ></div>
  </div>

  <div class="row info text-subtitle1">
    <div class="col-7 row items-center">
      <div>Name:</div>
      <input
        v-model="name"
        dense
        required
        type="text"
        class="col q-mr-sm"
        v-if="!receipt"
      />
      <div v-else>{{ receipt.customer_name }}</div>
    </div>
    <div class="col-5 row items-center">
      <div>Date:</div>
      <input
        v-model="orderDate"
        type="date"
        required
        class="col"
        v-if="!receipt"
      />
      <div v-else>{{ receipt.date }}</div>
    </div>
  </div>
  <div class="row info">
    <div class="col-7 row items-center">
      Voucher No:
      <q-btn
        v-if="!receipt"
        icon="info"
        dense
        flat
        color="primary"
        @click="explainVoucherNumber"
      />
      <span v-else>{{ receipt.code }}</span>
    </div>
    <div class="col-5 row items-center text-subtitle1">
      <div>Phone:</div>
      <input v-model="mobile" class="col" required type="tel" v-if="!receipt" />
      <div v-else>{{ receipt.customer_phone }}</div>
    </div>
  </div>
  <div class="row items-center info text-subtitle1">
    <div>Address:</div>
    <input v-model="address" dense class="col" v-if="!receipt" />
    <div v-else>{{ receipt.customer_address }}</div>
  </div>
</template>

<script setup>
import { onBeforeMount, onMounted, ref } from "vue";
import { date } from "quasar";
import { emitter } from "src/boot/eventEmitter";
import useApp from "src/composables/app";
import { useUserStore } from "src/stores/user";
const { formatDate } = date;
defineProps({
  receipt: {
    required: true,
  },
});
const { getImage } = useApp();
const userStore = useUserStore();
const name = ref("");
const mobile = ref("");
const address = ref("");
const orderDate = ref(formatDate(Date.now(), "YYYY-MM-DD"));
const explainVoucherNumber = () => {
  dialog({
    title: "Voucher number will be generated when you have saved the voucher.",
  });
};
defineExpose({
  name,
  mobile,
  address,
  orderDate,
});
const resetData = () => {
  name.value = "";
  mobile.value = "";
  address.value = "";
  orderDate.value = formatDate(Date.now(), "YYYY-MM-DD");
};
onMounted(() => {
  emitter.on("addNewReceipt", resetData);
});
onBeforeMount(() => {
  emitter.off("addNewReceipt", resetData);
});
</script>

<style scoped lang="scss">
.info {
  height: 28px;
}
.logo {
  height: 120px;
  // background-image: url("https://spaces.madewithheart.tech/UKM/assets/home-logo.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
