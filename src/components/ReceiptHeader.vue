<template>
  <div class="row info text-caption items-center border-bot-dot">
    <div class="col-7 row items-center">
      <q-icon name="phone" size="xs" />
      <input
        v-model="mobile"
        class="col"
        required
        type="tel"
        v-if="!receipt || receipt.status == 2"
        autofocus
        @blur="fillForm"
      />
      <div v-else style="font-size: 13px">{{ receipt.customer_phone }}</div>
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
      <span
        v-else
        style="font-size: 9px"
        :class="{ 'text-red': receipt.status == 2 }"
      >
        {{ receipt.code }}
      </span>
    </div>
  </div>

  <div class="row info text-caption items-center border-bot-dot">
    <div class="col-7 row items-center">
      <q-icon name="person" size="xs" />
      <input
        v-model="name"
        dense
        required
        type="text"
        class="col"
        v-if="!receipt || receipt.status == 2"
        :disabled="!mobile"
      />
      <div v-else class="text-weight-bold">
        {{ receipt.customer_name }}
      </div>
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
        v-if="!receipt || receipt.status == 2"
      />
      <div v-else>
        {{ formatDate(receipt.date, "DD-MM-YYYY") }}
      </div>
    </div>
  </div>
  <div class="row info items-center text-caption border-bot-dot">
    <template v-if="!receipt || receipt.status == 2">
      <q-icon name="apartment" size="xs" />
      <input v-model="address" dense class="col" :disabled="!mobile" />
    </template>
    <div v-else>
      <q-icon name="apartment" size="xs" />
      <span>
        {{ receipt.customer_address }}
      </span>
    </div>
  </div>
  <div
    class="row info items-center text-caption border-bot-dot"
    v-if="
      !receipt || receipt.status == 2 || (receipt.status == 1 && receipt.note)
    "
  >
    <template v-if="!receipt || receipt.status == 2">
      <q-icon name="note" size="xs" />
      <input v-model="note" dense class="col" :disabled="!mobile" />
    </template>
    <div v-else-if="receipt.note">
      <q-icon name="note" size="xs" />
      <span>
        {{ receipt.note }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, onMounted, ref } from "vue";
import { date, useQuasar } from "quasar";
import { emitter } from "src/boot/eventEmitter";
import { useUserStore } from "src/stores/user";

const { formatDate } = date;
const props = defineProps({
  receipt: {
    required: true,
  },
});

const { dialog, localStorage } = useQuasar();
const name = ref(props.receipt?.customer_name);
const mobile = ref(props.receipt?.customer_phone);
const address = ref(props.receipt?.customer_address);
const note = ref(props.receipt?.note);
const orderDate = ref(formatDate(new Date(props.receipt?.date), "YYYY-MM-DD"));
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
  note,
});

const userStore = useUserStore();
const resetData = () => {
  name.value = "";
  mobile.value = "";
  address.value = "";
  orderDate.value = formatDate(Date.now(), "YYYY-MM-DD");
  note.value = "";
};
const chooseDate = (e) => {
  e.target.showPicker();
};
const fillForm = () => {
  const knownUsers =
    localStorage.getItem(userStore.getUser.id + "knownUsers") ?? [];
  if (!knownUsers.length) return;
  const index = knownUsers.findIndex((e) => e.mobile == mobile.value);
  if (index >= 0) {
    address.value = knownUsers[index].address;
    name.value = knownUsers[index].name;
  }
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
  border: none;
}
input:focus {
  outline: none;
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
