<template>
<!-- Second Parallax Image with Portfolio Text -->
    <div class="bgimg-2 w3-display-container w3-opacity-min">
        <div class="w3-display-middle">
            <span class="w3-xxlarge w3-text-white w3-wide">{{parallaxContact[selectedLanguage]}}</span>
        </div>
    </div>

<!-- Container (Contact Section) -->
<div class="w3-content w3-container w3-padding-64" id="contact">
  <div class="w3-row w3-padding-32 w3-section">
      <p>{{contactPoen[selectedLanguage]}}</p>
      <form @submit.prevent="sendEmail">
        <div class="w3-row-padding" style="margin:0 -16px 8px -16px">
          <div class="w3-half">
            <input class="w3-input w3-border" type="text" :placeholder="contactName[selectedLanguage]" required name="Name" v-model="subject">
          </div>
          <div class="w3-half">
            <input class="w3-input w3-border" type="email" :placeholder="contactEmail[selectedLanguage]" required name="Email" v-model="email">
          </div>
        </div>
        <input class="w3-input w3-border" type="text" :placeholder="contactMessage[selectedLanguage]" required name="Message" v-model="message">
        <input class="w3-check w3-padding-24" type="checkbox" checked="checked">
        <label>{{gdprReading1[selectedLanguage]}}<a href="gdpr"   target="_blank" rel="noopener"  class="w3-hover-text-red">{{gdprReading2[selectedLanguage]}}</a>{{gdprReading3[selectedLanguage]}}</label>
        <button class="w3-button w3-black w3-right w3-section" type="submit">
          <i class="fa fa-paper-plane"></i> {{contactSendButton[selectedLanguage]}}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
// Reactive state for language change
const selectedLanguage = ref(document.documentElement.lang || 'hu');
const contactPoen = reactive({
  en: 'Stop by for a coffee or send a message:',
  hu: 'Ugorj be egy kávéra, vagy írj egy üzenetet:',
  de: 'Kommen Sie auf einen Kaffee vorbei oder senden Sie eine Nachricht:'
});
const contactName = reactive({
  en: 'Name',
  hu: 'Név',
  de: 'Name'
});
const contactEmail = reactive({
  en: 'Email',
  hu: 'Email',
  de: 'Email'
});
const contactMessage = reactive({
  en: 'Message',
  hu: 'Üzenet',
  de: 'Nachricht'
});
const contactSendButton = reactive({
  en: 'Send Message',
  hu: 'Üzenet küldése',
  de: 'Nachricht senden'
});
const gdprReading1 = reactive({
  en: ' I have read and agree to the ',
  hu: ' Elolvastam és elfogadom az ',
  de: ' Ich habe die '
});
const gdprReading2 = reactive({
  en: 'privacy policy',
  hu: 'adatvédelmi irányelveket',
  de: 'Datenschutzrichtlinie '
});
const gdprReading3 = reactive({
  en: '.',
  hu: '.',
  de: 'gelesen und akzeptiere sie.'
});
    const parallaxContact = reactive({
        en: 'CONTACT',
        hu: 'KAPCSOLAT',
        de: 'KONTAKT'
    });

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === "lang") {
      selectedLanguage.value = document.documentElement.lang;
    }
  });
});
observer.observe(document.documentElement, { attributes: true });

import axios from 'axios';
// Email form state
const email = ref('');
const subject = ref('');
const message = ref('');
// Email sending method
async function sendEmail() {
  try {
    await axios.post('http://localhost:3000/send-email', {
      email: email.value,
      subject: subject.value,
      message: message.value
    });
    alert('E-mail sikeresen elküldve!');
  } catch (error) {
    alert('Hiba történt: ' + error);
  }
}
</script>
