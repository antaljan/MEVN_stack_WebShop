<template>
    <!-- First</template> Parallax Image with Logo Text -->
    <div class="bgimg-1 w3-display-container w3-opacity-min" id="home">
        <div class="w3-display-middle" style="white-space:nowrap;">
            <!-- Hero Text for medium&large screen -->
            <span class="w3-center w3-padding-large w3-black w3-xlarge w3-wide w3-animate-opacity w3-hide-small">Your way is your life</span><br/>
            <span class="w3-center w3-hover-white w3-padding-large w3-text-white w3-xlarge w3-wide w3-animate-opacity w3-hide-small">{{captionText[selectedLanguage]}}</span>
            <!-- Hero Text for small screen -->
            <span class="w3-center w3-padding-large w3-black w3-small w3-wide w3-animate-opacity w3-hide-medium w3-hide-large">Your way is your life</span><br/>
            <span class="w3-center w3-bottom w3-hover-white w3-padding-large w3-text-white w3-tiny w3-wide w3-animate-opacity w3-hide-medium w3-hide-large">{{captionText[selectedLanguage]}}</span>
        </div>
        <!-- Hero contact -->
        <div class="w3-display-bottomleft w3-padding-large w3-text-white w3-xlarge w3-animate-opacity">
            <a href="#contact">{{captionContact[selectedLanguage]}}</a>
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
    const captionContact = reactive({
        en: 'contact me',
        hu: 'lépj velem kapcsolatba',
        de: 'kontaktiere mich'
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

