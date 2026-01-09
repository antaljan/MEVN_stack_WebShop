<template>
  <MyHeader/>
  <heroSection/>
  <GenericImageTextSection sectionKey="about" />
  <sectionSeparator/>
  <GenericTextSection sectionKey="story" />
  <sectionSeparator/>
  <GenericTextSection sectionKey="methode" />
  <sectionSeparator/>
  <customerFedBack/>
  <contactSection/>
  <blogSection/>
  <MyFooter/>
</template>
<script setup>
  import heroSection from '../components/HeroSection.vue';
  import GenericImageTextSection from '@/components/GenericImageTextSection.vue';
  import contactSection from '../components/ContactSection.vue';
  import blogSection from '../components/blogSection.vue';
  import MyFooter from "../components/MyFooter.vue";
  import MyHeader from "../components/MyHeader.vue";
  import GenericTextSection from '@/components/GenericTextSection.vue';
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