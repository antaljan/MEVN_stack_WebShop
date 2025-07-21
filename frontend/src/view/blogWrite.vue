<template>
  <MyHeader/>
  <div class="w3-container w3-padding-32">
    <v-card class="ma-4 blog-card-spacing" outlined>
      <v-form @submit.prevent="submitPost">
        <v-row>
          <v-col cols="12" md="4" class="d-flex align-center">
            <div>
              <input type="file" @change="handleFileChange" accept="image/*" />
              <img v-if="previewUrl" :src="previewUrl" alt="Bild-Vorschau" />
            </div>
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

// 🔧 Reaktive Variablen
const imageFile = ref(null)
const previewUrl = ref(null)

// 📸 Datei-Auswahlhandler
function handleFileChange(event) {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    imageFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

// 📝 Blogeintrag absenden
async function submitPost() {
  // Erst Bild hochladen, falls vorhanden
  let uploadedFileName = '';
  if (imageFile.value) {
    const formDataImg = new FormData();
    formDataImg.append('image', imageFile.value);
    try {
      const response = await axios.post('https://yowayoli.com/api/upload', formDataImg, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      uploadedFileName = response.data && response.data.filename ? response.data.filename : imageFile.value.name;
      post.value.image = uploadedFileName;
      //alert('Bild hochgeladen: ' + uploadedFileName);
    } catch (error) {
      alert('Fehler beim Bild-Upload: ' + error);
      return;
    }
  }
  // Validierung der Eingabefelder
  if (!post.value.title || !post.value.author || !post.value.date || !post .value.content) {
    alert('Bitte füllen Sie alle erforderlichen Felder aus.');
    return;
  }
  // Blogeintrag absenden
  try {
    await axios.post('https://yowayoli.com/api/newpost', {
      'language': document.documentElement.lang,
      'title': post.value.title,
      'subtitle': post.value.subtitle,
      'author': post.value.author,
      'date': post.value.date,
      'content': post.value.content,
      'image': 'https://yowayoli.com/api/uploads/' + uploadedFileName
    });
    alert('Blogeintrag erfolgreich erstellt!');
    return { success: true };
  } catch (error) {
    return { success: false, error };
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
