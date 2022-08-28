<template>
  <div class="col">
    <q-markup-table
      class="fit bg-transparent"
      separator="cell"
      wrap-cells
      flat
      dense
    >
      <thead>
        <tr>
          <th class="text-left number-column">No.</th>
          <th class="text-left">Name</th>
          <th class="text-right">Qty</th>
          <th class="text-right">Price</th>
          <th class="text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.key" @click="fillItem(item)">
          <td class="text-left number-column">{{ item.key }}</td>

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
        <tr v-if="!receipt">
          <td colspan="5" class="text-center">
            <q-btn
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
.q-markup-table {
  border: 1px solid black;
}
table {
  position: relative;
}

thead {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: rgba($color: #000000, $alpha: 1);
  color: white;
  th {
    border-color: white;
  }
}

.number-column {
  width: 1em;
}
tr {
  td {
    font-size: 11px !important;
    border-color: black;
  }
}
</style>
