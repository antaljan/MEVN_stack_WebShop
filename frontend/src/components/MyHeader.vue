<template>
  <v-app>
    <v-app-bar app color="primary" dark class="header">
      <v-container class="d-flex align-center justify-space-between">
        <v-avatar icon>
          <v-img src="/MyLogo.png" max-height="40px"></v-img>
        </v-avatar>
        <span class="ml-3 text-h6">Edith Skills Lab</span>
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
        <v-btn text>Kapcsolat</v-btn>
        <v-btn color="orange" dark>
          Bejelentkezés
        </v-btn>
      </v-container>
    </v-app-bar>
  </v-app>
</template>

<script setup>
import { ref } from "vue";

const menuItems = ref([
  { name: "Blog" },
  { name: "Oktatás" },
  { name: "Coaching" },
]);
</script>

<style scoped>
.header{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}
.v-app-bar {
  padding: 0 20px;
}
</style>
