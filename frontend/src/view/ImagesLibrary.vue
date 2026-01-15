<template>
  <v-container>
    <v-row>
      <v-col v-for="img in images" :key="img.filename" cols="12" md="3">
        <v-card>
          <v-img :src="img.url" height="150"></v-img>
          <v-card-actions>
            <v-btn color="red" @click="deleteImage(img.filename)">Törlés</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      images: []
    }
  },
  async mounted() {
    this.fetchImages();
  },
  methods: {
    async fetchImages() {
      const res = await fetch('/api/images');
      this.images = await res.json();
    },
    async deleteImage(filename) {
      await fetch(`/api/images/${filename}`, { method: 'DELETE' });
      this.fetchImages();
    }
  }
}
</script>
