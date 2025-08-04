<template>
  <my-header/>
  <v-app class="w3-centered w3-padding-top-48">
   <v-container>
    <v-row >
      <!--Card for Number of abonement-->
      <v-col cols="12" md="4">
        <v-card
          append-icon="mdi-format-list-bulleted"
          class="mx-auto"
          max-width="344"
          :subtitle="`${subscriberCount} feliratkozó a hírlevelekre`"
          title="Feliratkozók"
          @click="showList = !showList"
          link
        >
        <v-card-text v-if="showList">
          <v-list>
            <v-list-item v-for="abo in abonements" :key="abo._id">
            <v-list-item-title>{{ abo.firstname }} {{ abo.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ abo.email }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
    </v-card-text>
      </v-card>
      </v-col>
      <!--Card for timeline of newsletters-->
      <v-col cols="12" md="4">
        <v-card
          append-icon="mdi-email-newsletter"
          class="mx-auto"
          max-width="344"
          title="Hírlevelek"
          :subtitle="`${nLettersCount} hírlevél készült eddig`"
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
          href="/newsletterComposer"
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
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  // get the subscriber from the API
  const showList = ref(false);
  const abonements = ref([]);
  const subscriberCount = ref(0);
  onMounted(async () => {
    try {
      const response = await axios.post('https://yowayoli.com/api/newsletter/subscribers');
      abonements.value = response.data.subscribers;
      subscriberCount.value = abonements.value.length;
    } catch (error) {
    console.error('Failure by loading of Abonements:', error);
  }
});
  // timeline for newsletters
  const isOpen = ref(false)
  const nLettersCount = ref(0);
  const nLetters = [
    { date: '2025.08.02', from: 'Gyöngyi', title: 'Új kampány indul holnap!', color: 'green' },
    { date: '2025.07.21', from: 'Jani', title: 'Ne felejtsd el tesztelni a sablont!', color: 'blue' },
    { date: '2025.07.10', from: 'Jani', title: 'Indul a Hírlevél szolgáltatás!', color: 'blue' },
    // Ide jöhetnek további üzenetek...
  ]
  nLettersCount.value = nLetters.length;
</script>
<style scoped>
.v-container {
  position: relative;
  min-height: 800px;
  max-height: 100%;
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
  z-index: 0;
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