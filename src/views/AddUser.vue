<template>
  <div class="grid">

    <Header />

    <side-menu class="side-menu" />

    <main>

      <div class="container-center">
        <h2>Pridėti darbuotoją</h2>
        <form-item>
          <input type="text" placeholder="Vardas" required>
          <input type="text" placeholder="Pavardė" required>
          <input type="email" placeholder="Elektroninis paštas" class="input-long" required>
          <select class="input-long" required>
            <option selected hidden class="placeholder" value="">Įmonė</option>
            <option v-for="item in 5" :key="item" :value="item">Įmonės Pavadinimas {{item}}</option> <!-- įmonių sąrašas -->
          </select>

          <button class="btn" disabled>Pridėti</button>
        </form-item>

      </div>

    </main>

  </div>
</template>

<script>
  import SideMenu from "@/components/SideMenu";
  import Header from "@/components/Header";
  import FormItem from "@/components/FormItem";

  export default {
    name: "AddUser",
    components: {
      FormItem,
      Header,
      SideMenu
    }
  }
</script>

<style scoped>

  .grid {
    display: grid;
    grid-template: min-content auto / 330px auto;
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

  main {
    align-self: center;
    justify-self: center;
    max-width: 550px;
    margin: 2em;
  }

  h2 {
    border-color: var(--clr-accent);
  }

</style>