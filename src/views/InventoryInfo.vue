<template>
 <div>
   <Header />

   <main>
     <div class="title-container">
       <h1>{{ list.name }} <span>Paskolintas</span></h1>

       <div class="actions">
         <button @click="actionCardOpen = !actionCardOpen">
           <img src="../assets/icons/action-dots.svg" alt="">
         </button>
         <action-card v-show="actionCardOpen" @close="actionCardOpen = false">
           <button class="action-btn"
                   @click="openSelect('Skolinti')"
           >Skolinti</button>
           <button class="action-btn"
                   @click="openSelect('Perleisti')"
           >Perleisti</button>
           <button class="action-btn" @click="returnCardOpen = true">Grąžinti</button>
           <button class="action-btn" @click="generatePDF">Generuoti PDF</button>
           <button class="action-btn" @click="writeOffCardOpen = true">Nurašyti</button>
         </action-card>
       </div>
     </div>
     <div class="main-content">

       <div class="specs">
         <h3>Aprašymas</h3>
         <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
           tempor incididunt ut labore et dolore magna aliqua. Et ultrices neque
           ornare aenean euismod elementum. Aliquam purus sit amet luctus. Pellentesque
           massa placerat duis ultricies lacus sed. Feugiat in fermentum posuere
           urna nec tincidunt. Tellus in hac habitasse platea.</p>
         <div>
           <h3>Savininkas</h3>
           <p >{{ ownersName }}</p>
         </div>
         <div>
           <h3>Kodas</h3>
           <p>{{ list.code }}</p>
         </div>
         <div>
           <h3>Serijos numeris</h3>
           <p>{{ list.serial_number }}</p>
         </div>
         <div>
           <h3>Vieneto kaina</h3>
           <p>{{ list.unit_price }} €</p>
         </div>

         <div class="btn-container">
           <button class="btn" @click="returnCardOpen = true">Grąžinti</button>
           <button class="btn" @click="openSelect('Skolinti')">Skolinti</button>
           <button class="btn" @click="openSelect('Perleisti')">Perleisti</button>
         </div>
       </div>

       <div class="history">
         <div class="history-title">
           <h3>Istorija</h3>
         </div>
         <table-component>
           <tr v-for="item in 19" :key="item">
             <td>
               <img v-if="true" src="../assets/icons/lend.svg" alt="">
               <img v-else-if="true" src="../assets/icons/return.svg" alt="">
               <img v-else src="../assets/icons/transfer.svg" alt="">
             </td>
             <td>Jonas Jonauskas</td>
             <td>Paskolino</td>
             <td>Petrui Petrauskui</td>
             <td>2021-12-14</td>
           </tr>
         </table-component>

       </div>
     </div>

   </main>

   <select-user v-show="selectUserOpen"
                @close="selectUserOpen = false"
                :type="actionType" />

   <modulus-full v-show="writeOffCardOpen" @close="writeOffCardOpen = false">
     <p>Ar tikrai norite nurašyti <strong>This Item</strong>?</p>
     <button class="btn" @click="writeOffItem">Taip</button>
   </modulus-full>

   <modulus-full v-show="returnCardOpen" @close="returnCardOpen = false">
     <p>Ar esate pasiruošę grąžinti <strong>This Item</strong>?</p>
     <button class="btn" @click="returnItem">Taip</button>
   </modulus-full>

 </div>
</template>

<script>
  import Header from "@/components/Header";
  import ActionCard from "@/components/ActionCard";
  import TableComponent from "@/components/TableComponent";
  import SelectUser from "@/components/SelectUser";
  import ModulusFull from "@/components/ModulusFull";
  import DataMixin from "@/components/mixins/DataMixin";

  export default {
    name: "InventoryInfo",
    mixins: [ DataMixin ],
    components: {
      ModulusFull,
      SelectUser,
      TableComponent,
      ActionCard,
      Header,
    },
    // props: [ 'userId' ],
    data() {
      return {
        actionCardOpen: false,
        selectUserOpen: false,
        writeOffCardOpen: false,
        returnCardOpen: false,
        actionType:'',
        ownersName: '',
        status
      }
    },
    created() {
      this.getData('https://inventor-system.herokuapp.com/api/gear/' + this.$route.params.inventory_id)
    },
    watch: {
      list: function () {
        if(this.list.user_id && !this.ownersName){
          this.$http.get('https://inventor-system.herokuapp.com/api/users/' + this.list.user_id, this.config)
              .then(response => this.ownersName = `${response.data.first_name} ${response.data.last_name}`)
              .catch(error => error.response.message)
        }
      }
    },
    methods: {
      openSelect(action) {
        this.actionType = action;
        this.selectUserOpen = true;
        this.actionCardOpen = false;
      },
      returnItem() {
        console.log('return');
        // if everything is ok:
        this.returnCardOpen = false;
      },
      generatePDF() {
        console.log('PDF sugeneruotas');
        this.actionCardOpen = false;
      },
      writeOffItem() {
        console.log('nurašytas');
        // if everything is ok:
        this.writeOffCardOpen = false;
      }
    }
  }
</script>

<style scoped>

  main {
    width: 90%;
    max-width: 1500px;
    margin: 3em auto;
  }

  .title-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 0;
  }

  h1 {
    line-height: 1;
  }

  h1 span {
    color: var(--clr-grey);
    font-family: var(--ff-bebas-neue);
    font-size: var(--fs-button);
    letter-spacing: 0.065em;
  }

  .actions {
    position: relative;
  }

  .main-content {
    display: flex;
    justify-content: space-between;
    margin-top: 2em;
  }

  .specs{
    width: 40%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .history {
    width: 55%;
    position: relative;
    margin-top: 1.5rem;
    border: solid 3px var(--clr-grey);
    border-radius: 7px;
    /*max-height: 100%;*/
  }

  .specs div {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin: 1em 0;
    border-bottom: solid 2px var(--clr-light-grey);
  }

  .specs div p {
    margin: 0;
  }

  .specs div h3 {
    margin-bottom: -2px;
  }

  .specs .btn-container{
    border: none;
    margin: auto 0 0;
    justify-content: flex-end;
  }
  .specs .btn {
    margin-left: 1em
  }

  .history-title {
    position: absolute;
    top: -1.7em;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .history-title h3 {
    font-size: 2.125rem;
    border-bottom: 0;
    border-radius: 5px;
    padding: 0 .2em;
    background: var(--clr-white);
    color: var(--clr-dark-grey);
  }

  td {
    padding: .7em;
    border: none;
    border-bottom: solid 2px var(--clr-light-grey);
  }

  .table-container {
    border: none;
  }

  tr:first-child:hover {
    background-color: var(--clr-almost-white);
  }

</style>