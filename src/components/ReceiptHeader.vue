<template>
  <div>
    <div class="logo bg-accent">Logo</div>
    <div class="text-center">09-1231231, 09-1232132</div>
  </div>
  <div class="row">
    <div class="col-6 row items-center">
      <div>Name:</div>
      <q-input v-model="name" dense required />
    </div>
    <div class="col-6 row items-center">
      <div>Date:</div>
      <q-input v-model="orderDate" type="date" dense required />
    </div>
  </div>
  <div class="row">
    <div class="col-12 row items-center">
      <div>Phone:</div>
      <q-input v-model="mobile" dense class="col" required />
    </div>
  </div>
  <div class="row">
    <div class="col row items-center">
      <div>Address:</div>
      <q-input v-model="address" dense required class="col" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const name = ref("");
const mobile = ref("");
const address = ref("");
</script>
