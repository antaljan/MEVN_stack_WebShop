<template>
  <MyHeader/>
  <heroSection/>
  <aboutSection/>
  <div class="divider-with-icon">
    <v-divider :thickness="3" class="border-opacity-75" color="success"></v-divider>
    <v-icon class="w3-padding-large" color="red">mdi-heart</v-icon>
    <v-divider :thickness="3" class="border-opacity-75" color="success"></v-divider>
    <v-icon class="w3-padding-large" color="red">mdi-heart</v-icon>
    <v-divider :thickness="3" class="border-opacity-75" color="success"></v-divider>
    <v-icon class="w3-padding-large" color="red">mdi-heart</v-icon>
    <v-divider :thickness="3" class="border-opacity-75" color="success"></v-divider>
  </div>
  <storySection/>
  <div class="divider-with-icon">
    <v-divider :thickness="3" class="border-opacity-75" color="success"></v-divider>
    <v-icon class="w3-padding-large" color="red">mdi-heart</v-icon>
    <v-divider :thickness="3" class="border-opacity-75" color="success"></v-divider>
    <v-icon class="w3-padding-large" color="red">mdi-heart</v-icon>
    <v-divider :thickness="3" class="border-opacity-75" color="success"></v-divider>
    <v-icon class="w3-padding-large" color="red">mdi-heart</v-icon>
    <v-divider :thickness="3" class="border-opacity-75" color="success"></v-divider>
  </div>
  <methodeSection/>
  <contactSection/>
  <blogSection/>
  <MyFooter/>
</template>
<script setup>
  import heroSection from '../components/HeroSection.vue';
  import aboutSection from '../components/aboutSection.vue';
  import contactSection from '../components/ContactSection.vue';
  import blogSection from '../components/blogSection.vue';
  import MyFooter from "../components/MyFooter.vue";
  import MyHeader from "../components/MyHeader.vue";
  import storySection from "../components/storySection.vue";
  import methodeSection from "../components/methodeSection.vue";
</script>
<style scoped>
.divider-with-icon {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>