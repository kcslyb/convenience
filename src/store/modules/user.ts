import Vue from 'vue'
import Vuex from 'vuex'
import { removeToken, setToken } from '@/config/auth.ts'
import http from '@/config/axios.ts'
import store from "@/store";

Vue.use(Vuex)

const user = {
  state: {
    userInfo: {}
  },
  mutations: {
    SET_USER: (state: any, userInfo: any) => {
      state.userInfo = userInfo
    },
    RESET_USER: (state: any) => {
      state.userInfo = {}
    }
  },
  actions: {
    // 登录
    Login({ commit, state }: { commit: any, state: any }, loginForm: object) {
      return new Promise((resolve, reject) => {
        http.post('/login', loginForm).then((res) => {
          setToken()
          resolve(res.data)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    // 获取用户信息
    GetInfo({ commit }: { commit: any }) {
      return new Promise((resolve, reject) => {
        http.post('/getInfo').then((res) => {
          if (res.data) {
            // 储存用户信息
            commit('SET_USER', res.data)
            setToken()
            store.dispatch('generateRoutes', res.data.permissions || []).catch((e) => {
              throw Error(e)
            })
            resolve(res.data)
          }
        }).catch((error) => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({ commit }: { commit: any }) {
      return new Promise((resolve) => {
        http.post('/logout').then((data) => {
          commit('RESET_USER')
          removeToken()
          resolve(data.data)
        }).catch((error) => {
          commit('RESET_USER')
          removeToken()
          resolve(error)
        })
      })
    },
    // 登出
    FedLogOut({ commit }: { commit: any }) {
      return new Promise((resolve) => {
        commit('RESET_USER')
        removeToken()
        resolve()
      })
    }
  }
}
export default user

