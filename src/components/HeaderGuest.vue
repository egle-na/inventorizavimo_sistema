<template>
  <header>

    <router-link to="/">
      <img src="../assets/teltonika_logo.png" alt="" class="teltonika-logo">
    </router-link>

    <language-switch />

  </header>
</template>

<script>
  import LanguageSwitch from "@/components/LanguageSwitch";
  export default {
    name: 'HeaderGuest',
    components: { LanguageSwitch },
  }
</script>

<style scoped>

  header {
    position: fixed;
    z-index: 1;
    padding: .8em 1em .8em 5%;
    width: 100%;
    background-color: var(--clr-accent);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);

    display: flex;
    justify-content: space-between;
    align-items: center;

  }

  .teltonika-logo {
    margin-right: auto;
    height: 30px;
  }


</style>