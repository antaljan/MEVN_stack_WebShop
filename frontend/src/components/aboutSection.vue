<template>
    <div id="about"
    v-html="aboutText">
    </div>
</template>
<script setup>
    import { ref, onMounted,watch } from 'vue'
    const aboutText = ref('')
    const selectedLanguage = ref(document.documentElement.lang || 'hu');

// language change
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === "lang") {
                selectedLanguage.value = document.documentElement.lang;
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true });
// load text based on language
    const loadaboutText = async () => {
        const response = await fetch(`/aboutText_${selectedLanguage.value}.html`)
        aboutText.value = await response.text()
    }
    onMounted(loadaboutText);
    watch(selectedLanguage, () => {
        loadaboutText();
    });
</script>
