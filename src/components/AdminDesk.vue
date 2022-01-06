<template>
  <div class="grid">
    <Header />
    <side-menu class="side-menu" />
    <main>

     <slot />

    </main>
  </div>
</template>

<script>
  import SideMenu from "@/components/SideMenu";
  import Header from "@/components/Header";

  export default {
    name: "AdminDesk",
    components: {
      Header,
      SideMenu
    }
  }
</script>

<style scoped>

  .grid {
    display: grid;
    /*grid-template: min-content auto / 330px auto;*/
    grid-template: min-content auto / max-content auto;
    height: 100vh;
  }

  header {
    grid-column: 1 / -1;
    grid-row: 1;
  }

  .side-menu {
    grid-column: 1;
    grid-row: 2 / -1;
  }

  /*main {*/
  /*  justify-self: center;*/
  /*  max-width: 550px;*/
  /*  margin: 2em;*/
  /*}*/

  main {
    width: 95%;
    margin: 0 auto;
    align-self: center;
  }

  @media (max-width: 960px) {

    .grid {
      grid-template: 60px 60px calc(100vh - 120px) / auto;
    }

    .side-menu {
      grid-row: 2 / 3;
    }

  }



</style>