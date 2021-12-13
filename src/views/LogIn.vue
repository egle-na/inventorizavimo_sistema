<template>
<!--<div>-->
<!--  <Header />-->

  <div class="backdrop">
    <form class="form-container" @submit.prevent="tryLogin">

      <p v-show="true" class="error-msg">Prisijungimo duomenys neteisngi.</p>

      <input type="email" placeholder="Elektroninis Paštas" required class="first-input"/>
      <div class="password-container">
        <input :type="pswInputType" placeholder="Slaptažodis" required />
        <button id="show-psw-btn" @click="togglePasswordVisibility" type="button">
          <img src="../assets/icons/Eye-closed-icon.svg" alt="">
        </button>
      </div>

      <router-link to="/" >Priminti slaptažodį</router-link>
      <button type="submit" class="btn">Prisijungti</button>

    </form>
  </div>

<!--</div>-->
</template>

<script>
  // import Header from "@/components/Header";
  export default {
    name: "LogIn",
    components: {
      // Header
    },
    data() {
      return {
        pswVisible: false,
      }
    },
    methods: {
      togglePasswordVisibility() {
        this.pswVisible = !this.pswVisible;
      },
      tryLogin() {
        console.log("login");
      }
    },
    computed: {
      pswInputType() {
        return this.pswVisible ? "text" : "password";
      }
    }
  }
</script>

<style scoped>
  .backdrop {
    position: absolute;
    top:0;
    bottom: 0;
    left: 0;
    right: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    background: var(--clr-white);
  }

  .form-container {
    display: flex;
    flex-direction: column;

    width: 360px;
    margin: auto;
  }

  .first-input{
    margin-bottom: 1.5em;
  }

  .password-container {
    position: relative;
    display: flex;
    /*align-items: center;*/
  }

  .password-container input {
    width: 100%;
  }

  #show-psw-btn {
    position: absolute;
    right: 0;
    width: 40px;
  }

  a {
    align-self: end;
    font-size: 0.75rem; /* gal geriau 1rem */
    /*text-align: right;*/
    margin: 1.5em 0;
    color: var(--clr-darker-grey);
    text-decoration: none;
  }

  a:hover {
    color: var(--clr-dark-grey);
    text-decoration: underline;
  }

  .form-container button {
    align-self: end;
  }

  .error-msg {
    color: #FF6464;
  }
</style>