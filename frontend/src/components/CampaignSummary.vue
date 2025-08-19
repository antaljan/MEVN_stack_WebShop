<template>
    <MyHeader/>
    <v-container>
    <v-row>
        <v-col cols="12" md="6">
        <v-card>
            <v-card-title>📊 Összesített statisztikák</v-card-title>
            <v-card-text>
                <div>Hírlevelek száma: {{ summary.totalNewsletters }}</div>
                <div>Feliratkozók száma: {{ summary.totalSubscribers }}</div>
                <div>Megnyitások: {{ summary.totalOpened }}</div>
                <div>Kattintások: {{ summary.totalClicks }}</div>
            </v-card-text>
        </v-card>
        </v-col>
        <v-col cols="12" md="6">
        <v-card>
            <v-card-title>📋 Kampányok</v-card-title>
            <v-card-text>
                <v-list>
                    <v-list-item v-for="(campaign, index) in campaigns" :key="index">
                        <v-list-item-title>{{ campaign.subject }}</v-list-item-title>
                        <v-list-item-subtitle>
                            Küldés dátuma: {{ campaign.sendDate }}<br>
                            Megnyitási arány: {{ campaign.openRate }}%<br>
                            Kattintási arány: {{ campaign.clickRate }}%<br>
                            Legnépszerűbb link: {{ campaign.topLink || 'Nincs adat' }}
                        </v-list-item-subtitle>
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
        </v-col>
    </v-row>
    </v-container>
    <MyFooter/>
</template>

<script setup>
    import MyHeader from '../components/MyHeader.vue';
    import MyFooter from '../components/MyFooter.vue';
    import { ref, onMounted } from 'vue'
    import axios from 'axios'

    const summary = ref({})
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
</script>
