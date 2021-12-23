<template>
  <div>
    <h2>Pridėti Įrangą</h2>

    <form-item @onSubmit="addNewGear">
      <input type="text" placeholder="Pavadinimas" required class="input-long" v-model="newGear.name" >
      <textarea placeholder="Aprašymas" class="input-long" /><!-- nepriskirta -->
      <div>
        <input type="text" placeholder="Kodas" required v-model="newGear.code"><!-- nepriskirta -->
        <input type="text" placeholder="Serijos Numeris" v-model="newGear.serial_number" >
      </div>
      <div class="relative-container">
        <input type="text" placeholder="Kiekis" required ><!-- nepriskirta -->
        <input type="number" step=".01" placeholder="Vieneto Kaina" id="unit-price" required v-model="newGear.unit_price">
        <label for="unit-price" id="euro-sign">€</label>
      </div>

      <div class="btn-container">
        <div>
          <label>
            <input type="radio" name="long-term" value="LongTerm" v-model="longTerm">
            Ilgalaikė įranga
          </label>

          <label>
            <input type="radio" name="long-term" value="ShortTerm" v-model="longTerm">
            Trumpalaikė įranga
          </label>
        </div>

        <button class="btn">Pridėti</button>
      </div>
    </form-item>
  </div>
</template>

<script>
  // import SideMenu from "@/components/SideMenu";
  // import Header from "@/components/Header";
  import FormItem from "@/components/FormItem";
  import DataMixin from "@/components/mixins/DataMixin";

  export default {
    name: "AddItem",
    mixins: [ DataMixin ],
    components: {
      FormItem,
      // Header,
      // SideMenu
    },
    data() {
      return {
        list:[],
        longTerm: "LongTerm",
        newGear: {
          name: '',
          code:'',
          serial_number: '',
          quantity: '',
          unit_price: '',
          // long_term: this.isLongTerm,
          user_id: this.$store.getters.user.id,
        },
      }
    },
    computed: {
      isLongTerm() {
        return this.longTerm === "LongTerm";
      }
    },
    // created() {
    //   this.getData("https://inventor-system.herokuapp.com/api/companies");
    // },
    methods: {
      addNewGear() {
        this.postData(
            'https://inventor-system.herokuapp.com/api/gear',
            { ...this.newGear, long_term: this.isLongTerm},
            this.addGearSuccess,
            this.addGearError )
      },
      addGearSuccess() {
        this.$emit('success');
      },
      addGearError() {

      }
    }
  }
</script>

<style scoped>

  h2 {
    margin-top: 0;
  }

  textarea {
    height: 44px;
    transition: height 400ms;
    resize: vertical;
  }

  textarea:focus {
    height: 90px;
  }

  .relative-container {
    position: relative;
  }

  #euro-sign {
    position: absolute;
    /*top: 50%;*/
    bottom: 60%;
    right: .5em;
    color: grey;
  }

  .btn-container {
    display: flex;
    justify-content: space-between;
  }

  .btn-container label:not(:first-child) {
    margin-top: .9em ;
  }

  .btn-container div{
    color: grey;
    display: flex;
    flex-direction: column;
  }

  .btn-container input{
    width: fit-content;
    margin: 0 1em 0 0;
  }

  .btn-container .btn {
    align-self: flex-end;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
  }
</style>