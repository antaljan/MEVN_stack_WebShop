<template>
  <MyHeader/>
  <div class="w3-container w3-padding-32">
    <v-card class="ma-4 blog-card-spacing" outlined v-if="post">
      <v-row>
        <v-col cols="12" md="4" class="d-flex align-center">
          <v-img
            v-if="post.image"
            :src="post.image"
            height="400px"
            class="blog-image"
          ></v-img>
        </v-col>
        <v-col cols="12" md="8">
          <v-card-title>{{ post.title }}</v-card-title>
          <v-card-subtitle v-if="post.subtitle">
            <v-icon small class="mr-1">mdi-format-quote-close</v-icon>
            {{ post.subtitle }}
          </v-card-subtitle>
          <v-card-subtitle>
            <v-icon small class="mr-1">mdi-account</v-icon> {{ post.author }}
            <v-icon small class="ml-4 mr-1">mdi-calendar</v-icon> {{ formattedDate }}
          </v-card-subtitle>
          <v-card-text>
            <div v-html="post.content" class="blog-content"></div>
          </v-card-text>
          <v-card-actions>
            <v-btn :to="'/landing/#blog'" color="primary" text>
              {{ backToBlogSection[selectedLanguage] }}
            </v-btn>
            <v-btn v-if="userStore.role === 'admin'"
              :to="`/newblog/${post._id}`"
              color="primary" text>
              {{ editBlog[selectedLanguage] }}
            </v-btn>
            <v-btn v-if="userStore.role === 'admin'"
              @click.prevent="deletePost(post)"
              color="primary" text>
              {{ deleteBlog[selectedLanguage] }}
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-card>
    <v-alert v-else type="error" class="ma-4">
      Blogeintrag konnte nicht geladen werden.
    </v-alert>
  </div>
  <MyFooter/>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import MyFooter from "../components/MyFooter.vue";
import MyHeader from "../components/MyHeader.vue";
import { useUserStore } from '@/services/userStore'
const userStore = useUserStore()
const post = ref(null);
const route = useRoute();
const postId = route.params.id;
// Function to format the date
const formattedDate = computed(() => {
  if (!post.value) return "";
  const date = post.value.date || post.value.createdAt;
  return date ? new Date(date).toLocaleDateString() : "";
});
// Function to fetch the blog post by ID
onMounted(async () => {
  try {
    const response = await axios.get(`https://antaligyongyi.hu/api/posts/${postId}`);
    post.value = response.data;
  } catch (error) {
    post.value = null;
    console.error("Fehler beim Laden des Blogposts:", error);
  }
});
// language selection
const selectedLanguage = ref(document.documentElement.lang || 'hu');
const backToBlogSection = {
  en: 'back to blog section',
  hu: 'vissza a blog szekcióhoz',
  de: 'zurück zum Blogbereich'
};
const editBlog = {
  en: 'edit post',
  hu: 'post szerkesztése',
  de: 'post bearbeiten'
};
const deleteBlog = {
  en: 'delete post',
  hu: 'post törlése',
  de: 'post entfernen'
};

// Language change handler
onMounted(() => {
  const langSelect = document.getElementById('langselect');
  if (langSelect) {
    langSelect.value = selectedLanguage.value;
    langSelect.addEventListener('change', (e) => {
      selectedLanguage.value = e.target.value;
      document.documentElement.lang = selectedLanguage.value;
    });
  }
});

// delete post
const deletePost = async (post) => {
  const confirmDelete = confirm(`Biztosan törölni szeretnéd ezt a bejegyzést: "${post.title}"?`);
  if (!confirmDelete) return;
  const token = localStorage.getItem('jwt');
  const config = { headers: { Authorization: `Bearer ${token}`}};
  try {
    await axios.delete(`https://antaligyongyi.hu/api/posts/${post._id}`, config);
    alert("Bejegyzés sikeresen törölve.");
    window.location.href = "/landing/#blog"; // navigálás vissza a bloghoz
  } catch (error) {
    console.error("Hiba a törlés közben:", error);
    alert("Hiba történt a bejegyzés törlésekor.");
  }
}

</script>

<style scoped>
.blog-card-spacing {
  margin-top: 100px;
}
.blog-image {
  width: 100%;
  object-fit: cover;
  border-radius: 4px 4px 0 0;
}
.blog-content p {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.blog-content ul,
.blog-content ol {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

</style>
