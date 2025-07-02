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
      <a
        v-if="userRolle === 'admin' "
        href="/#admin"
        class="w3-bar-item w3-button w3-hover-black w3-hide-small"
        >Admin</a>
      <v-container class="w3-bar-item w3-button w3-right">
      <p  @click="dialog = true">
        <span> {{userFirstname}}</span>
        <v-icon name="loginIcon" color="black">mdi-login</v-icon>
      </p>
      <v-dialog v-model="dialog" max-width="500">
        <v-card>
        <v-card-title class="headline">
          {{ loggedIn ? 'Logout' : (isLogin ? 'Login' : 'Registrieren') }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-if="!isLogin && !loggedIn"
              v-model="firstname"
              label="First Name"
              :rules="[v => !!v || 'Name ist erforderlich']"
              required
            ></v-text-field>
            <v-text-field
              v-if="!isLogin && !loggedIn"
              v-model="name"
              label="Name"
              :rules="[v => !!v || 'Name ist erforderlich']"
              required
            ></v-text-field>            
            <v-text-field
              v-if="!loggedIn"
              v-model="email"
              label="E-Mail"
              :rules="[v => /.+@.+\..+/.test(v) || 'Gültige E-Mail angeben']"
              required
            ></v-text-field>
            <v-text-field
              v-if="!loggedIn"
              v-model="password"
              label="Passwort"
              :rules="[v => !!v || 'Passwort ist erforderlich']"
              type="password"
              required
            ></v-text-field>
            <v-checkbox
              v-if="!isLogin && !loggedIn"
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
            {{ loggedIn ? 'Logout' : (isLogin ? 'Einloggen' : 'Registrieren') }}
          </v-btn>
          <v-btn color="grey" text @click="dialog = false">Abbrechen</v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="toggleForm">
            {{ loggedIn ? '' : (isLogin ? 'Noch kein Konto? Jetzt registrieren' : 'Schon registriert? Jetzt einloggen') }}
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
import axios from 'axios';

// States
const dialog = ref(false);
const valid = ref(false);
const isLogin = ref(true);
const loggedIn = ref(false);
const name = ref('');
const firstname = ref('');
const email = ref('');
const password = ref('');
const gdpr = ref(false);
const userFirstname = ref('');
const userRolle = ref('');

// Sprachen
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

// Methoden
function toggleForm() {
  isLogin.value = !isLogin.value;
  // ggf. Validierung zurücksetzen
}

async function submit() {
  // Validierung ggf. selbst implementieren
  if (loggedIn.value) {
    // Logout
    try {
      const response = await axios.post('http://localhost:3000/logout');
      if (response.data.success) {
        loggedIn.value = false;
        userFirstname.value = '';
        userRolle.value = '';
        email.value = '',
        password.value = '',
        dialog.value = false;
        return { success: true };
      } else {
        alert('Logout fehlgeschlagen!');
        return { success: false };
      }
    } catch (error) {
      alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
      return { success: false, error };
    }
  } else if (isLogin.value) {
    // Login
    try {
      const response = await axios.post('http://localhost:3000/login', {
        email: email.value,
        psw: password.value
      });
      if (response.data.success) {
        userFirstname.value = response.data.user.firstname;
        loggedIn.value = true;
        userRolle.value = response.data.user.rolle;
        dialog.value = false;
        return { success: true };
      } else {
        alert('Login fehlgeschlagen! Bitte überprüfen Sie Ihre Anmeldedaten.');
        return { success: false };
      }
    } catch (error) {
      alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
      return { success: false, error };
    }
  } else {
    // Registrierung
    try {
      await axios.post('http://localhost:3000/create-user', {
        firstname: firstname.value,
        name: name.value,
        email: email.value,
        phone: '',
        rolle: 'user',
        adress: '',
        psw: password.value,
      });
      alert('Registrierung erfolgreich! Please check your EMAIL for confirmation.');
      firstname.value = '',
      name.value = '',
      email.value = '',
      password.value = '',
      loggedIn.value = false;
      userFirstname.value = '';
      userRolle.value = '';
      isLogin.value = true; // Zurück zum Login-Formular
      gdpr.value = false;
      dialog.value = false;
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }
}

function changeLanguage(event) {
  selectedLanguage.value = event.target.value;
  document.documentElement.lang = selectedLanguage.value;
}

function toggleFunction() {
  var x = document.getElementById("navDemo");
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
  } else {
    x.className = x.className.replace(" w3-show", "");
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