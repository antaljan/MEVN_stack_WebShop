<template>
    <MyHeader/>
    <div class="users">
        <h1>Users</h1>
        <ul>
        <li v-for="user in users" :key="user.id">
            {{ user.name }} - {{ user.email }}
        </li>
        </ul>
    </div>
    <MyFooter/>
</template>
<script>
import MyFooter from '@/components/MyFooter.vue';
import MyHeader from '@/components/MyHeader.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';
export default {
    name: 'usersManagement',
    components: {
        MyFooter,
        MyHeader
    },
    setup() {
        const users = ref([]);
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/get-users');
                users.value = response.data;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        onMounted(fetchUsers);
        return { users };
    }
};
</script>