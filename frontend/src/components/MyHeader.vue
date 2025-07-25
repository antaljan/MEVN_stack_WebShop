<template>
    <!-- Navbar  -->
    <div class="w3-bar w3-top" id="myNavbar">
      <a class="w3-bar-item w3-button w3-hover-black w3-left" href="javascript:void(0);" @click="toggleFunction" title="Navigation Menu">
        <i class="fa fa-bars"></i>
      </a>
      <div id="navDemo" class="w3-bar-block w3-white w3-hide" @change="changeLanguage">
        <a href="/landing/#home" class="w3-bar-item w3-button" @click="toggleFunction"> {{menuButtonHome[selectedLanguage]}}</a>
        <a href="/landing/#about" class="w3-bar-item w3-button" @click="toggleFunction"> {{menuButtonAbout[selectedLanguage]}}</a>
        <a href="/landing/#blog" class="w3-bar-item w3-button" @click="toggleFunction"> {{menuButtonBlog[selectedLanguage]}}</a>
        <a href="/landing/#contact" class="w3-bar-item w3-button" @click="toggleFunction">{{ menuButtonContact[selectedLanguage] }}</a>
        <a v-if="userStore.role === 'admin'"
          href="/newblog"
          class="w3-bar-item w3-button w3-hover-black w3-hide-small">
          {{ menuButtonNewPost[selectedLanguage] }}
        </a>
      </div>
      <!-- Login button and popup dialog -->
      <v-container class="w3-bar-item w3-button w3-right">
        <p  @click="dialog = true">
          <span> {{userStore.name}}</span>
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
                  :rules="[v => !!v || 'Firstname is must']"
                  required
                ></v-text-field>
                <v-text-field
                  v-if="!isLogin && !loggedIn"
                  v-model="name"
                  label="Name"
                  :rules="[v => !!v || 'Name is must']"
                  required
                ></v-text-field>
                <v-text-field
                  v-if="!loggedIn"
                  v-model="email"
                  label="E-Mail"
                  :rules="[v => /.+@.+\..+/.test(v) || 'correct E-Mail is required']"
                  required
                ></v-text-field>
                <v-text-field
                  v-if="!loggedIn"
                  v-model="password"
                  label="Passwort"
                  :rules="[v => !!v || 'Passwort is must']"
                  type="password"
                  required
                ></v-text-field>
                <v-checkbox
                  v-if="!isLogin && !loggedIn"
                  v-model="gdpr"
                  :rules="[v => !!v || 'please accept the GDPR']"
                  label="I accept the GDPR"
                  required
                ></v-checkbox>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green" text @click="submit">
                {{ loggedIn ? 'Logout' : (isLogin ? 'Login' : 'Registring') }}
              </v-btn>
              <v-btn color="grey" text @click="dialog = false">Abbrechen</v-btn>
            </v-card-actions>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="toggleForm">
                {{ loggedIn ? '' : (isLogin ? 'No account? Just registring' : 'alreadi registred? just login') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
      <!-- Language selection -->
      <select id="langselect" class="w3-bar-item w3-button w3-right" @change="changeLanguage">
        <option value="en">EN</option>
        <option value="hu">HU</option>
        <option value="de">DE</option>
      </select>
    </div>
 
</template>

<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/services/userStore'

const router = useRouter()
const userStore = useUserStore()

const api = axios.create({
  baseURL: 'https://yowayoli.com/api'
})

api.interceptors.request.use(config => {
  if (userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}`
  }
  return config
})


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
  // Sprachen
  import { onMounted } from 'vue';
  const selectedLanguage = ref(document.documentElement.lang || 'hu');
  onMounted(() => {
    const langSelect = document.getElementById('langselect');
    if (langSelect) {
      langSelect.value = selectedLanguage.value;
    }
  });
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
  const menuButtonBlog = reactive({
    en: 'BLOG',
    hu: 'BLOG',
    de: 'BLOG'
  });
  const menuButtonContact = reactive({
    en: 'CONTACT',
    hu: 'KAPCSOLAT',
    de: 'KONTAKT'
  });
  const menuButtonNewPost = reactive({
    en: 'Create Post',
    hu: 'Új blog bejegyzés',
    de: 'Neuen Blog Beitrag erstellen'
  });
  // toggleFunction login
  function toggleForm() {
    isLogin.value = !isLogin.value;
  }
  async function submit() {
    // check if form is valid
    if (loggedIn.value) {
      // Logout
      loggedIn.value = false;
      email.value = '';
      password.value = '';
      dialog.value = false;
      userStore.logout();
      router.push('/');
    } else if (isLogin.value) {
      // Login
      try {
        const response = await axios.post('https://yowayoli.com/api/login', {
          email: email.value,
          psw: password.value
        });
        if (response.data.success) {
          userStore.setUser(response.data.user, response.data.token);
          loggedIn.value = true;
          dialog.value = false;
          //alert('Login erfolgreich! ' + userStore.name + '/'+ userStore.role);
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
        await axios.post('https://yowayoli.com/api/create-user', {
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
        this.$user.name.value = '';
        this.$user.role.value = '';
        isLogin.value = true; // Zurück zum Login-Formular
        gdpr.value = false;
        dialog.value = false;
        return { success: true };
      } catch (error) {
        return { success: false, error };
      }
    }
  }
  // Language change
  function changeLanguage(event) {
    selectedLanguage.value = event.target.value;
    document.documentElement.lang = selectedLanguage.value;
  }
  // toggleFunction for menü
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