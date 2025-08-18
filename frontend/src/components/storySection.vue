<template>
    <div id="story"
    v-html="storyText">
    </div>
</template>
<script setup>
    import { ref, onMounted,watch } from 'vue'
    const storyText = ref('')
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
    const loadstoryText = async () => {
        const response = await fetch(`/storyText_${selectedLanguage.value}.html`)
        storyText.value = await response.text()
    }
    onMounted(loadstoryText);
    watch(selectedLanguage, () => {
        loadstoryText();
    });
</script>
