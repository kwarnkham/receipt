<template>
  <q-page padding v-if="page" :style-fn="pageOptions" class="column">
    <q-form @submit.prevent="submit" class="q-mb-sm">
      <q-input dense :label="'Name'" v-model="name">
        <template v-slot:before>
          <q-icon name="person" />
        </template>
      </q-input>
      <q-input dense :label="'Phone'" v-model="mobile">
        <template v-slot:before> <q-icon name="phone" /> </template>
      </q-input>
      <q-input
        dense
        :label="'Date'"
        v-model="date"
        type="date"
        @click="chooseDate"
      >
        <template v-slot:before>
          <q-icon name="calendar_month" />
        </template>
      </q-input>
      <q-input dense :label="'Code'" v-model="code">
        <template v-slot:before> <q-icon name="receipt" /> </template>
      </q-input>
      <div class="text-center">
        <q-btn icon="search" type="submit" flat />
      </div>
    </q-form>
    <q-list class="col scroll-y">
      <q-item
        v-for="receipt in page.data"
        :key="receipt.id"
        :to="{
          name: 'receipt',
          params: {
            id: receipt.id,
          },
        }"
      >
        <q-item-section>
          <div>Code: {{ receipt.code }}</div>
          <div>Date: {{ receipt.date }}</div>
        </q-item-section>
        <q-item-section side>
          <div>Name: {{ receipt.customer_name }}</div>
          <div>Phone: {{ receipt.customer_phone }}</div>
          <div>Address: {{ receipt.customer_address }}</div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import useReceiptList from "src/composables/receiptList";
import useUtility from "src/composables/utility";
import { ref } from "vue";

const { pageOptions } = useUtility();
const { page, fetchReceipts } = useReceiptList({
  per_page: 20,
  order_in: "desc",
});
const name = ref("");
const date = ref("");
const mobile = ref("");
const code = ref("");

const submit = () => {
  fetchReceipts({
    customer_name: name.value,
    customer_phone: mobile.value,
    date: date.value,
    code: code.value,
    per_page: 20,
    order_in: "desc",
  }).then((data) => {
    page.value = data;
  });
};
const chooseDate = (e) => {
  e.target.showPicker();
};
</script>
