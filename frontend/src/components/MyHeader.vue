<template>
  <!-- Navbar (sit on top) -->
  <div class="w3-top">
    <div class="w3-bar" id="myNavbar">
      <a class="w3-bar-item w3-button w3-hover-black w3-hide-medium w3-hide-large w3-right" href="javascript:void(0);" @click="toggleFunction" title="Toggle Navigation Menu">
        <i class="fa fa-bars"></i>
      </a>
      <a href="/#home" class="w3-bar-item w3-button">{{ menuButtonHome[selectedLanguage] }}</a>
      <a href="/#about" class="w3-bar-item w3-button w3-hide-small"> {{menuButtonAbout[selectedLanguage]}}</a>
      <a href="/#contact" class="w3-bar-item w3-button w3-hide-small"> {{ menuButtonContact[selectedLanguage] }}</a>
      <a href="/#" class="w3-bar-item w3-button w3-hide-small w3-right w3-hover-red">
        <i class="fa fa-user"></i>
      </a>
      <select id="langselect" class="w3-bar-item w3-button w3-right" @change="changeLanguage">
        <option value="en">EN</option>
        <option value="hu" selected>HU</option>
        <option value="de">DE</option>
      </select>
    </div>
    <!-- Navbar on small screens -->
    <div id="navDemo" class="w3-bar-block w3-white w3-hide w3-hide-large w3-hide-medium" @change="changeLanguage">
      <a href="/#about" class="w3-bar-item w3-button" @click="toggleFunction"> {{menuButtonAbout[selectedLanguage]}}</a>
      <a href="/#contact" class="w3-bar-item w3-button" @click="toggleFunction">{{ menuButtonContact[selectedLanguage] }}</a>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

// Reactive state
const selectedLanguage = ref(document.documentElement.lang || 'hu');
const menuButtonHome = reactive({
  en: 'HOME',
  hu: 'KEZDŐLAP',
  de: 'STARTSEITE'
});
const menuButtonAbout = reactive({
  en: 'ABOUT',
  hu: 'RÓLAM',
  de: 'ÜBER MICH'
});
const menuButtonContact = reactive({
  en: 'CONTACT',
  hu: 'KAPCSOLAT',
  de: 'KONTAKT'
});

// Change style of navbar on scroll
window.onscroll = function() { myFunction(); };
function myFunction() {
  var navbar = document.getElementById("myNavbar");
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    navbar.className = "w3-bar w3-card w3-animate-top w3-white";
  } else {
    navbar.className = "w3-bar";
  }
}

// Used to toggle the menu on small screens when clicking on the menu button
function toggleFunction() {
  var x = document.getElementById("navDemo");
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
  } else {
    x.className = x.className.replace(" w3-show", "");
  }
}

// Language change handler
function changeLanguage(event) {
  selectedLanguage.value = event.target.value;
  document.documentElement.lang = selectedLanguage.value;
}
</script>

