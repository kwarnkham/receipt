<template>
  <div class="row full-width summery">
    <div class="column justify-center q-gutter-y-xs q-pr-xs col-5">
      <div
        v-for="payment in userStore.getUser?.payments"
        :key="payment.pivot.id"
        class="row items-center payment-text"
      >
        <div>
          <q-icon
            size="md"
            :name="'img:' + getImage('assets/' + getPaymentLogo(payment.type))"
          />
        </div>
        <div :class="[payment.type == 1 ? 'kpay-color' : 'wavepay-color']">
          <strong v-if="payment.pivot.account_name">
            {{ payment.pivot.account_name }}
          </strong>
          <div>
            {{ payment.pivot.number }}
          </div>
        </div>
      </div>
    </div>

    <div class="col text-caption q-gutter-y-xs">
      <div class="row text-right">
        <div class="col row items-center">
          <div class="footer-label">{{ $t("total") }}:</div>
          <div class="col outline">{{ formatCurrency(total) }}</div>
        </div>
      </div>
      <div class="row text-right">
        <div class="col row items-center">
          <div class="footer-label">{{ $t("deposit") }}:</div>
          <div class="col outline">
            {{ formatCurrency(receipt ? deposit || receipt.deposit : deposit) }}
          </div>
          <q-popup-edit
            :disable="!!receipt && receipt.status == 1"
            :title="'Deposit'"
            :validate="validateNumber"
            auto-save
            v-model="deposit"
            v-slot="scope"
          >
            <q-input
              v-model="scope.value"
              dense
              autofocus
              @keyup.enter="scope.set"
              type="tel"
            />
          </q-popup-edit>
        </div>
      </div>
      <div class="row text-right">
        <div class="col row items-center">
          <div class="footer-label">{{ $t("discount") }}:</div>
          <div class="col outline">
            {{
              formatCurrency(receipt ? receipt.discount || discount : discount)
            }}
          </div>
          <q-popup-edit
            :disable="!!receipt && receipt.status == 1"
            :title="'Discount'"
            :validate="validateNumber"
            auto-save
            v-model="discount"
            v-slot="scope"
          >
            <q-input
              v-model="scope.value"
              dense
              autofocus
              @keyup.enter="scope.set"
              type="tel"
            />
          </q-popup-edit>
        </div>
      </div>
      <div class="row text-right text-weight-bolder text-body2">
        <div class="col row items-center">
          <div class="footer-label">{{ $t("grandTotal") }}:</div>
          <div class="col outline">
            {{ formatCurrency(grandTotal) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import useApp from "src/composables/app";
import useUtility from "src/composables/utility";
import { useUserStore } from "src/stores/user";
import { computed, ref } from "vue";

const props = defineProps({
  receipt: {
    requried: true,
  },
  items: {
    type: Array,
    required: true,
  },
});

const { formatCurrency } = useUtility();
const { validateNumber, getImage, getPaymentLogo } = useApp();
const discount = ref(props.receipt?.discount ?? 0);
const deposit = ref(props.receipt?.deposit ?? 0);
const userStore = useUserStore();
const total = computed(() =>
  props.items.reduce((carry, item) => carry + item.price * item.quantity, 0)
);

const grandTotal = computed(
  () =>
    total.value -
    (props.receipt ? deposit.value || props.receipt.deposit : deposit.value) -
    (props.receipt ? discount.value || props.receipt.discount : discount.value)
);

defineExpose({
  deposit,
  discount,
});
</script>

<style scoped lang="scss">
.footer-label {
  width: 90px;
}
.outline {
  border: 1px solid black;
  border-radius: 10px;
  padding-right: 4px;
  background-color: white;
}
.payment-text {
  font-size: 11px;
}
.summery {
  height: 100px;
}
</style>
