<template>
  <MyHeader />

  <v-container>
    <v-row>
      <v-col
        v-for="img in images"
        :key="img.filename"
        cols="12"
        md="3"
      >
        <v-card>
          <v-img :src="img.url" height="150" />

          <v-card-actions>
            <v-btn color="red" @click="deleteImage(img.filename)">
              Törlés
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <div>
    <v-btn color="primary" :to="'/landing'">
      {{ backToLanding[selectedLanguage] }}
    </v-btn>
  </div>

  <MyFooter />
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import MyFooter from '../components/MyFooter.vue'
import MyHeader from '../components/MyHeader.vue'

// -----------------------------
// Képek kezelése
// -----------------------------
const images = ref([])

async function fetchImages() {
  const res = await fetch('https://antaligyongyi.hu/api/images')
  images.value = await res.json()
}

async function deleteImage(filename) {
  await fetch(`https://antaligyongyi.hu/api/images/${filename}`, { method: 'DELETE' })
  fetchImages()
}

onMounted(fetchImages)

// -----------------------------
// Nyelvváltás figyelése
// -----------------------------
const selectedLanguage = ref(document.documentElement.lang || 'hu')

const backToLanding = reactive({
  en: 'Back to starting page',
  hu: 'Vissza a kezdőoldalra',
  de: 'Zurück zum Startseite'
})

const observer = new MutationObserver(() => {
  selectedLanguage.value = document.documentElement.lang
})

observer.observe(document.documentElement, { attributes: true })
</script>
