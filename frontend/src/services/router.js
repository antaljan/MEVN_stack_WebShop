import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../view/LandingPage.vue' 
import gdpr from '../view/gdprStatement.vue' 
import commingSoon from '../view/commingSoon.vue'
import blog from '../view/blogRead.vue'
import newblog from '../view/blogWrite.vue'
import { useUserStore } from '@/services/userStore'

const routes = [
    {
        path: '/',
        name: 'commingSoon',
        component: commingSoon
    },
    {
        path: '/landing',
        name: 'LandingPage',
        component: LandingPage
    },
    {
        path: '/gdpr',
        name: 'gdpr',
        component: gdpr
    },
    {
        path: '/blog/:id',
        name: 'blog',
        component: blog
    },
    {
    path: '/newblog',
    name: 'newblog',
    component: newblog,
    beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('jwt');
        const userStore = useUserStore()
        if (!token) {
            alert('no authentication found, redirecting to home');
            next('/landing'); // Weiterleitung, wenn kein Token
        } else if (userStore.role !== 'admin') {
            alert('You do not have permission to access this page.');
            next('/landing'); // Falls Rolle nicht ausreicht
        } else {
            next(); // Alles ok, Zugang erlaubt
        }
    }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router