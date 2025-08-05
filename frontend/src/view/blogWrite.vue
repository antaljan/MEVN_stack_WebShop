<template>
  <MyHeader/>
  <div class="w3-container w3-padding-32">
    <v-card class="ma-4 blog-card-spacing" outlined>
      <v-form @submit.prevent="submitPost">
        <v-row>
          <v-col cols="12" md="4" class="d-flex align-center">
            <div>
              <input type="file" @change="handleFileChange" accept="image/*" />
              <v-img
                v-if="previewUrl"
                :src="previewUrl"
                class="blog-image"
              />
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
import { useRoute } from 'vue-router';
const route = useRoute();
const postId = route.params.id;


const post = ref({
  language: "",
  title: "",
  subtitle: "",
  author: "",
  date: "",
  content: "",
  image: ""
});

// load post if its available
import { onMounted } from 'vue';
onMounted(async () => {
  if (!postId) return;
  try {
    const response = await axios.get(`https://yowayoli.com/api/posts/${postId}`);
    post.value = response.data;
    previewUrl.value = response.data.image;
  } catch (error) {
    alert("Nem sikerült betölteni a blogbejegyzést szerkesztéshez.");
    console.error(error);
  }
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

// send post
async function submitPost() {
  // image upload
  let uploadedFileName = '';
  if (imageFile.value) {
    const formDataImg = new FormData();
    formDataImg.append('image', imageFile.value);
    console.log("FormData tartalma:", formDataImg.get('image'));
    try {
      const response = await axios.post('https://yowayoli.com/api/upload', formDataImg, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log("Szerver válasza:", response.data);
      uploadedFileName = response.data && response.data.filename ? response.data.filename : imageFile.value.name;
      post.value.image = uploadedFileName;
      console.log('image is uploaded on name: ' + uploadedFileName);
    } catch (error) {
      alert('Failure by uploading of image: ' + error);
      return;
    }
  }
  // validating the imput fields
  if (!post.value.title || !post.value.author || !post.value.date || !post .value.content) {
    alert('Bitte füllen Sie alle erforderlichen Felder aus.');
    return;
  }
  // send post to backend
  try {

    if (postId) {
      post.value.image = 'https://yowayoli.com/api/uploads/' + uploadedFileName;
      post.value.language = document.documentElement.lang;
      await axios.put(`https://yowayoli.com/api/posts/${postId}`, post.value);
    } else {
      post.value = {
        language: document.documentElement.lang,
        title: post.value.title,
        subtitle: post.value.subtitle,
        author: post.value.author,
        date: post.value.date,
        content: post.value.content,
        image: 'https://yowayoli.com/api/uploads/' + uploadedFileName
    };
      await axios.post('https://yowayoli.com/api/posts/new', post.value);
    }

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
  max-width: 300px;   /* oder gewünschte feste Breite */
  height: 200px;      /* feste Höhe */
  object-fit: cover;  /* Bild wird zugeschnitten, bleibt aber immer gleich groß */
  border-radius: 4px 4px 0 0;
  margin-bottom: 16px;
}
</style>
