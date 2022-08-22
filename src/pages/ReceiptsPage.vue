<template>
  <q-page padding>
    <q-list>
      <q-item
        v-for="receipt in receipts"
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
import { onMounted, ref } from "vue";
import useBackend from "src/composables/backend";
import { useQuasar } from "quasar";
const { fetchReceipts } = useBackend();
const receipts = ref([]);
const { loading } = useQuasar();
onMounted(() => {
  loading.show();
  fetchReceipts()
    .then((data) => {
      receipts.value = data.data;
    })
    .finally(() => {
      loading.hide();
    });
});
</script>
