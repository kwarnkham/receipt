<template>
  <q-page padding class="bg-grey q-gutter-y-sm">
    <div class="text-center"><LanguageSwitcher /></div>
    <q-card @click="$router.push({ name: 'changePassword' })">
      <q-card-section>
        {{ $t("changePassword") }}
      </q-card-section>
    </q-card>
    <q-card @click="$router.push({ name: 'subscription' })">
      <q-card-section>
        {{ $t("subscription") }}
      </q-card-section>
    </q-card>
    <q-card @click="downloadApp" v-if="canDownload">
      <q-card-section>
        {{ $t("download") }}
        <q-icon name="android" size="xs" color="secondary" />
        <q-badge>v{{ version }} <q-icon name="download" /></q-badge>
      </q-card-section>
    </q-card>
    <q-card @click="logout">
      <q-card-section>
        {{ $t("logout") }}
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import LanguageSwitcher from "src/components/LanguageSwitcher.vue";
import { useUserStore } from "src/stores/user";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { localStorage, dialog, platform } = useQuasar();
const userStore = useUserStore();
const router = useRouter();
const { t } = useI18n();
const version = process.env.APP_VERSION;
const downloadApp = () => {
  if (!canDownload.value) return;
  window.open(
    process.env.ASSETS_URL +
      "/apk/PhoneVoucherV" +
      process.env.APP_VERSION +
      ".apk"
  );
};
const canDownload = computed(
  () => ["spa", "pwa"].includes(process.env.MODE) && platform.is.android
);
const logout = () => {
  dialog({
    title: t("Do you want to logout?"),
  }).onOk(() => {
    const user = userStore.getUser;
    localStorage.remove(user.id + "knownUsers");
    localStorage.remove(user.id + "knownItems");
    localStorage.remove("token");
    userStore.setUser(null);
    api.defaults.headers.common["Authorization"] = undefined;
    router.replace({ name: "login" });
  });
};
</script>
