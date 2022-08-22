<template>
  <q-page padding v-if="page">
    <q-list>
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

const { page } = useReceiptList({ per_page: 20, order_in: "desc" });
</script>
