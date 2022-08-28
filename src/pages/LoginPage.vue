<template>
  <q-page
    padding
    class="flex flex-center page"
    :style="{
      backgroundImage: 'url(' + getImage('assets/login-bg.jpeg') + ')',
    }"
  >
    <q-form
      @submit.prevent="submit"
      class="q-gutter-y-lg bg-white rounded-borders form"
    >
      <div class="text-light-blue">Login</div>
      <q-input
        dense
        :label="'Phone Number'"
        v-model="mobile"
        required
        type="tel"
        autocomplete="username"
        outlined
        color="light-blue"
      >
        <template v-slot:prepend>
          <q-icon name="phone" color="light-blue" />
        </template>
      </q-input>

      <q-input
        dense
        :label="'Password'"
        v-model="password"
        required
        type="password"
        autocomplete="password"
        outlined
        color="light-blue"
      >
        <template v-slot:prepend>
          <q-icon name="lock" color="light-blue" />
        </template>
      </q-input>
      <div class="text-center">
        <q-btn
          :label="'Login'"
          type="submit"
          color="primary"
          class="full-width"
          no-caps
        />
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
const { preserveToken, getImage } = useApp();
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

<style scoped lang="scss">
.page {
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.form {
  border: 2px solid $light-blue;
  width: 80vw;
  padding: 20px;
}
</style>
