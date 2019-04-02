import './polyfill'
import Vue from 'vue'
import Tippy from 'v-tippy'
// @ is the path to `./src` folder
import App from '@/components/App'
import router from '@/router'
import store from '@/store'

import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client';

Vue.config.productionTip = false

Vue.use(Tippy, {
  position: 'bottom'
})

Vue.use(new VueSocketIO({
  debug: true,
  connection: SocketIO('localhost:3001'), //options object is Optional
  vuex: {
    store,
    actionPrefix: "SOCKET_",
    mutationPrefix: "SOCKET_"
  }
})
);

new Vue({

  el: '#app',
  sockets: {
    connect: function () {
        console.log('socket connected')
        // 
    }},
  router,
  store,
  render: h => h(App)
})




if (process.env.NODE_ENV === 'production') {
  require('./pwa')
}
