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

      <!-- Statisztika mock 
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
import { ref, computed, axios  } from 'vue'
import { marked } from 'marked'
import MyFooter from '../components/MyFooter.vue'
import MyHeader from '../components/MyHeader.vue'
import { toast } from 'vue3-toastify'
import { greetingMarkdown } from '../sablons/GreetingTemplate.js'
import { featuredImageMarkdown } from '../sablons/ProductTemplate.js'

// 📋 Form state
const valid = ref(false)
const subject = ref('')
const content = ref('')
const sendDate = ref(null)
const showDatePicker = ref(false)

// 🧱 Sablon blokkok
const templateBlocks = [
  { label: 'Köszöntő blokk', markdown: greetingMarkdown },
  { label: 'Termékbemutató blokk', markdown: featuredImageMarkdown },
  { label: 'Gomb blokk', markdown: '[Kattints ide](https://example.com)' },
  { label: 'Kapcsolat blokk', markdown: '**Kapcsolat**: info@example.com' },
  { label: 'Jogi (GDPR,leiratkozás)', markdown: '[**Adatvédelmi nyilatkoza**](https://yowayoli.com/gdpr) / [leiratkozás](https://yowayoli.com/api/unsubscribe/{email})' }
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

// 🔄 Markdown → HTML
const convertedHtml = computed(() => marked(content.value || ''))

// 📆 Dátum formázás
const formattedDate = computed(() =>
  sendDate.value ? new Date(sendDate.value).toLocaleDateString() : 'Nincs kiválasztva'
)

// ➕ Blokk beszúrás
function insertBlock(block) {
  content.value += `\n\n${block.markdown}`
}

// 📧 Hírlevél küldés
async function sendNewsletter() {
  try {
    const payload = {
      subject: subject.value,
      content: content.value,
      sendDate: sendDate.value
    }
  await axios.post('https://yowayoli.com/api/send-newsletter', payload)
  toast.success('✅ Hírlevél elküldve vagy időzítve!')
  } catch (err) {
    console.error(err)
    toast.error('❌ Hiba történt a küldés során.')
  }
}
</script>

<style scoped>
.v-card {
  margin-bottom: 24px;
}
</style>