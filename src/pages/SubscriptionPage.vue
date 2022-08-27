<template>
  <q-page padding>
    <q-card v-if="subscription">
      <q-card-section>
        <div>
          Subscribed on :
          <strong>
            {{ formatDate(subscription.created_at, "DD/MM/YYYY") }}
          </strong>
        </div>
        <div>
          Subscription will end on :
          <strong>
            {{
              formatDate(
                addToDate(subscription.created_at, {
                  days: subscription.duration,
                }),
                "DD/MM/YYYY"
              )
            }}
          </strong>
        </div>
        <div>
          Remaining days :
          <strong>
            {{
              getDateDiff(
                addToDate(subscription.created_at, {
                  days: subscription.duration,
                }),
                subscription.created_at
              )
            }}
          </strong>
        </div>
        <div class="text-caption text-italic text-center">
          Please contact us to renew the subscription
        </div>
      </q-card-section>
      <q-card-actions align="between">
        <q-btn
          icon="facebook"
          flat
          @click="contactFacebook('108046798696086')"
        />
        <q-btn icon="phone" flat @click="callNumber('09740813851')" />
      </q-card-actions>
    </q-card>
    <q-card v-else> You don't have any active subscription </q-card>
  </q-page>
</template>

<script setup>
import { date } from "quasar";
import useApp from "src/composables/app";
import { useUserStore } from "src/stores/user";
const { formatDate, addToDate, getDateDiff } = date;
const { callNumber, contactFacebook } = useApp();
const userStore = useUserStore();
const subscription = userStore.getUser.latest_subscription;
</script>
