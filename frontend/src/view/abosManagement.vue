<template>
    <my-header/>
    <h3 class="w3-center">
        {{aboManTitle[selectedLanguage]}}
    </h3>
    <my-footer/>
</template>
<script setup>
    import MyHeader from '@/components/MyHeader.vue';
    import MyFooter from '@/components/MyFooter.vue';
    import { ref, reactive } from 'vue';
    // Reactive state for language change
    const selectedLanguage = ref(document.documentElement.lang || 'hu');
    const aboManTitle = reactive({
        en: 'Newsletter Management',
        hu: 'Hírlevél kezelés',
        de: 'Newsletter Verwaltung'
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