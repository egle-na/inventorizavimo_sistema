<template>
  <div>
    <header-guest />
    <div class="backdrop">
      <p v-show="passwordResetSent">Slaptažodis išsiųstas elektroniniu pašto adresu: <strong>{{ email }}</strong>.</p>
      <router-link v-show="passwordResetSent" to="/">Prisijungti</router-link>

      <div class="container" v-show="!passwordResetSent">
        <h1>Priminti slaptažodį</h1>
        <form class="form-container" @submit.prevent="remindPassword">

          <input type="email" placeholder="Elektroninis Paštas" required v-model="email"/>
          <p class="error-msg" :class="{'display': noEmailFound}">Vartotojas šiuo elektroninio pašto adresu nerastas.</p>

          <button type="submit" class="btn">Priminti</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import HeaderGuest from "@/components/HeaderGuest";
  export default {
    name: "RemindPassword",
    components: { HeaderGuest },
    data() {
      return {
        noEmailFound: false,
        passwordResetSent: false,
        email: '',
      }
    },
    methods: {
      remindPassword() {
        this.$http.post(this.$store.getters.API_baseURL + "/reset-password",{email: this.email})
          .then(() => this.passwordResetSent = true)
          .catch(() => this.noEmailFound = true)
      },
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
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    max-width: 90%;
    margin: 0 auto;
  }

  .container {
    max-width: 95%;
    text-align: left;
  }

  .form-container {
    position: relative;
    display: flex;
    flex-direction: column;

    margin: auto;
    width: 400px;
    max-width: 95%;
  }

  h1 {
    font-size: 3.5em;
    margin-bottom: .7em;
    border-bottom-width: 3px ;
    padding: 0;
  }

  .form-container button {
    align-self: flex-end;
  }

  .error-msg {
    color: #FF6464;
    visibility: hidden;
  }

  .display {
    visibility: initial;
  }

  a{
    color: var(--clr-dark-grey);
  }

  a:hover{
    color: var(--clr-accent)
  }

  @media (max-width: 580px){
    h1{
      font-size: 2.5em;
    }
  }

</style>