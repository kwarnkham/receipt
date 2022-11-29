<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent maximized>
    <q-card class="column items-center no-wrap">
      <div class="receipt text-grey-10 column justify-start" id="print-target">
        <img :src="getImage(logo)" alt="receipt" width="360" v-if="logo" />
        <div
          class="row justify-between font-weight-bolder text-h6"
          v-if="receipt.user.phones?.length"
        >
          <div v-for="phone in receipt.user.phones" :key="phone.id">
            <q-icon name="phone" /> {{ phone.number }}
          </div>
        </div>

        <div
          class="row justify-between"
          :class="{ 'q-mt-sm border-top': receipt.user.phones?.length || logo }"
        >
          <div>
            <q-icon name="person" class="q-mr-xs" />{{ receipt.customer_name }}
          </div>
          <div>
            <q-icon name="phone_iphone" class="q-mr-xs" />{{
              receipt.customer_phone
            }}
          </div>
        </div>
        <div class="row justify-between">
          <div><q-icon name="receipt" class="q-mr-xs" />{{ receipt.code }}</div>
          <div>
            <q-icon name="calendar_month" class="q-mr-xs" />{{
              formatDate(receipt.date, "DD-MM-YYYY")
            }}
          </div>
        </div>

        <q-markup-table
          wrap-cells
          flat
          dense
          separator="none"
          class="bg-transparent text-grey-10 full-width"
        >
          <thead>
            <tr>
              <th class="text-left">{{ $t("name") }}</th>
              <th class="text-right">{{ $t("qty") }}</th>
              <th class="text-right">{{ $t("price") }}</th>
              <th class="text-right">{{ $t("amount") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in receipt.items" :key="item.id">
              <td class="text-left">
                {{ item.name }}
              </td>

              <td class="text-right">
                {{ item.quantity }}
              </td>
              <td class="text-right">
                <template v-if="item.price">
                  {{ formatCurrency(item.price) }}
                </template>
              </td>
              <td class="text-right">
                <template v-if="item.quantity * item.price">
                  {{ formatCurrency(item.quantity * item.price) }}
                </template>
              </td>
            </tr>
            <tr class="summery">
              <td colspan="3" class="text-right">Total</td>
              <td class="text-right">
                {{ formatCurrency(total) }}
              </td>
            </tr>
            <tr>
              <td colspan="3" class="text-right">Deposit</td>
              <td class="text-right">
                {{ formatCurrency(receipt.deposit) }}
              </td>
            </tr>
            <tr>
              <td colspan="3" class="text-right">Discount</td>
              <td class="text-right">
                {{ formatCurrency(receipt.discount) }}
              </td>
            </tr>
            <tr class="grand-total">
              <td colspan="3" class="text-right text-weight-bolder">
                Grand Total
              </td>
              <td class="text-right text-weight-bolder">
                {{ formatCurrency(grandTotal) }}
              </td>
            </tr>
          </tbody>
        </q-markup-table>
        <div class="text-overline flex row line-text q-mt-sm">Thank you</div>
      </div>
      <div class="row justify-around full-width">
        <q-btn icon="close" @click="onDialogHide"></q-btn>
        <q-btn icon="print" @click="print" :disabled="printing"></q-btn>
      </div>

      <div class="col"></div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, date, useQuasar } from "quasar";
import useUtility from "src/composables/utility";
import { computed, ref } from "vue";
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
const { loading, notify } = useQuasar();
const { getImage } = useApp();
const total = computed(() =>
  props.receipt.items.reduce(
    (carry, item) => carry + item.pivot.price * item.pivot.quantity,
    0
  )
);

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
const { sendPrinterData } = usePrinter();
const print = () => {
  printing.value = true;
  sendPrinterData(document.getElementById("print-target"))
    .catch((error) => {
      if (error) notify(error);
      else notify("Printer has disconnected");
    })
    .finally(() => {
      printing.value = false;
      loading.hide();
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
