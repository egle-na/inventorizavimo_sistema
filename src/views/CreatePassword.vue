<template>
<div>
  <header-guest />

  <div class="backdrop">
    <div v-show="passwordCreated"  class="form-container done-container" >
      <p>Slaptažodis sėkmingai sukurtas!</p>
      <router-link to="/login">Prisijungti</router-link>
    </div>


    <div v-show="!passwordCreated">
      <h1>Susikurti slaptažodį</h1>
      <form class="form-container" @submit.prevent="createPassword">
        <p v-show="isUnrecognized" class="error-msg">{{ isUnrecognized }}</p>


        <input type="email" placeholder="Elektroninis Paštas" required class="input" v-model="email"/>
        <div class="password-container input" >
          <input :type="pswInputType"
                 placeholder="Naujas slaptažodis"
                 required
                 v-model="password"
                 minlength="6"/>
          <button id="show-psw-btn" @click="togglePasswordVisibility" type="button">
            <!--          <img src="../assets/icons/Eye-closed-icon.svg" alt="">-->
            <svg width="32" height="23" viewBox="0 0 32 23" fill="none" xmlns="http://www.w3.org/2000/svg" class="view">
              <path v-show="pswVisible === true" fill-rule="evenodd" clip-rule="evenodd" d="M27.5038 9.95738C19.6757 5.13166 9.70818 5.51187 2.27044 10.9199L1.09427 9.3023C9.18805 3.41726 20.0348 3.00352 28.5534 8.25488L31.0348 9.78461L29.9853 11.4871L27.5038 9.95738Z" fill="#646464"/>
              <path v-show="pswVisible === true" d="M20.7882 8.1666C20.7882 11.3883 18.497 13.9999 15.6706 13.9999C12.8442 13.9999 10.553 11.3883 10.553 8.1666C10.553 4.94494 13.1736 5.49989 16 5.49989C18.8264 5.49989 20.7882 4.94494 20.7882 8.1666Z" fill="#646464"/>
              <path v-show="pswVisible === false" fill-rule="evenodd" clip-rule="evenodd" d="M31.072 10.1664L29.1431 11.95C28.7489 12.3145 28.3439 12.6601 27.9293 12.9867L30.4712 16.528L28.8464 17.6943L26.2981 14.1441C25.125 14.8907 23.8928 15.5017 22.6232 15.9777L24.1409 21.5134L22.2121 22.0422L20.7159 16.5848C19.1657 16.9934 17.5776 17.2111 15.9882 17.2397V22.5556H13.9882V17.1757C12.8301 17.0806 11.6794 16.8846 10.5506 16.5885L8.75956 21.352L6.88751 20.6481L8.64139 15.9834C7.61271 15.5993 6.61029 15.1278 5.64586 14.5693L3.14955 17.7308L1.57987 16.4914L3.9611 13.4756C2.88757 12.6985 1.87599 11.802 0.945279 10.7869L0.26947 10.0499L1.74362 8.69824L2.41943 9.43532C9.12555 16.7494 20.4996 17.2186 27.7853 10.4816L29.7141 8.698L31.072 10.1664Z" fill="#646464"/>
            </svg>
          </button>
        </div>

        <button type="submit" class="btn">Sukurti</button>

      </form>
    </div>

  </div>

<!--</div>-->
</div>
</template>

<script>
  import HeaderGuest from "@/components/HeaderGuest";

  export default {
    name: "LogIn",
    components: {HeaderGuest},
    data() {
      return {
        isUnrecognized: "",
        pswVisible: false,
        passwordCreated: false,
        password: '',
        email: '',
      }
    },
    methods: {
      togglePasswordVisibility() {
        this.pswVisible = !this.pswVisible;
      },

      createPassword() {
        this.isUnrecognized = "";
        this.$http.post(
            this.$store.getters.API_baseURL + "/change-password",
            {email: this.email, token: "token", password: this.password }
        ).then(() => {
          this.passwordCreated = true;
        }).catch(error =>{
          if(error.response.status === 422){
            this.isUnrecognized = "Elektroninio pašto adresas neteisingas arba nuoroda nebegaliojanti.";
            // if( error.response.data.message === "Email does not exist."){
            //   this.isUnrecognized = "Vartotojas su šiuo elekroninio pašto adresu nerastas.";
            // } else {
            //   this.isUnrecognized = "Ši nuoroda neteisinga arba nebegaliojanti.";
            // }
          }
        })
      },

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

    /*background: var(--clr-white);*/
  }

  .form-container {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 360px;

    margin: auto;
  }

  .done-container{
    font-size: 1.1rem;
    align-items: center;
  }

  .input{
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

  h1 {
    margin-bottom: .5em;
    border-bottom-width: 3px;
    padding: 0;
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
    color: #FF6464;
    font-size: 1.2rem;
  }

  #show-psw-btn:hover path{
    fill: var(--clr-accent)
  }

</style>