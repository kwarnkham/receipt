<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    persistent
    full-height
    full-width
  >
    <q-card class="fit column">
      <q-card-section>
        <div
          class="row justify-between text-h5 full-width text-center q-mb-sm text-primary"
        >
          <div>Pictures to upload</div>
          <q-btn icon="close" flat @click="onCancelClick" dense round></q-btn>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="col no-wrap q-gutter-x-sm">
        <SelectedImage
          :src="picture"
          v-for="(picture, key) in pictures"
          :key="key"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import SelectedImage from "src/components/SelectedImage";
import { useDialogPluginComponent } from "quasar";
defineProps({
  pictures: {
    type: Array,
    required: true,
  },
});
defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent();

const onCancelClick = onDialogCancel;
</script>

<style lang="scss" scoped>
.image {
  width: 400px;
}
</style>
