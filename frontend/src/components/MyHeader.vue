<template>
  <v-app-bar
    color= #2196F3
    elevation="14"
  >
      <v-app-bar-nav-icon>
      </v-app-bar-nav-icon>

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
</template>

<script setup>
  import { ref } from "vue";
  const menuItems = ref([
    { name: "Blog" },
    { name: "Oktatás" },
    { name: "Coaching" },
  ]);
</script>