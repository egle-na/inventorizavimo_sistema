<template>
<div>

  <header-guest />

  <div class="backdrop">
    <form class="form-container" @submit.prevent="tryLogin">
      <p v-show="errorMsg" class="error-msg">{{ $t(errorMsg) }}</p>

      <!-- Email input -->
      <input type="email" autocomplete="username" :placeholder="$t('login.email')" required class="first-input" v-model="email"/>

      <!-- Password input -->
      <div class="password-container">
        <input :type="pswInputType" autocomplete="current-password" :placeholder="$t('login.password')" required v-model="password" minlength="6"/>
        <btn-view-eye :pswVisible="pswVisible" @btnClicked="togglePasswordVisibility" />
      </div>

      <router-link to="/forgot-password">{{ $t('login.reset-password') }}</router-link>
      <button type="submit" class="btn">{{ $t("login.login") }}</button>
    </form>
  </div>
</div>
</template>

<script>
  import BtnViewEye from "@/components/BtnViewEye";
  import HeaderGuest from "@/components/HeaderGuest";

  export default {
    name: "LogIn",
    components: { BtnViewEye, HeaderGuest },
    data() {
      return {
        errorMsg: false,
        pswVisible: false,
        password: '',
        email: '',
      }
    },
    created() {
      document.title = this.$t('login.login') + this.$t('tab-title_base');
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
          this.$store.commit("setAllUsers", {});
          localStorage.setItem("access_token", response.data.access_token);
          this.$router.push({path: '/user-inventory'});
        }).catch(error => {
          if(error.response.data.error === "Unauthorized"){
            this.errorMsg = "login.errors.data-incorrect";
          } else this.errorMsg = "errors.unknown";
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
    font-size: 0.8rem;
    margin: 1.3em 0;
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
    color: var(--clr-red);
    position: absolute;
    top: -3em;
  }

  #show-psw-btn:hover path{
    fill: var(--clr-accent);
  }

</style>