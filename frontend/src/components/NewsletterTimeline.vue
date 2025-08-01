<template>
  <v-timeline>
    <v-timeline-item v-for="newsletter in newsletters" :key="newsletter.id" :title="newsletter.title">
      {{ newsletter.date }}
    </v-timeline-item>
  </v-timeline>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';

const newsletters = ref([]);

onMounted(async () => {
  const response = await axios.get('/api/newsletters');
  newsletters.value = response.data;
});
</script>
