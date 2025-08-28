<template>
  <canvas ref="chartCanvas"></canvas>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { Chart } from 'chart.js';

const props = defineProps({
  data: Array
});

const chartCanvas = ref(null);

onMounted(() => {
  const labels = props.data.map(item => item._id);
  const counts = props.data.map(item => item.count);

  new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Napi kérések',
        data: counts,
        borderColor: 'blue',
        fill: false
      }]
    }
  });
});
</script>
