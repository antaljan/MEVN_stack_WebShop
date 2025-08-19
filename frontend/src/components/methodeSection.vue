<template>
    <v-container class="w3-container w3-padding-16 w3-center">
        <div id="methode" v-html="methodeText"></div>
        <v-btn v-if="userStore.role === 'admin'"
            class="w3-button w3-blue w3-round w3-center"
            @click="dialogMethode = true">
            szerkeztés
        </v-btn>
    </v-container>
    <v-dialog v-model="dialogMethode" max-width="800px">
        <v-card>
            <v-card-title class="headline">Szerkesztés</v-card-title>
            <v-card-text>
                <v-textarea v-model="methodeText" label="Szöveg szerkesztése" auto-grow></v-textarea>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" @click="saveChangesMethode">Mentés</v-btn>
                <v-btn color="primary" @click="dialogMethode = false">Mégse</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup>
    import { ref, onMounted,watch } from 'vue'
    import { useUserStore } from '@/services/userStore'
    const userStore = useUserStore()
    const methodeText = ref('')
    const selectedLanguage = ref(document.documentElement.lang || 'hu');
    const dialogMethode = ref(false)

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

// save changes
    const saveChangesMethode = async () => {
        try {
            await fetch(`/methodeText_${selectedLanguage.value}.html`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: methodeText.value
            });
            dialogMethode.value = false;
            loadmethodeText();
        } catch (error) {
            console.error('Error saving changes:', error);
            alert('Nem sikerült menteni a változtatásokat.');
        }
    }
</script>
