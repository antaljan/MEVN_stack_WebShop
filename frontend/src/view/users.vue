<template>
    <my-header/>
    <v-app>
    <v-container>
        <v-row>
            <v-col>
                <h1 class="mb-4">Felhasználók kezelése</h1>
                <v-data-table
                    :headers="headers"
                    :items="users"
                    item-key="id"
                    class="elevation-1"
                >
                <!-- eslint-disable-next-line vue/valid-v-slot -->
                <template v-slot:item.actions="{ item }">
                    <v-icon small class="mr-2" @click="editUser(item)">
                        mdi-pencil
                    </v-icon>
                    <v-icon small color="red" @click="deleteUser(item._id)">
                        mdi-delete
                    </v-icon>
                </template>
                </v-data-table>
            </v-col>
        </v-row>
    </v-container>
    <v-dialog v-model="dialog" max-width="500">
        <v-card>
            <v-card-title class="headline">
                {{ selectedUserId ? 'szerkesztése' : 'új felhasználó hozzáadása' }} : {{ firstname }} {{ name }}
            </v-card-title>
            <v-card-text>
                <v-form ref="form" v-model="valid">
                <v-text-field
                    v-model="firstname"
                    label='Keresztnév'
                    :rules="[v => !!v || 'Firstname is must']"
                    required
                ></v-text-field>
                <v-text-field
                    v-model="name"
                    label='Vezeték név'
                    :rules="[v => !!v || 'Name is must']"
                    required
                ></v-text-field>
                <v-text-field
                    v-model="email"
                    label='E-Mail'
                    :rules="[v => /.+@.+\..+/.test(v) || 'correct E-Mail is required']"
                    required
                ></v-text-field>
                <v-text-field
                    v-model="phone"
                    label='Telefonszám'
                ></v-text-field>
                <v-text-field
                    v-model="rolle"
                    label='Szerep'
                    :rules="[v => /.+@.+\..+/.test(v) || 'correct E-Mail is required']"
                    required
                ></v-text-field>
                <v-text-field
                    v-model="adress"
                    label='Cím'
                ></v-text-field>
                <v-text-field
                    v-model="psw"
                    label='Jelszó'
                ></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green" text @click="submit">
                    Mentés
                </v-btn>
                <v-btn color="grey" text @click="dialog = false">Mégsem</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    </v-app>
    <my-footer/>
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
        const dialog = ref(false);
        const users = ref([]);
        const fetchUsers = async () => {
            try {
                const response = await axios.post('https:yowayoli.com/api/get-users');
                users.value = response.data;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        onMounted(fetchUsers);
        return {
            headers: [
            { title: 'Név', value: 'name' },
            { title: 'Keresztnév', value: 'firstname' },
            { title: 'Email', value: 'email' },
            { title: 'Szerep', value: 'rolle' },
            { title: 'Műveletek', value: 'actions', sortable: false }
            ],
            users: users,
            dialog,
            valid: ref(false),
        };
    },
    methods: {
        editUser(user) {
            this.dialog = true;
            this.firstname = user.firstname;
            this.name = user.name;
            this.email = user.email;
            this.phone = user.phone;
            this.rolle = user.rolle;
            this.adress = user.adress;
            this.psw = user.psw; // Ideally, you should not pre-fill passwords
            this.selectedUserId = user._id; // Store the ID of the user being edited
        },
        deleteUser(userId) {
            if (confirm("Biztosan törlöd ezt a felhasználót?")) {
                axios.post('https:yowayoli.com/api/delete-user', { id: userId })
                    .then(() => {
                        this.fetchUsers();
                    })
                    .catch(error => {
                        console.error('Error deleting user:', error);
                    });
            }
        },
        submit() {
            if (this.$refs.form.validate()) {
                const userData = {
                    firstname: this.firstname,
                    name: this.name,
                    email: this.email,
                    phone: this.phone,
                    rolle: this.rolle,
                    adress: this.adress,
                    psw: this.psw,
                };
                if (this.selectedUserId) {
                    // Update existing user
                    axios.post('https:yowayoli.com/api/update-user', { id: this.selectedUserId, ...userData })
                        .then(() => {
                            this.dialog = false;
                            this.fetchUsers();
                        });
                } else {
                    // Create new user
                    axios.post('https:yowayoli.com/api/create-user', userData)
                        .then(() => {
                            this.dialog = false;
                            this.fetchUsers();
                        });
                }
            }
        },
        fetchUsers() {
            axios.post('https:yowayoli.com/api/get-users')
                .then(response => {
                    this.users = response.data;
                })
                .catch(error => {
                    console.error('Error fetching users:', error);
                });
        }
    }
}
</script>
<style scoped>
    .v-data-table-header {
        background-color: #f0f0f0;
        font-weight: bold;
        color: #000;
    }
</style>