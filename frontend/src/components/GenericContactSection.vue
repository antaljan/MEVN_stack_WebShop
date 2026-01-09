<template>
  <div class="w3-content w3-container w3-padding-64" id="contact">

    <!-- Titles -->
    <h3 class="w3-align-left">{{ content.title0 }}</h3>
    <ul>
      <li><h3>{{ content.title1 }}</h3></li>
      <li><h3>{{ content.title2 }}</h3></li>
    </ul>

    <!-- Contact Form -->
    <div class="w3-row w3-padding-32 w3-section">
      <form @submit.prevent="handleSendEmail">
        <div class="w3-row-padding" style="margin:0 -16px 8px -16px">
          <div class="w3-half">
            <input
              class="w3-input w3-border"
              type="text"
              :placeholder="content.placeholderName"
              required
              v-model="subject"
            />
          </div>
          <div class="w3-half">
            <input
              class="w3-input w3-border"
              type="email"
              :placeholder="content.placeholderEmail"
              required
              v-model="email"
            />
          </div>
        </div>

        <input
          class="w3-input w3-border"
          type="text"
          :placeholder="content.placeholderMessage"
          required
          v-model="message"
        />

        <input class="w3-check w3-padding-24" type="checkbox" required />
        <label>
          {{ content.gdpr1 }}
          <a href="/gdpr" target="_blank" rel="noopener" class="w3-hover-text-red">
            {{ content.gdpr2 }}
          </a>
          {{ content.gdpr3 }}
        </label>

        <button class="w3-button w3-black w3-right w3-section" type="submit">
          <i class="fa fa-paper-plane"></i> {{ content.buttonText }}
        </button>
      </form>
    </div>

    <!-- Admin: toggle editor -->
    <div v-if="userStore.role === 'admin'" class="w3-padding">
      <v-btn color="primary" @click="showEditor = !showEditor">
        {{ showEditor ? 'Close Editor' : 'Edit Contact Section' }}
      </v-btn>
    </div>

    <!-- Admin: editor panel -->
    <v-form v-if="showEditor" class="pa-4 mt-4 editor-panel" elevation="2">
      <v-text-field v-model="content.title0" label="Title 0"></v-text-field>
      <v-text-field v-model="content.title1" label="Title 1"></v-text-field>
      <v-text-field v-model="content.title2" label="Title 2"></v-text-field>

      <v-text-field v-model="content.placeholderName" label="Placeholder: Name"></v-text-field>
      <v-text-field v-model="content.placeholderEmail" label="Placeholder: Email"></v-text-field>
      <v-text-field v-model="content.placeholderMessage" label="Placeholder: Message"></v-text-field>

      <v-text-field v-model="content.buttonText" label="Button Text"></v-text-field>

      <v-text-field v-model="content.gdpr1" label="GDPR Part 1"></v-text-field>
      <v-text-field v-model="content.gdpr2" label="GDPR Link Text"></v-text-field>
      <v-text-field v-model="content.gdpr3" label="GDPR Part 3"></v-text-field>

      <v-btn color="primary" class="mt-4" @click="saveContent">
        Save Contact Content
      </v-btn>
    </v-form>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useUserStore } from "@/services/userStore";
import { sendEmail } from "@/services/emailService";

const props = defineProps({
  sectionKey: { type: String, required: true }
});

const BASE_URL = "https://antaligyongyi.hu/api";
const userStore = useUserStore();

const selectedLanguage = ref(document.documentElement.lang || "hu");
const showEditor = ref(false);

const content = ref({
  title0: "",
  title1: "",
  title2: "",
  placeholderName: "",
  placeholderEmail: "",
  placeholderMessage: "",
  buttonText: "",
  gdpr1: "",
  gdpr2: "",
  gdpr3: ""
});

// Load content
async function loadContent() {
  try {
    const response = await axios.get(
      `${BASE_URL}/content/${props.sectionKey}/${selectedLanguage.value}`
    );
    content.value = response.data;
  } catch (err) {
    console.error("Failed to load contact content:", err);
  }
}

onMounted(loadContent);

// Watch language changes
const observer = new MutationObserver(() => {
  selectedLanguage.value = document.documentElement.lang;
  loadContent();
});
observer.observe(document.documentElement, { attributes: true });

// Form fields
const email = ref("");
const subject = ref("");
const message = ref("");

// Email sending
async function handleSendEmail() {
  const result = await sendEmail({
    email: "antali.gyongyi@gmail.com",
    subject: "Kapcsolatfelvétel a honlapról",
    message: `Feladó: ${email.value}\nTárgy: ${subject.value}\nÜzenet: ${message.value}`
  });

  if (result.success) {
    alert("Email sent successfully!");
  } else {
    alert("Error sending email: " + result.error);
  }
}

// Save content
async function saveContent() {
  try {
    const token = localStorage.getItem("jwt");

    await axios.put(
      `${BASE_URL}/content/${props.sectionKey}/${selectedLanguage.value}`,
      content.value,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Contact content saved!");
    await loadContent();
  } catch (err) {
    console.error("Saving contact content failed:", err);
    alert("Error saving contact content");
  }
}
</script>

<style scoped>
.editor-panel {
  background: white;
  border-radius: 8px;
}
</style>
