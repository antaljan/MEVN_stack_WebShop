<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title>
        📝 Neuer Newsletter
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-form ref="form">
          <v-text-field label="Betreff" v-model="subject" required />
          <v-textarea label="Nachricht" v-model="message" rows="5" required />
          <v-file-input label="Bild hinzufügen (optional)" v-model="image" accept="image/*" />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" @click="submitNewsletter">Absenden</v-btn>
        <v-btn text @click="dialog = false">Abbrechen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const props = defineProps(['dialog'])
const emit = defineEmits(['update:dialog'])
const subject = ref('');
const message = ref('');
const image = ref(null);

async function submitNewsletter() {
  const formData = new FormData();
  formData.append('subject', subject.value);
  formData.append('message', message.value);
  if (image.value) {
    formData.append('image', image.value);
  }

 try {
    await axios.post('/api/create-newsletter', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    alert('Newsletter erfolgreich erstellt!');
    dialog.value = false;
    subject.value = '';
    message.value = '';
    image.value = null;
  } catch (error) {
    console.error('Fehler beim Erstellen:', error);
    alert('Fehler beim Erstellen des Newsletters.');
  }
}
</script>