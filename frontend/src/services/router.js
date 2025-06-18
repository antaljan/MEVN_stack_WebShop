import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../view/LandingPage.vue' 

const routes = [
    {
        path: '/',
        name: 'LandingPage',
        component: LandingPage
    },
    // Weitere Routen hier...
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router