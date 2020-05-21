import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "about" */ '../views/Register.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "about" */ '../views/Profile.vue')
  },
  {
    path: '/stats',
    name: 'Stats',
    component: () => import(/* webpackChunkName: "about" */ '../views/Stats.vue')
  },
  {
    path: '/my-reviews',
    name: 'MyReviews',
    component: () => import(/* webpackChunkName: "about" */ '../views/MyReviews.vue')
  },
  {
    path: '/add',
    name: 'AddReview',
    component: () => import(/* webpackChunkName: "about" */ '../views/AddReview.vue')
  },
  {
    path: '/post/:id',
    props:true,
    name: 'PostDetail',
    component: () => import(/* webpackChunkName: "about" */ '../views/PostDetail.vue')
  },
  {
    path: '/edit-post/:id',
    props:true,
    name: 'EditPost',
    component: () => import(/* webpackChunkName: "about" */ '../views/EditPost.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
