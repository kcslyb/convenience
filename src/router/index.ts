import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/statistical/analysis',
    name: 'StatisticalAnalysis',
    component: () => import('@/views/statistical-analysis/StatisticalAnalysis.vue')
  },
  {
    path: '/statistical/analysis/option',
    name: 'StatisticalAnalysisForm',
    component: () => import('@/views/statistical-analysis/StatisticalAnalysisForm.vue')
  },
  {
    path: '/entity/relevance',
    name: 'EntityRelevance',
    component: () => import('@/views/entity-relevance/EntityRelevance.vue')
  },
  {
    path: '/entity/relevance/option',
    name: 'EntityRelevanceForm',
    component: () => import('@/views/entity-relevance/EntityRelevanceForm.vue')
  }
]
const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes
})
export default router
