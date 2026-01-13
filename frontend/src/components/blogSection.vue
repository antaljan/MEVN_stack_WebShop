<template>
  <div class="blog-section" id="blog">
    <div class="w3-content">
      <h3 class="w3-center">{{ blogSectionCaption[selectedLanguage] }}</h3>
    </div>
    <v-carousel
      hide-delimiter-background
      height="400"
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
            <v-app>
            <v-card class="ma-4 blog-card" outlined>
              <div class="blog-image-wrapper">
                <v-img
                  v-if="post.image"
                  :src="post.image"
                  height="180px"
                  class="blog-image"
                ></v-img>
              </div>
              <v-card-title>{{ post.title }}</v-card-title>
              <v-card-subtitle v-if="post.subtitle">
                <v-icon small class="mr-1">mdi-format-quote-close</v-icon>
                {{ post.subtitle }}
              </v-card-subtitle>
              <v-card-subtitle>
                <v-icon small class="mr-1">mdi-account</v-icon> {{ post.author }}
                <v-icon small class="ml-4 mr-1">mdi-calendar</v-icon> {{ formatDate(post.date || post.createdAt) }}
              </v-card-subtitle>
              <v-card-text>
                {{ getPreview(post.content) }}...<br/>
                <a href="#" @click.prevent="navigateToPost(post)">
                  {{ blogSectionOpen[selectedLanguage] }}
                </a>
              </v-card-text>
            </v-card>
            </v-app>
          </v-col>
        </v-row>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
const isMobile = ref(false);
onMounted(() => {
  fetchPosts();
  isMobile.value = window.innerWidth < 600;
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 600;
  });
});
// language selection
const posts = ref([]);
const selectedLanguage = ref(document.documentElement.lang || 'hu');
const blogSectionCaption = {
  en: 'Latest Blog Posts',
  hu: 'Legfrissebb Blogbejegyzések',
  de: 'Neueste Blogbeiträge'
};
const blogSectionOpen = {
  en: 'Read More',
  hu: 'Tovább olvasom',
  de: 'Weiterlesen'
};
// Language change handler
onMounted(() => {
  const langSelect = document.getElementById('langselect');
  if (langSelect) {
    langSelect.value = selectedLanguage.value;
    langSelect.addEventListener('change', (e) => {
      selectedLanguage.value = e.target.value;
      document.documentElement.lang = selectedLanguage.value;
    });
  }
});

// Fetch posts from the API
async function fetchPosts() {
  try {
    const response = await axios.get(`https://antaligyongyi.hu/api/posts?language=${selectedLanguage}`);
    if (Array.isArray(response.data)) {
      posts.value = response.data;
    }
  } catch (error) {
    console.error('Fehler beim Laden der Blogposts:', error);
  }
}
// grupping post preview in 3 pack if not mobile device
const groupedPosts = computed(() => {
  const chunkSize = isMobile.value ? 1 : 3;
  const result = [];
  for (let i = 0; i < posts.value.length; i += chunkSize) {
    result.push(posts.value.slice(i, i + chunkSize));
  }
  return result;
});
// formating the post date to localformat
function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString();
}
// trimm the post text for preview
function getPreview(text) {
  if (!text) return '';
  const plain = text.replace(/<[^>]+>/g, ' ');
  const words = plain.split(/\s+/).filter(Boolean);
  return words.slice(0, 30).join(' ') + (words.length > 30 ? '...' : '');
}

onMounted(() => {
  fetchPosts();
});
watch(selectedLanguage, () => {
  fetchPosts();
});
// navigation to post
import { useRouter } from 'vue-router'
const router = useRouter()
const navigateToPost = (post) => {
  router.push(`/blog/${post._id}`)
}
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
}
.blog-image {
  width: 100%;
  object-fit: cover;
  border-radius: 16px;
}
.blog-col {
  /* Bei kleinen Geräten volle Breite, bei größeren 1/3 */
  flex: 0 0 100%;
  max-width: 100%;
}
@media (min-width: 960px) {
  .blog-col {
    flex: 0 0 33.3333%;
    max-width: 33.3333%;
  }
}
</style>