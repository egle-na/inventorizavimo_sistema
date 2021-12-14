<template>
  <div class="grid">

    <Header />

    <side-menu class="side-menu" />

    <main>

      <div class="container-center">
        <h2>Pridėti Įrangą</h2>

        <form-item @onSubmit="onSubmit">
          <input type="text" placeholder="Pavadinimas" required class="input-long">
          <textarea placeholder="Aprašymas" required class="input-long" />
          <div>
            <input type="text" placeholder="Kodas" required >
            <input type="text" placeholder="Serijos Numeris" required >
          </div>
          <div>
            <input type="text" placeholder="Kiekis" required >
            <input type="text" placeholder="Vieneto Kaina" required >
          </div>
          <select class="input-long" required>
            <option selected hidden class="placeholder" value="">Įmonė</option>
            <option v-for="item in 5" :key="item" :value="item">Įmonės Pavadinimas {{item}}</option> <!-- įmonių sąrašas -->
          </select>

          <button class="btn">Pridėti</button>
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
    },
    methods: {
      onSubmit() {
        console.log('hi');
      }
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

  textarea {
    height: 44px;
    transition: height 400ms;
    resize: vertical;
  }

  textarea:focus {
    height: 90px;
  }

</style>