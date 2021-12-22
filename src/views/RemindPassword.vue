<template>
  <div>
    <header-guest />
    <div class="backdrop">
      <p v-show="passwordResetSent">Slaptažodis išsiųstas elektroniniu pašto adresu: <strong>{{ email }}</strong>.</p>

      <div v-show="!passwordResetSent">
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
  import HeaderGuest from "@/views/HeaderGuest";
  export default {
    name: "RemindPassword",
    components: {HeaderGuest},
    data() {
      return {
        noEmailFound: false,
        passwordResetSent: false,
        email: '',
      }
    },
    methods: {
      remindPassword() {
        this.$http.post("https://inventor-system.herokuapp.com/api/auth/logout",{...this.email})
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
    align-items: center;
    justify-content: center;

    /*background: var(--clr-white);*/
  }

  .form-container {
    position: relative;
    display: flex;
    flex-direction: column;

    margin: auto;
    width: 400px;
  }

  h1 {
    margin-bottom: .7em;
    border-bottom-width: 3px ;
  }

  .form-container button {
    align-self: end;
  }

  .error-msg {
    color: #FF6464;
    visibility: hidden;
  }

  .display {
    visibility: initial;
  }

</style>