import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../view/LandingPage.vue' 
import gdpr from '../view/gdprStatement.vue' 
import commingSoon from '../view/commingSoon.vue'
import blog from '../view/blogRead.vue'
import newblog from '../view/blogWrite.vue'

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
    {
        path: '/newblog',
        name: 'newblog',
        component: newblog
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router