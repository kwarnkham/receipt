import { boot } from "quasar/wrappers";
import { ref } from "vue";
export default boot(({ app }) => {
  const printCharacteristic = ref();
  const setPrintCharacteristic = (characteristic) => {
    printCharacteristic.value = characteristic;
  };
  app.provide("printer", {
    printCharacteristic,
    setPrintCharacteristic,
  });
});

