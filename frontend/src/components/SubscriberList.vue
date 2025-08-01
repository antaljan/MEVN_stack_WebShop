<template>
  <v-card>
    <v-card-title>Abonnentenliste</v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="subscribers"
        class="elevation-1"
      >
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.email="{ item }">
          <a :href="`mailto:${item.email}`">{{ item.email }}</a>
      </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const subscribers = ref([]);

const headers = [
  { title: 'Vorname', key: 'firstname' },
  { title: 'Name', key: 'name' },
  { title: 'E-Mail', key: 'email' }
];

onMounted(async () => {
  try {
    const response = await axios.post('https://yowayoli.com/api/getabos'); // deine Route für Abonnenten
    subscribers.value = response.data;
  } catch (error) {
    console.error('Fehler beim Laden der Abonnenten:', error);
  }
});
</script>
