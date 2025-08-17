<template>
    <!-- Container (Methode Section) -->
    <div class="w3-content w3-container " id="story">
        <h3 class="w3-center">{{methodeName[selectedLanguage]}}</h3>
        <div 
            class="w3-center w3-padding-16"
            v-html="methodeText">
        </div>
    </div>
</template>
<script setup>

// language change
import { ref, reactive } from 'vue';
const selectedLanguage = ref(document.documentElement.lang || 'hu');
    const methodeName = reactive({
        en: 'Methode',
        hu: 'Módszer',
        de: 'Methode'
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
    const methodeText = ref('');
    const loadMethodeText = async () => {
        try {
            const response = await fetch(`https://yowayoli.com/api/uploads/methodeText_${selectedLanguage.value}.html`);
            const text = await response.text();
            methodeText.value = text;
        } catch (error) {
            methodeText.value = 'Error loading text.';
        }
    }
    onMounted(methodeText);
    watch(selectedLanguage, () => {
        loadMethodeText();
    });
</script>
