<template>
    <MyHeader/>
    <div class="w3-container w3-padding-32">
        <v-card class="ma-4 blog-card-spacing" outlined>
            <v-row>
                <v-col cols="12" md="4" class="d-flex align-center">
                    <v-img :src="post.image" height="200px" v-if="post.image" class="blog-image"></v-img>
                </v-col>
                <v-col cols="12" md="8">
                    <v-card-title>{{ post.title }}</v-card-title>
                    <v-card-subtitle v-if="post.subtitle">
                        <v-icon small class="mr-1">mdi-format-quote-close</v-icon> {{ post.subtitle }}
                    </v-card-subtitle>
                    <v-card-subtitle>
                        <v-icon small class="mr-1">mdi-account</v-icon> {{ post.author }}
                        <v-icon small class="ml-4 mr-1">mdi-calendar</v-icon> {{ formattedDate }}
                    </v-card-subtitle>
                    <v-card-text>
                        {{ post.content }}
                    </v-card-text>
                    <v-card-actions>
                        <v-btn text color="primary" @click="$emit('readMore', post._id)">
                            Weiterlesen
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
        </v-card>
    </div>
    <MyFooter/>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import MyFooter from "../components/MyFooter.vue";
import MyHeader from "../components/MyHeader.vue";

// Leeres Post-Objekt initialisieren
const post = ref({
  _id: "",
  title: "",
  subtitle: "",
  author: "",
  createdAt: "",
  image: "",
  content: ""
});

// Hole die Post-ID aus der Route (z.B. /blog/123)
const route = useRoute();
const postId = route.params.id;

// Lade den Blogpost vom Backend
onMounted(async () => {
  try {
    const response = await axios.get(`https://yowayoli.com/api/posts/${postId}`);
    post.value = response.data;
  } catch (error) {
    console.error("Fehler beim Laden des Blogposts:", error);
  }
});

const formattedDate = computed(() => {
  return post.value.createdAt
    ? new Date(post.value.createdAt).toLocaleDateString()
    : "";
});
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
</style>
