<template>
  <v-container class="w3-container w3-padding-16 w3-center">
    <div class="w3-content w3-container">

      <!-- TITLE -->
      <h3 class="w3-center">{{ content.title }}</h3>

      <!-- PARAGRAPHS -->
      <div class="w3-left-align w3-padding-16">
        <p v-for="(p, index) in content.paragraphs" :key="index">
          {{ p }}
        </p>
      </div>

      <!-- Admin: toggle editor -->
      <div v-if="userStore.role === 'admin'" class="w3-margin-top">
        <v-btn color="primary" @click="showEditor = !showEditor">
          {{ showEditor ? 'Close Editor' : 'Edit Section' }}
        </v-btn>
      </div>
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

      <!-- Dynamic paragraphs -->
      <div
        v-for="(p, index) in content.paragraphs"
        :key="index"
        class="mb-4"
      >
        <v-textarea
          v-model="content.paragraphs[index]"
          :label="'Paragraph ' + (index + 1)"
          auto-grow
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
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/services/userStore';

// Props: melyik szekciót töltsük be?
const props = defineProps({
  sectionKey: { type: String, required: true }
});

const BASE_URL = "https://antaligyongyi.hu/api";
const userStore = useUserStore();

const selectedLanguage = ref(document.documentElement.lang || 'hu');
const showEditor = ref(false);

// A tartalom egységes struktúrája
const content = ref({
  title: "",
  paragraphs: []
});

// Load content
async function loadContent() {
  try {
    const response = await axios.get(
      `${BASE_URL}/content/${props.sectionKey}/${selectedLanguage.value}`
    );

    content.value = {
      title: response.data.title || "",
      paragraphs: response.data.paragraphs || []
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

// Add/remove paragraphs
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
