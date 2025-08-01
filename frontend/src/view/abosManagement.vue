<template>
  <my-header/>
  <v-app>
    <v-card
    class="mx-auto"
    max-width="368"
  >
    <v-card-item title="Hírlevél feliratkozás"></v-card-item>
    <v-card-text class="py-0">
      <v-row align="center" no-gutters>
        <v-col
          class="text-h2"
          cols="6"
        >
          {{ subscriberCount }}
        </v-col>
      </v-row>
    </v-card-text>
    <div class="d-flex py-3 justify-space-between">
      <v-list-item
        density="compact"
        prepend-icon="mdi-share-variant"
      >
        <v-list-item-subtitle>feliratkozó</v-list-item-subtitle>
      </v-list-item>
    </div>
    <v-expand-transition>
      <div v-if="expand">
        <v-list class="bg-transparent">
          <v-list-item
            v-for="item in aboList"
            :key="item.id"
            :name="item.name"
            :firstname="item.firstname"
            :email="item.email"
          >
          </v-list-item>
        </v-list>
      </div>
    </v-expand-transition>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn
        :text="!expand ? 'Részletek' : 'kevesebb részlet'"
        @click="expand = !expand"
      ></v-btn>
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
  // get abonements from the API
  const abonements = ref([]);
  onMounted(async () => {
    try {
      const response = await axios.get('https://yowayoli.com/api/abonements')
      abonements.value = response.data;
    } catch (error) {
      console.error('Fehler beim Laden der Abonnements:', error);
    }
  });
  const aboList = [
    abonements
  ]

  const expand = ref(false)
</script>
