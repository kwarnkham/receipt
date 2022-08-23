<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <q-input :label="'Name'" v-model="name" autofocus />
        <q-input :label="'Phone'" v-model="mobile" type="tel" />
      </q-card-section>

      <q-card-actions align="right">
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
import { useDialogPluginComponent } from "quasar";
import { computed, ref } from "vue";

const name = ref("");
const mobile = ref("");

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
const filled = computed(() => mobile.value && name.value);
function onOKClick() {
  onDialogOK({
    name: name.value,
    mobile: mobile.value,
  });
  // or with payload: onDialogOK({ ... })
  // ...and it will also hide the dialog automatically
}
</script>
