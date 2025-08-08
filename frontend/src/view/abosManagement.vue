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
                  v-for="letter in scheduledNewsletters"
                  :key="letter.sendDate"
                  :dot-color="!letter.sent ? 'red' : 'green'"
                  size="x-small"
                >
                <div class="font-weight-normal">
                  <strong>{{ letter.sendDate }}</strong> - {{ letter.subject }}
                  <v-icon :color="!letter.sent ? 'red' : 'green'" size="small" class="ms-2">
                    {{ !letter.sent ? 'mdi-close-circle' : 'mdi-check-circle' }}
                  </v-icon>
                </div>
              <div v-for="subscriber in letter.subscribers" :key="subscriber.email" class="mb-1">
                <div>{{ subscriber.email }}</div>
              </div>
            </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </div>
        </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>
      <!--action buttons-->
      <v-spacer></v-spacer>
      <br/>
      <v-btn text @click="dialog = true">
        Hírlevél küldése
      </v-btn>
      <v-spacer></v-spacer>
      <br/>
      <v-btn text :to="'/newsletterComposer'">
        Sablon 
      </v-btn>
    <!--dialog for sending newsletter-->
    <v-dialog v-model="dialog" max-width="400">
    <v-card>
      <v-card-title class="headline">Hírlevél küldése</v-card-title>
      <v-card-text>
        
          <!-- subject -->
          <v-text-field
                v-model="subject"
                label="Hírlevél címe"
                :rules="[v => !!v || 'Kötelező mező']"
          ></v-text-field>
          <!-- sending Date-->
              <v-date-picker
                v-model="dateInput"
                title="Küldés igeje"
                header= "válasz egy dátumot"
                :rules="[v => !!v || 'Kötelező mező']"
              >
              </v-date-picker>
          <br/>
          <!--Subscriber lista -->
          <v-row>
            <v-col>
              <a class="w3-button w3-hover-black w3-left" href="javascript:void(0);" @click="toggleCheckbox" title="Címzettek">Címzettek</a>
            </v-col>
            <v-col>
              <v-select
                v-model="selectedGroup"
                :items = "subscriberGruop"
                item-text="name"
                item-value="id"
                label="szűrő"
              ></v-select>
            </v-col>
          </v-row>
          <br/>
          <div id="checkboxMenu" class="w3-hide">
            <v-checkbox 
              id="listSubscribers"
              v-for="abo in filteredAbonements"
              :key="abo._id"
              :label="abo.name + ' ' + abo.firstname + ' (' + abo.email + ')'"
              :value="abo"
              v-model="selectedSubscribers"
              :rules="[v => !!v || 'Kötelező mező']"
            ></v-checkbox>
          </div>
          <br/>
          <!-- Template kiválasztása -->
          <v-select
            v-model="selectedTemplate"
            :hint="selectedTemplate"
            :items="templates"
            :item-title="selectedTemplate"
            :item-value="selectedTemplate"
            label="Sablon kiválasztása"
            :rules="[v => !!v || 'Kötelező mező']"
            class="mt-4"
          ></v-select>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green" text @click="submit">Küldés</v-btn>
        <v-btn color="grey" text @click="dialog = false">Mégsem</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  </v-container>
  </v-app>
  <my-footer/>
</template>

<script setup>
  import MyHeader from '../components/MyHeader.vue';
  import MyFooter from '../components/MyFooter.vue';
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  //import { useDate } from 'vuetify';
  import { computed } from 'vue'
  //const dateAdapter = useDate();
  // get the subscriber from the API
  const showList = ref(false);
  const abonements = ref([]);
  const subject = ref('');
  const scheduledNewsletters = ref([]);
  const subscriberCount = ref(0);
  const isOpen = ref(false)
  const nLettersCount = ref(0);
  const dialog = ref(false);
  //const form = ref(null);
  const dateInput= ref();
  const selectedTemplate= ref('');
  const templates=['...','Kedves {{firstname}}! ez egy teszt üzenet a hírlevél küldő rendszerből.',' '];
  const subscriberGruop = ['ujonc', 'tesztelő', 'régi', '...'];
  const selectedSubscribers = ref([])
  const selectedGroup = ref('mind')

  // reques subscribers and newsletters from backend
  onMounted(async () => {
    try {
      const response = await axios.post('https://yowayoli.com/api/newsletter/subscribers');
      abonements.value = response.data.subscribers;
      subscriberCount.value = abonements.value.length;
    } catch (error) {
    console.error('Failure by loading of Abonements:', error);
  }
  try {
    const response = await axios.post('https://yowayoli.com/api/newsletter/getsceduled');
    scheduledNewsletters.value = response.data.scheduledNewsletters;
    nLettersCount.value = scheduledNewsletters.value.length;
  } catch (error) {
    console.error('Failure by loading of scheduled newsletters:', error);
  }
});
async function submit() {
    if (!subject.value || !selectedTemplate.value || selectedSubscribers.value.length === 0 || !dateInput.value) {
      alert('Kérlek, tölts ki minden mezőt!');
      return;
    }
    try {
        const sendDate = new Date(dateInput.value).toISOString();
        await axios.post('https://yowayoli.com/api/newsletter/send', {
          subject : subject.value,
          rawcontent : selectedTemplate.value,
          subscribers : selectedSubscribers.value,
          sendDate :  sendDate,
          sent : false
        });
        alert('A hírlevél sikeresen elküldve!');
        dialog.value = false;
        return { success: true };
      } catch (error) {
        console.log(error);
        return { success: false, error };
      }
  }


//filter for checkbox
const filteredAbonements = computed(() => {
  return selectedGroup.value === 'mind'
    ? abonements.value
    : abonements.value.filter(abo => abo.group === selectedGroup.value)
})

// toggleFunction for Menu
  function toggleCheckbox() {
    var x = document.getElementById("checkboxMenu");
    if ( x.className == "w3-hide"){
      x.className = "w3-show"
    }else{
      x.className = "w3-hide"
    }
  }

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