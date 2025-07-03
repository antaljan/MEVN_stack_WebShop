<template>
  <MyHeader/>
  <heroSection/>
  <aboutSection/>
  <blogSection/>
  <contactSection/>
  <MyFooter/>
</template>

<script setup>
  import heroSection from '../components/HeroSection.vue';
  import aboutSection from '../components/aboutSection.vue';
  import contactSection from '../components/ContactSection.vue';
  import blogSection from '../components/blogSection.vue';
  import MyFooter from "../components/MyFooter.vue";
  import MyHeader from "../components/MyHeader.vue";
</script>


