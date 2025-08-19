<template>
    <v-container class="w3-container w3-padding-16 w3-center">
        <div id="about" v-html="aboutText"></div>
        <v-btn v-if="userStore.role === 'admin'"
            class="w3-button w3-blue w3-round w3-center"
            @click="dialogAbout = true">
            szerkeztés
        </v-btn>
    </v-container>
    <v-dialog v-model="dialogAbout" max-width="800px">
        <v-card>
            <v-card-title class="headline">Szerkesztés</v-card-title>
            <v-card-text>
                <v-textarea v-model="aboutText" label="Szöveg szerkesztése" auto-grow></v-textarea>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" @click="saveChangesAbout">Mentés</v-btn>
                <v-btn color="primary" @click="dialogAbout = false">Mégse</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
    import { ref, onMounted,watch } from 'vue'
    import { useUserStore } from '@/services/userStore'
    const userStore = useUserStore()
    const aboutText = ref('')
    const selectedLanguage = ref(document.documentElement.lang || 'hu');
    const dialogAbout = ref(false)

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

// save changes
    const saveChangesAbout = async () => {
        try {
            await fetch(`/aboutText_${selectedLanguage.value}.html`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: aboutText.value
            });
            dialogAbout.value = false;
            loadaboutText();
        } catch (error) {
            console.error('Error saving changes:', error);
            alert('Nem sikerült menteni a változtatásokat.');
        }
    }
</script>
