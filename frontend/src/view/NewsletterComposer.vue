<template>
  <MyHeader/>
  <v-container>
    <v-form v-model="valid" lazy-validation>
      <v-text-field label="Tárgy" v-model="subject" required />

      <v-textarea
        label="Tartalom (Markdown)"
        v-model="content"
        auto-grow
        rows="8"
        required
      />

      <v-menu v-model="showDatePicker" transition="scale-transition" offset-y>
        <template #activator="{ on, attrs }">
          <v-text-field
            :value="formattedDate"
            label="Küldés időpontja (opcionális)"
            readonly
            v-bind="attrs"
            v-on="on"
          />
        </template>
        <v-date-picker v-model="sendDate" @input="showDatePicker = false" />
      </v-menu>

      <v-btn color="primary" :disabled="!valid" @click="sendNewsletter">
        Küldés
      </v-btn>

      <v-divider class="my-4" />

      <!-- Előnézet -->
      <v-card>
        <v-card-title>📬 Előnézet</v-card-title>
        <v-card-text>
          <div v-html="convertedHtml" />
        </v-card-text>
      </v-card>

      <!-- Sablon-elemek (Drag & Drop lista) -->
      <v-divider class="my-4" />
      <v-card>
        <v-card-title>🧩 Sablon-elemek</v-card-title>
        <v-list>
          <v-list-item v-for="(item, index) in templateBlocks" :key="index">
            <v-list-item-content>{{ item.label }}</v-list-item-content>
            <v-list-item-action>
              <v-btn icon @click="insertBlock(item)">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>

      <!-- Statisztika
      <v-divider class="my-4" />
      <v-card>
        <v-card-title>📊 Küldési statisztika</v-card-title>
        <v-card-text>
          <v-progress-linear :value="stats.openRate" height="20" color="green">
            <strong>{{ stats.openRate }}% megnyitási arány</strong>
          </v-progress-linear>
          <v-list>
            <v-list-item>
              <v-list-item-content>📤 Elküldött: {{ stats.sent }}</v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>📖 Megnyitott: {{ stats.opened }}</v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>⚠️ Hibás: {{ stats.bounced }}</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>-->
    </v-form>
  </v-container>
  <MyFooter/>
</template>
<script setup>
import { ref, computed  } from 'vue'
import axios from 'axios'
import { marked } from 'marked'
import MyFooter from '../components/MyFooter.vue'
import MyHeader from '../components/MyHeader.vue'
//import { toast } from 'vue3-toastify'
import { headerMarkdown } from '../sablons/headerTemplate.js'
import { heroMarkdown } from '../sablons/heroTemplate.js'
import { contentTextMarkdown } from '../sablons/contTextTemplate.js'
import { contentImageMarkdown } from '../sablons/contImageTemplate.js'
import { ctaMarkdown } from '../sablons/ctaTemplate.js'
import { footerMarkdown } from '../sablons/footerTemplate.js'
import { easyMarkdown } from '../sablons/easyReklam.js'
import DOMPurify from 'dompurify'

// 📋 Form state
const valid = ref(false)
const subject = ref('')
const content = ref('')
const sendDate = ref(null)
const showDatePicker = ref(false)

// 🧱 Sablon blokkok
const templateBlocks = [
  { label: 'Fejléc (Logo, Szlogen)', markdown: headerMarkdown },
  { label: 'Hero (figyelemfelkeltés)', markdown: heroMarkdown },
  { label: 'Tartalom - szöveg', markdown: contentTextMarkdown },
  { label: 'Tartalom - képpel', markdown: contentImageMarkdown },
  { label: 'CTA (Call To Action) gombok', markdown: ctaMarkdown },
  { label: 'Lábléc (Kapcsolat, GDPR, Leiratkozás)', markdown: footerMarkdown },
  { label: 'Egyszerű reklám', markdown: easyMarkdown }
]

/* 📊 Statisztikák
const sent = ref(120)
const opened = ref(85)
const bounced = ref(6)
const stats = computed(() => ({
  sent: sent.value,
  opened: opened.value,
  bounced: bounced.value,
  openRate: Math.round((opened.value / sent.value) * 100)
}))*/

// 📆 Dátum formázás
const formattedSendDate = sendDate.value
  ? new Date(sendDate.value).toISOString()
  : null

// convert and purify markdown to html
const convertedHtml = computed(() => DOMPurify.sanitize(marked(content.value || '')))

// ➕ Blokk beszúrás
function insertBlock(block) {
  content.value += `\n\n${block.markdown}`
}

// 📧 Hírlevél küldés
async function sendNewsletter() {
  try {
    const payload = {
      subject: subject.value,
      rawcontent: convertedHtml.value,
      sendDate: formattedSendDate
    }
  await axios.post('https://yowayoli.com/api/newsletter/send', payload)
  alert('✅ Hírlevél elküldve vagy időzítve!')
  } catch (err) {
    console.error(err)
    alert('❌ Hiba történt a küldés során.')
  }
}
</script>

<style scoped>
.v-card {
  margin-bottom: 24px;
}
</style>