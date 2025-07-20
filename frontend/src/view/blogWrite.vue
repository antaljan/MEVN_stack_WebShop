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
        await axios.get('https://yowayoli.com/api/newpost', {
          language: post.value.language,
          title: post.value.title,
          subtitle: post.value.subtitle,
          author: post.value.author,
          date: post.value.date,
          content: post.value.content,
          image: post.value.image  ,
        });
        alert('Registrierung erfolgreich! Please check your EMAIL for confirmation.');
        // Zurücksetzen der Eingabefelder
        post.value = {
          title: "",
          subtitle: "",
          author: "",
          date: "",
          content: "",
          image: ""
        };
        imageFile.value = [];
        imagePreview.value = "";
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
