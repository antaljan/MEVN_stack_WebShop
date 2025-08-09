<template>
  <MyHeader/>
  <v-container>
      <!--HTML elónézet-->
      <v-textarea
        v-model="subject"
        label="Hírlevél minta tárgya"
        rows="1"
        outlined
        :rules="[v => !!v || 'A tartalom nem lehet üres']"
        @input="valid = subject.length > 0"
      />
      <!-- Előnézet -->
      <v-card>
        <v-card-title>📬 Előnézet</v-card-title>
        <v-card-text>
          <div 
          :rules="[v => !!v || 'A tartalom nem lehet üres']"
          @input="valid = subject.length > 0"
          v-html="convertedHtml" />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="sendNewsletter" :disabled="!valid">
            Mentés
          </v-btn>
        </v-card-actions>
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
        <v-divider class="my-4" />

      </v-card>
  </v-container>
  <MyFooter/>
</template>
<script setup>
import { ref, computed  } from 'vue'
import axios from 'axios'
//import { marked } from 'marked'
import MyFooter from '../components/MyFooter.vue'
import MyHeader from '../components/MyHeader.vue'
//import { toast } from 'vue3-toastify'
import { headerHTML } from '../sablons/headerTemplate.js'
import { heroHTML } from '../sablons/heroTemplate.js'
import { contentTextHTML } from '../sablons/contTextTemplate.js'
import { contentImageHTML } from '../sablons/contImageTemplate.js'
import { ctaHTML } from '../sablons/ctaTemplate.js'
import { footerHTML } from '../sablons/footerTemplate.js'
import DOMPurify from 'dompurify'

// 📋 Form state
const valid = ref(false)
const subject = ref('')
const content = ref('')
const today = new Date().toISOString().split('T')[0]

//const showDatePicker = ref(false)

// 🧱 Sablon blokkok
const templateBlocks = [
  { label: 'Fejléc (Logo, Szlogen)', HTML: headerHTML },
  { label: 'Hero (figyelemfelkeltés)', HTML: heroHTML },
  { label: 'Tartalom - szöveg', HTML: contentTextHTML },
  { label: 'Tartalom - képpel', HTML: contentImageHTML },
  { label: 'CTA (Call To Action) gombok', HTML: ctaHTML },
  { label: 'Lábléc (Kapcsolat, GDPR, Leiratkozás)', HTML: footerHTML },
]

// convert and purify markdown to html
const convertedHtml = computed(() => DOMPurify.sanitize(content.value ));

// ➕ Blokk beszúrás
function insertBlock(block) {
  content.value += `\n\n${block.HTML}`
}

// 📧 Hírlevél küldés
async function sendNewsletter() {
  try {
    const payload = {
      subject: subject.value,
      rawcontent: convertedHtml.value,
      sendDate: today
    }
  await axios.post('https://yowayoli.com/api/newsletter/save', payload)
  alert('✅ Hírlevél sablon mentve!')
  } catch (err) {
    console.error(err)
    alert('❌ Hiba történt a mentés során.')
  }
}
</script>

<style scoped>
.v-card {
  margin-bottom: 24px;
}
</style>