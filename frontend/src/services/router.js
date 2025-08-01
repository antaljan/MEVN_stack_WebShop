import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../view/LandingPage.vue' 
import gdpr from '../view/gdprStatement.vue' 
import commingSoon from '../view/commingSoon.vue'
import blog from '../view/blogRead.vue'
import newblog from '../view/blogWrite.vue'
import usersMan from '../view/usersManagement.vue'
import abosMan from '../view/abosManagement.vue'

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
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!token || !userData || userData.role !== 'admin') {
            alert('No authentication or insufficient permissions');
            next('/landing');
        } else {
            next();
        }
    }
    },
    {
    path: '/users',
    name: 'users',
    component: usersMan,
    beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('jwt');
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!token || !userData || userData.role !== 'admin') {
            alert('No authentication or insufficient permissions');
            next('/landing');
        } else {
            next();
        }
    }
    },
    {
    path: '/abos',
    name: 'abos',
    component: abosMan,
    beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('jwt');
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!token || !userData || userData.role !== 'admin') {
            alert('No authentication or insufficient permissions');
            next('/landing');
        } else {
            next();
        }
    }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router