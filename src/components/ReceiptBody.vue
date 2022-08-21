<template>
  <div
    class="col body"
    :style="{
      backgroundImage:
        'url(' +
        getImage(userStore.getUser.pictures.find((e) => e.type == 2)?.name) +
        ')',
    }"
  >
    <q-markup-table
      class="fit bg-transparent"
      separator="cell"
      wrap-cells
      bordered
      flat
    >
      <thead>
        <tr>
          <th class="text-left">#</th>
          <th class="text-left">Name</th>
          <th class="text-right">Quantity</th>
          <th class="text-right">Price</th>
          <th class="text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.key" @click="fillItem(item)">
          <td class="text-left">{{ item.key }}</td>

          <td class="text-left">
            {{ item.name }}
          </td>

          <td class="text-right">
            {{ item.quantity }}
          </td>
          <td class="text-right">
            <span v-if="item.price">
              {{ formatCurrency(item.price) }}
            </span>
          </td>
          <td class="text-right">
            <span v-if="item.quantity * item.price">
              {{ formatCurrency(item.quantity * item.price) }}
            </span>
          </td>
        </tr>
        <tr>
          <td colspan="5" class="text-center">
            <q-btn
              v-if="!receipt"
              icon="add"
              dense
              flat
              color="primary"
              @click="$emit('addRow')"
            />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import useUtility from "src/composables/utility";
import ItemFormDialog from "src/components/ItemFormDialog";
import { useUserStore } from "src/stores/user";
import useApp from "src/composables/app";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  receipt: {
    required: true,
  },
});

const emit = defineEmits(["addRow", "itemFilled"]);

const { formatCurrency } = useUtility();
const { dialog } = useQuasar();
const userStore = useUserStore();
const { getImage } = useApp();
const fillItem = (item) => {
  if (props.receipt) return;
  dialog({
    component: ItemFormDialog,
    componentProps: {
      item,
    },
  }).onOk((item) => {
    emit("itemFilled", item);
  });
};
</script>

<style scoped lang="scss">
table {
  position: relative;
}

thead {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: rgba($color: #000000, $alpha: 0.7);
  color: white;
}
.body {
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
</style>
