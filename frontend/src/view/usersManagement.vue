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
<script setup>
    import { ref, onMounted } from 'vue';
    import axios from 'axios';
    import MyFooter from '@/components/MyFooter.vue';
    import MyHeader from '@/components/MyHeader.vue';

    // 💡 Állapotváltozók
    const dialog = ref(false);
    const users = ref([]);
    const valid = ref(false);
    const selectedUserId = ref(null);
    const form = ref(null);

    // ✏️ Felhasználói adatok
    const firstname = ref('');
    const name = ref('');
    const email = ref('');
    const phone = ref('');
    const rolle = ref('');
    const adress = ref('');
    const psw = ref('');

    // 🧾 Táblázat fejléc
    const headers = [
        { title: 'Név', value: 'name' },
        { title: 'Keresztnév', value: 'firstname' },
        { title: 'Email', value: 'email' },
        { title: 'Szerep', value: 'rolle' },
        { title: 'Műveletek', value: 'actions', sortable: false }
    ];

    // 📦 Felhasználók lekérése
    const fetchUsers = () => {
        axios.post('https://yowayoli.com/api/user/get')
            .then(response => {
            users.value = response.data;
        })
        .catch(error => {
            console.error('Error fetching users:', error);
        });
    };
    onMounted(fetchUsers);

    // 🛠 Szerkesztés
    const editUser = (user) => {
        dialog.value = true;
        firstname.value = user.firstname;
        name.value = user.name;
        email.value = user.email;
        phone.value = user.phone;
        rolle.value = user.rolle;
        adress.value = user.adress;
        psw.value = user.psw;
        selectedUserId.value = user._id;
    };

    // ❌ Törlés
    const deleteUser = (userId) => {
        if (confirm("Biztosan törlöd ezt a felhasználót?")) {
            axios.post('https://yowayoli.com/api/user/delete', { id: userId })
            .then(() => {
                fetchUsers();
            })
            .catch(error => {
                console.error('Error deleting user:', error);
            });
        }
    };

    // ✅ Mentés / Frissítés
    const submit = () => {
        if (form.value?.validate()) {
            const userData = {
            firstname: firstname.value,
            name: name.value,
            email: email.value,
            phone: phone.value,
            rolle: rolle.value,
            adress: adress.value,
            psw: psw.value,
        };
        const url = selectedUserId.value
            ? 'https://yowayoli.com/api/user/update'
            : 'https://yowayoli.com/api/user/create';
        const payload = selectedUserId.value
            ? { id: selectedUserId.value, ...userData }
            : userData;
        axios.post(url, payload)
            .then(() => {
                dialog.value = false;
                fetchUsers();
            })
            .catch(error => {
                console.error('Error saving user:', error);
            });
        } else {
            alert('Kérlek töltsd ki az összes kötelező mezőt!');
            return false;
        }
    };
</script>

<style scoped>
    .v-data-table-header {
        background-color: #f0f0f0;
        font-weight: bold;
        color: #000;
    }
</style>