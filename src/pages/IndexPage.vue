<template>
  <q-page
    class="flex flex-center page"
    :style="{
      backgroundImage: 'url(' + getImage('assets/home-bg.jpeg') + ')',
    }"
  >
    <div class="full-width">
      <q-img :src="getImage('assets/logo.png')"></q-img>
      <div class="row full-width no-wrap">
        <div class="col-6 text-center">
          <q-img
            :src="getImage('assets/invoice-add.png')"
            height="150px"
            fit="contain"
            @click="
              $router.push({
                name: 'createReceipt',
              })
            "
          />
          <div>{{ $t("newReceipt") }}</div>
        </div>
        <div class="col-6 text-center">
          <q-img
            :src="getImage('assets/invoice-done.png')"
            height="150px"
            fit="contain"
            @click="
              $router.push({
                name: 'receipts',
              })
            "
          />
          <div>{{ $t("addedReceipts") }}</div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import useApp from "src/composables/app";

const { getImage } = useApp();
</script>

<style scoped lang="scss">
.page {
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
