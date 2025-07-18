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
                    <v-card-subtitle>
                        <v-icon small class="mr-1">mdi-account</v-icon> {{ post.author }}
                        <v-icon small class="ml-4 mr-1">mdi-calendar</v-icon> {{ formattedDate }}
                    </v-card-subtitle>
                    <v-card-text>
                        {{ post.content }}
                    </v-card-text>
                    <v-card-actions>
                        <v-btn text color="primary" @click="$emit('readMore', post.id)">
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
import { ref, computed } from 'vue';
import MyFooter from "../components/MyFooter.vue";
import MyHeader from "../components/MyHeader.vue";

// Post-Objekt manuell belegen
const post = ref({
  id: 1,
  title: "Mein erster Blogpost",
  author: "Max Mustermann",
  createdAt: "2024-07-18T12:00:00Z",
  image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  content: "Das ist der Inhalt meines ersten Blogposts. Hier kannst du beliebigen Text einfügen."
});

const formattedDate = computed(() => {
  return new Date(post.value.createdAt).toLocaleDateString();
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
