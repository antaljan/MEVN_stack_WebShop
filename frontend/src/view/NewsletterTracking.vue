<template>
    <MyHeader/>
    <v-app>
    <v-container>
    <v-card  class="mx-auto">
        <div class="w3-centered">
            <h2>Hírlevél menedzsment</h2>
        </div>
        <div class="w3-text-small w3-text-left w3-padding-left-24 w3-padding-top-16">
            <div>Hírlevelek száma: {{ summary.totalNewsletters }}</div>
            <div>Feliratkozók száma: {{ subscriberCount }}</div>
            <div>Megnyitások: {{ summary.totalOpened }}</div>
            <div>Kattintások: {{ summary.totalClicks }}</div>        
        </div>
        <!-- switch for changing of list-->
        <div class="w3-center">
            <v-row class="justify-center align-center" no-gutters>
                <v-col cols="auto" class="px-2">
                    <p class="mb-0">Hírlevelek</p>
                </v-col>
                <v-col cols="auto" class="px-2">
                    <v-switch
                        v-model="showList"
                        inset
                        color="primary"
                        @change="handleSwitchChange"
                        hide-details
                    />
                </v-col>
                <v-col cols="auto" class="px-2">
                    <p class="mb-0">Feliratkozók</p>
                </v-col>
            </v-row>
        </div>
        <!-- button for schedule newsletter and templates -->
        <v-card-actions class="w3-padding-top-16" v-if="!showList">
            <v-btn
                color="primary"
                class="w3-button w3-hover-black w3-round-large w3-margin-left-24"
                @click="dialog = true"
            >
                <v-icon left>mdi-email</v-icon>
                Hírlevél küldése
            </v-btn>
            <v-btn
                color="primary"
                class="w3-button w3-hover-black w3-round-large w3-margin-left-24"
                :to="'/newsletterComposer'"
            >
                <v-icon left>mdi-email-newsletter</v-icon>
                Sablon
            </v-btn>
        </v-card-actions>
        <!-- list/table of subscibers -->
        <v-card-text v-if="showList">
            <div class="font-weight-bold ms-1 mb-2">Feliratkozók listája</div>
            <v-data-table
                :headers="[
                    { text: 'Email', value: 'email' },
                    { text: 'Csoport', value: 'group' },
                    { text: 'Regisztráció dátuma', value: 'registrationDate' }
                ]"
                :items="abonements"
                class="elevation-1"
                :items-per-page="5"
            >
                <!-- eslint-disable-next-line vue/valid-v-slot -->
                <template v-slot:item.group="{ item }">
                    <span>{{ item.group || 'Nincs megadva' }}</span>
                </template>
            </v-data-table>
        </v-card-text>
        <!-- chronology list of newsletters -->
        <v-card-text class="w3-padding-top-24" v-else>
            <div class="font-weight-bold ms-1 mb-2">Mai nap</div>
            <v-timeline align="start" density="compact">
                <v-timeline-item
                    v-for="campaign in campaigns"
                    :key="campaign.id"
                    :dot-color="'green'"
                    size="x-small"
                >
                    <div class="font-weight-normal">
                        <strong>{{ campaign.subject }}</strong> - {{ campaign.sendDate }}
                        <br/>
                        Megnyitási arány: {{ campaign.openRate }}%
                        <br/>
                        Kattintási arány: {{ campaign.clickRate }}%
                        <br/>
                        Legnépszerűbb link: {{ campaign.topLink || 'Nincs adat' }}
                    </div>
                    
                </v-timeline-item>
            </v-timeline>
        </v-card-text>
    </v-card>
    <!--dialog for sending newsletter-->
    <v-dialog v-model="dialog" max-width="400px">
    <v-card class="w3-card-4 w3-white w3-round-large">
        <v-card-title class="headline">Hírlevél küldése</v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-col cols="12">
                    <!-- subject -->
                        <v-text-field
                            v-model="subject"
                            label="Hírlevél címe"
                            :rules="[v => !!v || 'Kötelező mező']"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <!-- sending Date-->
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                            v-model="dateInput"
                            label="Küldés dátuma"
                            type="date"
                            :min="today"
                        ></v-text-field>
                        <br/>
                    </v-col>
                </v-row>
                <!--Subscriber list button with filter -->
                <v-row>
                    <v-col cols="12" md="6">
                        <a class="w3-button w3-hover-black w3-left" href="javascript:void(0);" @click="toggleCheckbox" title="Címzettek">Címzettek</a>
                    </v-col>
                    <v-col cols="12" md="6">
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
                <!--Subscriber list toggle -->
                <v-row>
                    <v-col cols="12">
                        <div v-show="showCheckboxes">
                            <v-checkbox 
                                v-for="abo in filteredAbonements"
                                :key="abo._id"
                                :label="abo.name + ' ' + abo.firstname + ' (' + abo.email + ')'"
                                :value="abo"
                                v-model="selectedSubscribers"
                                :rules="[v => !!v || 'Kötelező mező']"
                            ></v-checkbox>
                        </div>
                    </v-col>
                </v-row>
                <br/>
                <!-- Template kiválasztása -->
                <v-row>
                    <v-col cols="12">
                        <v-select
                            v-model="selectedTemplate"
                            :items="templates"
                            item-title="subject"
                            item-value="id"
                            label="Sablon kiválasztása"
                            :rules="[v => !!v || 'Kötelező mező']"
                            class="mt-4"
                        />
                    </v-col>
                </v-row>
            </v-container>
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
    <MyFooter/>
</template>

<script setup>
    import MyHeader from '../components/MyHeader.vue';
    import MyFooter from '../components/MyFooter.vue';
    import { ref, onMounted } from 'vue';
    import axios from 'axios';
    import { computed } from 'vue'
    const showList = ref(false);
    const abonements = ref([]);
    const subject = ref('');
    const scheduledNewsletters = ref([]);
    const subscriberCount = ref(0);
    const nLettersCount = ref(0);
    const dialog = ref(false);
    const selectedTemplate= ref('');
    const templates=ref('');
    const subscriberGruop = ['mind','ujonc', 'tesztelő', 'régi', '...'];
    const selectedSubscribers = ref([])
    const selectedGroup = ref('mind')
    const today = new Date().toISOString().split('T')[0]
    const dateInput = ref(today)
    const templatesCount = ref(0);
    const showCheckboxes = ref(false); 
    const summary = ref({
        totalNewsletters: 0,
        totalSubscribers: 0,
        totalOpened: 0,
        totalClicks: 0
    })
    const campaigns = ref([])

    // load data from backend
    onMounted(async () => {
        const token = localStorage.getItem('jwt') // vagy Pinia store-ból
        const headers = {
            Authorization: `Bearer ${token}`
        }
        try {
            const [summaryRes, campaignsRes] = await Promise.all([
                axios.get('https://antaligyongyi.hu/api/dashboard/summary', { headers }),
                axios.get('https://antaligyongyi.hu/api/dashboard/campaigns', { headers })
            ])
            summary.value = summaryRes.data
            campaigns.value = campaignsRes.data
        } catch (err) {
            console.error('Hiba az adatok lekérésekor:', err)
        }
    })

    // reques subscribers and newsletters from backend
    onMounted(async () => {
        // get subscribers
        try {
            const response = await axios.post('https://antaligyongyi.hu/api/newsletter/subscribers');
            abonements.value = response.data.subscribers;
            subscriberCount.value = abonements.value.length;
        } catch (error) {
            console.error('Failure by loading of Abonements:', error);
        }
        // get scheduled newsletters
        try {
            const response = await axios.post('https://antaligyongyi.hu/api/newsletter/getsceduled');
            scheduledNewsletters.value = response.data.scheduledNewsletters;
            nLettersCount.value = scheduledNewsletters.value.length;
        } catch (error) {
            console.error('Failure by loading of scheduled newsletters:', error);
        }
        // get newsletter tempalates
        try {
            const response = await axios.post('https://antaligyongyi.hu/api/newsletter/gettemplates');
            templates.value = response.data.allNewsletters.map(template => ({
                id: template._id,
                subject: template.subject
            }));
            templatesCount.value = templates.value.length;
        } catch (error) {
            console.error('Failure by loading of scheduled newsletters:', error);
        }
    });


    // handle switch change
    function handleSwitchChange() {
        if (showList.value) {
        // Hírlevelek listája
        console.log('Hírlevelek listája jelenik meg');
        } else {
        // Feliratkozók listája
        console.log('Hírlevelek listája jelenik meg');
        }
    }


    // function submit
    async function submit() {
        if (!subject.value || !selectedTemplate.value || selectedSubscribers.value.length === 0 || !dateInput.value) {
            alert('Kérlek, tölts ki minden mezőt!');
            return;
        }
        try {
            const sendDate = new Date(dateInput.value).toISOString();
            await axios.post('https://antaligyongyi.hu/api/newsletter/send', {
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


    //filter for checkbox
    const filteredAbonements = computed(() => {
        return selectedGroup.value === 'mind'
            ? abonements.value
            : abonements.value.filter(abo => abo.group === selectedGroup.value)
    })


    // toggle checkbox
    function toggleCheckbox() {
        showCheckboxes.value = !showCheckboxes.value;
    }

</script>
