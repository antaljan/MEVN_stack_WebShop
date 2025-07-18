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
              v-model="post.author"
              label="Autor"
              required
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
  title: "",
  author: "",
  content: "",
  image: ""
});

const imageFile = ref(null);
const imagePreview = ref("");

function onImageChange(file) {
  if (file && file instanceof File) {
    const reader = new FileReader();
    reader.onload = e => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    imagePreview.value = "";
  }
}

async function submitPost() {
  try {
    const formData = new FormData();
    formData.append('title', post.value.title);
    formData.append('author', post.value.author);
    formData.append('content', post.value.content);
    if (imageFile.value) {
      formData.append('image', imageFile.value);
    }

    // Passe die URL an dein Backend an!
    const response = await axios.post('https://yowayoli.com/api/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (response.data.success) {
      alert('Blogeintrag erfolgreich erstellt!');
      // Optional: Felder zurücksetzen
      post.value = { title: "", author: "", content: "", image: "" };
      imageFile.value = null;
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
