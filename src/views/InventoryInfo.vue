<template>
 <div>
   <Header />

   <main>
     <div class="title-container">
       <h1>Dell 24 Monitor - S2421H <span>Paskolintas</span></h1>

       <div class="actions">
         <button @click="actionCardOpen = !actionCardOpen">
           <img src="../assets/icons/action-dots.svg" alt="">
         </button>
         <action-card v-show="actionCardOpen" @close="actionCardOpen = false">
           <button class="action-btn">Skolinti</button>
           <button class="action-btn">Perleisti</button>
           <button class="action-btn">Grąžinti</button>
           <button class="action-btn">Generuoti PDF</button>
           <button class="action-btn">Ištrinti</button>
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
           <p>Jonas Jonaitis</p>
         </div>
         <div>
           <h3>Kodas</h3>
           <p>KD-55XG9505</p>
         </div>
         <div>
           <h3>Serijos numeris</h3>
           <p>6007041</p>
         </div>
         <div>
           <h3>Vieneto kaina</h3>
           <p>163,67 €</p>
         </div>

         <div class="btn-container">
           <button class="btn">Grąžinti</button>
           <button class="btn">Skolinti</button>
           <button class="btn">Perleisti</button>
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

 </div>
</template>

<script>
  import Header from "@/components/Header";
  import ActionCard from "@/components/ActionCard";
  import TableComponent from "@/components/TableComponent";

  export default {
    name: "InventoryInfo",
    components: {
      TableComponent,
      ActionCard,
      Header,
    },
    // props: [ 'item' ],
    data() {
      return {
        actionCardOpen: false,
        item: {
          name: '',
          status: '',
          owner: '',
          price: '',
        }
      }
    },
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
    align-items: end;
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
    align-items: end;
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
    justify-content: end;
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

</style>