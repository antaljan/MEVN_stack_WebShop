<template>
    <div class="bgimg w3-display-container w3-animate-opacity w3-text-white">
      <!-- login icon  -->
      <p  @click="dialog = true" class="w3-display-topright w3-padding-large">
        <v-icon name="loginIcon" color="black">mdi-login</v-icon>
      </p>
      <!-- Login Dialog -->
      <v-dialog v-model="dialog" max-width="500">
        <v-card>
        <v-card-title class="headline">Login</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
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
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green" text @click="submit">Einloggen</v-btn>
          <v-btn color="grey" text @click="dialog = false">Abbrechen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Text on midle -->
    <div class="w3-display-middle">
      <h1 class="coming-title">COMMING SOON</h1>
      <hr class="w3-border-grey" style="margin:auto;width:40%">
      <p class="coming-subtitle">Your way is your life!</p>
    </div>
    <!-- Footer -->
    <div class="w3-display-bottomleft w3-padding-large">
      Powered by <a href="https://www.w3schools.com/w3css/default.asp" target="_blank">w3.css</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

// States
const dialog = ref(false);
const valid = ref(false);
const email = ref('');
const password = ref('');

async function submit() {
    // Login
    try {
      const response = await axios.post('https://yowayoli.com/api/user/login', {
        email: email.value,
        psw: password.value
      });
      if (response.data.success) {
        dialog.value = false;
        window.location.href = 'https://yowayoli.com/landing';
      } else {
        alert('Login fehlgeschlagen! Bitte überprüfen Sie Ihre Anmeldedaten.');
        return { success: false };
      }
    } catch (error) {
      alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
      return { success: false, error };
    }
  }

</script>

<style scoped>
.bgimg {
  min-height: 100vh;
  background-position: center;
  background-size: cover;
  background-image: url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80');
}

/* Responsive Textgrößen mit Viewport-Einheiten */
.coming-title {
  font-size: 8vw;
  font-weight: bold;
  text-align: center;
}

.coming-subtitle {
  font-size: 3vw;
  text-align: center;
}

/* Optional: Für sehr kleine Bildschirme die Schriftgröße begrenzen */
@media (max-width: 600px) {
  .coming-title {
    font-size: 12vw;
  }
  .coming-subtitle {
    font-size: 5vw;
  }
}
.hover-glow:hover {
  box-shadow: 0 0 12px rgba(0, 123, 255, 0.7);
  transform: scale(1.1);
  transition: all 0.3s ease;
}
</style>
