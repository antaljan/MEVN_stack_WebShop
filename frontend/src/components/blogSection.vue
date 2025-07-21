<template>
  <div class="blog-section">
    <h2>Latest Blog Posts</h2>
    <v-row>
      <v-col
        v-for="post in posts"
        :key="post._id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card class="ma-2" outlined>
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
      </v-col>
    </v-row>
    <v-btn @click="loadMore" color="primary" class="mt-4">Mehr laden</v-btn>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const posts = ref([]);
const page = ref(1);
const pageSize = 6;

async function fetchPosts() {
  try {
    const response = await axios.get(`https://yowayoli.com/api/posts?page=${page.value}&limit=${pageSize}`);
    if (Array.isArray(response.data)) {
      posts.value.push(...response.data);
    }
  } catch (error) {
    console.error('Fehler beim Laden der Blogposts:', error);
  }
}

function loadMore() {
  page.value += 1;
  fetchPosts();
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString();
}

onMounted(() => {
  fetchPosts();
});
</script>

<style>

</style>