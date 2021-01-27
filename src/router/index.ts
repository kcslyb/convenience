import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/home/Home.vue'
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
    path: '/test',
    name: 'test',
    component: () => import('@/views/Test.vue')
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
  },
  {
    path: '/record/notepad', // 事件记录
    name: 'Notepad',
    component: () => import('@/views/record/Notepad.vue')
  },
  {
    path: '/record/notepad/option',
    name: 'NotepadForm',
    component: () => import('@/views/record/NotepadForm.vue')
  }
]
const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes
})
export default router
