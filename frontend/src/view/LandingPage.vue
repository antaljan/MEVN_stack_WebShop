<template>
  <MyHeader/>
  <heroSection/>
  <aboutSection/>
  <blogSection/>
  <CalendarSertion v-if="userStore.role === 'user' || userStore.role === 'admin'"/>
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
  import CalendarSertion from '../components/terminReserv.vue';
  // Import userStore for user role and name
  import { useUserStore } from '@/services/userStore'
  const userStore = useUserStore()
</script>


