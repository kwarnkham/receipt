<template>
  <q-page padding v-if="page" :style-fn="pageOptions" class="column">
    <q-form @submit.prevent="submit" class="q-mb-sm">
      <q-input dense :label="'Name'" v-model="params.customer_name">
        <template v-slot:before>
          <q-icon name="person" />
        </template>
      </q-input>
      <q-input dense :label="'Phone'" v-model="params.customer_phone">
        <template v-slot:before> <q-icon name="phone" /> </template>
      </q-input>
      <q-input
        dense
        :label="'Date'"
        v-model="params.date"
        type="date"
        @click="chooseDate"
      >
        <template v-slot:before>
          <q-icon name="calendar_month" />
        </template>
      </q-input>
      <q-input dense :label="'Code'" v-model="params.code">
        <template v-slot:before> <q-icon name="receipt" /> </template>
      </q-input>
      <div class="text-center">
        <q-btn icon="search" type="submit" flat />
      </div>
    </q-form>
    <q-list class="col scroll-y" v-scroll="debounce(fetchMore, 300)">
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
import useModelList from "src/composables/modelList";
import useUtility from "src/composables/utility";
import { ref } from "vue";
import { debounce, useQuasar } from "quasar";
import useBackend from "src/composables/backend";

const { pageOptions } = useUtility();
const params = ref({
  cutomer_name: "",
  date: "",
  customer_phone: "",
  code: "",
  per_page: 20,
  order_in: "desc",
});
const { loading } = useQuasar();
const { fetchReceipts } = useBackend();
const { page, fetchMore } = useModelList(fetchReceipts, params.value);

const submit = () => {
  loading.show();
  fetchReceipts(params.value)
    .then((data) => {
      page.value = data;
    })
    .finally(() => {
      loading.hide();
    });
};
const chooseDate = (e) => {
  e.target.showPicker();
};
</script>
