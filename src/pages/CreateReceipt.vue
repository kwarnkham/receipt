<template>
  <q-page :style-fn="pageOptions" class="column q-px-xs page">
    <div>
      <div class="logo"></div>
      <div class="text-center">09-1231231, 09-1232132</div>
    </div>
    <div class="row bigger-font">
      <div class="col row items-center">
        <div class="header-label">Name:</div>
        <input v-model="name" dense required type="text" class="col q-mr-sm" />
      </div>
      <div class="col-5 row items-center">
        <div>Date:</div>
        <input v-model="orderDate" type="date" required class="col" />
      </div>
    </div>
    <div class="row">
      <div class="col-6 row items-center">
        Voucher No:
        <q-btn
          icon="info"
          dense
          flat
          color="primary"
          @click="explainVoucherNumber"
        />
      </div>
      <div class="col-6 row items-center">
        <div class="header-label">Phone:</div>
        <input v-model="mobile" class="col" required type="tel" />
      </div>
    </div>
    <div class="row">
      <div class="col row items-center">
        <div class="header-label">Address:</div>
        <input v-model="address" dense class="col" />
      </div>
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
            <div class="text-right col">{{ formatCurrency(deposit) }}</div>
            <q-popup-edit
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
            <div class="text-right col">{{ formatCurrency(discount) }}</div>
            <q-popup-edit
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
import { computed, ref } from "vue";
import { date, useQuasar } from "quasar";
import useUtility from "src/composables/utility";
const { formatDate } = date;
const { dialog } = useQuasar();
const { pageOptions, formatCurrency } = useUtility();
const submit = () => {};
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
//name, phone, today date, deliery address
//item name, quantity, price, amount

//total amount
//discount
//deposit
//grand total amount
</script>

<style lang="scss" scoped>
input {
  background-color: transparent;
  border-radius: 10px;
  border: 1px solid $primary;
}
.logo {
  height: 150px;
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
