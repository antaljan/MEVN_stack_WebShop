<template>
    <v-app>
    <v-app-bar app color="blue" dark class="fixed-header">
        <v-container class="d-flex align-center justify-space-between">
            <v-img src="/MyLogo.png" max-height="40px"></v-img>
            <span class="ml-3 text-h6">Edith Skills Lab</span>
            <v-menu open-on-hover>
                <template v-slot:activator="{ props }">
                <v-btn v-bind="props" text>
                    Szolgáltatások
                </v-btn>
                </template>
                <v-list>
                    <v-list-item v-for="(item, index) in menuItems" :key="index">
                        <v-list-item-title>{{ item.name }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-btn text>Kapcsolat</v-btn>
            <v-btn color="orange" dark>
                Feliratkozás
            </v-btn>
        </v-container>
    </v-app-bar>
    </v-app>
</template>


<script setup>
    import { ref } from "vue";
    const menuItems = ref([
        { name: "Blog" },
        { name: "Oktatások" },
        { name: "Coaching" },
    ]);
</script>

<style>
.fixed-header {
    position: fixed;
    top: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 30px;
    z-index: 1000;
}
</style>
