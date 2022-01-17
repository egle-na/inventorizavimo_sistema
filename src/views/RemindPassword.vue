<template>
  <div>
    <header-guest />
    <div class="backdrop">

      <!-- After success container -->
      <p v-show="passwordResetSent">Slaptažodis išsiųstas elektroniniu pašto adresu: <strong>{{ email }}</strong>.</p>
      <router-link v-show="passwordResetSent" to="/">Prisijungti</router-link>

      <!-- Main container -->
      <div class="container" v-show="!passwordResetSent">
        <h2>Priminti slaptažodį</h2>
        <form class="form-container" @submit.prevent="remindPassword">

          <input type="email" autocomplete="username" placeholder="Elektroninis Paštas" required v-model="email"/>
          <p class="error-msg">{{ errorMsg }}</p>

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
        errorMsg: "",
        passwordResetSent: false,
        email: '',
      }
    },
    created() {
      document.title = "Priminti slaptažodį | Inventorizavimo sistema";
    },
    methods: {
      remindPassword() {
        this.$http.post(this.$store.getters.API_baseURL + "/reset-password-email",{email: this.email})
          .then(() => this.passwordResetSent = true)
          .catch((error) => {
            if(error.response.data.message === "Email does not exist.") {
              this.errorMsg = "Vartotojas šiuo elektroninio pašto adresu nerastas.";
            } else {
              this.errorMsg = "Įvyko klaida.";
            }
          })
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

  h2 {
    margin: 0 0 .7em 0;
    border-bottom-width: 3px;
    padding: 0;
  }

  .form-container button {
    align-self: flex-end;
  }

  .error-msg {
    color: var(--clr-red);
  }

  a {
    font-size: 1.5rem;
    margin: 1em 0;
    font-weight: var(--fw-bold-karla);
    color: var(--clr-darker-grey);
    text-decoration: none;
    width: max-content;
  }

  a:hover {
    color: var(--clr-accent);
    text-decoration: underline;
  }

</style>