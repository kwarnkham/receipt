<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent position="bottom">
    <q-card class="q-dialog-plugin">
      <q-card-section v-if="suggestedItems.length">
        <q-list dense>
          <q-item
            v-for="value in suggestedItems"
            :key="value.name"
            clickable
            @click="fillItem(value)"
          >
            <q-item-section>{{ value.name }}</q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-section>
        <q-input :label="'Item name'" v-model="name" autofocus />
        <q-input :label="'Price'" v-model="price" type="tel" />
        <q-input :label="'Quantity'" v-model="quantity" type="tel" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="info" label="Clear" @click="clearData" />
        <q-btn color="primary" label="Cancel" @click="onDialogCancel" />
        <q-btn
          color="primary"
          label="OK"
          @click="onOKClick"
          :disabled="!filled"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from "quasar";
import { useUserStore } from "src/stores/user";
import { computed, ref } from "vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const { localStorage } = useQuasar();

const name = ref(props.item.name);
const price = ref(props.item.price);
const quantity = ref(props.item.quantity || "1");

const userStore = useUserStore();
const knownItems =
  localStorage.getItem(userStore.getUser.id + "knownItems") ?? [];
const suggestedItems = computed(() => {
  if (!name.value) return [];
  return knownItems.filter((e) =>
    e.name.toLowerCase().includes(name.value.toLowerCase())
  );
});

const clearData = () => {
  onDialogOK({
    key: props.item.key,
    price: "",
    quantity: "",
    name: "",
  });
};

const fillItem = (item) => {
  name.value = item.name;
  price.value = item.price;
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

// this is part of our example (so not required)
const filled = computed(
  () =>
    name.value &&
    price.value &&
    quantity.value &&
    Number(price.value) &&
    Number(quantity.value)
);
function onOKClick() {
  onDialogOK({
    key: props.item.key,
    price: price.value,
    quantity: quantity.value,
    name: name.value,
  });
  // or with payload: onDialogOK({ ... })
  // ...and it will also hide the dialog automatically
}
</script>
