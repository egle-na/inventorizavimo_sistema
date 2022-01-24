<template>
<div>
  <header-guest />

  <div class="container">

    <!-- After success container -->
    <div v-show="passwordCreated"  class="form-container done-container" >
      <p>{{ $t('login.create-success') }}</p>
      <router-link to="/login">{{ $t('login.login') }}</router-link>
    </div>

    <!-- Main container -->
    <div v-show="!passwordCreated">
      <h2>{{ $t('login.create-password') }}</h2>

      <form-item @onSubmit="createPassword" class="form-container">
        <p v-show="errorMsg" class="error-msg">{{ $t(errorMsg) }}</p>

        <!-- Email input -->
        <input type="email" autocomplete="username" :placeholder="$t('login.email')" required class="input-long" v-model="email"/>

        <!-- New password input -->
        <div class="password-container" >
          <input :type="pswInputType"
                 class="input-long"
                 :placeholder="$t('login.new-password')"
                 autocomplete="new-password"
                 v-model="password"
                 required minlength="6"/>
          <btn-view-eye :pswVisible="pswVisible" @btnClicked="togglePasswordVisibility" />
        </div>

        <!-- New password confirm input -->
        <input type="password" class="input-long"
               :placeholder="$t('login.confirm-password')"
               autocomplete="new-password"
               v-model="passwordConfirm"
               required minlength="6"/>

        <!-- does it match msg -->
        <div class="confirm-msg" v-if="password.length >= 6 && passwordConfirm.length >= 6">
          <p v-if="validPsw">{{ $t('login.psw-match') }}</p>
          <p v-if="!validPsw" class="error-msg">{{ $t('login.psw-dont-match') }}</p>
        </div>

        <button type="submit" class="btn">{{ $t('login.create') }}</button>
      </form-item>

    </div>
  </div>
</div>
</template>

<script>
  import BtnViewEye from "@/components/BtnViewEye";
  import FormItem from "@/components/FormItem";
  import HeaderGuest from "@/components/HeaderGuest";

  export default {
    name: "LogIn",
    components: {
      BtnViewEye,
      FormItem,
      HeaderGuest,
    },
    data() {
      return {
        passwordCreated: false,
        errorMsg: "",
        email: '',
        token: '',
        pswVisible: false,
        password: '',
        passwordConfirm: '',
      }
    },
    created() {
      document.title = this.$t('login.create-password') + this.$t('tab-title_base');
      this.email = this.$route.query.email;
      this.token = this.$route.query.token;
    },
    computed: {
      validPsw(){
        return this.password === this.passwordConfirm;
      },
      pswInputType() {
        return this.pswVisible ? "text" : "password";
      },
    },
    methods: {
      togglePasswordVisibility() {
        this.pswVisible = !this.pswVisible;
      },

      createPassword() {
        if (this.validPsw) {
          this.errorMsg = "";
          this.$http.post(
              this.$store.getters.API_baseURL + "/reset-password",
              {email: this.email, token: this.token, password: this.password}
          ).then(() => {
            this.passwordCreated = true;

          }).catch(error => {
            if (error.response.status === 422) {
              this.errorMsg = "login.errors.create-email";
            } else this.errorMsg = "errors.unknown";
          })

        }
      },

    },
  }
</script>

<style scoped>

  .container {
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
    width: 400px;
    max-width: 95%;
    margin: auto;
  }

  .done-container{
    font-size: 1.1rem;
    align-items: center;
  }

  input{
    margin-bottom: 0;
    margin-top: 1em;
  }

  .password-container {
    position: relative;
    display: flex;
  }

  input[type = email] {
    margin-bottom: 2em;
  }

  h2 {
    border-bottom: none;
    padding: 0;
    margin-bottom: .3em;
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

  .form-container button {
    align-self: flex-end;
  }

  .error-msg {
    margin-top: 1em;
  }

  .confirm-msg p {
    position:  absolute;
    margin-bottom: 0;
  }

  .btn {
    margin-top: 1em;
  }

</style>