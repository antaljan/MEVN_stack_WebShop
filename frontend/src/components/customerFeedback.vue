<template>
  <v-container id="story" class="py-12">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <h3 class="text-center font-weight-bold mb-6">
          Az ügyfelek véleménye
          <span class="pulse-heart" style="font-size: 32px;">❤️</span>
        </h3>

        <v-card class="mb-6" outlined>
          <v-card-title class="font-weight-bold">Eszter</v-card-title>
          <v-card-text>
            „Az online térben is biztonságban éreztem magam, ami fontos volt ahhoz, hogy meg tudjak nyílni…  
            A 40-hez közelítek, de egy 18 éves korom óta nyomasztó dolgot, a pályaválasztást sikerült megoldanom a segítségeddel néhány alkalom elteltével.  
            Újra felfedeztem magam, hogy miben vagyok jó, miben adhatok értéket és kaphatok energiát, mi az amit hivatásomnak élhetek meg…  
            Végre elindultam az önmegvalósítás útján… Nagyon nagy hála van bennem! Minden köszönök, s azt is, hogy mai napig érzem, hogy fontos vagyok neked és a távolból is fogod a kezem! ❤️”
          </v-card-text>
        </v-card>

        <v-card class="mb-6" outlined>
          <v-card-title class="font-weight-bold">Tamás</v-card-title>
          <v-card-text>
            „Csak annyit tudok írni, hogy minden képzéseden részt vettem eddig, amiről tudtam és jövök a többire is.  
            Rengeteg tudást kaptam. Köszönöm!”
          </v-card-text>
        </v-card>

        <v-card class="mb-6" outlined>
          <v-card-title class="font-weight-bold">Anna</v-card-title>
          <v-card-text>
            „Egy baleset után újra kellett építeni magam… Már az első online alkalom alatt tudtam, hogy én másnak biztos, hogy nem nyílnék meg ennyire mint neked.  
            Az életem 180 fokos fordulatot vett a lehető legjobb értelemben… Nagyon köszönöm a türelmedet és a támogatásodat, amit ma is kapok!”
          </v-card-text>
        </v-card>

        <v-card class="mb-6" outlined>
          <v-card-title class="font-weight-bold">Péter</v-card-title>
          <v-card-text>
            „Az online óráink olyanok voltak, mintha elutaztam volna egy szigetre, ahol béke van, nyugalom és biztonság.  
            Köszönöm a hatalmas türelmedet! Megtanítottad, hogy máshogy is lehet nézni az életemre.”
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.pulse-heart {
  display: inline-block;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
</style>
