<template>
    <div  class="w3-content w3-container w3-padding-64">
        <div class="w3-col w3-padding-large" v-html="gdprHtml"></div>
    </div>
</template>
<script setup>
    // Language change
    import { ref, watch } from 'vue';
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === "lang") {
                selectedLanguage.value = document.documentElement.lang;
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true });
    // loading gdprHtml
    import { onMounted } from 'vue';
    const gdprHtml = ref('');
    const selectedLanguage = ref(document.documentElement.lang || 'hu');
    watch(selectedLanguage, () => {
        document.documentElement.lang = selectedLanguage.value;
    });
    onMounted(async () => {
        try {
            const response = await fetch(`https://yowayoli.com/api/uploads/gdprStatement_${selectedLanguage.value}.html`);
            const htmlText = await response.text();
            gdprHtml.value = htmlText;
        } catch (error) {
            console.error('❗ Fehler beim Laden der GDPR-Datei:', error);
        }
    });
</script>