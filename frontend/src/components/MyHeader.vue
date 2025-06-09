<template>
  <v-app-bar
    color= #2196F3
    elevation="14"
  >
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-menu open-on-hover>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" text>
              Menü
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(item, index) in menuItems" :key="index">
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
      </v-menu>

      <v-toolbar-title>Edith Skills Lab</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn color="white" dark>
          Bejelentkezés
      </v-btn>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item v-for="item in items" :key="item.title" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
  </v-navigation-drawer>

</template>

<script setup>
  import { ref } from "vue";
  const menuItems = ref([
    { name: "Blog" },
    { name: "Oktatás" },
    { name: "Coaching" },
  ]);
</script>

<script>
export default {
  data() {
    return {
      drawer: false,
      items: [
        { title: "Kezdőlap", icon: "mdi-home" },
        { title: "Blog", icon: "mdi-account" },
        { title: "Oktatás", icon: "mdi-cog" },
        { title: "Coaching", icon: "mdi-clipboard-text" },
        { title: "Kapcsolat", icon: "mdi-email" },
        { title: "Feliratkozás", icon: "mdi-cog" }
      ]
    };
  }
};
</script>