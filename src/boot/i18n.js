import { boot } from "quasar/wrappers";
import { createI18n } from "vue-i18n";
import messages from "src/i18n";
import { LocalStorage } from "quasar";

export default boot(({ app }) => {
  const locale = LocalStorage.getItem("locale") ?? "mm";
  const i18n = createI18n({
    locale,
    globalInjection: true,
    messages,
    legacy: false,
  });

  // Set i18n instance on app
  app.use(i18n);
});
