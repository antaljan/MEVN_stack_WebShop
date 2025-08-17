<template>
    <!-- Container (story Section) -->
    <div class="w3-content w3-container " id="story">
        <h3 class="w3-center">{{storyName[selectedLanguage]}}</h3>
        <div
            class="w3-center w3-padding-16"
            v-html="storyText">
        </div>
    </div>
</template>
<script setup>
// language change
import { ref, reactive } from 'vue';
const selectedLanguage = ref(document.documentElement.lang || 'hu');
    const storyName = reactive({
        en: 'Story',
        hu: 'Történet',
        de: 'Story'
    });
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === "lang") {
                selectedLanguage.value = document.documentElement.lang;
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true });
    // loading Text
    import { onMounted, watch } from 'vue';
    const storyText = ref('');
    const loadStoryText = async () => {
        try {
            const response = await fetch(`https://yowayoli.com/api/uploads/storyText_${selectedLanguage.value}.html`);
            const text = await response.text();
            storyText.value = text;
        } catch (error) {
            storyText.value = 'Error loading text.';
        }
    }
    onMounted(loadStoryText);
    watch(selectedLanguage, () => {
        loadStoryText();
    });
</script>
