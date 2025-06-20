<template>
    <!-- First</template> Parallax Image with Logo Text -->
    <div class="bgimg-1 w3-display-container w3-opacity-min" id="home">
        <div class="w3-display-middle" style="white-space:nowrap;">
            <span class="w3-center w3-padding-large w3-black w3-xlarge w3-wide w3-animate-opacity">Your way is your life</span><br/>
            <span class="w3-center w3-hover-white w3-padding-large w3-text-white w3-xlarge w3-wide w3-animate-opacity">{{captionText[selectedLanguage]}}</span>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive } from 'vue';
// Reactive state for language change
const selectedLanguage = ref(document.documentElement.lang || 'hu');
    const captionText = reactive({
        en: '',
        hu: 'A Te utad a Te életed',
        de: 'Dein Weg ist Dein Leben'
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
