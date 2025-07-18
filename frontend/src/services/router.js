import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../view/LandingPage.vue' 
import gdpr from '../view/gdprStatement.vue' 
import commingSoon from '../view/commingSoon.vue'
import blog from '../view/blogRead.vue'

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
        path: '/blog',
        name: 'blog',
        component: blog
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router