<template>
  <v-card @click="showSubscribers">
    <v-card-title>📊 Abonnenten</v-card-title>
    <v-card-text><canvas ref="gaugeCanvas"></canvas></v-card-text>
  </v-card>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { Chart, registerables } from 'chart.js';
import Gauge from 'chartjs-gauge';
import axios from 'axios';

Chart.register(...registerables, Gauge);

const gaugeCanvas = ref(null);
const emit = defineEmits(['show-subscribers'])


onMounted(async () => {
  const response = await axios.get('https;//yowayoli.com/api/newsletter-count');
  const count = response.data.count;

  new Chart(gaugeCanvas.value, {
    type: 'gauge',
    data: {
      datasets: [{
        value: count,
        minValue: 0,
        data: [count],
        backgroundColor: ['#2196F3'],
        borderWidth: 2
      }]
    },
    options: {
      needle: { radiusPercentage: 2, widthPercentage: 2.5, lengthPercentage: 80, color: 'black' },
      valueLabel: { display: true, formatter: (value) => `${value} Abos` }
    }
  });
});

function showSubscribers() {
  emit('show-subscribers');
}
</script>
