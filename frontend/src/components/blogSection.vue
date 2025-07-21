<template>
  <div class="blog-section">
    <h2>Latest Blog Posts</h2>
    <v-carousel
      hide-delimiter-background
      height="350"
      show-arrows
      cycle
    >
      <v-carousel-item
        v-for="post in posts"
        :key="post._id"
      >
        <v-card class="ma-4 blog-card" outlined>
          <v-img
            v-if="post.image"
            :src="post.image"
            height="180px"
            class="blog-image"
          ></v-img>
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
            {{ post.content?.slice(0, 120) }}...
          </v-card-text>
          <v-card-actions>
            <v-btn :to="`/blog/${post._id}`" color="primary" text>Weiterlesen</v-btn>
          </v-card-actions>
        </v-card>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const posts = ref([]);

async function fetchPosts() {
  try {
    const response = await axios.get('https://yowayoli.com/api/posts');
    if (Array.isArray(response.data)) {
      posts.value = response.data;
    }
  } catch (error) {
    console.error('Fehler beim Laden der Blogposts:', error);
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString();
}

onMounted(() => {
  fetchPosts();
});
</script>

<style scoped>
.blog-image {
  width: 100%;
  object-fit: cover;
  border-radius: 4px 4px 0 0;
}
.blog-card {
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}
</style>