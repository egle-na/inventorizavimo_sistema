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
    z-index: 1;
    padding: .8em 5%;
    width: 100%;
    background-color: var(--clr-accent);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  }

  .teltonika-logo {
    margin-right: auto;
    height: 30px;
  }

</style>