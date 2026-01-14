<template>
  <v-container class="py-8">
    <h2 class="mb-6">{{ isEdit ? 'Visszajelzés szerkesztése' : 'Új visszajelzés' }}</h2>

    <v-text-field label="Név" v-model="form.name" />

    <v-select
      label="Nyelv"
      :items="['hu','de','en']"
      v-model="form.language"
    />

    <v-select
      label="Rating"
      :items="[1,2,3,4,5]"
      v-model="form.rating"
    />

    <v-select
      label="Státusz"
      :items="['published','draft','archived']"
      v-model="form.status"
    />

    <v-text-field label="Forrás" v-model="form.source" />
    <div class="mt-4">
    <QuillEditor
      :content="form.content"
      @update:content="form.content = $event"
      content-type="html"
      theme="snow"
      :toolbar="[
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
        ['clean']
      ]"
    />
    </div>

    <v-btn color="primary" class="mt-6" @click="save">
      Mentés
    </v-btn>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { QuillEditor } from '@vueup/vue-quill'
import { useUserStore } from "@/services/userStore";
const userStore = useUserStore();
const route = useRoute()
const router = useRouter()

const form = ref({
  name: '',
  content: '<p><br></p>',
  language: 'hu',
  rating: 5,
  status: 'draft',
  source: ''
})

const isEdit = computed(() => !!route.params.id)

onMounted(async () => {
  if (isEdit.value) {
    const res = await axios.get(`https://antaligyongyi.hu/api/feedbacks/${route.params.id}`)
    form.value = res.data
  }
})

const save = async () => {
  const headers = {
    Authorization: `Bearer ${userStore.token}`
  }

  if (isEdit.value) {
    await axios.put(
      `https://antaligyongyi.hu/api/feedbacks/${route.params.id}`,
      form.value,
      { headers }
    )
  } else {
    await axios.post(
      'https://antaligyongyi.hu/api/feedbacks/new',
      form.value,
      { headers }
    )
  }

  router.push('/admin/feedbacks')
}

</script>
<style>
@import '@vueup/vue-quill/dist/vue-quill.snow.css';
</style>
