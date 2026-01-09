<template>
    <div
        class="hero-container w3-display-container w3-opacity-min"
        :style="{
            backgroundImage: `url(${backgroundUrl})`
        }"
    >
        <!-- CENTER TEXT -->
        <div class="w3-display-middle hero-text">
            <!-- Desktop -->
            <span class="hero-title w3-hide-small">{{ content.title }}</span><br />
            <span class="hero-subtitle w3-hide-small">{{ content.subtitle }}</span>
            <!-- Mobile -->
            <span class="hero-title-small w3-hide-medium w3-hide-large">{{ content.title }}</span><br />
            <span class="hero-subtitle-small w3-hide-medium w3-hide-large">{{ content.subtitle }}</span>
        </div>
        <!-- CTA (only if text exists) -->
        <div
            v-if="content.ctaText"
            class="w3-display-bottomleft w3-padding-large w3-animate-opacity cta-wrapper"
        >
            <a :href="content.ctaLink" class="cta-link">
                {{ content.ctaText }}
            </a>
        </div>
     </div>
    <!-- Admin: image upload -->
    <div v-if="userStore.role === 'admin'" class="w3-padding">
        <label>Hero background image:</label>
        <input type="file" @change="onImageSelected" />
    </div>
    <!-- Admin: toggle editor -->
    <div v-if="userStore.role === 'admin'" class="w3-padding">
        <v-btn color="primary" @click="showEditor = !showEditor">
            {{ showEditor ? 'Close Editor' : 'Edit Hero Section' }}
        </v-btn>
    </div>
    <!-- Admin: editor panel -->
    <v-form v-if="showEditor" class="pa-4 mt-4 editor-panel" elevation="2">
        <v-text-field v-model="content.title" label="Title"></v-text-field>
        <v-text-field v-model="content.subtitle" label="Subtitle"></v-text-field>
        <v-text-field v-model="content.ctaText" label="CTA Text"></v-text-field>
        <v-text-field v-model="content.ctaLink" label="CTA Link"></v-text-field>
        <v-btn color="primary" class="mt-4" @click="saveContent">
            Save Hero Content
        </v-btn>
    </v-form>
</template>

<script setup>
    import { ref, onMounted, computed } from "vue";
    import axios from "axios";
    import { useUserStore } from "@/services/userStore";

    const props = defineProps({
        sectionKey: { type: String, required: true }
    });
    const BASE_URL = "https://antaligyongyi.hu/api";
    const userStore = useUserStore();
    const selectedLanguage = ref(document.documentElement.lang || "hu");
    const showEditor = ref(false);
    const content = ref({
        title: "",
        subtitle: "",
        ctaText: "",
        ctaLink: "",
        backgroundImage: ""
    });
    const backgroundUrl = computed(() => {
        if (content.value.backgroundImage) {
        return `${BASE_URL}${content.value.backgroundImage}`;
        }
        // Fallback a régi statikus képre
        return "https://antaligyongyi.hu/forestbridge.jpg";
    });

    // Load content
    async function loadContent() {
        try {
            const response = await axios.get(
                `${BASE_URL}/content/${props.sectionKey}/${selectedLanguage.value}`
            );
        content.value = {
            title: response.data.title || "",
            subtitle: response.data.subtitle || "",
            ctaText: response.data.ctaText || "",
            ctaLink: response.data.ctaLink || "",
            backgroundImage: response.data.backgroundImage || ""
        };
        } catch (err) {
            console.error(`Failed to load hero content for ${props.sectionKey}:`, err);
        }
    }

    onMounted(loadContent);

    // Watch language changes
    const observer = new MutationObserver(() => {
        selectedLanguage.value = document.documentElement.lang;
        loadContent();
    });
    observer.observe(document.documentElement, { attributes: true });

    // Image upload
    async function onImageSelected(event) {
        const file = event.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("image", file);
        try {
            const token = localStorage.getItem("jwt");
            const response = await axios.post(
                `${BASE_URL}/content-upload`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            content.value.backgroundImage = response.data.path + "?t=" + Date.now();
        } catch (err) {
            console.error("Image upload failed:", err);
        }
    }

    // Save content
    async function saveContent() {
    try {
        const token = localStorage.getItem("jwt");
        await axios.put(
            `${BASE_URL}/content/${props.sectionKey}/${selectedLanguage.value}`,
            content.value,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Hero content saved!");
        await loadContent();
    } catch (err) {
        console.error(`Saving hero content failed for ${props.sectionKey}:`, err);
        alert("Error saving hero content");
    }
    }
</script>

<style scoped>
.hero-container {
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    min-height: 600px;
    max-height: 100%;
}
.hero-text {
    white-space: nowrap;
}
.hero-title {
    color: white;
    padding: 12px;
    background: black;
    font-size: 32px;
    font-weight: bold;
}
.hero-subtitle {
    color: white;
    padding: 12px;
    font-size: 28px;
}
.hero-title-small {
    color: white;
    padding: 8px;
    background: black;
    font-size: 16px;
}
.hero-subtitle-small {
    color: white;
    padding: 8px;
    font-size: 14px;
}
.admin-toggle {
    position: absolute;
    top: 60px;
    right: 10px;
}
.editor-panel {
    background: white;
    border-radius: 8px;
}
.cta-wrapper {
    color: white;
}
.cta-link {
    color: white;
    padding: 8px 16px;
    background: rgba(0, 0, 0, 0.7);
    text-decoration: none;
    font-size: 18px;
}
.cta-link:hover {
    background: white;
    color: black;
}
</style>
