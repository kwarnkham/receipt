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
        />
        <q-btn
          flat
          dense
          round
          icon="keyboard_arrow_left"
          aria-label="Back"
          @click="$router.go(-1)"
          v-if="$route.name != 'index'"
        />
        <q-toolbar-title> Quasar App </q-toolbar-title>

        <div>
          <q-btn icon="touch_app" flat v-if="$route.name == 'createReceipt'">
            <q-menu max-width="57px">
              <q-btn icon="save" flat @click="$emitter.emit('createReceipt')" />
              <q-btn icon="add" flat @click="$emitter.emit('addNewReceipt')" />
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item
          v-for="link in links"
          :key="link.name"
          :to="{ name: link.name }"
          exact-active-class="bg-primary text-white"
          exact
        >
          <q-item-section> {{ link.meta.label }} </q-item-section>
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
import { useQuasar } from "quasar";
const { children } = routes[0];
const { localStorage } = useQuasar();
const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
const links = computed(() =>
  children.filter((e) => {
    if (localStorage.getItem("token")) return e.name != "login" && e.meta.label;
    else return e.meta.label;
  })
);
</script>
