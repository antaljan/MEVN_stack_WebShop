<template>
<!-- First Parallax Image with Logo Text -->
<div class="bgimg-1 w3-display-container w3-opacity-min" id="home">
  <div class="w3-display-middle" style="white-space:nowrap;">
    <span class="w3-center w3-padding-large w3-black w3-xlarge w3-wide w3-animate-opacity">Edith <span class="w3-hide-small">Skills</span> Lab</span>
  </div>
</div>

<!-- Container (About Section) -->
<div class="w3-content w3-container w3-padding-64" id="about">
  <h3 class="w3-center"><i class="fa fa-user w3-margin-right"></i>{{aboutName[selectedLanguage]}}</h3>
  <p class="w3-center"><em>{{aboutTitle[selectedLanguage]}}</em></p>
  <p>{{aboutText1[selectedLanguage]}}</p>
  <div class="w3-row">
    <div class="w3-col m6 w3-center w3-padding-large">
      <img src="avatar_hat.jpg" class="w3-round w3-image w3-opacity w3-hover-opacity-off" alt="Photo of Me" width="500" height="333">
    </div>

    <!-- Hide this text on small devices -->
    <div class="w3-col m6 w3-hide-small w3-padding-large">
      <p>{{aboutText2[selectedLanguage]}}</p>
    </div>
  </div>
  
</div>

<!-- Second Parallax Image with Portfolio Text -->
<div class="bgimg-2 w3-display-container w3-opacity-min">
  <div class="w3-display-middle">
    <span class="w3-xxlarge w3-text-white w3-wide">{{parallaxContact[selectedLanguage]}}</span>
  </div>
</div>

<!-- Container (Contact Section) -->
<div class="w3-content w3-container w3-padding-64" id="contact">
  <p class="w3-center"><em>{{contactWelcome[selectedLanguage]}}</em></p>

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
const parallaxContact = reactive({
  en: 'CONTACT',
  hu: 'KAPCSOLAT',
  de: 'KONTAKT'
});
const contactWelcome = reactive({
  en: 'I am very interested in your opinion!',
  hu: 'Nagyon érdekel a véleményed!',
  de: 'Eure Meinung interessiert mich sehr!'
});
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
const aboutName = reactive({
  en: 'Edit Gyöngyi Antali',
  hu: 'Antali Gyöngyi Edit',
  de: 'Edit Gyöngyi Antali'
});
const aboutTitle = reactive({
  en: 'Psychologist, Coach, Lifestyle Consultant and Therapist',
  hu: 'Pszichológus, Coach, Életmód-tanácsadó és terapeuta',
  de: 'Psychologe, Coach, Lifestyle-Berater und Therapeutin'
});
const aboutText1 = reactive({
  en: 'I am committed to supporting my clients on their journey of self-discovery and solving their life challenges. My expertise extends to lifestyle counseling and therapy, so I support them with a holistic approach.',
  hu: 'Elkötelezetten támogatom ügyfeleimet önismereti útjukon és életvezetési kihívásaik megoldásában. Szakértelmem kiterjed az életmód-tanácsadásra és terápiára is, így holisztikus szemlélettel állok mellettük.',
  de: 'Ich unterstütze meine Klienten auf ihrem Weg der Selbstfindung und der Lösung ihrer Lebensherausforderungen. Meine Expertise umfasst auch Lebensberatung und Therapie, sodass ich sie mit einem ganzheitlichen Ansatz unterstütze.'
});
const aboutText2 = reactive({
  en: 'Antali Gyöngyi Edits clients generally rate her work positively, especially her empathetic approach and effective support. Based on the feedback, many emphasize that she helped them gain deeper self-knowledge and overcome difficult periods in their lives. If you would like to see specific opinions, it is worth visiting her Facebook page, where her clients often share their experiences.',
  hu: 'Antali Gyöngyi Edit ügyfelei általában pozitívan értékelik a munkáját, különösen az empatikus hozzáállását és hatékony támogatását. A visszajelzések alapján sokan kiemelik, hogy segített nekik mélyebb önismeretre jutni és életük nehéz szakaszain túllendülni. Ha szeretnéd megnézni konkrét véleményeket, érdemes ellátogatni a Facebook oldalára, ahol ügyfelei gyakran osztják meg tapasztalataikat.',
  de: 'Die Klienten von Antali Gyöngyi Edit bewerten ihre Arbeit im Allgemeinen positiv, insbesondere ihren einfühlsamen Ansatz und ihre effektive Unterstützung. Viele betonen, dass sie ihnen geholfen hat, tiefere Selbsterkenntnis zu erlangen und schwierige Lebensphasen zu überwinden. Für konkrete Meinungen lohnt sich ein Besuch ihrer Facebook-Seite, wo ihre Klienten oft ihre Erfahrungen teilen.'
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


