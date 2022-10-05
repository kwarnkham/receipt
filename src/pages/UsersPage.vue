<template>
  <q-page padding v-if="page" :style-fn="pageOptions" class="column">
    <q-form @submit.prevent="submit">
      <q-input :label="'Name'" dense v-model="params.name" />
      <q-input dense v-model="params.mobile">
        <template v-slot:prepend>
          <q-icon name="phone" />
        </template>
      </q-input>
      <div class="row justify-around">
        <q-btn icon="add" flat @click="showAddUserForm" />
        <q-btn icon="search" flat type="submit" />
      </div>
    </q-form>
    <q-list
      class="col scroll-y"
      v-scroll="debounce(fetchMore, 300)"
      separator
      bordered
    >
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
        <q-item-section
          :class="{
            'text-red': user.latest_subscription.remaining_duration < 0,
          }"
        >
          {{ user.name ?? user.mobile }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { debounce, useQuasar } from "quasar";
import AddUserFormDialog from "src/components/AddUserFormDialog";
import useBackend from "src/composables/backend";
import useModelList from "src/composables/modelList";
import useUtility from "src/composables/utility";
import { ref } from "vue";
import { useRouter } from "vue-router";

const { fetchUsers, createUser } = useBackend();
const { loading, dialog } = useQuasar();
const { pageOptions } = useUtility();
const router = useRouter();
const params = ref({
  role: "user",
  per_page: 20,
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

const showAddUserForm = () => {
  dialog({
    component: AddUserFormDialog,
  }).onOk((data) => {
    loading.show();
    createUser(data)
      .then((data) => {
        if (data)
          router.push({
            name: "user",
            params: {
              id: data.id,
            },
          });
      })
      .finally(() => {
        loading.hide();
      });
  });
};
</script>
