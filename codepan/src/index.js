import './polyfill'
import Vue from 'vue'
import Tippy from 'v-tippy'
// @ is the path to `./src` folder
import App from '@/components/App'
import router from '@/router'
import store from '@/store'

import io from 'socket.io-client';
const socket = io('localhost:3001');


Vue.config.productionTip = false

Vue.use(Tippy, {
  position: 'bottom'
})

let app = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

socket.on('connect', () => {
  console.log(socket.id);
  app.$store.dispatch('setSocketId', socket.id);
});

if (process.env.NODE_ENV === 'production') {
  require('./pwa')
}

export {
  socket
}
