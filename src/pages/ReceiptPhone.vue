<template>
  <q-page padding>
    <div class="text-h6 text-center">Receipt Phone</div>
    <div>
      <q-card v-for="phone in userStore.getUser?.phones" :key="phone.id">
        <q-card-section class="q-px-md row justify-between q-mb-sm">
          <div class="text-subtitle1">
            <q-icon name="phone" /> {{ phone.number }}
          </div>
          <div class="q-gutter-x-sm">
            <q-btn
              icon="edit"
              size="sm"
              round
              color="info"
              @click="editPhone(phone)"
            ></q-btn>
            <q-btn
              icon="delete_forever"
              size="sm"
              round
              color="warning"
              @click="remove(phone)"
            ></q-btn>
          </div>
        </q-card-section>
      </q-card>
      <q-separator spaced v-if="userStore.getUser.phones.length < 2" />
      <q-form
        @submit.prevent="addPhone"
        class="q-pa-sm q-gutter-y-sm"
        v-if="userStore.getUser.phones.length < 2"
      >
        <div class="text-h6">Add New Phone</div>
        <q-input
          v-model="phone"
          type="tel"
          required
          :label="'Phone'"
          placeholder="New phone number to add"
        />

        <div class="text-center">
          <q-btn type="submit" label="Add" no-caps rounded />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { useUserStore } from "src/stores/user";
import { ref } from "vue";
import useBackend from "src/composables/backend";
import { useQuasar } from "quasar";

const userStore = useUserStore();
const { createPhone, updatePhone, deletePhone } = useBackend();
const { loading, dialog } = useQuasar();
const addPhone = () => {
  loading.show();
  createPhone({ number: phone.value })
    .then((data) => {
      const temp = JSON.parse(JSON.stringify(userStore.getUser));
      temp.phones.push(data);
      userStore.setUser(temp);
      phone.value = "";
    })
    .finally(() => {
      loading.hide();
    });
};
const phone = ref("");
const remove = (phone) => {
  dialog({
    title: "Confirm",
    message: "Would you like to delete the phone number?",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    loading.show();
    deletePhone(phone.id)
      .then(() => {
        const temp = JSON.parse(JSON.stringify(userStore.getUser));
        temp.phones.splice(
          temp.phones.findIndex((e) => e.id == phone.id),
          1
        );
        userStore.setUser(temp);
      })
      .finally(() => {
        loading.hide();
      });
  });
};
const editPhone = (phone) => {
  dialog({
    prompt: {
      model: phone.number,
    },
  }).onOk((value) => {
    if (value == phone.number) return;
    loading.show();
    updatePhone(phone.id, { number: value })
      .then((data) => {
        const temp = JSON.parse(JSON.stringify(userStore.getUser));
        temp.phones.splice(
          temp.phones.findIndex((e) => e.id == data.id),
          1,
          data
        );
        userStore.setUser(temp);
      })
      .finally(() => {
        loading.hide();
      });
  });
};
</script>
