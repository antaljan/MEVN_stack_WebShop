<template>
  <v-footer class="footer">
    <v-container class="d-flex justify-center">
      <v-btn v-for="icon in socialIcons" :key="icon.name" :href="icon.link" icon>
        <v-icon>{{ icon.icon }}</v-icon>
      </v-btn>
    </v-container>
    <v-container class="text-center">
      <small>&copy; 2025 Edith Skills Lab. Minden jog fenntartva.</small>
    </v-container>
  </v-footer>
</template>

<script setup>
const socialIcons = [
  { name: "Facebook", icon: "mdi-facebook", link: "https://facebook.com" },
  { name: "YouTube", icon: "mdi-youtube", link: "https://youtube.com" },
  { name: "Instagram", icon: "mdi-instagram", link: "https://instagram.com" },
  { name: "LinkedIn", icon: "mdi-linkedin", link: "https://linkedin.com" }
];
</script>

<style scoped>
.footer {
  background: #2196F3; 
  color: white;
  padding: 20px;
  position: relative; 
}
</style>
