<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup>
import {  watch, ref } from 'vue'
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js'

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale)

const props = defineProps({
  chartData: Object
})

const canvas = ref(null)
let chart = null

watch(() => props.chartData, (newData) => {
  if (chart) chart.destroy()
  if (!newData) return

  chart = new Chart(canvas.value, {
    type: 'line',
    data: newData
  })
})
</script>
