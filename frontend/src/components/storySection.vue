<template>
    <!-- Container (story Section) -->
    <div class="w3-content w3-container " id="story">
        <h3 class="w3-center"><i class="fa fa-user w3-margin-right"></i>{{storyName[selectedLanguage]}}</h3>
        <div v-if="userStore.role !== 'admin'"
            class="w3-col m6 w3-padding-small"
            v-html="storyText">
        </div>
    </div>
</template>
<script setup>
// Import userStore for user role and name
import { useUserStore } from '@/services/userStore'
const userStore = useUserStore()

// language change
import { ref, reactive } from 'vue';
const selectedLanguage = ref(document.documentElement.lang || 'hu');
    const storyName = reactive({
        en: 'story',
        hu: 'történet',
        de: 'story'
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
