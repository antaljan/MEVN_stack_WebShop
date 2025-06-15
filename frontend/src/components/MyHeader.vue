<template>
  <!-- Navbar (sit on top) -->
  <div class="w3-top">
    <div class="w3-bar" id="myNavbar">
      <a class="w3-bar-item w3-button w3-hover-black w3-hide-medium w3-hide-large w3-right" href="javascript:void(0);" @click="toggleFunction" title="Toggle Navigation Menu">
        <i class="fa fa-bars"></i>
      </a>
      <a href="#home" class="w3-bar-item w3-button">KEZDŐLAP</a>
      <a href="#about" class="w3-bar-item w3-button w3-hide-small"><i class="fa fa-user"></i> RÓLAM</a>
      <a href="#contact" class="w3-bar-item w3-button w3-hide-small"><i class="fa fa-envelope"></i> KAPCSOLAT</a>
      <a href="#" class="w3-bar-item w3-button w3-hide-small w3-right w3-hover-red">
        <i class="fa fa-search"></i>
      </a>
      <select id="langselect" class="w3-bar-item w3-button w3-hide-small w3-right">
        <option value="en">EN</option>
        <option value="hu" selected>HU</option>
        <option value="de">DE</option>
      </select>
    </div>
    <!-- Navbar on small screens -->
    <div id="navDemo" class="w3-bar-block w3-white w3-hide w3-hide-large w3-hide-medium" @change="changeLanguage">
      <a href="#about" class="w3-bar-item w3-button" @click="toggleFunction">RÓLAM</a>
      <a href="#contact" class="w3-bar-item w3-button" @click="toggleFunction">KAPCSOLAT</a>
      <a href="#" class="w3-bar-item w3-button">KERESÉS</a>
    </div>
  </div>
</template>

<script setup>
// get browser languege
/*const userLanguage = navigator.language || navigator.languages[0];*/

// Change style of navbar on scroll
window.onscroll = function() {myFunction()};
function myFunction() {
    var navbar = document.getElementById("myNavbar");
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        navbar.className = "w3-bar" + " w3-card" + " w3-animate-top" + " w3-white";
    } else {
        navbar.className = navbar.className.replace(" w3-card w3-animate-top w3-white", "");
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
function changeLanguage() {
    const selectElement = document.getElementById("langselect");
    const selectedLanguage = selectElement.value;
    if (selectedLanguage === 'en') {
        // Change to English
        document.documentElement.lang = 'en';
    } else if (selectedLanguage === 'hu') {
        // Change to Hungarian
        document.documentElement.lang = 'hu';
    } else if (selectedLanguage === 'de') {
        // Change to German
        document.documentElement.lang = 'de';
    }
}
</script>
