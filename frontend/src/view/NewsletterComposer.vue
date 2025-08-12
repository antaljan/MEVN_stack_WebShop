<template>
  <MyHeader/>
  <v-container>
<!-- subject-->
      <v-textarea
        v-model="subject"
        label="Hírlevél minta tárgya"
        rows="1"
        outlined
        :rules="[v => !!v || 'A tartalom nem lehet üres']"
        @input="valid = subject.length > 0"
      />
<!-- toolbar-->
      <v-card >
        <v-card-title>Sablon-elemek</v-card-title>
        <v-card-text>
              <v-btn v-for="(item, index) in templateBlocks" :key="index"
                @click="insertBlock(item)"
                class="ma-2"
                :color="index % 2 === 0 ? 'primary' : 'secondary'"
                :outlined="index % 2 === 0"
                :text="index % 2 !== 0"
              >
                {{ item.label }}
              </v-btn>
        </v-card-text>
      </v-card>
    <v-row>
      <v-col cols="12" md="9">
<!-- Preview - HTML -->
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
          <v-btn color="primary" @click="clearNewsletter">
            Törlés
          </v-btn>
          <v-btn color="primary" @click="loadNewsletter">
            Betöltés
          </v-btn>
        </v-card-actions>
      </v-card>
      </v-col>
      <v-col cols="12" md="3">
<!-- Structure -->
        <v-card title="Sablon szerkezete">
          <v-card-text>
          <v-timeline align="start" density="compact">
            <v-timeline-item
              v-for="(structureitem, index) in structure"
              :key="index"
              size="x-small"
            >
              <div class="d-flex justify-space-between align-center">
                <strong>{{ structureitem.label }}</strong>
                <v-spacer></v-spacer>
                <div>
                  <v-btn icon size="small" @click="editBlock(index)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon size="small" @click="removeBlock(index)">
                    <v-icon color="error">mdi-delete</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-timeline-item>
          </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
<!--- dialog for editing -->
    <v-dialog v-model="dialogVisible" max-width="600px">
      <v-card>
        <v-card-title>Sablon blokk szerkesztése</v-card-title>
        <v-card-text>
          <h3>✏️ Szövegek</h3>
          <div v-for="(text, i) in editableTexts" :key="'text-' + i">
            <v-text-field v-model="editableTexts[i]" label="Szöveg" outlined />
          </div>
          <h3>🔗 Linkek</h3>
          <div v-for="(link, i) in editableLinks" :key="'link-' + i">
            <v-text-field v-model="editableLinks[i]" label="Link" outlined />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="saveEditedBlock">Mentés</v-btn>
          <v-btn color="secondary" @click="dialogVisible = false">Mégse</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
<!-- dialog list of saved templates -->
    <v-card>
      <v-card-title>Mentett sablonok</v-card-title>
      <v-card-text>
        <v-select
            v-model="selectedTemplate"
            :items="templates"
            item-title="subject"
            item-value="_id"
            label="Sablon kiválasztása"
            class="mt-4"
          />
      </v-card-text>
    </v-card>
</v-container>
<MyFooter/>
</template>
<script setup>
// import componnents and libraries
import { ref, computed  } from 'vue'
import axios from 'axios'
import MyFooter from '../components/MyFooter.vue'
import MyHeader from '../components/MyHeader.vue'
import DOMPurify from 'dompurify'
import { onMounted } from 'vue'

// import the templates
import { bodyImgL } from '../sablons/TemplateBodyImgL.js'
import { bodyImgC } from '../sablons/TemplateBodyImgC.js'
import { bodyTextImgL } from '../sablons/TemplateBodyTextImgL.js'
import { bodyTextImgR } from '../sablons/TemplateBodyTextImgR.js'
import { headerHTML } from '../sablons/TemplateHeader.js'
import { heroHTML } from '../sablons/TemplateHero.js'
import { BodyTextL } from '../sablons/TemplateBodyTextL.js'
import { BodyTextC } from '../sablons/TemplateBodyTextC.js'
import { BodyTextBL } from '../sablons/TemplateBodyTextBL.js'
import { BodyTextBC } from '../sablons/TemplateBodyTextBC.js'
import { BodyCtaC } from '../sablons/TemplateCtaC.js'
import { BodyCtaL } from '../sablons/TemplateCtaL.js'
import { footerHTML } from '../sablons/TemplateFooter.js'

// Form state
const valid = ref(false)
const subject = ref('')
const content = ref('')
const today = new Date().toISOString().split('T')[0]
const structure = ref([])
const dialogVisible = ref(false)
const editedIndex = ref(-1)
const editedHTML = ref('')
const templates = ref([])
const selectedTemplate = ref(null)
const editableTexts = ref([])
const editableLinks = ref([])


// Sablon block
const templateBlocks = [
  { label: 'Fejléc', HTML: headerHTML },
  { label: 'Lábléc', HTML: footerHTML },
  { label: 'Hero', HTML: heroHTML },
  { label: 'cím közép', HTML: BodyTextBC },
  { label: 'cím ball', HTML: BodyTextBL },
  { label: 'szöveg közép', HTML: BodyTextC },
  { label: 'szöveg ball', HTML: BodyTextL },
  { label: 'kép közép', HTML: bodyImgC },
  { label: 'kép ball', HTML: bodyImgL },
  { label: 'kép&szöveg ball', HTML: bodyTextImgL },
  { label: 'kép&szöveg jobb', HTML: bodyTextImgR },
  { label: 'gomb közép', HTML: BodyCtaC },
  { label: 'gomb ball', HTML: BodyCtaL },
]

onMounted(async () => {
  try {
    const response = await axios.post('https://yowayoli.com/api/newsletter/gettemplates')
    templates.value = response.data.allNewsletters
  } catch (error) {
    console.error('Nem sikerült lekérni a sablonokat:', error)
  }
})

// load newsletter content
function loadNewsletter() {
  if (!selectedTemplate.value) {
    alert("Válassz ki egy sablont a betöltéshez!")
    return
  }

  if (subject.value || content.value) {
    if (!confirm("Biztosan törlöd a jelenlegi tartalmat?")) return
    content.value = ''
    subject.value = ''
    structure.value = []
  }

  // 🔍 Keresés a már lekért sablonok között
  const selected = templates.value.find(t => t._id === selectedTemplate.value)
  if (!selected) {
    alert('❌ Nem található a kiválasztott sablon a listában.')
    return
  }

  // ✅ Betöltés a lokális adatokból
  content.value = selected.rawcontent || ''
  subject.value = selected.subject || ''
  structure.value = selected.structure || []
}

// Escape special characters in a string for use in a regular expression
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// convert and purify markdown to html
const convertedHtml = computed(() => DOMPurify.sanitize(content.value ));

// insert block into content
function insertBlock(block) {
  content.value += `\n\n${block.HTML}`
  structure.value.push({ label: block.label, HTML: block.HTML })
}

// send newsletter
async function sendNewsletter() {
  console.log('Küldött payload:', JSON.stringify({
  subject: subject.value,
  rawcontent: convertedHtml.value,
  sendDate: today,
  structure: structure.value
}, null, 2))
  try {
    const payload = {
      subject: subject.value,
      rawcontent: convertedHtml.value,
      sendDate: today,
      structure: structure.value
    }
  await axios.post('https://yowayoli.com/api/newsletter/save', payload)
  alert('✅ Hírlevél sablon mentve!')
  } catch (err) {
    console.error(err)
    alert('❌ Hiba történt a mentés során.')
  }
}

// clear newsletter content
function clearNewsletter() {
  if (confirm("Biztosan törlöd a tartalmat?")) {
    content.value = ''
    subject.value = ''
    structure.value = []
  }
}

// edit block in inserted structure
function editBlock(index) {
  editedIndex.value = index
  editedHTML.value = structure.value[index].HTML

  // Szűrés szövegekre és linkekre
  editableTexts.value = filterText(editedHTML.value)
  editableLinks.value = filterLink(editedHTML.value)

  dialogVisible.value = true
}


// remove block from structure
function removeBlock(index) {
  const block = structure.value[index]
  if (confirm(`Biztosan törlöd a(z) "${block.label}" blokkot?`)) {
    // Törlés a structure tömbből
    structure.value.splice(index, 1)

    // Törlés a content.value-ből
    const htmlToRemove = block.HTML.trim()
    const regex = new RegExp(`\\n*${escapeRegExp(htmlToRemove)}\\n*`, 'g')
    content.value = content.value.replace(regex, '').trim()
  }
}

// save edited block
function saveEditedBlock() {
  const index = editedIndex.value
  let html = structure.value[index].HTML
  // Szövegek cseréje
  const originalTexts = filterText(html)
  originalTexts.forEach((original, i) => {
    const updated = editableTexts.value[i]
    if (updated && updated !== original) {
      html = html.replace(new RegExp(`>${escapeRegExp(original)}<`, 'g'), `>${updated}<`)
    }
  })
  // Linkek cseréje
  const originalLinks = filterLink(html)
  originalLinks.forEach((original, i) => {
    const updated = editableLinks.value[i]
    if (updated && updated !== original) {
      html = html.replace(new RegExp(escapeRegExp(original), 'g'), updated)
    }
  })
  // Frissítés a structure tömbben
  structure.value[index].HTML = html
  // Frissítés a content.value-ben
  const oldHTML = editedHTML.value.trim()
  const regex = new RegExp(`\\n*${escapeRegExp(oldHTML)}\\n*`, 'g')
  content.value = content.value.replace(regex, `\n\n${html}`).trim()
  dialogVisible.value = false
}

// Filter functions to extract text and links from HTML
function filterText(html) {
  return [...html.matchAll(/>([^<]+)</g)]
    .map(match => match[1].trim())
    .filter(text => text.length > 0);
}

// Filter function to extract links from HTML
function filterLink(html) {
  return [...html.matchAll(/https:\/\/[^"]+/g)].map(match => match[0]);
}



</script>

<style scoped>
.v-card {
  margin-bottom: 24px;
}
</style>