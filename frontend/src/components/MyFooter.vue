<template>
  <!-- Footer -->
  <footer class="w3-center w3-black w3-padding-64 w3-opacity w3-hover-opacity-off">
<!-- newsletter abo -->
    <v-container>
      <v-btn color="primary" class="text" @click="dialog = true">{{ aboButton[selectedLanguage] }}</v-btn>
      <v-dialog v-model="dialog" max-width="500">
        <v-card>
         <v-card-title class="headline">{{ aboButton[selectedLanguage] }}</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid">
              <v-text-field
                v-model="firstname"
                :label="aboFirstName[selectedLanguage]"
                :rules="[v => !!v || aboError1[selectedLanguage]]"
                required
              ></v-text-field>
              <v-text-field
                v-model="name"
                :label="aboName[selectedLanguage]"
                :rules="[v => !!v || aboError1[selectedLanguage]]"
                required
              ></v-text-field>
              <v-text-field
                v-model="email"
                :label="aboEmail[selectedLanguage]"
                :rules="[v => /.+@.+\..+/.test(v) || aboError2[selectedLanguage]]"
                required
              ></v-text-field>
              <v-checkbox
                v-model="gdpr"
                :rules="[v => !!v || aboError3[selectedLanguage]]"
                required
              >
                <template v-slot:label>
                  {{ aboGdpr1[selectedLanguage] }}
                  <a href="/gdpr" target="_blank" rel="noopener">
                    {{ aboGdpr2[selectedLanguage] }}
                  </a>
                </template>
              </v-checkbox>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green" text @click="submit">{{ aboButtonSend[selectedLanguage] }}</v-btn>
            <v-btn color="grey" text @click="dialog = false">{{ aboButtonCancel[selectedLanguage] }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
<!-- Social Media Links -->
    <div class="w3-xlarge w3-section">
      <a href="https://www.facebook.com/profile.php?id=100064353450604" target="_blank" rel="noopener"><i class="fa fa-facebook-official w3-hover-opacity"></i></a>
      <a href="https://www.instagram.com/antaligyongyiedit/" target="_blank" rel="noopener"><i class="fa fa-instagram w3-hover-opacity"> </i></a>
      <a href="https://www.linkedin.com/in/gy%C3%B6ngyi-edit-antali-09a1aa174/" target="_blank" rel="noopener"><i class="fa fa-linkedin w3-hover-opacity"> </i></a>
    </div>
<!--copyright-->
    <p>&copy; {{ new Date().getFullYear() }} Antali Gyöngyi Edit. All rights reserved.</p>
  </footer>
</template>

<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';

// Reactive state for language change
const selectedLanguage = ref(document.documentElement.lang || 'hu');
const aboButton = reactive({
  en: 'NEWSLETTER SUBSCRIPTION',
  hu: 'HÍRLEVÉL FELIRATKOZÁS',
  de: 'NEWSLETTER ABONNIEREN'
});
const aboFirstName = reactive({
  en: 'first name',
  hu: 'keresztnév',
  de: 'Vorname'
});
const aboName = reactive({
  en: 'name',
  hu: 'vezetéknév',
  de: 'Familienname'
});
const aboEmail = reactive({
  en: 'EMAIL',
  hu: 'EMAIL',
  de: 'EMAIL'
});
const aboGdpr1 = reactive({
  en: 'I accept the ',
  hu: 'Elfogadom az ',
  de: 'Ich stimme der '
});
const aboGdpr2 = reactive({
  en: '_ privacy policy.',
  hu: '_ adatvédelmi nyilatkozatot.',
  de: '_ Datenschutzerklärung zu.'
});
const aboError1 = reactive({
  en: 'Name is required',
  hu: 'név kötelező',
  de: 'Name ist erforderlich'
});
const aboError2 = reactive({
  en: 'please enter a valid email address!',
  hu: 'Kérjük, adjon meg egy érvényes e-mail címet!',
  de: 'Bitte gültige E-Mail angeben!'
});
const aboError3 = reactive({
  en: 'Please accept the privacy policy!',
  hu: 'Kérjük, fogadja el az adatvédelmi nyilatkozatot!',
  de: 'Bitte stimme der Datenschutzerklärung zu!'
});
const aboButtonSend = reactive({
  en: 'SEND',
  hu: 'ELKÜLDÉS',
  de: 'ABSCHICKEN'
});
const aboButtonCancel = reactive({
  en: 'CANCEL',
  hu: 'MÉGSE',
  de: 'ABBRECHEN'
});
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === "lang") {
      selectedLanguage.value = document.documentElement.lang;
    }
  });
});
observer.observe(document.documentElement, { attributes: true });

// Form state
const dialog = ref(false);
const valid = ref(false);
const firstname = ref('');
const name = ref('');
const email = ref('');
const gdpr = ref(false);
const form = ref(null);

// Email sending method
async function sendEmail(email, subject, message ) {
  alert('E-mail küldése folyamatban...'+ email+' '+ subject+' '+ message+' adatokkal.');
  try {
    await axios.post('http://localhost:3000/send-email', {
      email: email,
      subject: subject,
      message: message
    });
    alert('E-mail sikeresen elküldve!');
  } catch (error) {
    alert('Hiba történt: ' + error);
  }
}

// Submit handler function
function submit() {
  if (form.value && form.value.validate()) {
    // Optionally, show the form data
    // let textOut = 'Vorname: ' + firstname.value + '\n';
    // textOut += 'Name: ' + name.value + '\n';
    // textOut += 'E-Mail: ' + email.value + '\n';
    // textOut += 'GDPR zugestimmt: ' + (gdpr.value ? 'Ja' : 'Nein');
    // alert(textOut)
    sendEmail(email.value, 'newsletter abo', firstname.value + ' ' + name.value);
    dialog.value = false;
    firstname.value = '';
    name.value = '';
    email.value = '';
    gdpr.value = false;
    form.value.resetValidation();
  }
}
</script>