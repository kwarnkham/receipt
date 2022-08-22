<template>
  <q-page padding v-if="page" :style-fn="pageOptions" class="column">
    <q-form @submit.prevent="submit">
      <q-input :label="'Name'" dense v-model="params.name" />
      <q-input dense v-model="params.mobile">
        <template v-slot:prepend>
          <q-icon name="phone" />
        </template>
      </q-input>
      <div class="text-center">
        <q-btn icon="search" flat type="submit" />
      </div>
    </q-form>
    <q-list class="col scroll-y" v-scroll="debounce(fetchMore, 300)">
      <q-item
        v-for="user in page.data"
        :key="user"
        :to="{
          name: 'user',
          params: {
            id: user.id,
          },
        }"
      >
        <q-item-section>
          {{ user.name ?? user.mobile }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { debounce, useQuasar } from "quasar";
import useBackend from "src/composables/backend";
import useModelList from "src/composables/modelList";
import useUtility from "src/composables/utility";
import { ref } from "vue";

const { fetchUsers } = useBackend();
const { loading } = useQuasar();
const { pageOptions } = useUtility();
const params = ref({
  role: "user",
  per_page: 40,
  name: "",
  mobile: "",
});
const { page, fetchMore } = useModelList(fetchUsers, params.value);

const submit = () => {
  loading.show();
  fetchUsers(params.value)
    .then((data) => {
      page.value = data;
    })
    .finally(() => {
      loading.hide();
    });
};
</script>
