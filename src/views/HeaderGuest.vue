<template>
  <header>
    <router-link to="/">
      <img src="../assets/teltonika_logo.png" alt="" class="teltonika-logo">
    </router-link>
  </header>
</template>
<script>
  export default {
    name: 'HeaderGuest'
  }
</script>
<style scoped>

  header {
    position: fixed;
    width: 100%;
    background-color: var(--clr-accent);
    padding: .8em 5%; /* dešinė pusė */
    z-index: 1;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  }

  .teltonika-logo {
    margin-right: auto;
    height: 30px;
  }

  /*.password-container input {*/
  /*  width: 100%;*/
  /*}*/

  /*a {*/
  /*  align-self: end;*/
  /*  font-size: 0.75rem; !* gal geriau 1rem *!*/
  /*  !*text-align: right;*!*/
  /*  margin: 1.5em 0;*/
  /*  color: var(--clr-darker-grey);*/
  /*  text-decoration: none;*/
  /*}*/

  /*a:hover {*/
  /*  color: var(--clr-dark-grey);*/
  /*  text-decoration: underline;*/
  /*}*/

  /*.form-container button {*/
  /*  align-self: end;*/
  /*}*/

  /*#show-psw-btn:hover path {*/
  /*  fill: var(--clr-accent)*/
  /*}*/

</style>