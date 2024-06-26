<template>
  <q-page padding v-if="user" class="q-gutter-y-sm bg-grey-4">
    <div class="text-subtitle1 text-center">
      {{ user.name }}
      <q-btn
        icon="visibility"
        flat
        size="xs"
        @click="
          $router.push({
            name: 'createReceipt',
            query: {
              user: user.id,
            },
          })
        "
      />
    </div>
    <q-expansion-item expand-separator label="Subscription">
      <q-form @submit.prevent="subscribe">
        <q-input :label="'Days'" v-model="dayDuration" required type="tel" />
        <q-input :label="'Price'" v-model="price" required type="tel" />
        <div class="text-center">
          <q-btn type="submit" :label="'Submit'" flat no-caps />
        </div>
      </q-form>
      <div
        v-if="user.latest_subscription"
        class="bg-grey-8 text-white text-center rounded-borders"
      >
        <div>
          Start Date:
          {{ formatDate(user.latest_subscription.created_at, "DD/MM/YYYY") }}
        </div>
        <div>
          End Date:
          {{
            formatDate(
              addToDate(user.latest_subscription.created_at, {
                days: user.latest_subscription.duration,
              }),
              "DD/MM/YYYY"
            )
          }}
        </div>
        <div v-if="user.latest_subscription.remaining_duration >= 0">
          Remaining Days:
          {{ user.latest_subscription.remaining_duration }}
        </div>
        <div v-else>Expired</div>
      </div>
    </q-expansion-item>
    <q-expansion-item expand-separator label="Information">
      <div class="q-px-sm row justify-between">
        <q-btn @click="changeUserInfo('name')" no-caps flat>
          Name : {{ user.name }}
        </q-btn>
        <q-btn @click="changeUserInfo('mobile')" no-caps flat>
          Mobile: {{ user.mobile }}
        </q-btn>
      </div>
    </q-expansion-item>
    <q-expansion-item expand-separator label="Payment">
      <q-form
        @submit.prevent="addPaymentToUser"
        class="q-pa-xs q-gutter-y-xs bg-light-blue-1 rounded-borders"
      >
        <q-select
          :label="'Payments'"
          v-model="selectedPayment"
          :options="payments"
          option-label="name"
          option-value="id"
        ></q-select>
        <q-input v-model="accountName" dense :label="'Account Name'" />
        <q-input v-model="number" required dense type="tel" :label="'Number'" />
        <div class="text-center">
          <q-btn icon="add" flat type="submit" />
        </div>
      </q-form>
      <div>
        <div
          v-for="payment in user.payments"
          :key="payment.id"
          @click="showEditUserPaymentDialog(payment)"
        >
          <q-icon name="paid" /> {{ payment.name }} <q-icon name="numbers" />{{
            payment.pivot.number
          }}
          <q-icon name="person" v-if="payment.pivot.account_nam" />{{
            payment.pivot.account_name
          }}
        </div>
      </div>
    </q-expansion-item>
    <q-expansion-item expand-separator label="Logo">
      <q-img :src="getImage(logoPicture?.name)" alt="logo">
        <div class="absolute-bottom">Logo</div>
        <PicturesSelector v-model="logo">
          <template #showSelectedPictures="{ showPicturesToUpload }">
            <q-btn
              no-caps
              outline
              color="accent"
              icon="visibility"
              @click="showPicturesToUpload"
            />
          </template>
          <template #deleteSelectedPictures="{ clearChosenImages }">
            <q-btn
              no-caps
              outline
              color="negative"
              icon="delete"
              @click="clearChosenImages"
            />
          </template>
          <template #imagePicker="{ chooseImages }">
            <q-btn
              color="indigo"
              @click="chooseImages"
              no-caps
              :label="'Add logo'"
            />
          </template>
          <!-- <template #upload>
          <q-btn color="primary" @click="upload" no-caps icon="upload" />
        </template> -->
        </PicturesSelector>
        <div class="absolute-top-right">
          <q-btn
            icon="save"
            color="primary"
            @click="savePicture(1)"
            :disabled="!logo.length"
          />
        </div>
      </q-img>
      <q-img
        :src="getImage(receiptLogoPicture?.name)"
        alt="receipt-logo"
        class="q-mt-sm"
        id="receipt-logo"
      >
        <div class="absolute-bottom row justify-between">
          <div>Receipt Logo</div>
          <div v-if="receiptLogoPicture">
            <q-btn icon="print" size="sm" flat @click="print" />
          </div>
        </div>
        <PicturesSelector v-model="receiptLogo">
          <template #showSelectedPictures="{ showPicturesToUpload }">
            <q-btn
              no-caps
              outline
              color="accent"
              icon="visibility"
              @click="showPicturesToUpload"
            />
          </template>
          <template #deleteSelectedPictures="{ clearChosenImages }">
            <q-btn
              no-caps
              outline
              color="negative"
              icon="delete"
              @click="clearChosenImages"
            />
          </template>
          <template #imagePicker="{ chooseImages }">
            <q-btn
              color="indigo"
              @click="chooseImages"
              no-caps
              :label="'Add Receipt logo'"
            />
          </template>
          <!-- <template #upload>
          <q-btn color="primary" @click="upload" no-caps icon="upload" />
        </template> -->
        </PicturesSelector>
        <div class="absolute-top-right">
          <q-btn
            icon="save"
            color="primary"
            @click="savePicture(3)"
            :disabled="!receiptLogo.length"
          />
        </div>
      </q-img>
    </q-expansion-item>
    <q-expansion-item expand-separator label="Background">
      <q-img :src="getImage(backgroundPicture?.name)" alt="baclground">
        <div class="absolute-bottom">Background</div>
        <PicturesSelector v-model="background">
          <template #showSelectedPictures="{ showPicturesToUpload }">
            <q-btn
              no-caps
              outline
              color="accent"
              icon="visibility"
              @click="showPicturesToUpload"
            />
          </template>
          <template #deleteSelectedPictures="{ clearChosenImages }">
            <q-btn
              no-caps
              outline
              color="negative"
              icon="delete"
              @click="clearChosenImages"
            />
          </template>
          <template #imagePicker="{ chooseImages }">
            <q-btn
              color="indigo"
              @click="chooseImages"
              no-caps
              :label="'Add Background'"
            />
          </template>
          <!-- <template #upload>
          <q-btn color="primary" @click="upload" no-caps icon="upload" />
        </template> -->
        </PicturesSelector>
        <div class="absolute-top-right">
          <q-btn
            icon="save"
            color="primary"
            @click="savePicture(2)"
            :disabled="!background.length"
          />
        </div>
      </q-img>
    </q-expansion-item>
    <q-expansion-item expand-separator label="Table color">
      <div class="row items-center">
        <q-input
          class="col"
          label="Color Code"
          v-model="tableColor"
          outlined
          :input-style="{ backgroundColor: tableColor }"
        />
        <div><q-btn label="Set" no-caps flat @click="setTableColor" /></div>
      </div>
    </q-expansion-item>
    <div class="row justify-evenly">
      <div>
        <q-btn
          :label="'Reset Password'"
          color="teal"
          no-caps
          outline
          @click="resetPassword"
        />
      </div>
      <div>
        <q-btn
          :label="'Download Receipts'"
          color="teal"
          no-caps
          outline
          @click="downloadReceipts"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import useBackend from "src/composables/backend";
import { useRoute } from "vue-router";
import { useQuasar, date } from "quasar";
import PicturesSelector from "src/components/PicturesSelector.vue";
import useApp from "src/composables/app";
import EditPaymentInfoFormDialog from "src/components/EditPaymentInfoFormDialog";
import usePrinter from "src/composables/printer";
const { formatDate, addToDate } = date;
const user = ref(null);
const { sendPrinterData } = usePrinter();
const print = () => {
  sendPrinterData(
    document.getElementById("receipt-logo")?.children[1]?.children[0]
  ).finally(() => {
    loading.hide();
  });
};
const {
  findUser,
  createPicture,
  updateUserInfo,
  fetchPayments,
  addPayment,
  updateUserPaymentInfo,
  deleteUserPaymentInfo,
  subscribeUser,
  resetUserPassword,
  setSetting,
  fetchAllReceiptsOfUser,
} = useBackend();
const route = useRoute();
const { loading, dialog } = useQuasar();
const { getImage, successNotify, downloadCSV } = useApp();
const logo = ref([]);
const receiptLogo = ref([]);
const background = ref([]);
const payments = ref([]);
const accountName = ref("");
const number = ref("");
const tableColor = ref("");
const selectedPayment = ref(null);
const logoPicture = computed(() =>
  user.value?.pictures.find((e) => e.type == 1)
);
const receiptLogoPicture = computed(() =>
  user.value?.pictures.find((e) => e.type == 3)
);

const setTableColor = () => {
  if (!tableColor.value) return;
  loading.show();
  setSetting({ user_id: user.value.id, table_color: tableColor.value }).finally(
    () => {
      loading.hide();
    }
  );
};

const addPaymentToUser = () => {
  loading.show();
  addPayment({
    user_id: user.value.id,
    payment_id: selectedPayment.value.id,
    account_name: accountName.value,
    number: number.value,
  })
    .then((data) => {
      if (data) {
        accountName.value = "";
        number.value = "";
        user.value = data;
      }
    })
    .finally(() => {
      loading.hide();
    });
};
const showEditUserPaymentDialog = (payment) => {
  dialog({
    component: EditPaymentInfoFormDialog,
    componentProps: {
      payment,
    },
  }).onOk((payload) => {
    if (payload.delete) {
      loading.show();
      deleteUserPaymentInfo({
        user_id: user.value.id,
        payment_id: payment.id,
        number: payment.pivot.number,
      })
        .then((data) => {
          if (data)
            user.value.payments.splice(
              user.value.payments.findIndex((e) => e.id == payment.id),
              1
            );
        })
        .finally(() => {
          loading.hide();
        });
    } else {
      if (
        payload.account_name == payment.pivot.account_name &&
        payload.number == payment.pivot.number
      )
        return;
      loading.show();
      updateUserPaymentInfo({
        user_id: user.value.id,
        payment_id: payment.id,
        old_number: payment.pivot.number,
        account_name: payload.account_name,
        number: payload.number,
      })
        .then((data) => {
          if (data) {
            const temp = JSON.parse(JSON.stringify(user.value));
            const index = temp.payments.findIndex((e) => e.id == data.id);
            temp.payments[index] = data;
            user.value = temp;
          }
        })
        .finally(() => {
          loading.hide();
        });
    }
  });
};
const dayDuration = ref(30);
const price = ref(20000);
const subscribe = () => {
  dialog({
    title: "Are you sure?",
  }).onOk(() => {
    loading.show();
    subscribeUser({
      user_id: user.value.id,
      day: Number(dayDuration.value),
      price: price.value,
    })
      .then((data) => {
        successNotify("Success");
        user.value.latest_subscription = data;
      })
      .finally(() => {
        loading.hide();
      });
  });
};

const downloadReceipts = () => {
  fetchAllReceiptsOfUser(user.value.id).then((receipts) => {
    if (receipts) {
      downloadCSV(receipts, user.value.name);
    }
  });
};
const changeUserInfo = (field) => {
  dialog({
    title: "Change " + field,
    prompt: {
      model: user.value[field],
    },
  }).onOk((value) => {
    console.log(value, user.value[field]);
    if (value == user.value[field]) return;
    loading.show();
    const data = JSON.parse(JSON.stringify(user.value));
    data.user_id = data.id;
    data[field] = value;
    updateUserInfo(data)
      .then((data) => {
        user.value = data;
      })
      .finally(() => {
        loading.hide();
      });
  });
};

const resetPassword = () => {
  dialog({
    title: "Confirm reset password",
  }).onOk(() => {
    loading.show();
    resetUserPassword(user.value.id)
      .then((_) => {
        if (_) successNotify("Reset success");
      })
      .finally(() => {
        loading.hide();
      });
  });
};

const savePicture = (type) => {
  if (![1, 2, 3].includes(type)) return;
  if (type == 1 && logo.value.length == 0) return;
  if (type == 2 && background.value.length == 0) return;
  if (type == 3 && receiptLogo.value.length == 0) return;
  loading.show();
  const pictures = {
    1: logo.value[0],
    2: background.value[0],
    3: receiptLogo.value[0],
  };
  createPicture({
    picture: pictures[type],
    user_id: user.value.id,
    type,
  })
    .then((data) => {
      const index = user.value.pictures.findIndex((e) => e.type == data.type);
      if (index >= 0) user.value.pictures[index] = data;
      else user.value.pictures.push(data);

      logo.value = [];
      background.value = [];
      receiptLogo.value = [];
    })
    .finally(() => {
      loading.hide();
    });
};

const backgroundPicture = computed(() =>
  user.value?.pictures.find((e) => e.type == 2)
);
onMounted(() => {
  loading.show();
  findUser(route.params.id)
    .then((data) => {
      user.value = data;
      tableColor.value = data.setting?.table_color;
    })
    .finally(() => {
      fetchPayments()
        .then((data) => {
          payments.value = data;
          selectedPayment.value = data[0];
        })
        .finally(() => {
          loading.hide();
        });
    });
});
</script>
