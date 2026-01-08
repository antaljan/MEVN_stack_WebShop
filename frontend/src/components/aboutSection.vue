<template>
  <v-container class="w3-container w3-padding-16 w3-center">
    <div class="w3-content w3-container" id="about">
        <div class="w3-row">
        <!-- LEFT SIDE: IMAGE -->
        <div class="w3-col m6 w3-center w3-padding-small">
            <img
                :src="content.image"
                class="w3-round w3-image w3-padding-top-24"
                alt="About image"
                width="500"
                height="333"
            />
            <!-- Admin: image upload -->
            <div v-if="userStore.role === 'admin'" class="w3-margin-top">
                <input type="file" @change="onImageSelected">
            </div>
        </div>
        <!-- RIGHT SIDE: TEXT -->
        <div class="w3-col m6 w3-padding-small">
            <h3 class="w3-center">{{ content.title }}</h3>
            <p class="w3-center"><em>{{ content.subtitle }}</em></p>
            <div>
                <p v-for="(p, index) in content.paragraphs" :key="index">
                    {{ p }}
                </p>
            </div>
            <!-- Admin: text editor -->
            <div v-if="userStore.role === 'admin'" class="w3-margin-top">
                <v-text-field v-model="content.title" label="Title"></v-text-field>
                <v-text-field v-model="content.subtitle" label="Subtitle"></v-text-field>
                <v-textarea
                    v-for="(p, index) in content.paragraphs"
                    :key="index"
                    v-model="content.paragraphs[index]"
                    :label="'Paragraph ' + (index + 1)"
                ></v-textarea>
                <v-btn color="primary" class="mt-4" @click="saveContent">
                    Save About Content
                </v-btn>
            </div>
        </div>
        </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted} from 'vue';
import axios from 'axios';
import { useUserStore } from '@/services/userStore';

const userStore = useUserStore();

const selectedLanguage = ref(document.documentElement.lang || 'hu');

// CMS content object
const content = ref({
  title: "",
  subtitle: "",
  paragraphs: [],
  image: ""
});

// Load content from backend
async function loadContent() {
  try {
    const response = await axios.get(`https://antaligyongyi.hu/api/content/about/${selectedLanguage.value}`);
    content.value = response.data;
  } catch (err) {
    console.error("Failed to load about content:", err);
  }
}

onMounted(loadContent);

// Reload when language changes
const observer = new MutationObserver(() => {
  selectedLanguage.value = document.documentElement.lang;
  loadContent();
});
observer.observe(document.documentElement, { attributes: true });

// Upload new image
async function onImageSelected(event) {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  try {
    const token = localStorage.getItem('jwt');

    const response = await axios.post(
      "https://antaligyongyi.hu/api/content-upload",
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    content.value.image = "https://antaligyongyi.hu" + response.data.path + "?t=" + Date.now();
  } catch (err) {
    console.error("Image upload failed:", err);
  }
}

// Save text content
async function saveContent() {
  try {
    const token = localStorage.getItem('jwt');

    await axios.put(
      `https://antaligyongyi.hu/api/content/about/${selectedLanguage.value}`,
      content.value,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("About content saved!");
  } catch (err) {
    console.error("Saving content failed:", err);
    alert("Error saving content");
  }
}
</script>
