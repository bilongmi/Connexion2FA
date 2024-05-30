import { createRouter, createWebHistory } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'
import RegisterForm from '../components/RegisterForm.vue'
import Verify2FA from '../components/Verify2FA.vue'
import HomeForm from '../components/HomeForm.vue'

const routes = [
  {
    path: '/',
    name: 'RegisterForm',
    component: RegisterForm
  },
  {
    path: '/login',
    name: 'LoginForm',
    component: LoginForm
  },
  {
    path: '/verify-2fa',
    name: 'Verify2FA',
    component: Verify2FA,
    props: true
  },
  {
    path: '/home',
    name: 'HomeForm',
    component: HomeForm
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
