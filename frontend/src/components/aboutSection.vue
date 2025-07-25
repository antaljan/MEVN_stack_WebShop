<template>
    <!-- Container (About Section) -->
    <div class="w3-content w3-container w3-padding-64" id="about">
        <h3 class="w3-center"><i class="fa fa-user w3-margin-right"></i>{{aboutName[selectedLanguage]}}</h3>
        <p class="w3-center"><em>{{aboutTitle[selectedLanguage]}}</em></p>
        <p>{{aboutText1[selectedLanguage]}}</p>
        <div class="w3-row">
            <div class="w3-col m6 w3-center w3-padding-large">
                <img src="https://yowayoli.com/avatar_hat.jpg" class="w3-round w3-image w3-opacity w3-hover-opacity-off" alt="Photo of Me" width="500" height="333">
            </div>
            <div v-if="userStore.role !== 'admin'"
                class="w3-col m6 w3-padding-large"
                v-html="aboutText2">
            </div>
            <div class="w3-col m6 w3-padding-large">
            <textarea v-if="userStore.role === 'admin'"
                v-model="aboutText2"
                rows="10" 
                cols="80">
            </textarea> 
            <v-button v-if="userStore.role === 'admin'"
                class="w3-button w3-black w3-margin-top"
                @click="saveAboutText2">save
            </v-button>
            </div>
        </div>
    </div>
</template>
<script setup>
// Import userStore for user role and name
import { useUserStore } from '@/services/userStore'
const userStore = useUserStore()

// Reactive state for selected language and about section texts
import { ref, reactive } from 'vue';
// Reactive state for language change
const selectedLanguage = ref(document.documentElement.lang || 'hu');
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
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === "lang") {
                selectedLanguage.value = document.documentElement.lang;
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true });

    import { onMounted, watch } from 'vue';
    const aboutText2 = ref('');
    // Betöltés függvény
    const loadAboutText2 = async () => {
        try {
            const response = await fetch(`/texts/aboutText2_${selectedLanguage.value}.html`);
            const text = await response.text();
            aboutText2.value = text;
        } catch (error) {
            aboutText2.value = 'Error loading text.';
        }
    };
    // Betöltés indítása
    onMounted(loadAboutText2);
    watch(selectedLanguage, () => {
        loadAboutText2();
    });
</script>
