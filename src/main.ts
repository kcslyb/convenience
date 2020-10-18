import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import './config/router'
import './config/rem'
import router from './router'
import store from './store'
import http from "@/config/axios"

Vue.config.productionTip = false

Vue.prototype.$service = http
new Vue({
  store,
  router,
  render: (h) => h(App)
}).$mount('#app')
