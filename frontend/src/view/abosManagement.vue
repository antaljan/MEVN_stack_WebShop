<template>
  <my-header/>
  <v-app>
  <v-container class="w3-centered w3-padding-top-48">
    <v-row >
      <!--Card for Number of abonement-->
      <v-col cols="12" md="4">
        <v-card
          append-icon="mdi-format-list-bulleted"
          class="mx-auto"
          max-width="344"
          :subtitle="`${subscriberCount} ember iratkozott fel a hírlevélre`"          
          title="Feliratkozók"
          link
        ></v-card>
      </v-col>
      <!--Card for timeline of newsletters-->
      <v-col cols="12" md="4">
        <v-card
          append-icon="mdi-email-newsletter"
          class="mx-auto"
          max-width="344"
          title="Hírlevelek"
          subtitle="Hírlevelek listája időrendben"
          @click="isOpen = !isOpen"
          style="cursor: pointer"
        >
        <v-expand-transition>
          <div v-show="isOpen">
            <v-card-text>
              <div class="font-weight-bold ms-1 mb-2">Mai nap</div>
              <v-timeline align="start" density="compact">
                <v-timeline-item
                  v-for="letter in nLetters"
                  :key="letter.date"
                  :dot-color="letter.color"
                  size="x-small"
                >
                <div class="mb-4">
                  <div class="font-weight-normal">
                    <strong>{{ letter.date }}</strong> @{{ letter.from }}
                  </div>
                  <div>{{ letter.title }}</div>
                </div>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </div>
        </v-expand-transition>
      </v-card>
      </v-col>
      <!--Card for creat a new newsletter-->
      <v-col cols="12" md="4">
        <v-card
          append-icon="mdi-open-in-new"
          class="mx-auto"
          href="#"
          max-width="344"
          rel="noopener"
          subtitle="ide kattinva készíthetsz hírlevelet"
          target="_blank"
          title="Hírlevél készítése"
        ></v-card>
      </v-col>
    </v-row>
  </v-container>
  </v-app>
  <my-footer/>
</template>

<script setup>
  import MyHeader from '../components/MyHeader.vue';
  import MyFooter from '../components/MyFooter.vue';
  import { ref } from 'vue';
  import { onMounted } from 'vue';
  import axios from 'axios';
  // get the subscriber from the API
  const abonements = ref([]);
  onMounted(async () => {
    try {
      const response = await axios.post('https://yowayoli.com/newsletter/subscribers/')
      abonements.value = response.data;
      subscriberCount = abonements.count;
    } catch (error) {
      console.error('Failure by loding of Abonnements:', error);
    }
  });
  // timeline for newsletters
  const isOpen = ref(false)
  const nLetters = [
    { date: '2025.08.02', from: 'Gyöngyi', title: 'Új kampány indul holnap!', color: 'green' },
    { date: '2025.07.21', from: 'Jani', title: 'Ne felejtsd el tesztelni a sablont!', color: 'blue' },
    { date: '2025.07.10', from: 'Jani', title: 'Indul a Hírlevél szolgáltatás!', color: 'blue' },
    // Ide jöhetnek további üzenetek...
  ]
</script>
<style scoped>
.v-container {
  position: relative;
  min-height: 800px;
  max-height: 100%;
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
  z-index: 1;
}

.v-container::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url('https://media.istockphoto.com/id/879447344/photo/newsletter-icon-and-sign-on-computer-key.webp?a=1&b=1&s=612x612&w=0&k=20&c=wSADzSDWWOyeN67nD1IzuEbwlA-aM-4SD9EtoPCnBaU=');
  background-position: center;
  background-size: cover;
  opacity: 0.4; /* <-- Ez szabályozza az átlátszóságot */
  z-index: -1;
}
</style>