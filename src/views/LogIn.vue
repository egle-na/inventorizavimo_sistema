<template>
<div>

  <header-guest />

  <div class="backdrop">
    <form class="form-container" @submit.prevent="tryLogin">
      <p v-show="isUnrecognized" class="error-msg">Prisijungimo duomenys neteisngi.</p>

      <!-- Email input -->
      <input type="email" placeholder="Elektroninis Paštas" required class="first-input" v-model="email"/>

      <!-- Password input -->
      <div class="password-container">
        <input :type="pswInputType" placeholder="Slaptažodis" required v-model="password" minlength="6"/>
        <btn-view-eye :pswVisible="pswVisible" @btnClicked="togglePasswordVisibility">
        </btn-view-eye>
      </div>

      <router-link to="/forgot-password">Priminti slaptažodį</router-link>
      <button type="submit" class="btn">Prisijungti</button>
    </form>
  </div>
</div>
</template>

<script>
  import HeaderGuest from "@/components/HeaderGuest";
  import BtnViewEye from "@/views/BtnViewEye";

  export default {
    name: "LogIn",
    components: {BtnViewEye, HeaderGuest},
    data() {
      return {
        isUnrecognized: false,
        pswVisible: false,
        password: '',
        email: '',
      }
    },

    methods: {
      togglePasswordVisibility() {
        this.pswVisible = !this.pswVisible;
      },

      tryLogin() {
        this.$http.post(this.$store.getters.API_baseURL + '/auth/login',{
          email: this.email,
          password: this.password
        }).then(response => {
          this.$store.commit('setUser', response.data.user);
          localStorage.setItem("access_token", response.data.access_token);

          this.$router.push({path: '/user-inventory'});
        }).catch(err => {
          console.error(err);
          this.isUnrecognized = true;
        })
      }
    },

    computed: {
      pswInputType() {
        return this.pswVisible ? "text" : "password";
      }
    },
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
  }

  .form-container {
    position: relative;
    display: flex;
    flex-direction: column;

    width: 360px;
    max-width: 95%;
    margin: auto;
  }

  .first-input{
    margin-bottom: 1.5em;
  }

  .password-container {
    position: relative;
    display: flex;
  }

  .password-container input {
    width: 100%;
  }

  .show-psw-btn {
    position: absolute;
    right: 2px;
    bottom: .2em;
    width: 40px;
  }

  a {
    align-self: flex-end;
    font-size: 0.75rem; /* gal geriau 1rem */
    margin: 1.5em 0;
    color: var(--clr-darker-grey);
    text-decoration: none;
  }

  a:hover {
    color: var(--clr-dark-grey);
    text-decoration: underline;
  }

  .form-container button {
    align-self: flex-end;
  }

  .error-msg {
    color: #FF6464;
    position: absolute;
    top: -3em;
  }

  #show-psw-btn:hover path{
    fill: var(--clr-accent)
  }


  /* ISTRINTI -----------------  Button hover */

  button img {
    opacity: 1;
    transition: opacity 200ms;
  }

  button img.icon-blue {
    position: absolute;
    opacity: 0;
  }

  button:hover img.icon-blue{
    opacity: 1;
  }

  button:hover img:not(.icon-blue){
    opacity: 0;
  }

  button:not(.add-btn) img:not(.hand) {
    height: 1.35em;
  }

</style>