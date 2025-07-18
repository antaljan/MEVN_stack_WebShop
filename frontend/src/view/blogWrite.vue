<template>
  <MyHeader/>
  <div class="w3-container w3-padding-32">
    <v-card class="ma-4 blog-card-spacing" outlined>
      <v-form @submit.prevent="submitPost">
        <v-row>
          <v-col cols="12" md="4" class="d-flex align-center">
            <v-img
              v-if="imagePreview"
              :src="imagePreview"
              height="200px"
              class="blog-image"
            ></v-img>
            <v-file-input
              v-model="imageFile"
              accept="image/*"
              label="Bild hochladen"
              prepend-icon="mdi-image"
              @change="onImageChange"
              outlined
              dense
            ></v-file-input>
          </v-col>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="post.title"
              label="Titel"
              required
              outlined
              dense
            ></v-text-field>
            <v-text-field
              v-model="post.subtitle"
              label="Untertitel"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              v-model="post.author"
              label="Autor"
              required
              outlined
              dense
            ></v-text-field>
            <v-text-field
              v-model="post.date"
              label="Datum"
              type="date"
              outlined
              dense
            ></v-text-field>
            <v-textarea
              v-model="post.content"
              label="Inhalt"
              required
              outlined
              rows="6"
            ></v-textarea>
            <v-card-actions>
              <v-btn color="primary" type="submit">Blogeintrag erstellen</v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </div>
  <MyFooter/>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import MyFooter from "../components/MyFooter.vue";
import MyHeader from "../components/MyHeader.vue";

const post = ref({
  language: "",
  title: "",
  subtitle: "",
  author: "",
  date: "",
  content: "",
  image: ""
});

// imageFile ist ein Array!
const imageFile = ref([]);
const imagePreview = ref("");

function onImageChange(files) {
  const file = Array.isArray(files) ? files[0] : files;
  if (file && file instanceof File) {
    const reader = new FileReader();
    reader.onload = e => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
    // imageFile.value bleibt ein Array!
  } else {
    imagePreview.value = "";
  }
}

async function submitPost() {
  try {
    const formData = new FormData();
    formData.append('language', document.documentElement.lang);
    formData.append('title', post.value.title);
    formData.append('subtitle', post.value.subtitle);
    formData.append('author', post.value.author);
    formData.append('date', post.value.date);
    formData.append('content', post.value.content);
    // Immer das erste Element aus dem Array nehmen!
    if (imageFile.value && imageFile.value[0]) {
      formData.append('image', imageFile.value[0]);
    }

    const response = await axios.post('https://yowayoli.com/api/newpost', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (response.data.success) {
      alert('Blogeintrag erfolgreich erstellt!');
      post.value = { title: "", subtitle: "", author: "", date: "", content: "", image: "" };
      imageFile.value = [];
      imagePreview.value = "";
    } else {
      alert('Fehler beim Erstellen des Blogeintrags.');
    }
  } catch (error) {
    alert('Fehler beim Senden: ' + error);
  }
}
</script>

<style scoped>
.blog-card-spacing {
  margin-top: 100px;
}
.blog-image {
  width: 100%;
  object-fit: cover;
  border-radius: 4px 4px 0 0;
  margin-bottom: 16px;
}
</style>
