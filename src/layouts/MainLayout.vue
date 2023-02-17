<template>
  <q-layout view="lHh Lpr lFf" class="max-w-400">
    <transition
      enter-active-class="animated slideInDown"
      leave-active-class="animated slideOutUp"
    >
      <q-header elevated class="my-header max-w-400">
        <q-toolbar>
          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="toggleLeftDrawer"
            v-if="$route.meta.requireAuth"
          />
          <q-btn
            flat
            dense
            round
            icon="keyboard_arrow_left"
            aria-label="Back"
            @click="$router.go(-1)"
            v-if="$route.name != 'index' && $route.meta.requireAuth"
          />
          <q-toolbar-title class="row justify-between no-wrap">
            <div style="width: 40px">
              <q-img
                :src="getImage('assets/icon.png')"
                alt="logo"
                height="34px"
                fit="contain"
                @click="
                  $router.push({
                    name: 'index',
                  })
                "
              />
            </div>
            <div>
              <q-btn
                icon="phone"
                color="teal"
                text-color="white"
                @click="callNumber('09740813851')"
                dense
                round
              >
              </q-btn>
            </div>

            <LanguageSwitcher v-if="$route.name == 'login'" />
          </q-toolbar-title>

          <div>
            <q-btn
              icon="touch_app"
              flat
              v-if="$route.name == 'createReceipt' || $route.name == 'receipt'"
            >
              <q-menu max-width="57px" auto-close>
                <template v-if="$route.name == 'receipt'">
                  <q-btn
                    icon="add"
                    flat
                    @click="$router.replace({ name: 'createReceipt' })"
                  />
                  <q-btn
                    v-if="!platform.is.iphone && !platform.is.ipad"
                    icon="download"
                    flat
                    @click="downloadPage($route.params.id)"
                  />
                  <q-btn icon="print" flat @click="$emitter.emit('print')" />
                  <q-btn
                    icon="location_pin"
                    flat
                    @click="$emitter.emit('printAddress')"
                  />
                </template>
                <template v-else>
                  <q-btn
                    icon="save"
                    flat
                    @click="$emitter.emit('createReceipt')"
                  />
                  <q-btn
                    icon="label"
                    flat
                    @click="$emitter.emit('draftReceipt')"
                  />
                </template>
              </q-menu>
            </q-btn>
          </div>
        </q-toolbar>
      </q-header>
    </transition>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      v-if="userStore.getUser"
    >
      <q-list>
        <template v-for="link in links" :key="link.name">
          <q-item
            :to="{ name: link.name }"
            exact-active-class="bg-primary text-white"
            exact
            v-if="link.name != 'users' || isAdmin(userStore.getUser)"
          >
            <q-item-section> {{ link.meta.label }} </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view
        :key="$route.name"
        :class="{ 'q-pb-lg': platform.is.iphone || platform.is.ios }"
      />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, ref } from "vue";
import routes from "src/router/routes";
import { useUserStore } from "src/stores/user";
import useApp from "src/composables/app";
import LanguageSwitcher from "src/components/LanguageSwitcher.vue";
import useUtility from "src/composables/utility";
import { useQuasar } from "quasar";

const { children } = routes[0];
const { isAdmin, getImage, callNumber } = useApp();
const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
const { downloadJpegDomToImage } = useUtility();
const { platform } = useQuasar();
const userStore = useUserStore();

const downloadPage = (id) => {
  downloadJpegDomToImage(
    document.getElementById("receipt-page"),
    `reciept-${id}`
  );
};

const links = computed(() =>
  children.filter((e) => {
    if (userStore.getUser) return e.name != "login" && e.meta.label;
    else return e.meta.label;
  })
);
</script>

<style scoped>
.max-w-400 {
  max-width: 420px;
}
.my-header {
  width: 100%;
  left: 50%;
  transform: translate(-50%, 0);
}
</style>
