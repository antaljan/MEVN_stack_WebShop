<template>
  <v-app>
    <v-main>
      <MyHeader/>
      <LandingPage/>
      <MyFooter/>
    </v-main>
  </v-app>
</template>

<script>
import LandingPage from './view/LandingPage.vue';
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

<stile>
  .v-main {
  margin-top: 4px;
}
</stile>