<template>
  <q-img
    :src="image"
    :alt="src.name"
    loading="lazy"
    fit="scale-down"
    :img-style="{ borderRadius: '10px' }"
  >
    <!-- <div class="absolute-bottom text-subtitle1 text-center">{{ src.name }}</div> -->
  </q-img>
</template>

<script setup>
import { ref, onMounted } from "vue";
import useUtilities from "src/composables/utility";

const props = defineProps({
  src: {
    required: true,
  },
});
const { readPicture } = useUtilities();
onMounted(() => {
  readPicture(props.src).then((url) => (image.value = url));
});
const image = ref("");
</script>

<style lang="scss" scoped>
div.text-subtitle1 {
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}
</style>
