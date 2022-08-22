<template>
  <q-page padding v-if="page" :style-fn="pageOptions" class="column">
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
import { debounce } from "quasar";
import useBackend from "src/composables/backend";
import useModelList from "src/composables/modelList";
import useUtility from "src/composables/utility";

const { fetchUsers } = useBackend();
const { pageOptions } = useUtility();
const { page, fetchMore } = useModelList(fetchUsers, {
  role: "user",
  per_page: 40,
});
</script>
