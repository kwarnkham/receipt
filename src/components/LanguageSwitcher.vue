<template>
  <q-btn-group v-if="langOptions">
    <q-btn
      no-caps
      :outline="option.value != lang"
      :glossy="option.value == lang"
      v-for="option in langOptions"
      :label="label[option.value]"
      :key="option.value"
      @click="lang = option.value"
      :color="option.value == lang ? 'positive' : 'white'"
    />
  </q-btn-group>
</template>

<script setup>
import { useQuasar } from "quasar";
import languages from "quasar/lang/index.json";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const appLanguages = languages.filter((lang) =>
  ["mm", "en-US"].includes(lang.isoName)
);

const langOptions = appLanguages.map((lang) => ({
  label: lang.nativeName,
  value: lang.isoName,
}));

const $q = useQuasar();
const lang = ref($q.lang.isoName);
const { locale } = useI18n({ useScope: "global" });

const label = {
  "en-US": "English",
  mm: "မြန်မာ",
};

watch(lang, (val) => {
  // dynamic import, so loading on demand only
  import(
    /* webpackInclude: /(mm|en-US)\.js$/ */
    `quasar/lang/${val}`
  ).then((lang) => {
    $q.lang.set(lang.default);
    locale.value = val;
    $q.localStorage.set("locale", val);
    // console.log($q.lang.isoName);
  });
});
</script>
