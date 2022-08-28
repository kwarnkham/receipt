<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
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
          <q-icon
            :name="'img:' + getImage('assets/icon.png')"
            size="md"
            @click="
              $router.push({
                name: 'index',
              })
            "
          />
          <q-btn
            icon="phone"
            color="teal"
            text-color="white"
            @click="callNumber('09740813851')"
            dense
            round
          >
          </q-btn>
          <LanguageSwitcher />
        </q-toolbar-title>

        <div>
          <q-btn
            icon="touch_app"
            flat
            v-if="$route.name == 'createReceipt' || $route.name == 'receipt'"
          >
            <q-menu max-width="57px">
              <q-btn icon="save" flat @click="$emitter.emit('createReceipt')" />
              <q-btn icon="add" flat @click="$emitter.emit('addNewReceipt')" />
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

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
        <q-item clickable @click="logout">
          <q-item-section> Logout </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, ref } from "vue";
import routes from "src/router/routes";
import { useUserStore } from "src/stores/user";
import useApp from "src/composables/app";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useRouter } from "vue-router";
import LanguageSwitcher from "src/components/LanguageSwitcher.vue";
const { children } = routes[0];
const { isAdmin, getImage, callNumber } = useApp();
const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
const { localStorage } = useQuasar();
const router = useRouter();
const logout = () => {
  const user = userStore.getUser;
  localStorage.remove(user.id + "knownUsers");
  localStorage.remove(user.id + "knownItems");
  localStorage.remove("token");
  userStore.setUser(null);
  api.defaults.headers.common["Authorization"] = undefined;
  router.replace({ name: "login" });
};
const userStore = useUserStore();
const links = computed(() =>
  children.filter((e) => {
    if (userStore.getUser) return e.name != "login" && e.meta.label;
    else return e.meta.label;
  })
);
</script>
