<template>
  <MyHeader/>
  <heroSection/>
  <aboutSection/>
  <sectionSeparator/>
  <storySection/>
  <sectionSeparator/>
  <methodeSection/>
  <sectionSeparator/>
  <customerFedBack/>
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
  import customerFedBack from "../components/customerFeedback.vue";
  import sectionSeparator from '@/components/sectionSeparator.vue';
</script>
<style scoped>
.divider-with-icon {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>