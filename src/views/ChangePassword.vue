<template>
<div>
  <Header />

  <div class="backdrop">
    <div v-show="passwordChanged"  class="form-container done-container" >
      <p>Slaptažodis pakeistas!</p>
      <router-link to="/">Mano Inventorius</router-link>
    </div>

    <div v-show="!passwordChanged" class="form-container">
      <h2>Keisti slaptažodį</h2>

      <form-item @onSubmit="changePassword">
        <p v-show="errorMsg" class="error-msg">{{ errorMsg }}</p>

        <!-- Old password input -->
        <div class="password-container" >
          <input :type="oldPswInputType"
                 class="input-long"
                 placeholder="Dabartinis slaptažodis"
                 v-model="oldPassword"
                 required minlength="6"/>
          <btn-view-eye :pswVisible="oldPswVisible" @btnClicked="togglePasswordVisibility('old')"/>
        </div>

        <!-- New password input -->
        <div class="password-container" >
          <input :type="pswInputType"
                 class="input-long"
                 placeholder="Naujas slaptažodis"
                 v-model="password"
                 required minlength="6"/>
          <btn-view-eye :pswVisible="pswVisible" @btnClicked="togglePasswordVisibility('new')"/>
        </div>
        <p v-show="password.length >= 6 && password === oldPassword" class="error-msg">Naujas slaptažodis sutampa su dabartiniu slaptažodžiu!</p>

        <!-- New password confirm input -->
        <input type="password" class="input-long"
               placeholder="Pakartoti naują slaptažodį"
               v-model="passwordConfirm"
               required minlength="6"/>

        <!-- does it match msg -->
        <div class="confirm-msg" v-if="password.length >= 6 && password !== oldPassword">
          <p v-if="passwordConfirm.length >= 6 && validPsw">Slaptažodžiai sutampa!</p>
          <p v-if="passwordConfirm.length >= 6 && !validPsw" class="error-msg">Slaptažodžiai nesutampa!</p>
        </div>

        <button type="submit" class="btn">Pakeisti</button>
      </form-item>

    </div>
  </div>
</div>
</template>

<script>
  import DataMixin from "@/components/mixins/DataMixin";
  import BtnViewEye from "@/views/BtnViewEye";
  import FormItem from "@/components/FormItem";
  import Header from "@/components/Header";

  export default {
    name: "LogIn",
    mixins: [ DataMixin ],
    components: {
      BtnViewEye,
      FormItem,
      Header,
    },
    data() {
      return {
        passwordChanged: false,
        errorMsg: "",
        oldPswVisible: false,
        oldPassword: '',
        pswVisible: false,
        password: '',
        passwordConfirm: '',
      }
    },
    computed: {
      validPsw(){
        return this.password === this.passwordConfirm;
      },
      pswInputType() {
        return this.pswVisible ? "text" : "password";
      },
      oldPswInputType() {
        return this.oldPswVisible ? "text" : "password";
      },
    },
    methods: {
      togglePasswordVisibility(type) {
        if (type === 'old') {
          this.oldPswVisible = !this.oldPswVisible;
        } else if (type === 'new') {
          this.pswVisible = !this.pswVisible;
        }
      },

      changePassword() {
        if (this.validPsw && this.password !== this.oldPassword) {
          this.errorMsg = "";
          this.$http.post(
              this.$store.getters.API_baseURL + "/change-password",
              { old_password: this.oldPassword, password: this.password },
              this.config
          ).then(() => {
            this.passwordChanged = true;

          }).catch(error =>{
            if(error.response.status === 422){
            this.errorMsg = "Slaptažodis neteisingas";
            }
          })
        } // end if
      },

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

  .password-container:first-of-type {
    margin-bottom: 2.8em;
  }

  .password-container input {
    width: 100%;
  }

  h2 {
    border-bottom: none;
    padding-bottom: 0;
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
    margin-bottom: 0;
  }

  .btn {
    margin-top: 1em;
  }

</style>