<template>
  <div>
    <div v-if="modelValue.length" class="q-gutter-x-xs">
      <slot
        :showPicturesToUpload="showPicturesToUpload"
        name="showSelectedPictures"
      ></slot>
      <slot
        :clearChosenImages="clearChosenImages"
        name="deleteSelectedPictures"
      ></slot>

      <slot name="upload"></slot>
    </div>

    <div class="row justify-between" v-show="!modelValue.length">
      <input
        :multiple="multiple"
        type="file"
        ref="filesInput"
        class="hidden"
        @input="setPictures"
        accept="image/*"
      />
      <slot :chooseImages="chooseImages" name="imagePicker"></slot>
    </div>
  </div>
</template>

<script setup>
import PicturesToUpload from "src/components/PicturesToUpload";
import imageCompression from "browser-image-compression";
import { useQuasar } from "quasar";
import { watch, ref } from "vue";

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:modelValue"]);

const { dialog, loading } = useQuasar();
const filesInput = ref(null);
const chooseImages = () => {
  filesInput.value.click();
};
const clearChosenImages = () => {
  filesInput.value.value = null;
  emit("update:modelValue", []);
};
const showPicturesToUpload = () => {
  dialog({
    component: PicturesToUpload,
    componentProps: {
      pictures: props.modelValue,
    },
  });
};

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue.length == 0) filesInput.value.value = null;
  }
);
const setPictures = (e) => {
  loading.show();
  const fileList = e.target.files;
  if (fileList.length > 5) {
    notify({
      color: "negative",
      position: "center",
      message: "Files cannot be more than 5",
      textColor: "white",
    });
    return;
  }

  if (fileList.length == 0) loading.hide();

  const temp = [];
  for (let index = 0; index < fileList.length; index++) {
    const imageFile = fileList.item(index);
    // console.log("originalFile instanceof Blob", imageFile instanceof Blob);
    // console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);
    const options = {
      maxSizeMB: 0.7,
    };

    imageCompression(imageFile, options)
      .then(function (compressedFile) {
        // console.log(
        //   "compressedFile instanceof Blob",
        //   compressedFile instanceof Blob
        // ); // true
        // console.log(
        //   `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
        // ); // smaller than maxSizeMB
        temp.push(compressedFile);
        if (temp.length === fileList.length) {
          emit("update:modelValue", temp);
          loading.hide();
        }
      })
      .catch(function (error) {
        console.log(error.message);
      });
  }
};
</script>
