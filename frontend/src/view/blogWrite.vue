<template>
  <MyHeader/>
  <div class="w3-container w3-padding-32">
    <v-card class="ma-4 blog-card-spacing" outlined>
      <v-form @submit.prevent="submitPost">
        <v-row>
          <v-col cols="8" md="4" class="d-flex align-center">
            <div>
              <input type="file" @change="handleFileChange" accept="image/*" />
              <v-img
                v-if="previewUrl"
                :src="previewUrl"
                class="blog-image"
              />
            </div>
          </v-col>

          <v-col cols="8" md="8">
            <v-text-field v-model="post.title" label="Cím" required outlined dense />
            <v-text-field v-model="post.subtitle" label="Alcím" outlined dense />
            <v-text-field v-model="post.author" label="Szerző" required outlined dense />
            <v-text-field v-model="post.date" label="Dátum" type="date" outlined dense />

            <label class="mb-2 d-block">Tartalom</label>
            <QuillEditor
              :content="post.content"
              @update:content="post.content = $event"
              content-type="html"
              theme="snow"
              :toolbar="[
                ['bold', 'italic', 'underline'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link'],
              ['clean']
            ]"/>

            />
          </v-col>

          <v-col cols="12">
            <v-card-actions>
              <v-btn color="primary" type="submit">
                {{ savePost[selectedLanguage] }}
              </v-btn>
              <v-btn color="primary" :to="'/landing'">
                {{ backToLanding[selectedLanguage] }}
              </v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </div>
  <MyFooter/>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import MyFooter from "../components/MyFooter.vue";
import MyHeader from "../components/MyHeader.vue";
import { useRoute } from 'vue-router';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const route = useRoute();
const postId = route.params.id;

// 🔥 reactive objektum, NINCS .value
const post = reactive({
  language: "",
  title: "",
  subtitle: "",
  author: "",
  date: "",
  content: "",
  image: ""
});

const imageFile = ref(null);
const previewUrl = ref(null);

// Betöltés
onMounted(async () => {
  if (!postId) return;
  try {
    const response = await axios.get(`https://antaligyongyi.hu/api/posts/${postId}`);

    // reactive objektum frissítése
    Object.assign(post, response.data);

    previewUrl.value = response.data.image;
  } catch (error) {
    alert("Nem sikerült betölteni a blogbejegyzést szerkesztéshez.");
    console.error(error);
  }
});

// Képkezelés
function handleFileChange(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    imageFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
  }
}

// Tartalom ellenőrzése
function isContentEmpty(html) {
  if (!html) return true;
  const text = html.replace(/<(.|\n)*?>/g, '').replace(/&nbsp;/g, ' ').trim();
  return text.length === 0;
}

// Mentés
async function submitPost() {
  // Validáció
console.log("CONTENT:", post.content);
if (!post.title || !post.author || !post.date || isContentEmpty(post.content)) {
  alert('Kérlek töltsd ki az összes kötelező mezőt!');
  return;
}

  let finalImagePath = post.image;

  // Kép feltöltése
  if (imageFile.value) {
    const formDataImg = new FormData();
    formDataImg.append('image', imageFile.value);

    try {
      const response = await axios.post('https://antaligyongyi.hu/api/upload', formDataImg, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const uploadedFileName = response.data?.filename || imageFile.value.name;
      finalImagePath = 'https://antaligyongyi.hu/api/uploads/' + uploadedFileName;

    } catch (error) {
      console.error("Kép feltöltési hiba:", error);
      alert('Hiba a kép mentése során.');
      return;
    }
  }

  const payload = {
    ...post,
    image: finalImagePath,
    language: document.documentElement.lang || 'hu'
  };

  try {
    const token = localStorage.getItem('jwt');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    if (postId) {
      await axios.put(`https://antaligyongyi.hu/api/posts/${postId}`, payload, config);
    } else {
      if (!token) {
        alert('Nincs érvényes token. Jelentkezz be újra!');
        return;
      }
      await axios.post('https://antaligyongyi.hu/api/posts/new', payload, config);
    }

    alert('A Blog bejegyzés sikeresen mentve!');

  } catch (error) {
    console.error("Mentési hiba:", error);
    alert('Hiba történt a mentés során.');
  }
}

// Nyelvváltás
const selectedLanguage = ref(document.documentElement.lang || 'hu');
const savePost = reactive({
  en: 'save post',
  hu: 'post mentése',
  de: 'Post speichern'
});
const backToLanding = reactive({
  en: 'Back to starting page',
  hu: 'Vissza a kezdőoldalra',
  de: 'Zurück zum Startseite'
});

const observer = new MutationObserver(() => {
  selectedLanguage.value = document.documentElement.lang;
});
observer.observe(document.documentElement, { attributes: true });
</script>

<style>
.blog-card-spacing {
  margin-top: 100px;
}
.blog-image {
  width: 100%;
  max-width: 300px;
  height: 200px;
  object-fit: cover;
  border-radius: 4px 4px 0 0;
  margin-bottom: 16px;
}
.ql-editor {
  min-height: 200px;
}
</style>
