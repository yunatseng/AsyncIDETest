import './polyfill'
import Vue from 'vue'
import Tippy from 'v-tippy'
// @ is the path to `./src` folder
import App from '@/components/App'
import router from '@/router'
import store from '@/store'

import VueSocketIO from 'vue-socket.io'
import socketio from 'socket.io-client'

Vue.config.productionTip = false

Vue.use(Tippy, {
  position: 'bottom'
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

if (process.env.NODE_ENV === 'production') {
  require('./pwa')
}
