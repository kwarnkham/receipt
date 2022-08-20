<template>
  <div class="row">
    <div class="q-px-md flex flex-center">
      <div>
        <div>Payment Info</div>
        <div>09-213123213</div>
        <div>09-123231231</div>
      </div>
    </div>

    <div class="col bigger-font-2">
      <div class="row">
        <div class="col row items-center">
          <div class="footer-label">Total:</div>
          <div class="text-right col">{{ formatCurrency(total) }}</div>
        </div>
      </div>
      <div class="row">
        <div class="col row items-center">
          <div class="footer-label">Deposit:</div>
          <div class="text-right col">
            {{ formatCurrency(receipt ? receipt.deposit : deposit) }}
          </div>
          <q-popup-edit
            :disable="!!receipt"
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
      <div class="row">
        <div class="col row items-center">
          <div class="footer-label">Discount:</div>
          <div class="text-right col">
            {{ formatCurrency(receipt ? receipt.discount : discount) }}
          </div>
          <q-popup-edit
            :disable="!!receipt"
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
      <div class="row text-weight-bolder">
        <div class="col row items-center">
          <div class="footer-label">Grand total:</div>
          <div class="col text-right">
            {{ formatCurrency(grandTotal) }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="text-center text-overline">Thank You</div>
</template>

<script setup>
import { emitter } from "src/boot/eventEmitter";
import useApp from "src/composables/app";
import useUtility from "src/composables/utility";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

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
const { validateNumber } = useApp();
const discount = ref("");
const deposit = ref("");
const total = computed(() =>
  props.items.reduce((carry, item) => carry + item.price * item.quantity, 0)
);

const grandTotal = computed(() => total.value - deposit.value - discount.value);

defineExpose({
  deposit,
  discount,
});
const resetData = () => {
  deposit.value = "";
  discount.value = "";
};
onMounted(() => {
  emitter.on("addNewReceipt", resetData);
});

onBeforeUnmount(() => {
  emitter.off("addNewReceipt", resetData);
});
</script>

<style scoped lang="scss">
.bigger-font-2 {
  font-size: 1.2em;
}
.footer-label {
  width: 90px;
}
</style>
