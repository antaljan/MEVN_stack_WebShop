<template>
  <v-container id="story" class="py-12">
    <h3 class="text-center font-weight-bold mb-10">
      {{ translations.title[selectedLanguage] }}
      <span class="pulse-heart" style="font-size: 32px;">❤️</span>
    </h3>

    <v-row justify="center" align="stretch" dense>
      <v-col
        cols="12"
        sm="6"
        md="4"
        v-for="(testimonial, index) in testimonials"
        :key="index"
      >
        <v-card class="d-flex flex-column h-100" outlined>
          <v-card-title class="font-weight-bold">
            {{ testimonial.name }}
          </v-card-title>
          <v-card-text>
            {{ testimonial.text[selectedLanguage] }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 🔤 Nyelv figyelése a <html lang="..."> alapján
const selectedLanguage = ref(document.documentElement.lang || 'hu')

onMounted(() => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'lang') {
        selectedLanguage.value = document.documentElement.lang
      }
    })
  })
  observer.observe(document.documentElement, { attributes: true })
})

// 🗣️ Fordítások
const translations = {
  title: {
    hu: 'Véleménye',
    de: 'Kundenstimmen',
    en: 'Testimonials'
  }
}

// 💬 Vélemények
const testimonials = [
  {
    name: 'Eszter',
    text: {
      hu: '„Az online térben is biztonságban éreztem magam… Végre elindultam az önmegvalósítás útján… Nagyon nagy hála van bennem! ❤️”',
      de: '„Ich fühlte mich auch online sicher… Endlich habe ich mich auf den Weg der Selbstverwirklichung gemacht… Ich bin sehr dankbar! ❤️”',
      en: '„I felt safe even in the online space… I finally started my journey of self-realization… I’m deeply grateful! ❤️”'
    }
  },
  {
    name: 'Tamás',
    text: {
      hu: '„Minden képzéseden részt vettem eddig… Rengeteg tudást kaptam. Köszönöm!”',
      de: '„Ich habe an allen deinen Schulungen teilgenommen… Ich habe so viel gelernt. Danke!”',
      en: '„I’ve attended all your trainings so far… I’ve gained so much knowledge. Thank you!”'
    }
  },
  {
    name: 'Anna',
    text: {
      hu: '„Egy baleset után újra kellett építeni magam… Az életem 180 fokos fordulatot vett… Nagyon köszönöm a türelmedet!”',
      de: '„Nach einem Unfall musste ich mich neu aufbauen… Mein Leben hat sich um 180 Grad gewendet… Vielen Dank für deine Geduld!”',
      en: '„After an accident I had to rebuild myself… My life turned around completely… Thank you for your patience!”'
    }
  },
  {
    name: 'Péter',
    text: {
      hu: '„Az online óráink olyanok voltak, mintha elutaztam volna egy szigetre… Megtanítottad, hogy máshogy is lehet nézni az életemre.”',
      de: '„Unsere Online-Stunden fühlten sich an wie eine Reise auf eine Insel… Du hast mir gezeigt, dass man das Leben auch anders sehen kann.”',
      en: '„Our online sessions felt like a trip to an island… You taught me to see my life differently.”'
    }
  }
]
</script>

<style scoped>
.pulse-heart {
  display: inline-block;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
