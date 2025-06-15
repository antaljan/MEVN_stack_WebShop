<template>
  <v-app-bar app color=#2196F3 dark flat class="px-12">
    <v-menu open-on-hover>
      <template v-slot:activator="{ props }">
        <v-app-bar-nav-icon v-bind="props"></v-app-bar-nav-icon>
      </template>
      <v-list>
        <v-list-item v-for="(item, index) in menuItems" :key="index">
          <v-list-item-title>{{ item.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <span>Edith Skills Lab</span>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-btn text color="white" dark @click="$router.push('/login')">
          Login
    </v-btn>
  </v-app-bar>

</template>

<script setup>
  import { ref } from "vue";
  const menuItems = ref([
    { name: "Home" },
    { name: "Blog" },
    { name: "Training" },
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