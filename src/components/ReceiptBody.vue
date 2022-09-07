<template>
  <div class="col">
    <q-markup-table
      class="fit bg-transparent"
      separator="cell"
      wrap-cells
      flat
      dense
    >
      <thead
        :style="{ backgroundColor: user?.setting?.table_color ?? 'black' }"
      >
        <tr>
          <th class="text-left number-column">{{ $t("no.") }}</th>
          <th class="text-left">{{ $t("name") }}</th>
          <th class="text-right">{{ $t("qty") }}</th>
          <th class="text-right">{{ $t("price") }}</th>
          <th class="text-right">{{ $t("amount") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.key" @click="fillItem(item)">
          <td
            class="text-left number-column"
            :style="{ borderColor: user?.setting?.table_color ?? 'black' }"
          >
            {{ item.key }}
          </td>

          <td
            class="text-left"
            :style="{ borderColor: user?.setting?.table_color ?? 'black' }"
          >
            {{ item.name }}
          </td>

          <td
            class="text-right"
            :style="{ borderColor: user?.setting?.table_color ?? 'black' }"
          >
            {{ item.quantity }}
          </td>
          <td
            class="text-right"
            :style="{ borderColor: user?.setting?.table_color ?? 'black' }"
          >
            <span v-if="item.price">
              {{ formatCurrency(item.price) }}
            </span>
          </td>
          <td
            class="text-right"
            :style="{ borderColor: user?.setting?.table_color ?? 'black' }"
          >
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
  user: {
    required: true,
    type: Object,
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
  }
}
</style>
