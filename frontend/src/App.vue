<template>
  <v-app>
    <v-main>

      <router-view/>

    </v-main>
  </v-app>
</template>

<script>
//import MyFooter from "./components/MyFooter.vue";
//import MyHeader from "./components/MyHeader.vue";

export default {
  name: 'App',
/*
  components: {
    MyFooter,
    MyHeader,
  },
*/
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