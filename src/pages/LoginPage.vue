<template>
  <q-page padding class="flex flex-center">
    <q-form @submit.prevent="submit" class="q-pa-xs q-gutter-y-xs full-width">
      <q-input
        :label="'Phone Number'"
        v-model="mobile"
        required
        type="tel"
        autocomplete="username"
      />
      <q-input
        :label="'Password'"
        v-model="password"
        required
        type="password"
        autocomplete="password"
      />
      <div class="text-center">
        <q-btn :label="'Login'" type="submit" color="primary" />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import useApp from "src/composables/app";
import useBackend from "src/composables/backend";
import { ref } from "vue";
import { useRouter } from "vue-router";

const mobile = ref("");
const password = ref("");
const { loading, localStorage } = useQuasar();
const { login, fetchKnownItems, fetchKnownUsers } = useBackend();
const { preserveToken } = useApp();
const router = useRouter();
const submit = () => {
  loading.show();
  login({
    mobile: mobile.value,
    password: password.value,
  })
    .then((data) => {
      if (data) {
        preserveToken(data);
        const { user } = data;
        const knownUsersKey = user.id + "knownUsers";
        const knownItemsKey = user.id + "knownItems";
        let knownUsers = localStorage.getItem(knownUsersKey);
        let knownItems = localStorage.getItem(knownItemsKey);
        if (!knownUsers)
          fetchKnownUsers().then((data) =>
            localStorage.set(knownUsersKey, data)
          );

        if (!knownItems)
          fetchKnownItems().then((data) =>
            localStorage.set(knownItemsKey, data)
          );
        router.replace({ name: "index" });
      }
    })
    .finally(() => {
      loading.hide();
    });
};
</script>
