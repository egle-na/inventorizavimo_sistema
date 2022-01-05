<template>
  <div>
    <h2>Pridėti Įrangą</h2>

    <form-item @onSubmit="addNewGear">
      <input type="text" placeholder="Pavadinimas" required class="input-long" v-model="newGear.name" >
      <textarea placeholder="Aprašymas" class="input-long" v-model="newGear.description" required /><!-- nepriskirta -->
      <div>
        <input type="text" placeholder="Kodas" required v-model="newGear.code">
        <input type="text" placeholder="Serijos Numeris" v-model="newGear.serial_number" required
               :class="{'input-error': errorInput.serial_number}" @focus="delete errorInput.serial_number">
        <p v-if="errorInput.serial_number" class="error-msg">{{ errorInput.serial_number }}</p>
      </div>
      <div class="relative-container">
        <input type="number" step="1" max="50" placeholder="Kiekis" required v-model="newGear.amount" ><!-- nepriskirta -->
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
      <p v-if="errorInput.message" class="error-msg">{{ errorInput.message }}</p>
    </form-item>
  </div>
</template>

<script>
  import FormItem from "@/components/FormItem";
  import DataMixin from "@/components/mixins/DataMixin";

  export default {
    name: "AddItem",
    mixins: [ DataMixin ],
    props: [ 'user' ],
    components: {
      FormItem,
      // Header,
      // SideMenu
    },
    data() {
      return {
        list:[],
        longTerm: "LongTerm",
        errorInput: {},
        newGear: {
          description:'',
          name: '',
          code:'',
          serial_number: '',
          amount: '',
          unit_price: '',
          // long_term: this.isLongTerm,
          user_id: this.user,
        },
      }
    },
    computed: {
      isLongTerm() {
        return this.longTerm === "LongTerm";
      }
    },
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
        this.errorInput = {};
      },
      addGearError(error) {
        this.errorInput = {};
        if (error.response.data.error){
          if(error.response.data.error.serial_number) {
          this.errorInput.serial_number = "Inventorius su tokiu serijos numeriu jau pridėtas";
          }
        }
        if (error.response.data.message === "Gear does not match with other ones with the same code") {
          this.errorInput.message = "Duomenys nesutampa su kitu šio kodo inventoriumi"
        }
        // console.log(error.response.data.message)
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
    width: fit-content;
  }

  @media (max-width: 550px) {
    #euro-sign {
      bottom: 2.9em;
    }
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