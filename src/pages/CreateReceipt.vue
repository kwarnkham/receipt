<template>
  <q-page :style-fn="pageOptions" class="column q-px-xs page">
    <div>
      <div class="logo"></div>
      <div class="text-center">09-1231231, 09-1232132</div>
    </div>

    <div class="bigger-font row">
      <div class="col-7 row items-center self-baseline">
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
      <div class="col-5 row items-center self-baseline">
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
    <div class="row">
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
        <input
          v-model="mobile"
          class="col"
          required
          type="tel"
          v-if="!receipt"
        />
        <div v-else>{{ receipt.customer_phone }}</div>
      </div>
    </div>
    <div class="row items-center">
      <div class="header-label">Address:</div>
      <input v-model="address" dense class="col" v-if="!receipt" />
      <div v-else>{{ receipt.customer_address }}</div>
    </div>

    <q-markup-table
      class="col bg-transparent"
      separator="cell"
      wrap-cells
      dense
      bordered
      flat
    >
      <thead>
        <tr>
          <th class="text-left">#</th>
          <th class="text-left">Name</th>
          <th class="text-right">Quantity</th>
          <th class="text-right">Price</th>
          <th class="text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.key">
          <td class="text-left">{{ item.key }}</td>

          <td class="text-left">
            {{ item.name }}
            <q-popup-edit
              :disable="!!receipt"
              :title="'Item name'"
              auto-save
              v-model="item.name"
              v-slot="scope"
            >
              <q-input
                v-model="scope.value"
                dense
                autofocus
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </td>

          <td class="text-right">
            {{ item.quantity }}
            <q-popup-edit
              :disable="!!receipt"
              :validate="validateNumber"
              :title="'Quantity'"
              auto-save
              v-model="item.quantity"
              v-slot="scope"
            >
              <q-input
                v-model="scope.value"
                dense
                autofocus
                @keyup.enter="scope.set"
                type="tel"
              />
            </q-popup-edit>
          </td>
          <td class="text-right">
            <span v-if="item.price">
              {{ formatCurrency(item.price) }}
            </span>
            <q-popup-edit
              :disable="!!receipt"
              :title="'Price'"
              :validate="validateNumber"
              auto-save
              v-model="item.price"
              v-slot="scope"
            >
              <q-input
                v-model="scope.value"
                dense
                autofocus
                @keyup.enter="scope.set"
                type="tel"
              />
            </q-popup-edit>
          </td>
          <td class="text-right">
            <span v-if="item.quantity * item.price">
              {{ formatCurrency(item.quantity * item.price) }}
            </span>
          </td>
        </tr>
        <tr>
          <td colspan="5" class="text-center">
            <q-btn
              v-if="!receipt"
              icon="add"
              dense
              flat
              color="primary"
              @click="
                items.push({
                  key: items.length + 1,
                  name: '',
                  quantity: '',
                  price: '',
                })
              "
            />
          </td>
        </tr>
      </tbody>
    </q-markup-table>

    <div class="row">
      <div class="q-px-md flex flex-center">
        <div>
          <div>Payment Info</div>
          <div>09-213123213</div>
          <div>09-123231231</div>
        </div>
      </div>

      <div class="col bigger-font-2">
        <div class="row">
          <div class="col row items-center">
            <div class="footer-label">Total:</div>
            <div class="text-right col">{{ formatCurrency(total) }}</div>
          </div>
        </div>
        <div class="row">
          <div class="col row items-center">
            <div class="footer-label">Deposit:</div>
            <div class="text-right col">
              {{ formatCurrency(receipt ? receipt.deposit : deposit) }}
            </div>
            <q-popup-edit
              :disable="!!receipt"
              :title="'Deposit'"
              :validate="validateNumber"
              auto-save
              v-model="deposit"
              v-slot="scope"
            >
              <q-input
                v-model="scope.value"
                dense
                autofocus
                @keyup.enter="scope.set"
                type="tel"
              />
            </q-popup-edit>
          </div>
        </div>
        <div class="row">
          <div class="col row items-center">
            <div class="footer-label">Discount:</div>
            <div class="text-right col">
              {{ formatCurrency(receipt ? receipt.discount : discount) }}
            </div>
            <q-popup-edit
              :disable="!!receipt"
              :title="'Discount'"
              :validate="validateNumber"
              auto-save
              v-model="discount"
              v-slot="scope"
            >
              <q-input
                v-model="scope.value"
                dense
                autofocus
                @keyup.enter="scope.set"
                type="tel"
              />
            </q-popup-edit>
          </div>
        </div>
        <div class="row text-weight-bolder">
          <div class="col row items-center">
            <div class="footer-label">Grand total:</div>
            <div class="col text-right">
              {{ formatCurrency(grandTotal) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center text-overline">Thank You</div>
  </q-page>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { date, useQuasar } from "quasar";
import useUtility from "src/composables/utility";
import useBackend from "src/composables/backend";
import { emitter } from "src/boot/emitter";
import useApp from "src/composables/app";
import { useRoute } from "vue-router";

const { formatDate } = date;
const { dialog, loading } = useQuasar();
const { pageOptions, formatCurrency } = useUtility();
const { createReceipt, findReceipt } = useBackend();
const { errorNotify } = useApp();
const route = useRoute();
const submit = () => {
  if (
    !name.value ||
    !orderDate.value ||
    !mobile.value ||
    !address.value ||
    !orderItems.value.length
  ) {
    errorNotify("Not enough data");
    return;
  }
  loading.show();
  createReceipt({
    date: orderDate.value,
    customer_name: name.value,
    customer_phone: mobile.value,
    customer_address: address.value,
    discount: discount.value,
    deposit: deposit.value,
    items: orderItems.value,
  })
    .then((data) => {
      receipt.value = data;
    })
    .finally(() => {
      loading.hide();
    });
};
const receipt = ref(null);
const name = ref("");
const mobile = ref("");
const address = ref("");
const discount = ref("");
const deposit = ref("");
const orderDate = ref(formatDate(Date.now(), "YYYY-MM-DD"));
const items = ref(
  [...Array(10).keys()].map((e) => ({
    key: e + 1,
    name: "",
    quantity: "",
    price: "",
  }))
);
const orderItems = computed(() =>
  items.value.filter((e) => e.name && e.price && e.quantity)
);
const total = computed(() =>
  items.value.reduce((carry, item) => carry + item.price * item.quantity, 0)
);
const explainVoucherNumber = () => {
  dialog({
    title: "Voucher number will be generated when you have saved the voucher.",
  });
};
const grandTotal = computed(() => total.value - deposit.value - discount.value);

const validateNumber = (value) => !isNaN(Number(value));

onMounted(() => {
  if (route.params.id) {
    loading.show();
    findReceipt(route.params.id)
      .then((data) => {
        receipt.value = data;
        data.items.forEach((e, key) => {
          const temp = JSON.parse(JSON.stringify(e));
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
  emitter.on("addNewReceipt", () => {
    receipt.value = null;
    items.value = [...Array(10).keys()].map((e) => ({
      key: e + 1,
      name: "",
      quantity: "",
      price: "",
    }));
    discount.value = 0;
    deposit.value = 0;
    name.value = "";
    mobile.value = "";
    address.value = "";
    orderDate.value = formatDate(Date.now(), "YYYY-MM-DD");
  });
});
onBeforeUnmount(() => {
  emitter.off("createReceipt");
  emitter.off("addNewReceipt");
});
</script>

<style lang="scss" scoped>
.row,
.column,
.flex {
  flex-wrap: unset;
}
.self-baseline {
  align-self: baseline;
}
input {
  background-color: transparent;
  border-radius: 10px;
  border: 1px solid $primary;
}
.logo {
  height: 120px;
  // background-image: url("https://spaces.madewithheart.tech/UKM/assets/home-logo.png");
  // background-size: contain;
  // background-repeat: no-repeat;
  // background-position: center;
}
.header-label {
  width: 60px;
}
.footer-label {
  width: 90px;
}
.bigger-font {
  font-size: 1.1em;
}
.bigger-font-2 {
  font-size: 1.2em;
}
.page {
  // background-image: url("https://spaces.madewithheart.tech/UKM/assets/home-background.jpg");
  // background-size: cover;
  // background-repeat: no-repeat;
  // background-position: center;
}
table {
  position: relative;
}

thead {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: rgba($color: #000000, $alpha: 0.7);
  color: white;
}
</style>
