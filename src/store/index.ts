import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import menu from './modules/menu'
import common from './modules/common'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    menu,
    common
  },
  getters: getters
})

export default store
