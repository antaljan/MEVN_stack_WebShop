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
              <button @click="uploadImage">Bild hochladen</button>
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

// 🚀 Upload-Funktion (optional auf Button-Klick etc.)
async function uploadImage() {
  if (!imageFile.value) return

  const formData = new FormData()
  formData.append('image', imageFile.value)

  try {
    await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    console.log('Bild erfolgreich hochgeladen!')
  } catch (error) {
    console.error('Fehler beim Upload:', error)
  }
}

// 📝 Blogeintrag absenden
async function submitPost() {
  try {
    const formData = new FormData();
    formData.append('language', post.value.language);
    formData.append('title', post.value.title);
    formData.append('subtitle', post.value.subtitle);
    formData.append('author', post.value.author);
    formData.append('date', post.value.date);
    formData.append('content', post.value.content);
    if (imageFile.value && imageFile.value[0]) {
      formData.append('image', imageFile.value[0]);
    }

    await axios.post('https://yowayoli.com/api/newpost', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    alert('Blogeintrag erfolgreich erstellt!');
    post.value = {
      language: "",
      title: "",
      subtitle: "",
      author: "",
      date: "",
      content: "",
      image: ""
    };
    //imageFile.value = [];
    //imagePreview.value = "";
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
