<template>
  <q-page padding>
    <q-list>
      <q-item
        v-for="user in users"
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
import { useQuasar } from "quasar";
import useBackend from "src/composables/backend";
import { onMounted, ref } from "vue";
const users = ref([]);
const { fetchUsers } = useBackend();
const { loading } = useQuasar();
onMounted(() => {
  loading.show();
  fetchUsers({ role: "user" })
    .then((data) => {
      users.value = data.data;
    })
    .finally(() => {
      loading.hide();
    });
});
</script>
