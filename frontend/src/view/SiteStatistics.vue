<template>
  <MyHeader />

  <v-container class="py-10">
    <h1 class="text-center mb-8">Weboldal statisztika</h1>

    <!-- Dátumválasztó -->
    <v-row class="mb-6" align="center">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="from"
          type="date"
          label="Dátumtól"
          outlined
          dense
        />
      </v-col>

      <v-col cols="12" md="4">
        <v-text-field
          v-model="to"
          type="date"
          label="Dátumig"
          outlined
          dense
        />
      </v-col>

      <v-col cols="12" md="4">
        <v-btn color="primary" class="mt-2" @click="loadStats">
          Statisztika frissítése
        </v-btn>
      </v-col>
    </v-row>

    <!-- Napi request count -->
    <h3 class="mt-10 mb-4">Napi kérések száma</h3>
    <line-chart :chart-data="dailyRequestsChart" />

    <!-- Napi egyedi látogatók -->
    <h3 class="mt-10 mb-4">Napi egyedi látogatók</h3>
    <line-chart :chart-data="dailyVisitorsChart" />

    <!-- Top országok -->
    <h3 class="mt-10 mb-4">Top országok</h3>
    <bar-chart :chart-data="topCountriesChart" />

    <!-- Top városok -->
    <h3 class="mt-10 mb-4">Top városok</h3>
    <bar-chart :chart-data="topCitiesChart" />

    <!-- Top IP címek -->
    <h3 class="mt-10 mb-4">Top IP címek</h3>
    <bar-chart :chart-data="topIpsChart" />

    <!-- Top URL-ek -->
    <h3 class="mt-10 mb-4">Top URL-ek</h3>
    <bar-chart :chart-data="topUrlsChart" />

  </v-container>

  <MyFooter />
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import MyHeader from '../components/MyHeader.vue'
import MyFooter from '../components/MyFooter.vue'
import LineChart from '../components/charts/LineChart.vue'
import BarChart from '../components/charts/BarChart.vue'

const from = ref('')
const to = ref('')

const dailyRequestsChart = ref(null)
const dailyVisitorsChart = ref(null)
const topCountriesChart = ref(null)
const topCitiesChart = ref(null)
const topIpsChart = ref(null)
const topUrlsChart = ref(null)

async function loadStats() {
  try {
    const response = await axios.get('https://antaligyongyi.hu/api/logs/stats', {
      params: { from: from.value, to: to.value }
    })

    const data = response.data

    // Napi request count
    dailyRequestsChart.value = {
      labels: data.dailyRequests.map(d => d._id),
      datasets: [
        {
          label: 'Kérések száma',
          data: data.dailyRequests.map(d => d.count),
          borderColor: '#1976D2',
          fill: false
        }
      ]
    }

    // Napi egyedi látogatók
    dailyVisitorsChart.value = {
      labels: data.dailyUniqueVisitors.map(d => d._id),
      datasets: [
        {
          label: 'Egyedi látogatók',
          data: data.dailyUniqueVisitors.map(d => d.uniqueVisitors),
          borderColor: '#E53935',
          fill: false
        }
      ]
    }

    // Top országok
    topCountriesChart.value = {
      labels: data.topCountries.map(c => c._id || 'Ismeretlen'),
      datasets: [
        {
          label: 'Kérések',
          data: data.topCountries.map(c => c.count),
          backgroundColor: '#43A047'
        }
      ]
    }

    // Top városok
    topCitiesChart.value = {
      labels: data.topCities.map(c => c._id || 'Ismeretlen'),
      datasets: [
        {
          label: 'Kérések',
          data: data.topCities.map(c => c.count),
          backgroundColor: '#FB8C00'
        }
      ]
    }

    // Top IP címek
    topIpsChart.value = {
      labels: data.topIps.map(i => i._id),
      datasets: [
        {
          label: 'Kérések',
          data: data.topIps.map(i => i.count),
          backgroundColor: '#8E24AA'
        }
      ]
    }

    // Top URL-ek
    topUrlsChart.value = {
      labels: data.topUrls.map(u => u._id),
      datasets: [
        {
          label: 'Kérések',
          data: data.topUrls.map(u => u.count),
          backgroundColor: '#3949AB'
        }
      ]
    }

  } catch (err) {
    console.error('Statisztika betöltési hiba:', err)
  }
}
</script>

<style scoped>
h3 {
  font-weight: bold;
}
</style>
