<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup>
import { watch, ref } from 'vue'
import { Chart, BarController, BarElement, LinearScale, CategoryScale } from 'chart.js'

Chart.register(BarController, BarElement, LinearScale, CategoryScale)

const props = defineProps({
  chartData: Object
})

const canvas = ref(null)
let chart = null

watch(() => props.chartData, (newData) => {
  if (chart) chart.destroy()
  if (!newData) return

  chart = new Chart(canvas.value, {
    type: 'bar',
    data: newData
  })
})
</script>
