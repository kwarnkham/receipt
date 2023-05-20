<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="text-center text-h6 q-mb-lg">Printer setting</div>
      <q-slider v-model="printFormat" :min="1" :max="8" label label-always />
      <div>Value : {{ printMaxData }}</div>
    </div>

    <div class="flex flex-center" ref="printTarget">
      <q-icon name="print" size="10em" color="grey" />
    </div>
    <div class="text-center">
      <q-btn label="Test print" no-caps @click="print()" />
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import usePrinter from "src/composables/printer";
import { computed, ref, watch } from "vue";

const { localStorage, loading } = useQuasar();
const printFormat = ref(1);
const printTarget = ref(null);

const { sendPrinterData, sendTextData } = usePrinter();

const printMaxData = computed(() => {
  const size = {
    1: 1,
    2: 2,
    3: 4,
    4: 8,
    5: 16,
    6: 32,
    7: 64,
    8: 128,
  };
  return 512 / size[printFormat.value];
});

watch(printMaxData, () => {
  localStorage.set("printMaxData", printMaxData.value);
});

const print = () => {
  loading.show();
  sendPrinterData(printTarget.value)
    .then(() => {
      sendTextData("\u000A\u000D");
    })
    .catch((error) => {
      if (error) notify(error);
      else notify("Printer has disconnected");
    })
    .finally(() => {
      loading.hide();
      localStorage.set("printSize");
    });

  // sendPrinterData(document.getElementById("foo"));
};
</script>
