<template>
    <MyHeader/>
    <v-app>
    <v-container class="w3-container w3-padding-64">
    <v-card  class="mx-auto">
        <v-img
            color="surface-variant"
            height="100"
            src="newsletter.webp"
            cover
        >
            <v-toolbar color="transparent">
                <template v-slot:prepend>
                    <v-btn icon="mdi-dots-vertical"></v-btn>
                </template>
                <v-toolbar-title class="w3-text-white">Aktuálisan {{subscriberCount}} feliratkozó a hírlevelekre,</v-toolbar-title>
                <v-toolbar-title class="w3-text-white">és {{nLettersCount}} hírlevél készőlt</v-toolbar-title>
            </v-toolbar>
        </v-img>
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
    </v-card>
    </v-container>
    </v-app>
    <MyFooter/>
</template>

<script setup>
    import MyHeader from '../components/MyHeader.vue';
    import MyFooter from '../components/MyFooter.vue';
    import { ref, onMounted } from 'vue';
    import axios from 'axios';
    //import { computed } from 'vue'
    //const showList = ref(false);
    const abonements = ref([]);
    //const subject = ref('');
    const scheduledNewsletters = ref([]);
    const subscriberCount = ref(0);
    //const isOpen = ref(false)
    const nLettersCount = ref(0);
    //const dialog = ref(false);
    //const selectedTemplate= ref('');
    const templates=ref('');
    //const subscriberGruop = ['mind','ujonc', 'tesztelő', 'régi', '...'];
    //const selectedSubscribers = ref([])
    //const selectedGroup = ref('mind')
    //const today = new Date().toISOString().split('T')[0]
    //const dateInput = ref(today)

    // reques subscribers and newsletters from backend
    onMounted(async () => {
        // get subscribers
        try {
            const response = await axios.post('https://yowayoli.com/api/newsletter/subscribers');
            abonements.value = response.data.subscribers;
            subscriberCount.value = abonements.value.length;
        } catch (error) {
            console.error('Failure by loading of Abonements:', error);
        }
        // get scheduled newsletters
        try {
            const response = await axios.post('https://yowayoli.com/api/newsletter/getsceduled');
            scheduledNewsletters.value = response.data.scheduledNewsletters;
            nLettersCount.value = scheduledNewsletters.value.length;
        } catch (error) {
            console.error('Failure by loading of scheduled newsletters:', error);
        }
        // get newsletter tempalates
        try {
            const response = await axios.post('https://yowayoli.com/api/newsletter/gettemplates');
            templates.value = response.data.allNewsletters.map(template => ({
                id: template._id,
                subject: template.subject
            }));
        } catch (error) {
            console.error('Failure by loading of scheduled newsletters:', error);
        }
    });

// function submit
/*async function submit() {
    if (!subject.value || !selectedTemplate.value || selectedSubscribers.value.length === 0 || !dateInput.value) {
      alert('Kérlek, tölts ki minden mezőt!');
      return;
    }
    try {
        const sendDate = new Date(dateInput.value).toISOString();
        await axios.post('https://yowayoli.com/api/newsletter/send', {
          subject : subject.value,
          templateId: selectedTemplate.value,
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
*/

//filter for checkbox
/*const filteredAbonements = computed(() => {
  return selectedGroup.value === 'mind'
    ? abonements.value
    : abonements.value.filter(abo => abo.group === selectedGroup.value)
})
*/

// toggleFunction for Menu
/*  function toggleCheckbox() {
    var x = document.getElementById("checkboxMenu");
    if ( x.className == "w3-hide"){
      x.className = "w3-show"
    }else{
      x.className = "w3-hide"
    }
  }
*/
</script>