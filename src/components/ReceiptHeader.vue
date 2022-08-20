<template>
  <div>
    <div class="logo"></div>
    <div class="text-center">09-1231231, 09-1232132</div>
  </div>

  <div class="bigger-font row info">
    <div class="col-7 row items-center">
      <div class="header-label">Name:</div>
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
      <span v-else class="text-weight-bold">{{ receipt.code }}</span>
    </div>
    <div class="col-5 row items-center">
      <div>Phone:</div>
      <input v-model="mobile" class="col" required type="tel" v-if="!receipt" />
      <div v-else>{{ receipt.customer_phone }}</div>
    </div>
  </div>
  <div class="row items-center info">
    <div class="header-label">Address:</div>
    <input v-model="address" dense class="col" v-if="!receipt" />
    <div v-else>{{ receipt.customer_address }}</div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { date } from "quasar";
const { formatDate } = date;
defineProps({
  receipt: {
    required: true,
  },
});
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
</script>

<style scoped lang="scss">
.info {
  height: 28px;
}
.logo {
  height: 120px;
  // background-image: url("https://spaces.madewithheart.tech/UKM/assets/home-logo.png");
  // background-size: contain;
  // background-repeat: no-repeat;
  // background-position: center;
}
.bigger-font {
  font-size: 1.1em;
}

.header-label {
  width: 60px;
}
</style>
