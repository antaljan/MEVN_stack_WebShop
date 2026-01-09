<template>
  <v-container id="feedback" class="py-12">

    <!-- Title -->
    <h3 class="text-center font-weight-bold mb-10">
      {{ translations.title[selectedLanguage] }}
      <span class="pulse-heart" style="font-size: 32px;">❤️</span>
    </h3>

    <!-- Carousel -->
    <v-carousel
      height="auto"
      hide-delimiters
      show-arrows="hover"
      cycle
    >
      <v-carousel-item
        v-for="(group, index) in groupedTestimonials"
        :key="index"
      >
        <!-- MOBILE: 1 card per slide -->
        <div v-if="isMobile" class="pa-4">
          <v-card class="d-flex flex-column w-100" outlined>
            <v-card-title class="font-weight-bold">
              {{ group[0].name }}
            </v-card-title>
            <v-card-text>
              {{ group[0].text[selectedLanguage] }}
            </v-card-text>
          </v-card>
        </div>

        <!-- DESKTOP/TABLET: multiple cards -->
        <v-row v-else justify="center" align="stretch" dense>
          <v-col
            v-for="(testimonial, i) in group"
            :key="i"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card class="d-flex flex-column w-100" outlined>
              <v-card-title class="font-weight-bold">
                {{ testimonial.name }}
              </v-card-title>
              <v-card-text>
                {{ testimonial.text[selectedLanguage] }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

      </v-carousel-item>
    </v-carousel>

  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const testimonials = ref([])

const selectedLanguage = ref(document.documentElement.lang || 'hu')

const translations = {
  title: {
    hu: 'Vélemények',
    de: 'Kundenstimmen',
    en: 'Testimonials'
  }
}

// Detect mobile
const isMobile = computed(() => window.innerWidth < 600)

// Load testimonials
const loadTestimonials = async () => {
  try {
    const response = await fetch(`/customerFeedbacks.json`)
    testimonials.value = await response.json()
  } catch (error) {
    console.error('Error loading testimonials:', error)
  }
}
onMounted(loadTestimonials)

// Grouping logic
const itemsPerSlide = computed(() => {
  if (isMobile.value) return 1
  if (window.innerWidth < 960) return 2
  if (window.innerWidth < 1280) return 3
  return 4
})

const groupedTestimonials = computed(() => {
  const groups = []
  const perSlide = itemsPerSlide.value

  for (let i = 0; i < testimonials.value.length; i += perSlide) {
    groups.push(testimonials.value.slice(i, i + perSlide))
  }
  return groups
})
</script>

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
