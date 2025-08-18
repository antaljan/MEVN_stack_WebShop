<template>
    <div id="customerFB"
    v-html="customerFBText">
    </div>
</template>
<script setup>
    import { ref, onMounted,watch } from 'vue'
    const customerFBText = ref('')
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
    const loadcustomerFBText = async () => {
        const response = await fetch(`/customerFBText_${selectedLanguage.value}.html`)
        customerFBText.value = await response.text()
    }
    onMounted(loadcustomerFBText);
    watch(selectedLanguage, () => {
        loadcustomerFBText();
    });
</script>
