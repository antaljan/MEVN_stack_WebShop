<template>
  <!-- Footer -->
  <footer class="w3-center w3-black w3-padding-64 w3-opacity w3-hover-opacity-off">
    <a href="/#home" class="w3-button w3-light-grey"><i class="fa fa-arrow-up w3-margin-right"></i>{{buttonToTop[selectedLanguage]}}</a>
    <div class="w3-xlarge w3-section">
      <a href="https://www.facebook.com/profile.php?id=100064353450604" target="_blank" rel="noopener"><i class="fa fa-facebook-official w3-hover-opacity"></i></a>
      <a href="https://www.instagram.com/antaligyongyiedit/" target="_blank" rel="noopener"><i class="fa fa-instagram w3-hover-opacity"> </i></a>
      <a href="https://www.linkedin.com/in/gy%C3%B6ngyi-edit-antali-09a1aa174/" target="_blank" rel="noopener"><i class="fa fa-linkedin w3-hover-opacity"> </i></a>
    </div>
    <p>Powered by <a href="https://www.w3schools.com/w3css/default.asp" title="W3.CSS" target="_blank" rel="noopener" class="w3-hover-text-green">w3.css</a> &
     <a href="https://vuetifyjs.com/" title="vuetify"  target="_blank" rel="noopener" class="w3-hover-text-green">vuetify</a> &
     <a href="https://www.linkedin.com/in/janos-antali-29086a70/" title="A_Jani"  target="_blank" rel="noopener" class="w3-hover-text-green">A_Jani</a>.</p>
  </footer>
</template>

<script setup>
import { ref, reactive } from 'vue';

// Reactive state for language change
const selectedLanguage = ref(document.documentElement.lang || 'hu');
const buttonToTop = reactive({
  en: 'HOME',
  hu: 'KEZDŐLAP',
  de: 'STARTSEITE'
});
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === "lang") {
      selectedLanguage.value = document.documentElement.lang;
    }
  });
});
observer.observe(document.documentElement, { attributes: true });
</script>

<style>
.w3-xlarge i {
  margin-right: 10px; /* 10px távolság minden ikon között */
}
</style>
