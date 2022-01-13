<template>
<div class="msg-container">

  <div v-for="(message, index) in messages" :key="index" class="msg">
    <p>{{ message }}</p>
  </div>

</div>
</template>

<script>
  import {EventBus} from "@/main";

  export default {
    name: "SuccessMsgComponent",
    data() {
      return {
        messages: [],
      }
    },
    created() {
      EventBus.$on('displayMessage', this.showMessage);
    },
    methods: {
      showMessage(message){
        this.messages.push(message);
        setTimeout(() => {
          this.messages.shift();
        }, 8000);
      },
    },
  }
</script>

<style scoped>

  .msg-container {
    position: fixed;
    bottom: 1rem;
    left: 1rem;
  }

  .msg {
    position: relative;
    background: var(--clr-white);
    box-shadow: 0 0 10px #aaa;
    padding: .7em 2em;
    border-radius: 10px;
    margin-top: 1em;
  }

  @media (max-width: 580px){
    .msg-container {
      left: 1em;
      right: 1em;
      margin: 0 auto;
      width: fit-content;
    }

    .msg {
      padding: .4em 1.8em;
    }
  }

</style>