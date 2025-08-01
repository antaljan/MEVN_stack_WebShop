<template>
  <my-header/>
  <v-app>
    <v-card>
      <v-card-title class="text-h5">Abonnenten Management</v-card-title>
      <v-card-text>
        <p>Aktuelle Abonnentenzahl: {{ subscriberCount }}</p>
        <p>Hier können Sie Ihre Abonnenten verwalten.</p>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="$router.push('/abos-management/add')">Neuen Abonnenten hinzufügen</v-btn>
      </v-card-actions>
    </v-card>
  </v-app>
  <my-footer/>
</template>

<script setup>
  import MyHeader from '../components/MyHeader.vue';
  import MyFooter from '../components/MyFooter.vue';
  import { ref } from 'vue';
  import { onMounted } from 'vue';
  import axios from 'axios';
  // get the subscriber count from the API
  const subscriberCount = ref(0);
  onMounted(async () => {
    try {
      const response = await axios.get('https://yowayoli.com/api/newsletter-count')
      subscriberCount.value = response.data.count
    } catch (error) {
      console.error('Fehler beim Laden der Abonnenten:', error)
    }
  })
</script>
