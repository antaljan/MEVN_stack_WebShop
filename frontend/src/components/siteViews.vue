<template>
    <MyHeader/>
    <v-container class="w3-container">
        <h1>A Weboldal statisztikája</h1>
        <!-- daily logs -->
        <v-table>
            <thead>
                <tr>
                    <th>Dátum</th>
                    <th>Kérések száma</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="log in dailyLogs" :key="log._id">
                    <td>{{ log._id }}</td>
                    <td>{{ log.count }}</td>
                </tr>
            </tbody>
        </v-table>
        <!-- top IP addresses -->
        <v-list>
            <v-list-item v-for="ip in oftenIps" :key="ip._id">
                <v-list-item-title>{{ ip._id }}</v-list-item-title>
                <v-list-item-subtitle>{{ ip.count }} kérés</v-list-item-subtitle>
            </v-list-item>
        </v-list>
        <!--  -->

    </v-container>
    <MyFooter/>
</template>
<script setup>
    import MyHeader from '../components/MyHeader.vue';
    import MyFooter from '../components/MyFooter.vue';
    import { ref, onMounted } from 'vue';
    import axios from 'axios';

    const dailyLogs = ref([]);
    const oftenIps = ref([]);
    const oftenUrls = ref([]);
    const oftenMethods = ref([]);
    
     // get logs summary
    async function  getLogsSummary(){
        try {
            const token = localStorage.getItem('jwt');
            if (!token) {
                console.warn('Nincs token, nem lehet lekérni a felhasználókat.');
                return;
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axios.get('https://antaligyongyi.hu/api/logs/summary', { }, config);
            dailyLogs.value = response.data.dailyLogs;
            oftenIps.value = response.data.oftenIps;
            oftenUrls.value = response.data.oftenUrls;
            oftenMethods.value = response.data.oftenMethods;
        } catch (error) {
            console.error('Failure by loading of scheduled newsletters:', error);
        }
    }

    // load data from backend
    onMounted(() => {
        getLogsSummary();
    });



</script>
