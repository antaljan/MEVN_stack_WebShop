<template>
    <div id="methode"
    v-html="methodeText">
    </div>
</template>
<script setup>
    import { ref, onMounted,watch } from 'vue'
    const methodeText = ref('')
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
    const loadmethodeText = async () => {
        const response = await fetch(`/methodeText_${selectedLanguage.value}.html`)
        methodeText.value = await response.text()
    }
    onMounted(loadmethodeText);
    watch(selectedLanguage, () => {
        loadmethodeText();
    });
</script>
