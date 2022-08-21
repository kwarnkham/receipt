<template>
  <q-page padding v-if="user" class="q-gutter-y-sm">
    <div>Name : {{ user.name }}</div>
    <div>Mobile: {{ user.mobile }}</div>

    <q-img :src="getImage(logoPicture?.name)" alt="logo">
      <div class="absolute-bottom">Logo</div>
      <PicturesSelector v-model="logo">
        <template #showSelectedPictures="{ showPicturesToUpload }">
          <q-btn
            no-caps
            outline
            color="accent"
            icon="visibility"
            @click="showPicturesToUpload"
          />
        </template>
        <template #deleteSelectedPictures="{ clearChosenImages }">
          <q-btn
            no-caps
            outline
            color="negative"
            icon="delete"
            @click="clearChosenImages"
          />
        </template>
        <template #imagePicker="{ chooseImages }">
          <q-btn
            color="indigo"
            @click="chooseImages"
            no-caps
            :label="'Add logo'"
          />
        </template>
        <!-- <template #upload>
          <q-btn color="primary" @click="upload" no-caps icon="upload" />
        </template> -->
      </PicturesSelector>
      <div class="absolute-top-right">
        <q-btn
          icon="save"
          color="primary"
          @click="savePicture(1)"
          :disabled="!logo.length"
        />
      </div>
    </q-img>

    <q-img :src="getImage(backgroundPicture?.name)" alt="baclground">
      <div class="absolute-bottom">Background</div>
      <PicturesSelector v-model="background">
        <template #showSelectedPictures="{ showPicturesToUpload }">
          <q-btn
            no-caps
            outline
            color="accent"
            icon="visibility"
            @click="showPicturesToUpload"
          />
        </template>
        <template #deleteSelectedPictures="{ clearChosenImages }">
          <q-btn
            no-caps
            outline
            color="negative"
            icon="delete"
            @click="clearChosenImages"
          />
        </template>
        <template #imagePicker="{ chooseImages }">
          <q-btn
            color="indigo"
            @click="chooseImages"
            no-caps
            :label="'Add Background'"
          />
        </template>
        <!-- <template #upload>
          <q-btn color="primary" @click="upload" no-caps icon="upload" />
        </template> -->
      </PicturesSelector>
      <div class="absolute-top-right">
        <q-btn
          icon="save"
          color="primary"
          @click="savePicture(2)"
          :disabled="!background.length"
        />
      </div>
    </q-img>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import useBackend from "src/composables/backend";
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
import PicturesSelector from "src/components/PicturesSelector.vue";
import useApp from "src/composables/app";

const user = ref(null);
const { findUser, createPicture } = useBackend();
const route = useRoute();
const { loading } = useQuasar();
const { getImage } = useApp();
const logo = ref([]);
const background = ref([]);
const logoPicture = computed(() =>
  user.value?.pictures.find((e) => e.type == 1)
);

const savePicture = (type) => {
  if (![1, 2].includes(type)) return;
  if (type == 1 && logo.value.length == 0) return;
  if (type == 2 && background.value.length == 0) return;
  loading.show();
  createPicture({
    picture: type == 1 ? logo.value[0] : background.value[0],
    user_id: user.value.id,
    type,
  })
    .then((data) => {
      const index = user.value.pictures.findIndex((e) => e.type == data.type);
      if (index >= 0) user.value.pictures[index] = data;
      else user.value.pictures.push(data);
      logo.value = [];
    })
    .finally(() => {
      loading.hide();
    });
};

const backgroundPicture = computed(() =>
  user.value?.pictures.find((e) => e.type == 2)
);
onMounted(() => {
  loading.show();
  findUser(route.params.id)
    .then((data) => {
      user.value = data;
    })
    .finally(() => {
      loading.hide();
    });
});
</script>
