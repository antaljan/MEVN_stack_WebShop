<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <GaugeChart @show-subscribers="showSubscriberList = true" />
      </v-col>
      <v-col cols="12" md="6">
        <v-btn @click="showCreateDialog = true" color="primary">
          ➕ Neuer Newsletter
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" v-if="showSubscriberList">
        <SubscriberList />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <NewsletterTimeline />
      </v-col>
    </v-row>

    <CreateNewsletterDialog v-model:dialog="showCreateDialog" />
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import GaugeChart from '../components/GaugeChart.vue';
import SubscriberList from '../components/SubscriberList.vue';
import NewsletterTimeline from '../components/NewsletterTimeline.vue';
import CreateNewsletterDialog from '../components/CreateNewsletterDialog.vue';

const showSubscriberList = ref(false);
const showCreateDialog = ref(false);
</script>
