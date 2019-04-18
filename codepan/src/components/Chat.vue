<template>
  <div class="card mt-3">
    <div class="card-body">
      <div class="card-title">
        <h3>意見交流區</h3>
        <hr>
      </div>
      <div class="card-body">
        <div class="messages" v-for="(msg, index) in messages" :key="index">
          <p>
            <span class="font-weight-bold">{{ msg.user }}:</span>
            {{ msg.message }}
          </p>
        </div>
      </div>
    </div>
    <div class="card-footer">
      <form @submit.prevent="sendMessage">
        <div class="gorm-group">
          <label for="user">使用者名稱:</label>
          <input type="text" v-model="user" class="form-control">
        </div>
        <div class="gorm-group pb-3">
          <label for="message">訊息:</label>
          <input type="text" v-model="message" class="form-control">
        </div>
        <button type="submit" class="btn btn-success">送出</button>
      </form>
    </div>
  </div>
</template>

<script>
// import io from "socket.io-client";

export default {
  data() {
    return {
      user: "",
      message: "",
      messages: []
      // socket: io("localhost:3001")
    };
  },
  methods: {
    sendMessage(e) {
      e.preventDefault();

      const messageData = {
        user: this.user,
        message: this.message,
        status: (this.status = "message")
      };

      // this.messages.push(messageData);

      this.$socket.emit("SEND_MESSAGE", messageData);
      this.message = "";
    }
  },
  mounted() {
    let vuexSocketId = this.$store.state.socketId;
    this.sockets.subscribe("MESSAGE", data => {
      this.messages = [...this.messages, data];
      // you can also do this.messages.push(data)
    });

    this.sockets.subscribe("code", data => {
      // if (vuexSocketId === data.id) return;
      // console.log(data);
      Object.keys(data.settings).forEach(el => {
        if (this.$store.state[el].code === data.settings[el].code) return;
        this.$store.dispatch("updateCode", {
          type: el,
          code: data.settings[el].code,
          position: data.settings[el].position
        });
      });
      this.$store.dispatch("setSenderId", data.id);
      this.$store.dispatch("editorChanged");
    });

    this.sockets.subscribe("fontsize", data => {
      this.$store.dispatch("getFontSize", data);
      // console.log("change font size");
    });

    // this.socket.on("html_code", data => {
    //   this.$store.dispatch("updateCode", { type: "html", code: data });
    //   this.$store.dispatch("editorChanged");
    //   console.log("html");
    //   console.log(this.$store["html"]);
    // });
    // this.socket.on("css_code", data => {
    //   this.$store.dispatch("updateCode", { type: "css", code: data });
    //   this.$store.dispatch("editorChanged");
    // });
    // this.socket.on("js_code", data => {
    //   this.$store.dispatch("updateCode", { type: "js", code: data });
    //   this.$store.dispatch("editorChanged");
    // });
  }
};
</script>

<style>
</style>
