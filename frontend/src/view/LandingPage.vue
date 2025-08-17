<template>
  <MyHeader/>
  <heroSection/>
  <aboutSection/>
  <StorySection/>
  <MethodeSection/>
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
  import StorySection from "../components/StorySection.vue";
  import MethodeSection from "../components/MethodeSection.vue";
</script>