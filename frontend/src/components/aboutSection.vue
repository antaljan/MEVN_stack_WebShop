<template>
    <!-- Container (About Section) -->
    <div class="w3-content w3-container " id="about">
        <div class="w3-row">
            <div class="w3-col m6 w3-center w3-padding-small">
                <img src="https://yowayoli.com/avatar_hat.jpg" class="w3-round w3-image w3-padding-top-24" alt="Photo of Me" width="500" height="333">
            </div>
            <div class="w3-col m6 w3-padding-small">
                <h3 class="w3-center">{{aboutName[selectedLanguage]}}</h3>
                <p class="w3-center"><em>{{nameTitle[selectedLanguage]}}</em></p>
                <h3 class="w3-center">{{aboutTitle[selectedLanguage]}}</h3>
                <div
                    v-html="aboutText2">
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
// language change
import { ref, reactive } from 'vue';
const selectedLanguage = ref(document.documentElement.lang || 'hu');
    const aboutName = reactive({
        en: 'Edit Gyöngyi Antali',
        hu: 'Antali Gyöngyi Edit',
        de: 'Edit Gyöngyi Antali'
    });
    const nameTitle = reactive({
        en: 'Psychologist, Coach, Lifestyle Consultant and Therapist',
        hu: 'Pszichológus, Coach, Életmód-tanácsadó és terapeuta',
        de: 'Psychologe, Coach, Lifestyle-Berater und Therapeutin'
    });
    const aboutTitle = reactive({
        en: 'compass for fearless challenge management',
        hu: 'Iránytű a félelem nélküli kihíváskezeléshez',
        de: 'Kompass für die Herausforderung ohne Angst'
    });
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === "lang") {
                selectedLanguage.value = document.documentElement.lang;
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true });
    // loading aboutText2
    import { onMounted, watch } from 'vue';
    const aboutText2 = ref('');
    const loadAboutText2 = async () => {
        try {
            const response = await fetch(`https://yowayoli.com/api/uploads/aboutText2_${selectedLanguage.value}.html`);
            const text = await response.text();
            aboutText2.value = text;
        } catch (error) {
            aboutText2.value = 'Error loading text.';
        }
    }
    onMounted(loadAboutText2);
    watch(selectedLanguage, () => {
        loadAboutText2();
    });
</script>
