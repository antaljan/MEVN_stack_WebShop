<template>
  <v-app>
    <MyHeader />
    <v-main>
      <LandingPage/>
    </v-main>
    <MyFooter />
  </v-app>
</template>

<script>
import LandingPage from './components/LandingPage.vue';
import MyFooter from "./components/MyFooter.vue";
import MyHeader from "./components/MyHeader.vue";

export default {
  name: 'App',

  components: {
    LandingPage,
    MyFooter,
    MyHeader,
  },

  data: () => ({
    //
  }),
}
</script>
