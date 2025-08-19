<template>
    <MyHeader/>
    <div  class="w3-content w3-container w3-padding-64">
        <div class="w3-col w3-padding-large" v-html="gdprHtml"></div>
    </div>
    <MyFooter/>
</template>
<script setup>
    // Language change
    import MyHeader from "../components/MyHeader.vue";
    import MyFooter from "../components/MyFooter.vue";
    // language selection
    import { ref, onMounted, watch } from 'vue';
    const selectedLanguage = ref(document.documentElement.lang || 'hu');
    // Language change handler
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === "lang") {
                selectedLanguage.value = document.documentElement.lang;
                loadGdprHtml(); // Jetzt wird neu geladen!
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true });
    watch(selectedLanguage, () => {
        loadGdprHtml();
    });
    // loading gdprHtml
    const gdprHtml = ref('');
    const loadGdprHtml = async () => {
        try {
            const response = await fetch(`https://antaligyongyi.hu/api/uploads/gdprStatement_${selectedLanguage.value}.html`);
            const htmlText = await response.text();
            gdprHtml.value = htmlText;
        } catch (error) {
            console.error('❗ Fehler beim Laden der GDPR-Datei:', error);
        }
    };
    // Load GDPR HTML on component mount
    onMounted(() => {
        loadGdprHtml();
    });

</script>