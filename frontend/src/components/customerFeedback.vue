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
        md="3"
        v-for="(testimonial, index) in testimonials"
        :key="index"
      >
        <v-card class="d-flex flex-column w-100" outlined>
          <v-card-title class="font-weight-bold">
            {{ testimonial.name }}
          </v-card-title>
          <v-card-text v-if="testimonial.text && testimonial.text[selectedLanguage]">
            {{ testimonial.text[selectedLanguage] }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const testimonials = ref([])

// language change
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

// texst acc. language
const translations = {
  title: {
    hu: 'Vélemények',
    de: 'Kundenstimmen',
    en: 'Testimonials'
  }
}

// load testimonals
const loadTestimonials = async () => {
  try {
    const response = await fetch(`/customerFeedbacks.json`)
    if (!response.ok) throw new Error('Failed to load testimonials')
    testimonials.value = await response.json()
  } catch (error) {
    console.error('Error loading testimonials:', error)
  }
}
    onMounted(loadTestimonials);
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
