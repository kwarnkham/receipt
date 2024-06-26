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
          class="row justify-between full-width no-wrap"
          :class="{ 'q-mt-sm border-top': receipt.user.phones?.length || logo }"
        >
          <div class="col">
            <q-icon name="person" class="q-mr-xs" />{{ receipt.customer_name }}
          </div>
          <div class="text-right">
            <q-icon name="phone_iphone" class="q-mr-xs" />{{
              receipt.customer_phone
            }}
          </div>
        </div>
        <div class="row justify-between full-width no-wrap">
          <div class="col">
            <span class="text-xs">{{ receipt.code }}</span>
          </div>
          <div class="text-right">
            <q-icon name="calendar_month" class="q-mr-xs" />{{
              formatDate(receipt.date, "DD-MM-YYYY")
            }}
          </div>
        </div>
        <div>
          <q-icon name="location_on" class="q-mr-xs" />
          {{ receipt.customer_address }}
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
                {{ item.quantity ?? item.pivot.quantity }}
              </td>
              <td class="text-right">
                <template v-if="item.price">
                  {{ formatCurrency(item.price) }}
                </template>
              </td>
              <td class="text-right">
                <template
                  v-if="(item.quantity ?? item.pivot.quantity) * item.price"
                >
                  {{
                    formatCurrency(
                      (item.quantity ?? item.pivot.quantity) * item.price
                    )
                  }}
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
        <div v-if="receipt.note">Note: {{ receipt.note }}</div>
        <div class="text-caption">{{ printTime }}</div>
        <div class="text-overline flex row line-text q-mt-sm">Thank you</div>
      </div>

      <div class="row justify-around receipt">
        <div class="col-12" v-if="!platform.is.iphone && !platform.is.ipad">
          <div class="full-width q-px-lg">
            <q-badge color="primary"> Size: {{ printSize }} (1 to 10) </q-badge>
            <q-slider v-model="printSize" markers :min="1" :max="10" />
          </div>
        </div>
        <q-btn icon="close" @click="onDialogHide"></q-btn>
        <q-btn :icon="'print'" @click="copyForPrint" color="primary"></q-btn>
      </div>

      <div class="col"></div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import {
  useDialogPluginComponent,
  date,
  useQuasar,
  copyToClipboard,
} from "quasar";
import useUtility from "src/composables/utility";
import { computed, onMounted, ref } from "vue";
import useApp from "src/composables/app";

const { formatDate } = date;
const { formatCurrency } = useUtility();
const props = defineProps({
  receipt: {
    type: Object,
    required: true,
  },
});
const { notify, platform, localStorage } = useQuasar();
const { getImage } = useApp();
const total = computed(() =>
  props.receipt.items.reduce(
    (carry, item) => carry + item.pivot.price * item.pivot.quantity,
    0
  )
);

const copyForPrint = () => {
  const order = {
    id: props.receipt.code,
    amount: total.value,
    discount: props.receipt.discount,
    customer: props.receipt.customer_name,
    phone: props.receipt.customer_phone,
    address: props.receipt.customer_address,
    note: props.receipt.note,
    paid: props.receipt.deposit,
    created_at: props.receipt.date,
    logo: getImage(logo.value),
    logo_phone:
      props.receipt.user.phones?.length == 0
        ? null
        : props.receipt.user.phones.map((e) => e.number).join(", "),
    a_items: props.receipt.items
      .filter((v) => !!v)
      .map((e) => ({
        id: e.id,
        name: e.name,
        price: e.price,
        pivot: {
          price: e.pivot.price,
          quantity: e.pivot.quantity,
          discount: null,
        },
      })),
  };

  copyToClipboard(JSON.stringify(order))
    .then(() => {
      window.open("https://printy.book-mm.com");
    })
    .catch(() => {
      notify({
        message: "Copy Failed",
        type: "negative",
      });
    });
};

const printSize = ref(Number(localStorage.getItem("printSize")) || 1);

const logo = computed(
  () => props.receipt.user.pictures.find((e) => e.type == 3)?.name
);

const grandTotal = computed(
  () =>
    total.value -
    (props.receipt ? props.receipt.deposit : deposit.value) -
    (props.receipt ? props.receipt.discount : discount.value)
);

const printTime = ref(formatDate(new Date(), "DD-MM-YYYY HH:mm:ss"));
// const print = () => {
//   printing.value = true;
//   sendPrinterData(document.getElementById("print-target"), printSize.value)
//     .then(() => {
//       sendTextData("\u000A\u000D");
//     })
//     .catch((error) => {
//       if (error) notify(error);
//       else notify("Printer has disconnected");
//     })
//     .finally(() => {
//       printing.value = false;
//       loading.hide();
//       localStorage.set("printSize", printSize.value);
//     });

//   // sendPrinterData(document.getElementById("foo"));
// };

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
