<template>
<!-- Navbar (sit on top) -->
  <div class="w3-top">
    <div class="w3-bar" id="myNavbar">
      <a class="w3-bar-item w3-button w3-hover-black w3-hide-medium w3-hide-large w3-left" href="javascript:void(0);" @click="toggleFunction" title="Toggle Navigation Menu">
        <i class="fa fa-bars"></i>
      </a>
      <a href="/#home" class="w3-bar-item w3-button w3-hide-small">{{ menuButtonHome[selectedLanguage] }}</a>
      <a href="/#about" class="w3-bar-item w3-button w3-hide-small"> {{menuButtonAbout[selectedLanguage]}}</a>
      <a href="/#contact" class="w3-bar-item w3-button w3-hide-small"> {{ menuButtonContact[selectedLanguage] }}</a>
<!-- login -->
      <v-container class="w3-bar-item w3-button w3-right">
      <p  @click="dialog = true">
        <v-icon name="loginIcon" color="black">mdi-login</v-icon>
      </p>
      <v-dialog v-model="dialog" max-width="500">
        <v-card>
        <v-card-title class="headline">
          {{ isLogin ? 'Login' : 'Registrieren' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-if="!isLogin"
              v-model="name"
              label="Name"
              :rules="[v => !!v || 'Name ist erforderlich']"
              required
            ></v-text-field>
            <v-text-field
              v-model="email"
              label="E-Mail"
              :rules="[v => /.+@.+\..+/.test(v) || 'Gültige E-Mail angeben']"
              required
            ></v-text-field>
            <v-text-field
              v-model="password"
              label="Passwort"
              :rules="[v => !!v || 'Passwort ist erforderlich']"
              type="password"
              required
            ></v-text-field>
            <v-checkbox
              v-if="!isLogin"
              v-model="gdpr"
              :rules="[v => !!v || 'Bitte stimme der Datenschutzerklärung zu']"
              label="Ich stimme der Datenschutzerklärung zu"
              required
            ></v-checkbox>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green" text @click="submit">
            {{ isLogin ? 'Einloggen' : 'Registrieren' }}
          </v-btn>
          <v-btn color="grey" text @click="dialog = false">Abbrechen</v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="toggleForm">
            {{ isLogin ? 'Noch kein Konto? Jetzt registrieren' : 'Schon registriert? Jetzt einloggen' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
<!-- Language selection -->
      <select id="langselect" class="w3-bar-item w3-button w3-right" @change="changeLanguage">
        <option value="en">EN</option>
        <option value="hu" selected>HU</option>
        <option value="de">DE</option>
      </select>
    </div>
<!-- Navbar on small screens -->
    <div id="navDemo" class="w3-bar-block w3-white w3-hide w3-hide-large w3-hide-medium" @change="changeLanguage">
      <a href="/#home" class="w3-bar-item w3-button" @click="toggleFunction"> {{menuButtonHome[selectedLanguage]}}</a>
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
<script>
export default {
  data() {
    return {
      dialog: false,
      valid: false,
      isLogin: true,
      name: '',
      email: '',
      password: '',
      gdpr: false
    }
  },
  methods: {
    toggleForm() {
      this.isLogin = !this.isLogin
      this.$refs.form.resetValidation()
    },
    submit() {
      if (this.$refs.form.validate()) {
        if (this.isLogin) {
          console.log('Login:', this.email, this.password)
        } else {
          console.log('Registrierung:', this.name, this.email, this.password, 'GDPR:', this.gdpr)
        }
        this.dialog = false
        this.name = ''
        this.email = ''
        this.password = ''
        this.gdpr = false
      }
    }
  }
}
</script>
<style>
.hover-glow:hover {
  box-shadow: 0 0 12px rgba(0, 123, 255, 0.7);
  transform: scale(1.1);
  transition: all 0.3s ease;
}
</style>