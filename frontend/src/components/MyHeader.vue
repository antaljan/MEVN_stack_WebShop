<template>
    <!-- Navbar  -->
    <div class="w3-bar w3-top" id="myNavbar">
      <a class="w3-bar-item w3-button w3-hover-black w3-left" href="javascript:void(0);" @click="toggleFunction" title="Navigation Menu">
        <i class="fa fa-bars"></i>
      </a>
      <div id="navMenu" class="w3-bar-block w3-white w3-hide" @change="changeLanguage">
        <a href="/landing/#home" class="w3-bar-item w3-button" @click="toggleFunction"> {{menuButtonHome[selectedLanguage]}}</a>
        <a href="/landing/#about" class="w3-bar-item w3-button" @click="toggleFunction"> {{menuButtonAbout[selectedLanguage]}}</a>
        <a href="/landing/#story" class="w3-bar-item w3-button" @click="toggleFunction"> {{menuButtonStory[selectedLanguage]}}</a>
        <a href="/landing/#methode" class="w3-bar-item w3-button" @click="toggleFunction"> {{menuButtonMethode[selectedLanguage]}}</a>
        <a href="/landing/#contact" class="w3-bar-item w3-button" @click="toggleFunction">{{ menuButtonContact[selectedLanguage] }}</a>
        <a href="/landing/#blog" class="w3-bar-item w3-button" @click="toggleFunction"> {{menuButtonBlog[selectedLanguage]}}</a>
        <a v-if="userStore.role === 'admin'"
          href="/newblog"
          class="w3-bar-item w3-button">
          {{ menuButtonNewPost[selectedLanguage] }}
        </a>
        <a v-if="userStore.role === 'admin'"
          href="/users"
          class="w3-bar-item w3-button">
          {{ menuButtonUsers[selectedLanguage] }}
        </a>
        <a v-if="userStore.role === 'admin'"
          href="/newsletter"
          class="w3-bar-item w3-button">
          {{ menuButtonAbos[selectedLanguage] }}
        </a>
        <a v-if="userStore.role === 'admin'"
          href="/admin/statistics"
          class="w3-bar-item w3-button">
          {{ menuButtonLogs[selectedLanguage] }}
        </a>
        <a v-if="userStore.role === 'admin'"
          href="/productOverView"
          class="w3-bar-item w3-button">
          {{ menuButtonProdOverV[selectedLanguage] }}
        </a>
        <a v-if="userStore.role === 'admin'"
          href="/booking"
          class="w3-bar-item w3-button">
          {{ menuButtonBooking[selectedLanguage] }}
        </a>
        <a v-if="userStore.role === 'admin'"
          href="/admin/ImagesLibrary"
          class="w3-bar-item w3-button">
          {{ menuImagesLibrary[selectedLanguage] }}
        </a>

      </div>
      <!-- Login button and popup dialog -->
      <v-container class="w3-bar-item w3-button w3-right">
        <p  @click="dialog = true">
          {{ userStore.name }}
          <v-icon v-if="loggedIn" name="logoutIcon" color="black">mdi-logout</v-icon>
          <v-icon v-else name="loginIcon" color="black">mdi-login</v-icon>
        </p>
        <v-dialog v-model="dialog" max-width="500">
          <v-card>
            <v-card-title class="headline">
              {{ loggedIn ? dialogLogout[selectedLanguage] : (isLogin ? dialogLogin[selectedLanguage] : dialogRegistry[selectedLanguage]) }}
            </v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="valid">
                <v-text-field
                  v-if="!isLogin && !loggedIn"
                  v-model="firstname"
                  :label="dialogFirstName[selectedLanguage]"
                  :rules="[v => !!v || 'Firstname is must']"
                  required
                ></v-text-field>
                <v-text-field
                  v-if="!isLogin && !loggedIn"
                  v-model="name"
                  :label="dialogName[selectedLanguage]"
                  :rules="[v => !!v || 'Name is must']"
                  required
                ></v-text-field>
                <v-text-field
                  v-if="!loggedIn"
                  v-model="email"
                  :label="dialogEmail[selectedLanguage]"
                  :rules="[v => /.+@.+\..+/.test(v) || 'correct E-Mail is required']"
                  required
                ></v-text-field>
                <v-text-field
                  v-if="!loggedIn"
                  v-model="password"
                  :label="dialogPsw[selectedLanguage]"
                  :rules="[v => !!v || 'Passwort is must']"
                  type="password"
                  required
                ></v-text-field>
                <v-checkbox
                  v-if="!isLogin && !loggedIn"
                  v-model="gdpr"
                  :rules="[v => !!v || 'please accept the GDPR']"
                  :label="dialogGdpr[selectedLanguage]"
                  th:href="@{url '/gdpr'}"
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
            <!-- registration banned out
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="toggleForm">
                {{ loggedIn ? '' : (isLogin ? 'No account? Just registring' : 'alreadi registred? just login') }}
              </v-btn>
            </v-card-actions>
            -->
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
// useUserStore is a Pinia store for managing user state
const router = useRouter()
const userStore = useUserStore()
// Axios instance for API requests
const api = axios.create({
  baseURL: 'https://antaligyongyi.hu/api'
})
// jwt token interceptor
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
  // laguage selection
  import { onMounted } from 'vue';
  const selectedLanguage = ref(document.documentElement.lang || 'hu');
  onMounted(() => {
    const langSelect = document.getElementById('langselect');
    if (langSelect) {
      langSelect.value = selectedLanguage.value;
    }
    const token = localStorage.getItem('jwt');
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!token || !userData ) {
      loggedIn.value = false;
      userStore.name = '';
    } else {
      loggedIn.value = true;
      userStore.role = userData.role;
      userStore.name = userData.name;
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
  const menuButtonStory = reactive({
    en: 'MY STORY',
    hu: 'TÖRTÉNETEM',
    de: 'MENE GESCHICHTE'
  });
  const menuButtonMethode = reactive({
    en: 'METHOD',
    hu: 'MÓDSZER',
    de: 'METHODE'
  });
  const menuButtonBlog = reactive({
    en: 'BLOG',
    hu: 'BLOG',
    de: 'BLOG'
  });
  const menuButtonLogs = reactive({
    en: 'Seit statistic',
    hu: 'Honlap Statisztika',
    de: 'Webseiten Statistik'
  });
  const menuButtonProdOverV = reactive({
    en: 'Products',
    hu: 'Termékek',
    de: 'Produkten'
  });
  const menuButtonBooking = reactive({
    en: 'Termin Booking',
    hu: 'Időpont Foglalás',
    de: 'Termin Buchung'
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
  const menuButtonUsers = reactive({
    en: 'User Managemet',
    hu: 'Felhasználók kezelése',
    de: 'Benutzerverwaltung'
  });
  const menuButtonAbos = reactive({
    en: 'Newsletter Management',
    hu: 'Hírlevél kezelése',
    de: 'Newsletter Verwaltung'
  });
  const dialogLogout = reactive({
    en: 'Logout',
    hu: 'Kijelentkezés',
    de: 'Abmelden'
  });
  const dialogLogin = reactive({
    en: 'Login',
    hu: 'Bejelentkezés',
    de: 'Anmelden'
  });
  const dialogRegistry = reactive({
    en: 'Registration',
    hu: 'Regisztráció',
    de: 'Registrierung'
  });
  const dialogFirstName = reactive({
    en: 'First Name',
    hu: 'Keresztnév',
    de: 'Vorname'
  });
  const dialogName = reactive({
    en: 'Name',
    hu: 'Név',
    de: 'Nachname'
  });
  const dialogEmail = reactive({
    en: 'E-Mail',
    hu: 'E-Mail',
    de: 'E-Mail'
  });
  const dialogPsw = reactive({
    en: 'Password',
    hu: 'Jelszó',
    de: 'Passwort'
  });
  const dialogGdpr = reactive({
    en: 'I accept the GDPR',
    hu: 'Elfogadom az adatvédelmi irányelveket',
    de: 'Ich akzeptiere die Datenschutzbestimmungen'
  });
  const menuImagesLibrary = reactive({
    en: 'Images Library',
    hu: 'Képkönyvtár',
    de: 'Bildersammlung'
  });

  // toggleFunction login
  /*
  function toggleForm() {
    isLogin.value = !isLogin.value;
  }*/
  async function submit() {
    // check if form is valid
    if (loggedIn.value) {
      // Logout
      loggedIn.value = false;
      email.value = '';
      password.value = '';
      dialog.value = false;
      userStore.logout();
      router.push('/landing');
    } else if (isLogin.value) {
      // Login
      try {
        const response = await axios.post('https://antaligyongyi.hu/api/user/login', {
          email: email.value,
          psw: password.value
        });
        if (response.data.success) {
          userStore.setUser(response.data.user, response.data.token);
          loggedIn.value = true;
          dialog.value = false;
          return { success: true };
        } else {
          alert('Login not successful. Please check your credentials.');
          return { success: false };
        }
      } catch (error) {
        alert('Login failed. Please check your credentials.');
        return { success: false, error };
      }
    } else {
      // Registration
      try {
        await axios.post('https://antaligyongyi.hu/api/user/create', {
          firstname: firstname.value,
          name: name.value,
          email: email.value,
          phone: '',
          rolle: 'user',
          adress: '',
          psw: password.value,
        });
        alert('Registration successful. You can now log in.');
        firstname.value = '',
        name.value = '',
        email.value = '',
        password.value = '',
        loggedIn.value = false;
        this.$user.name.value = '';
        this.$user.role.value = '';
        isLogin.value = true;
        gdpr.value = false;
        dialog.value = false;
        return { success: true };
      } catch (error) {
        return { success: false, error };
      }
    }
  }
  // manage language change
  function changeLanguage(event) {
    selectedLanguage.value = event.target.value;
    document.documentElement.lang = selectedLanguage.value;
  }
  // toggleFunction for Menu
  function toggleFunction() {
    var x = document.getElementById("navMenu");
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