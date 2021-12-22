<template>
  <div class="grid">

    <Header />

    <side-menu class="side-menu" />

    <main>

      <div class="container-center">
        <h2>Pridėti Įrangą</h2>

        <form-item @onSubmit="addNewGear">
          <input type="text" placeholder="Pavadinimas" required class="input-long" v-model="newGear.name" >
          <textarea placeholder="Aprašymas" required class="input-long" /><!-- nepriskirta -->
          <div>
            <input type="text" placeholder="Kodas" required ><!-- nepriskirta -->
            <input type="text" placeholder="Serijos Numeris" required v-model="newGear.serial_number" >
          </div>
          <div>
            <input type="text" placeholder="Kiekis" required v-model="newGear.quantity" >
            <input type="text" placeholder="Vieneto Kaina" required v-model="newGear.unit_price">
          </div>
          <select class="input-long" required><!-- nepriskirta -->
            <option selected hidden class="placeholder" value="">Įmonė</option>
            <option v-for="item in list" :key="item.id" :value="item.id">{{ item.name }}</option>
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
  import DataMixin from "@/components/mixins/DataMixin";

  export default {
    name: "AddUser",
    mixins: [ DataMixin ],
    components: {
      FormItem,
      Header,
      SideMenu
    },
    data() {
      return {
        list:[],
        newGear: {
          name: '',
          serial_number: '',
          quantity: '',
          unit_price: '',
          long_term: '',
          user_id: '',
        },
      }
    },
    created() {
      this.getData("https://inventor-system.herokuapp.com/api/companies");
    },
    methods: {
      addNewGear() {
        this.postData('https://inventor-system.herokuapp.com/api/gear', this.newGear, {name: 'all-inventory'})
      },
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