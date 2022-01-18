<template>
<div class="msg-container">

  <div v-for="(message, index) in messages"
       :key="index"
       class="msg" :class="{'error-msg': message.errors}">
    <p>
      {{ message.message }}
      <button v-if="message.errors"
              class="error-msg"
              @click="viewErrors(message.errors)"
      >Peržiūrėti klaidas.</button>
    </p>
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
      EventBus.$on('displayErrorsMessage', this.showErrors);
    },
    beforeDestroy() {
      EventBus.$off('displayMessage');
      EventBus.$off('displayErrorsMessage');
    },
    methods: {
      showMessage(message){
        this.messages.push({message});
        setTimeout(() => {
          this.messages.shift();
        }, 8000);
      },
      showErrors(message, errors){
        this.messages.push({message, errors});
        setTimeout(() => {
          this.messages.shift();
        }, 25000);
      },
      viewErrors(errors) {
        EventBus.$emit('viewErrors', errors)
      }
    },
  }
</script>

<style scoped>

  button {
    font-family: inherit;
  }

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

  .error-msg {
    color: var(--clr-red);
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