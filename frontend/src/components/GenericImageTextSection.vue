<template>
  <v-container class="w3-container w3-padding-16 w3-center">
    <div class="w3-content w3-container">
      <div class="w3-row">

        <!-- LEFT SIDE: IMAGE -->
        <div class="w3-col m6 w3-center w3-padding-small">
          <img
            :src="`${BASE_URL}${content.image}`"
            class="w3-round w3-image w3-padding-top-24"
            alt="Section image"
            width="500"
            height="333"
          />

          <!-- Admin: image upload -->
          <div v-if="userStore.role === 'admin'">
            <input type="file" @change="onImageSelected">
          </div>
        </div>

        <!-- RIGHT SIDE: TEXT -->
        <div class="w3-col m6 w3-padding-small">
          <h3 class="w3-center w3-padding-24">{{ content.title }}</h3>
          <p class="w3-center w3-padding-24"><em>{{ content.subtitle }}</em></p>

          <div>
            <p v-for="(p, index) in content.paragraphs" :key="index">
              {{ p }}
            </p>
          </div>

          <!-- Admin: toggle editor -->
          <div v-if="userStore.role === 'admin'">
            <v-btn color="primary" @click="showEditor = !showEditor">
              {{ showEditor ? 'Close Editor' : 'Edit Section' }}
            </v-btn>
          </div>

          <!-- Admin: editor panel -->
          <v-form
            v-if="showEditor"
            class="pa-4 mt-4"
            elevation="2"
          >
            <v-text-field
              v-model="content.title"
              label="Title"
            ></v-text-field>

            <v-text-field
              v-model="content.subtitle"
              label="Subtitle"
            ></v-text-field>

            <!-- Dynamic paragraphs -->
            <div
              v-for="(p, index) in content.paragraphs"
              :key="index"
              class="mb-4"
            >
              <v-textarea
                v-model="content.paragraphs[index]"
                :label="'Paragraph ' + (index + 1)"
              ></v-textarea>

              <v-btn
                color="error"
                variant="text"
                @click="removeParagraph(index)"
              >
                Delete paragraph
              </v-btn>
            </div>

            <v-btn
              color="secondary"
              class="mb-4"
              @click="addParagraph"
            >
              + Add paragraph
            </v-btn>

            <v-btn
              color="primary"
              class="mt-4"
              @click="saveContent"
            >
              Save Content
            </v-btn>
          </v-form>
        </div>

      </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/services/userStore';

const props = defineProps({
  sectionKey: { type: String, required: true }
});

const BASE_URL = "https://antaligyongyi.hu/api";
const userStore = useUserStore();

const selectedLanguage = ref(document.documentElement.lang || 'hu');
const showEditor = ref(false);

const content = ref({
  title: "",
  subtitle: "",
  paragraphs: [],
  image: ""
});

// Load content
async function loadContent() {
  try {
    const response = await axios.get(
      `${BASE_URL}/content/${props.sectionKey}/${selectedLanguage.value}`
    );

    content.value = {
      title: response.data.title || "",
      subtitle: response.data.subtitle || "",
      paragraphs: response.data.paragraphs || [],
      image: response.data.image || ""
    };

  } catch (err) {
    console.error(`Failed to load content for ${props.sectionKey}:`, err);
  }
}

onMounted(loadContent);

// Watch language changes
const observer = new MutationObserver(() => {
  selectedLanguage.value = document.documentElement.lang;
  loadContent();
});
observer.observe(document.documentElement, { attributes: true });

// Image upload
async function onImageSelected(event) {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  try {
    const token = localStorage.getItem('jwt');

    const response = await axios.post(
      `${BASE_URL}/content-upload`,
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    content.value.image = response.data.path + "?t=" + Date.now();
  } catch (err) {
    console.error("Image upload failed:", err);
  }
}

// Dynamic paragraph controls
function addParagraph() {
  content.value.paragraphs.push("");
}

function removeParagraph(index) {
  content.value.paragraphs.splice(index, 1);
}

// Save content
async function saveContent() {
  try {
    const token = localStorage.getItem('jwt');

    await axios.put(
      `${BASE_URL}/content/${props.sectionKey}/${selectedLanguage.value}`,
      content.value,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Content saved!");
    await loadContent();
  } catch (err) {
    console.error(`Saving content failed for ${props.sectionKey}:`, err);
    alert("Error saving content");
  }
}
</script>
