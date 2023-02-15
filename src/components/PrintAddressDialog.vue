<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent maximized>
    <q-card class="column items-center no-wrap">
      <div class="receipt text-grey-10 column justify-start" id="print-target">
        <img :src="getImage(logo)" alt="receipt" width="360" v-if="logo" />
        <div
          class="row justify-evenly font-weight-bolder text-h6"
          v-if="receipt.user.phones?.length"
        >
          <div v-for="phone in receipt.user.phones" :key="phone.id">
            <q-icon name="phone" /> {{ phone.number }}
          </div>
        </div>

        <div
          class="row justify-between full-width"
          :class="{ 'q-mt-sm border-top': receipt.user.phones?.length || logo }"
        >
          <div class="col-12">
            <q-icon name="person" class="q-mr-xs" size="lg" />
            <span class="text-h5">{{ receipt.customer_name }}</span>
          </div>
          <div class="col-12">
            <q-icon name="phone_iphone" class="q-mr-xs" size="lg" />
            <span class="text-h5">{{ receipt.customer_phone }}</span>
          </div>
        </div>

        <div>
          <q-icon name="location_pin" class="q-mr-xs" size="lg" />
          <span class="text-h5">{{ receipt.customer_address }}</span>
        </div>

        <div v-if="receipt.note" class="text-h5">Note: {{ receipt.note }}</div>
      </div>

      <div class="row justify-around receipt">
        <div class="col-12" v-if="!platform.is.iphone && !platform.is.ipad">
          <div class="full-width q-px-lg">
            <q-badge color="primary"> Size: {{ printSize }} (1 to 10) </q-badge>
            <q-slider v-model="printSize" markers :min="1" :max="10" />
          </div>
        </div>
        <q-btn icon="close" @click="onDialogHide"></q-btn>
        <q-btn
          v-if="!platform.is.iphone && !platform.is.ipad"
          :icon="'print'"
          @click="print"
          :disabled="printing"
          color="primary"
        ></q-btn>
      </div>

      <div class="col"></div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, date, useQuasar } from "quasar";
import useUtility from "src/composables/utility";
import { computed, onMounted, ref } from "vue";
import usePrinter from "src/composables/printer";
import useApp from "src/composables/app";

const { formatDate } = date;
const { formatCurrency } = useUtility();
const props = defineProps({
  receipt: {
    type: Object,
    required: true,
  },
});
const { loading, notify, platform, localStorage } = useQuasar();
const { getImage } = useApp();
const total = computed(() =>
  props.receipt.items.reduce(
    (carry, item) => carry + item.pivot.price * item.pivot.quantity,
    0
  )
);

const printSize = ref(Number(localStorage.getItem("printSize")) || 1);

const logo = computed(
  () => props.receipt.user.pictures.find((e) => e.type == 3)?.name
);

const printing = ref(false);

const grandTotal = computed(
  () =>
    total.value -
    (props.receipt ? props.receipt.deposit : deposit.value) -
    (props.receipt ? props.receipt.discount : discount.value)
);
const { sendPrinterData, sendTextData } = usePrinter();

const printTime = ref(formatDate(new Date(), "DD-MM-YYYY HH:mm:ss"));
const print = () => {
  printing.value = true;
  sendPrinterData(document.getElementById("print-target"), printSize.value)
    .then(() => {
      sendTextData("\u000A\u000D");
    })
    .catch((error) => {
      if (error) notify(error);
      else notify("Printer has disconnected");
    })
    .finally(() => {
      printing.value = false;
      loading.hide();
      localStorage.set("printSize", printSize.value);
    });

  // sendPrinterData(document.getElementById("foo"));
};

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
// dialogRef      - Vue ref to be applied to QDialog
// onDialogHide   - Function to be used as handler for @hide on QDialog
// onDialogOK     - Function to call to settle dialog with "ok" outcome
//                    example: onDialogOK() - no payload
//                    example: onDialogOK({ /*...*/ }) - with payload
// onDialogCancel - Function to call to settle dialog with "cancel" outcome

onMounted(() => {
  setInterval(() => {
    printTime.value = formatDate(new Date(), "DD-MM-YYYY HH:mm:ss");
  }, 1000);
});
</script>

<style lang="scss" scoped>
.line-text:before,
.line-text:after {
  content: "";
  flex: 1 1;
  border-bottom: 1px dashed;
  margin: auto;
}
.line-text:before {
  margin-right: 1em;
}
.line-text:after {
  margin-left: 1em;
}
.receipt {
  width: 360px;
}
.q-table tbody td,
th {
  font-size: 18px;
}

th,
.summery > td {
  border-top: 1px dashed $grey-10;
  font-weight: normal;
}

th {
  border-bottom: 1px dashed $grey-10;
}

.grand-total > td {
  border-top: 1px dashed $grey-10;
}

.border-top {
  border-top: 1px dashed $grey-10;
}
</style>
