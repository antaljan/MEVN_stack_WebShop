<template>
  <MyHeader/>
  <GenericHeroSection sectionKey="hero" />
  <GenericImageTextSection sectionKey="about" />
  <sectionSeparator/>
  <GenericTextSection sectionKey="story" />
  <sectionSeparator/>
  <GenericTextSection sectionKey="methode" />
  <sectionSeparator/>
  <customerFedBack/>
  <GenericHeroSection sectionKey="contact" />
  <GenericContactSection sectionKey="contact" />
  <sectionSeparator/>
  <blogSection/>
  <MyFooter/>
</template>
<script setup>
  import GenericHeroSection from '@/components/GenericHeroSection.vue';
  import GenericImageTextSection from '@/components/GenericImageTextSection.vue';
  import GenericContactSection from '@/components/GenericContactSection.vue';
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