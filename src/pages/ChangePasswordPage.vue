<template>
  <q-page padding>
    <q-form @submit.prevent="submit" class="q-gutter-y-sm">
      <q-input
        v-model="password"
        type="password"
        required
        :label="'Old Password'"
        autocomplete="current-password"
      />
      <q-input
        v-model="newPassword"
        type="password"
        required
        :label="'New Password'"
        autocomplete="new-password"
      />
      <q-input
        v-model="newPasswordConfirmation"
        type="password"
        required
        :label="'New Password Again'"
        autocomplete="new-password"
      />
      <div class="text-center">
        <q-btn type="sumit" icon="save" />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import useApp from "src/composables/app";
import useBackend from "src/composables/backend";
import { ref } from "vue";

const { changePassword } = useBackend();
const { loading } = useQuasar();
const { successNotify } = useApp();
const newPassword = ref("");
const password = ref("");
const newPasswordConfirmation = ref("");
const resetData = () => {
  newPassword.value = "";
  newPasswordConfirmation.value = "";
  password.value = "";
};
const submit = () => {
  loading.show();
  changePassword({
    password: password.value,
    new_password: newPassword.value,
    new_password_confirmation: newPasswordConfirmation.value,
  })
    .then((_) => {
      if (_) {
        resetData();
        successNotify("Success");
      }
    })
    .finally(() => {
      loading.hide();
    });
};
</script>
