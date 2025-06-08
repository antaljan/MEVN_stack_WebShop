<template>
  <v-app>
    <v-container>
      <!-- Elevator Pitch -->
      <v-card class="elevator-pitch pa-5" color="blue" dark>
        <v-card-title class="text-h4 font-weight-bold">Miért válassz minket?</v-card-title>
        <v-card-text class="text-h6">
          Innovatív megoldásaink segítenek gyorsan és hatékonyan elérni céljaidat. 
          Egyedi, modern és felhasználóbarát megoldásokat kínálunk!
        </v-card-text>
      </v-card>

      <!-- Termék Bemutató -->
      <v-container class="product-showcase mt-5">
        <v-row justify="center">
          <v-col cols="12" md="4">
            <v-card>
              <v-img src="https://via.placeholder.com/400x250" height="200px" />
              <v-card-title>Gyors és hatékony</v-card-title>
              <v-card-text>Termékünk garantálja a gyorsaságot és pontosságot.</v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card>
              <v-img src="https://via.placeholder.com/400x250" height="200px" />
              <v-card-title>Modern design</v-card-title>
              <v-card-text>Elegáns és könnyen kezelhető felhasználói élményt kínál.</v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card>
              <v-img src="https://via.placeholder.com/400x250" height="200px" />
              <v-card-title>Ügyfélközpontú</v-card-title>
              <v-card-text>Minden funkció a felhasználó igényei szerint lett kialakítva.</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Vevői Visszajelzések -->
      <v-container class="reviews mt-5">
        <v-row>
          <v-col v-for="review in reviews" :key="review.name" cols="12" md="4">
            <v-card class="pa-3">
              <v-card-title class="text-h6 font-weight-bold">{{ review.name }}</v-card-title>
              <v-card-text>"{{ review.feedback }}"</v-card-text>
              <v-rating :value="review.rating" readonly color="yellow darken-2" />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref } from "vue";

const reviews = ref([
  { name: "Péter", feedback: "Nagyon elégedett vagyok a szolgáltatással!", rating: 5 },
  { name: "Anna", feedback: "Gyors és pontos, pont amire szükségem volt.", rating: 4 },
  { name: "Tamás", feedback: "Kiváló ügyfélélmény, modern megoldások!", rating: 5 }
]);
</script>

<style scoped>
.elevator-pitch {
  text-align: center;
  border-radius: 10px;
}

.product-showcase .v-card {
  text-align: center;
}

.reviews .v-card {
  background: #f5f5f5;
}
</style>
