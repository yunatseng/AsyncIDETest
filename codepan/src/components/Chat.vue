<template>
  <div class="card mt-3">
      <div class="card-body">
          <div class="card-title">
              <h3>Chat Group</h3>
              <hr>
          </div>
          <div class="card-body">
              <div class="messages" v-for="(msg, index) in messages" :key="index">
                  <p><span class="font-weight-bold">{{ msg.user }}: </span>{{ msg.message }}</p>
              </div>
          </div>
      </div>
      <div class="card-footer">
          <form @submit.prevent="sendMessage">
              <div class="gorm-group">
                  <label for="user">User:</label>
                  <input type="text" v-model="user" class="form-control">
              </div>
              <div class="gorm-group pb-3">
                  <label for="message">Message:</label>
                  <input type="text" v-model="message" class="form-control">
              </div>
              <button type="submit" class="btn btn-success">Send</button>
          </form>
      </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import { socket } from '../index.js';

export default {
    data() {
        return {
            user: '',
            message: '',
            messages: [],
            // socket : io('localhost:3001')
        }
    },
    methods: {
        sendMessage(e) {
            e.preventDefault();

            socket.emit('SEND_MESSAGE', {
                user: this.user,
                message: this.message
            });
            this.message = ''
        }
    },

    mounted() {
      let vuexSocketId = this.$store.state.socketId;
        socket.on('MESSAGE', (data) => {
            this.messages = [...this.messages, data];
            // you can also do this.messages.push(data)
        });
        socket.on('html_code', (data) => {
          if (vuexSocketId === data.id) return;
          if (this.$store.state.html.code === data.code) return;
          this.$store.dispatch('updateCode', { type: 'html', code: data.code });
          this.$store.dispatch('setSenderId', data.id);
          this.$store.dispatch('editorChanged')
          console.log('html')
          console.log(this.$store['html'])
        });
        socket.on('css_code', (data) => {
          if (vuexSocketId === data.id) return;
          if (this.$store.state.css.code === data.code) return;
          this.$store.dispatch('updateCode', { type: 'css', code: data.code });
          this.$store.dispatch('setSenderId', data.id);
          this.$store.dispatch('editorChanged')
        });
        socket.on('js_code', (data) => {
          if (vuexSocketId === data.id) return;
          if (this.$store.state.js.code === data.code) return;
          this.$store.dispatch('updateCode', { type: 'js', code: data.code });
          this.$store.dispatch('setSenderId', data.id);
          this.$store.dispatch('editorChanged')
        });
    }
}
</script>

<style>

</style>
