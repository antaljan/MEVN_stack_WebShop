<template>
    <v-container class="w3-container w3-padding-16 w3-center">
        <div class="w3-content w3-container" id="about">
            <div class="w3-row">
                <div class="w3-col m6 w3-center w3-padding-small">
                    <img
                        :src="aboutImageUrl"
                        class="w3-round w3-image w3-padding-top-24"
                        alt="picture about me"
                        width="500"
                        height="333"
                    />
                <div v-if="userStore.role === 'admin'" class="w3-margin-top">
                    <input type="file" @change="onImageSelected">
                </div>
                </div>
                <div class="w3-col m6 w3-padding-small">
                    <h3 class="w3-center">Gyöngyi Edit Antali</h3>
                    <p class="w3-center"><em>Psychologin, Coach, Lebensstilberaterin und Therapeutin</em></p>
                    <p class="w3-center"><strong>Kompass für eine furchtlose Bewältigung von Herausforderungen</strong></p>
                    <div>
                        <p>
                            Ich betrachte die menschliche Würde, das Recht auf freie Entscheidung und ein Leben ohne Angst als die grundlegendsten Werte.
                        </p><p>
                            Ich glaube daran, dass Veränderungen, Herausforderungen und Krisen mit möglichst wenig Angst, Sorge und Stress erlebt werden können.
                        </p><p>
                            Deshalb arbeite ich daran, dass meine Klient:innen ihre Herausforderungen mit mehr Selbstkenntnis in einem sicheren, unterstützenden und stabilen Umfeld erleben – mit minimaler Angst und gelöster Anspannung.
                        </p><p>
                            Denn das Leben und die Veränderung sollen gelebt werden – nicht gefürchtet!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useUserStore } from '@/services/userStore';

const userStore = useUserStore();

const aboutText = ref('');
const selectedLanguage = ref(document.documentElement.lang || 'hu');

// IMPORTANT: must be a ref
const aboutImageUrl = ref("https://antaligyongyi.hu/avatar_hat.jpg");

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
    const response = await fetch(`/aboutText_${selectedLanguage.value}.html`);
    aboutText.value = await response.text();
};

onMounted(loadaboutText);

watch(selectedLanguage, () => {
    loadaboutText();
});

// upload new picture
const onImageSelected = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await fetch("https://antaligyongyi.hu/api/upload", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.path) {
            // update reactive ref
            aboutImageUrl.value = "https://antaligyongyi.hu" + data.path;
        }
    } catch (err) {
        console.error("Fehler beim Hochladen:", err);
    }
};
</script>
