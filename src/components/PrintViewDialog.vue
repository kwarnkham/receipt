<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent maximized>
    <q-card class="column items-center">
      <div class="row justify-evenly">
        <q-btn icon="print" @click="print"></q-btn>
        <q-btn icon="close" @click="onDialogHide"></q-btn>
      </div>
      <div class="receipt bg-transparent">
        <div class="row justify-between">
          <div>{{ receipt.code }}</div>
          <div>{{ formatDate(receipt.date, "DD-MM-YYYY") }}</div>
        </div>
        <q-markup-table
          wrap-cells
          flat
          dense
          separator="none"
          id="print-target"
        >
          <thead>
            <tr>
              <th class="text-left number-column">{{ $t("no.") }}</th>
              <th class="text-left">{{ $t("name") }}</th>
              <th class="text-right">{{ $t("qty") }}</th>
              <th class="text-right">{{ $t("price") }}</th>
              <th class="text-right">{{ $t("amount") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in receipt.items" :key="item.key">
              <td class="text-left number-column">
                {{ item.key }}
              </td>

              <td class="text-left">
                {{ item.name }}
              </td>

              <td class="text-right">
                {{ item.quantity }}
              </td>
              <td class="text-right">
                <span v-if="item.price">
                  {{ formatCurrency(item.price) }}
                </span>
              </td>
              <td class="text-right">
                <span v-if="item.quantity * item.price">
                  {{ formatCurrency(item.quantity * item.price) }}
                </span>
              </td>
            </tr>
            <tr class="summery">
              <td colspan="4" class="text-right">Total</td>
              <td class="text-right">
                <span>{{ formatCurrency(total) }}</span>
              </td>
            </tr>
            <tr>
              <td colspan="4" class="text-right">Deposit</td>
              <td class="text-right">
                <span>{{ formatCurrency(receipt.deposit) }}</span>
              </td>
            </tr>
            <tr>
              <td colspan="4" class="text-right">Discount</td>
              <td class="text-right">
                <span>{{ formatCurrency(receipt.discount) }}</span>
              </td>
            </tr>
            <tr>
              <td colspan="4" class="text-right">Grand Total</td>
              <td class="text-right">
                <span>{{ formatCurrency(grandTotal) }}</span>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
      <div class="col"></div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, date } from "quasar";
import useUtility from "src/composables/utility";
import { computed } from "vue";
import usePrinter from "src/composables/printer";

const { formatDate } = date;
const { formatCurrency } = useUtility();
const props = defineProps({
  receipt: {
    type: Object,
    required: true,
  },
});

const total = computed(() =>
  props.receipt.items.reduce(
    (carry, item) => carry + item.pivot.price * item.pivot.quantity,
    0
  )
);

const grandTotal = computed(
  () =>
    total.value -
    (props.receipt ? props.receipt.deposit : deposit.value) -
    (props.receipt ? props.receipt.discount : discount.value)
);
const { sendPrinterData } = usePrinter();
const print = () => {
  sendPrinterData(document.getElementById("print-target"));
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
.receipt {
  width: 360px;
}
thead > tr > th,
.summery > td {
  border-bottom: 1px solid black;
}
</style>
