import router from '@/router'
import store from '@/store/index'
import { getToken } from './auth'
import { Route } from 'vue-router'
const whiteList = ['/login', '/test']
router.beforeEach((to: Route, from: Route, next: any) => {
  if (getToken() === 'JSESSIONID') { // 已经登录
    if (!store.getters.role) {
      store.dispatch('GetInfo').then(() => {
        next({ ...to })
      }).catch(() => {
        next({ path: '/login' })
      })
    }
    next()
  } else if (whiteList.includes(to.path)) { // 如果前往的路径是白名单内的,就可以直接前往
    next()
  } else { // 如果路径不是白名单内的,而且又没有登录,就跳转登录页面
    next({ path: '/login' })
  }
})
