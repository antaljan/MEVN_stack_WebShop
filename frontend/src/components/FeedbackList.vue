<template>
  <v-container class="py-8">
    <h2 class="mb-6">Feedback Admin</h2>

    <v-btn color="primary" class="mb-4" @click="goNew">
      Új visszajelzés
    </v-btn>

    <v-table>
      <thead>
        <tr>
          <th>Név</th>
          <th>Nyelv</th>
          <th>Rating</th>
          <th>Státusz</th>
          <th>Forrás</th>
          <th>Műveletek</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="fb in feedbacks" :key="fb._id">
          <td>{{ fb.name }}</td>
          <td>{{ fb.language }}</td>
          <td>{{ fb.rating }}</td>
          <td>{{ fb.status }}</td>
          <td>{{ fb.source }}</td>
          <td>
            <v-btn size="small" color="blue" @click="edit(fb._id)">Szerkesztés</v-btn>
            <v-btn size="small" color="red" @click="remove(fb._id)">Törlés</v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-btn color="primary" class="mb-4" @click="goBack">
      Vissza a Landing oldalra
    </v-btn>  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const feedbacks = ref([])

const load = async () => {
  const res = await axios.get('https://antaligyongyi.hu/api/feedbacks')
  feedbacks.value = res.data
}

const goNew = () => router.push('/admin/feedbacks/new')
const edit = (id) => router.push(`/admin/feedbacks/${id}`)
const goBack = () => router.push('/landing')

const remove = async (id) => {
  if (!confirm('Biztosan törlöd?')) return
  await axios.delete(`https://antaligyongyi.hu/api/feedbacks/${id}`)
  load()
}

onMounted(load)
</script>
