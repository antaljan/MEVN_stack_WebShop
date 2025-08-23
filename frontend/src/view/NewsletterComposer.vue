<template>
  <MyHeader/>
  <v-container>
<!-- subject-->
    <v-row class="align-center">
      <v-col cols="12" md="9">
        <v-textarea
          v-model="subject"
          label="Hírlevél minta tárgya"
          rows="1"
          outlined
          :rules="[v => !!v || 'A tartalom nem lehet üres']"
          @input="valid = subject.length > 0"
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-btn color="secondary" @click="templateDialogVisible = true">
          Mentett sablonok
        </v-btn>
      </v-col>
    </v-row>
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
            <v-text-field
              v-model="editableTexts[i]"
              label="Szöveg"
              outlined
              :rules="[v => !containsForbiddenChars(v) || 'Tiltott karaktert tartalmaz']"
            />
          </div>
          <h3>🔗 Linkek</h3>
          <div v-for="(link, i) in editableLinks" :key="'link-' + i">
            <v-text-field v-model="editableLinks[i]" label="Link" outlined />
            <v-file-input
              v-model="imageFile"
              label="Kép feltöltése"
              accept="image/*"
              outlined
              @change="uploadImage(i)"
            />
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
    <v-dialog v-model="templateDialogVisible" max-width="600px">
      <v-card>
        <v-card-title>📁 Mentett sablonok</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item
              v-for="template in templates"
              :key="template._id"
            >
                  <v-list-item-title>{{ template.subject }}</v-list-item-title>
                  <v-list-item-subtitle>{{ new Date(template.sendDate).toLocaleDateString() }}</v-list-item-subtitle>
                  <v-list-item-action>
                    <v-btn icon @click="loadSelectedTemplate(template)">
                      <v-icon>mdi-download</v-icon>
                    </v-btn>
                    <v-btn icon @click="deleteTemplate(template._id)">
                      <v-icon color="error">mdi-delete</v-icon>
                    </v-btn>
                  </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="secondary" @click="templateDialogVisible = false">Bezárás</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- back button -->
    <v-btn
      class="w3-button w3-hover-black w3-round-large w3-margin-top-24"
      color="primary"
      :to="'/newsletter'"
    >
      <v-icon left>mdi-arrow-left</v-icon>
      Vissza a hírlevél követéshez
    </v-btn>
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
const editableTexts = ref([])
const editableLinks = ref([])
const forbiddenChars = ['<', '>', '[', ']', '$', '%', '#', '`']
const imageFile = ref(null);
const templateDialogVisible = ref(false)

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
    const token = localStorage.getItem('jwt');
        if (!token) {
            console.warn('Nincs token, nem lehet lekérni a felhasználókat.');
            return;
        }
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    const response = await axios.post('https://antaligyongyi.hu/api/newsletter/gettemplates', config)
    templates.value = response.data.allNewsletters
  } catch (error) {
    console.error('Nem sikerült lekérni a sablonokat:', error)
  }
})

// check text for vorbidden charakters
function containsForbiddenChars(text) {
  return forbiddenChars.some(char => text.includes(char));
}

// load newsletter content
function loadSelectedTemplate(template) {
  if (subject.value || content.value) {
    if (!confirm("Biztosan törlöd a jelenlegi tartalmat?")) return
    content.value = ''
    subject.value = ''
    structure.value = []
  }
  content.value = template.rawcontent || ''
  subject.value = template.subject || ''
  structure.value = template.structure || []
  templateDialogVisible.value = false
}

// delete template
async function deleteTemplate(_id) {
  if (!confirm("Biztosan törlöd ezt a sablont?")) return
  try {
    const token = localStorage.getItem('jwt');
        if (!token) {
            console.warn('Nincs token, nem lehet lekérni a felhasználókat.');
            return;
        }
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    await axios.post('https://antaligyongyi.hu/api/newsletter/deletetemplate', { _id }, config)
    templates.value = templates.value.filter(t => t._id !== _id)
  } catch (error) {
    alert('❌ Nem sikerült törölni a sablont.')
    console.error(error)
  }
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
    const token = localStorage.getItem('jwt');
    if (!token) {
      console.warn('Nincs token, nem lehet lekérni a felhasználókat.');
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    await axios.post('https://antaligyongyi.hu/api/newsletter/save', payload, config)
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
   // Frissítés a content.value-ben
    content.value = ''
    for (const item of structure.value) {
      content.value += `\n\n${item.HTML}`
    }
  }
}

// save edited block
function saveEditedBlock() {
  const index = editedIndex.value
  const hasInvalidText = editableTexts.value.some(text => containsForbiddenChars(text));
  if (hasInvalidText) {
    alert("❌ A szöveg tiltott karaktert tartalmaz. Kérlek javítsd ki.");
    return;
  }
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
  content.value = ''
  for (const item of structure.value) {
    content.value += `\n\n${item.HTML}`
  }
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

// picture upload function
const uploadImage = async (index) => {
  if (!imageFile.value) return;
  const formDataImg = new FormData();
  formDataImg.append('image', imageFile.value);
  try {
    const response = await axios.post('https://antaligyongyi.hu/api/upload', formDataImg, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    const uploadedFileName = response.data?.filename || imageFile.value.name;
    const imageUrl = `https://antaligyongyi.hu/api/uploads/${uploadedFileName}`;
    editableLinks.value[index] = imageUrl;
    alert('✅ Kép sikeresen feltöltve és linkbe illesztve.');
  } catch (error) {
    alert('❌ Hiba a kép feltöltésekor: ' + error);
  }
};

</script>

<style scoped>
.v-card {
  margin-bottom: 24px;
}
</style>