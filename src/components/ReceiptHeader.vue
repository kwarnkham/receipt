<template>
  <div class="row info text-caption items-center border-bot-dot">
    <div class="col-7 row items-center">
      <q-icon name="person" size="xs" />
      <input
        v-model="name"
        dense
        required
        type="text"
        class="col"
        v-if="!receipt"
      />
      <div v-else class="text-weight-bold">
        {{ receipt.customer_name }}
      </div>
    </div>
    <div class="col-5 row items-center">
      <q-icon name="receipt" size="xs" />
      <q-btn
        v-if="!receipt"
        icon="info"
        dense
        flat
        size="sm"
        @click="explainVoucherNumber"
      />
      <span v-else style="font-size: 9px">{{ receipt.code }}</span>
    </div>
  </div>

  <div class="row info text-caption items-center border-bot-dot">
    <div class="col-7 row items-center">
      <q-icon name="phone" size="xs" />
      <input v-model="mobile" class="col" required type="tel" v-if="!receipt" />
      <div v-else style="font-size: 13px">{{ receipt.customer_phone }}</div>
    </div>
    <div class="col-5 row items-center">
      <q-icon name="calendar_month" size="xs" />
      <input
        v-model="orderDate"
        type="date"
        format="DD-MM-YYYY"
        required
        class="col"
        @click="chooseDate"
        v-if="!receipt"
      />
      <div v-else>
        {{ formatDate(receipt.date, "DD-MM-YYYY") }}
      </div>
    </div>
  </div>
  <div class="row items-center text-caption info">
    <template v-if="!receipt">
      <q-icon name="apartment" size="xs" />
      <input v-model="address" dense class="col" />
    </template>
    <div v-else>
      <q-icon name="apartment" size="xs" />
      <span>
        {{ receipt.customer_address }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, onMounted, ref } from "vue";
import { date } from "quasar";
import { emitter } from "src/boot/eventEmitter";

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
const resetData = () => {
  name.value = "";
  mobile.value = "";
  address.value = "";
  orderDate.value = formatDate(Date.now(), "YYYY-MM-DD");
};
const chooseDate = (e) => {
  e.target.showPicker();
};
onMounted(() => {
  emitter.on("addNewReceipt", resetData);
});
onBeforeMount(() => {
  emitter.off("addNewReceipt", resetData);
});
</script>

<style scoped lang="scss">
input {
  height: 20px;
}
.info {
  height: 18px;
  margin-bottom: 5px;
}

.text {
  font-size: 0.75rem;
  line-height: 1.25rem;
  letter-spacing: 0.03333em;
}
.border-bot-dot {
  border-bottom: 1px solid black;
}
</style>
