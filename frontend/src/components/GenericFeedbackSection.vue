<template>
  <v-container id="feedback" class="py-12">

    <!-- Title -->
    <h3 class="text-center font-weight-bold mb-10">
      {{ translations.title[selectedLanguage] }}
      <span class="pulse-heart" style="font-size: 32px;">❤️</span>
    </h3>

    <!-- Carousel -->
    <v-carousel
      height="350"
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
            <v-card-text class="scrollable-text">
              <div v-html="group[0].content"></div>
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
              <v-card-text class="scrollable-text">
                <div v-html="testimonial.content"></div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

      </v-carousel-item>
    </v-carousel>
    <div v-if="userStore.role === 'admin'" class="w3-padding" >
      <v-btn color="primary" class="mt-8" @click="goList">
        Admin Vélemények
      </v-btn>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useUserStore } from "@/services/userStore";
const router = useRouter()
const testimonials = ref([])
const userStore = useUserStore();

const goList = () => router.push('/admin/feedbacks')

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

// Load testimonials from backend
const loadTestimonials = async () => {
  try {
    const response = await axios.get('https://antaligyongyi.hu/api/feedbacks', {
      params: {
        language: selectedLanguage.value,
        status: 'published'
      }
    })
    testimonials.value = response.data
  } catch (error) {
    console.error('Error loading testimonials:', error)
  }
}

onMounted(() => {
  loadTestimonials()
})

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

// Language change observer
const observer = new MutationObserver(() => {
  selectedLanguage.value = document.documentElement.lang
})
observer.observe(document.documentElement, { attributes: true })

watch(selectedLanguage, () => {
  loadTestimonials()
})
</script>

<style scoped>
.pulse-heart {
  display: inline-block;
  animation: pulse 1s infinite;
}
.scrollable-text {
  overflow-y: auto;
  max-height: 300px;
  padding-right: 8px;
}
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
</style>
