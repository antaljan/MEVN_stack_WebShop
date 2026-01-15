<template>
  <div class="blog-section" id="blog">
    <div class="w3-content">
      <h3 class="w3-center">{{ blogSectionCaption[selectedLanguage.value] }}</h3>
    </div>

    <!-- Loading állapot -->
    <div v-if="isLoading" class="w3-center blog-loading">
      Betöltés...
    </div>

    <!-- Hiba állapot -->
    <div v-else-if="error" class="w3-center blog-error">
      Hiba történt a bejegyzések betöltésekor.
    </div>

    <!-- Üres állapot -->
    <div v-else-if="groupedPosts.length === 0" class="w3-center blog-empty">
      Jelenleg nincs elérhető bejegyzés ezen a nyelven.
    </div>

    <!-- Carousel tartalom -->
    <v-carousel
      v-else
      hide-delimiter-background
      height="480"
      show-arrows
      cycle
    >
      <v-carousel-item
        v-for="(group, idx) in groupedPosts"
        :key="idx"
      >
        <v-row justify="center" align="stretch">
          <v-col
            v-for="post in group"
            :key="post._id"
            cols="12"
            md="4"
            class="blog-col"
          >
            <v-card class="ma-4 blog-card" outlined>
              <div class="blog-image-wrapper">
                <v-img
                  v-if="post.image"
                  :src="post.image"
                  height="170px"
                  class="blog-image"
                ></v-img>
              </div>

              <v-card-title class="w3-padding-small">{{ post.title }}</v-card-title>

              <v-card-subtitle v-if="post.subtitle">
                <v-icon small class="mr-1">mdi-format-quote-close</v-icon>
                {{ post.subtitle }}
              </v-card-subtitle>

              <v-card-subtitle>
                <v-icon small class="mr-1">mdi-account</v-icon>
                {{ post.author }}
                <v-icon small class="ml-4 mr-1">mdi-calendar</v-icon>
                {{ formatDate(post.date || post.createdAt) }}
              </v-card-subtitle>

              <v-card-text>
                {{ getPreview(post.content) }}
                <div class="read-more-wrapper">
                  <a href="#" @click.prevent="navigateToPost(post)">
                    {{ blogSectionOpen[selectedLanguage] }}
                  </a>
                </div>
              </v-card-text>

            </v-card>
          </v-col>
        </v-row>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, reactive } from 'vue';
import axios from 'axios';

import { useRouter } from 'vue-router';

const router = useRouter();

// --- Állapotok ---
const posts = ref([]);
const isMobile = ref(false);
const isLoading = ref(false);
const error = ref(null);

// Nyelv
const selectedLanguage = ref(document.documentElement.lang || 'hu');
const blogSectionCaption = reactive({
  en: 'Latest Blog Posts',
  hu: 'Legfrissebb Blogbejegyzések',
  de: 'Neueste Blogbeiträge'
});

const blogSectionOpen = reactive({
  en: 'Read More',
  hu: 'Tovább olvasom',
  de: 'Weiterlesen'
});
// --- API hívás ---
async function fetchPosts() {
  isLoading.value = true;
  error.value = null;
  try {
    const lang = selectedLanguage.value;
    const response = await axios.get(
      `https://antaligyongyi.hu/api/posts?language=${lang}`
    );
    posts.value = Array.isArray(response.data) ? response.data : [];
  } catch (err) {
    console.error('Fehler beim Laden der Blogposts:', err);
    error.value = err;
    posts.value = [];
  } finally {
    isLoading.value = false;
  }
}

// --- Csoportosítás carouselhez ---
const groupedPosts = computed(() => {
  const chunkSize = isMobile.value ? 1 : 3;
  const result = [];
  for (let i = 0; i < posts.value.length; i += chunkSize) {
    result.push(posts.value.slice(i, i + chunkSize));
  }
  return result;
});

// --- Dátum formázása ---
function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString();
}

// --- Előnézet generálása ---
function getPreview(text) {
  if (!text) return '';
  const plain = text.replace(/<[^>]+>/g, ' ');
  const words = plain.split(/\s+/).filter(Boolean);
  const snippet = words.slice(0, 30).join(' ');
  return snippet + (words.length > 30 ? '...' : '');
}

// --- Navigáció a bejegyzésre ---
function navigateToPost(post) {
  router.push(`/blog/${post._id}`);
}

// --- Responsive kezelés ---
function updateIsMobile() {
  isMobile.value = window.innerWidth < 600;
}

// --- Nyelvváltás (DOM select integráció) ---
function initLanguageSelect() {
  const langSelect = document.getElementById('langselect');
  if (!langSelect) return;

  langSelect.value = selectedLanguage.value;
  langSelect.addEventListener('change', (e) => {
    selectedLanguage.value = e.target.value;
    document.documentElement.lang = selectedLanguage.value;
  });
}

// --- Lifecycle ---
onMounted(() => {
  updateIsMobile();
  window.addEventListener('resize', updateIsMobile);

  initLanguageSelect();
  fetchPosts();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIsMobile);
});

// Nyelvváltásra újra tölti a posztokat
watch(selectedLanguage, () => {
  fetchPosts();
});

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === "lang") {
      selectedLanguage.value = document.documentElement.lang;
    }
  });
});
observer.observe(document.documentElement, { attributes: true });

</script>

<style scoped>
.blog-card {
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 24px;
  background-color: #f5f5f5;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.blog-image-wrapper {
  padding-top: 12px;
  padding-left: 12px;
  padding-right: 12px;
  padding-bottom: 6px;
}

.blog-image {
  width: 100%;
  object-fit: cover;
  border-radius: 16px;
}

.blog-col {
  flex: 0 0 100%;
  max-width: 100%;
}

@media (min-width: 960px) {
  .blog-col {
    flex: 0 0 33.3333%;
    max-width: 33.3333%;
  }
}

.read-more-link {
  display: inline-block;
  margin-top: 8px;
  font-weight: 600;
  color: #1976d2;
  cursor: pointer;
}
.preview-text {
  margin-bottom: 8px;
}

.read-more-wrapper a {
  font-weight: 600;
  color: #1976d2;
  cursor: pointer;
}

.blog-loading,
.blog-error,
.blog-empty {
  margin-top: 24px;
}
</style>
