<template>
    <v-container class="w3-container w3-padding-16 w3-center">
        <div id="story" v-html="storyText"></div>
        <v-btn v-if="userStore.role === 'admin'"
            class="w3-button w3-blue w3-round w3-center"
            @click="dialogStory = true">
            szerkeztés
        </v-btn>
    </v-container>
    <v-dialog v-model="dialogStory" max-width="800px">
        <v-card>
            <v-card-title class="headline">Szerkesztés</v-card-title>
            <v-card-text>
                <v-textarea v-model="storyText" label="Szöveg szerkesztése" auto-grow></v-textarea>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" @click="saveChangesStory">Mentés</v-btn>
                <v-btn color="primary" @click="dialogStory = false">Mégse</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup>
    import { ref, onMounted,watch } from 'vue'
    import { useUserStore } from '@/services/userStore'
    const userStore = useUserStore()
    const storyText = ref('')
    const selectedLanguage = ref(document.documentElement.lang || 'hu');
    const dialogStory = ref(false)

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
    
// save changes
    const saveChangesStory = async () => {
        try {
            await fetch(`/storyText_${selectedLanguage.value}.html`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: storyText.value
            });
            dialogStory.value = false;
            loadstoryText();
        } catch (error) {
            console.error('Error saving changes:', error);
            alert('Nem sikerült menteni a változtatásokat.');
        }
    }
</script>
