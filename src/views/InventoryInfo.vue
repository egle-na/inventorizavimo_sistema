<template>
 <div>
   <Header />

   <main>
     <!-- Title container -->
     <div class="title-container">
       <h1>{{ list.name }} <span>{{ statusText }}</span></h1>

       <div class="actions" v-if="statusText !== 'Paskolintas'">
         <button @click="actionCardOpen = !actionCardOpen">
           <img src="../assets/icons/action-dots.svg" alt="">
         </button>
         <!-- Action Card -->
         <action-card v-show="actionCardOpen" @close="actionCardOpen = false">
           <button class="action-btn"
                   @click="openSelect('Skolinti')"
                   v-if="statusText === 'Savininkas' || statusText === 'Pasiskolinta'"
           >Skolinti</button>
           <button class="action-btn"
                   v-show="statusText === 'Savininkas' || this.$store.getters.user.isAdmin === true && !list.lent"
                   @click="openSelect('Perleisti')"
           >Perleisti</button>
           <button class="action-btn"
                   v-show="statusText === 'Pasiskolinta'"
                   @click="returnCardOpen = true"
           >Grąžinti</button>
           <button class="action-btn" @click="generatePDF(list.id, list.name)">Generuoti PDF</button>
           <button class="action-btn" @click="writeOffCardOpen = true">Nurašyti</button>
         </action-card>
       </div>
       <button v-else class="btn" @click="generatePDF(list.id, list.name)">
         Generuoti PDF
       </button>

     </div><!-- /Title container -->

     <!-- Main -->
     <div class="main-content">

       <!-- Info container -->
       <div class="specs">
         <h3>Aprašymas</h3>
         <p>{{ list.description }}</p>
         <div>
           <h3>Savininkas</h3>
           <p >{{ ownerName }}</p>
         </div>
<!--         <div v-if="statusText === 'Paskolintas'">--> <!-- nėra kaip paprastai sužinoti kam paskolinta -->
<!--           <h3>Paskolinta</h3>-->
<!--           <p >{{ findName(list.) }}</p> -->
<!--         </div>-->
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
           <button class="btn"
                   v-show="statusText === 'Pasiskolinta'"
                   @click="returnCardOpen = true">Grąžinti</button>
           <button class="btn"
                   v-show="statusText === 'Savininkas' || statusText === 'Pasiskolinta'"
                   @click="openSelect('Skolinti')">Skolinti</button>
           <button class="btn"
                   v-show="statusText === 'Savininkas' || this.$store.getters.user.isAdmin === true"
                   @click="openSelect('Perleisti')">Perleisti</button>
         </div>
       </div><!-- /info container -->

       <!-- History container -->
       <div class="history">
         <div class="history-title">
           <h3>Istorija</h3>
         </div>
         <table-component>
           <tr v-for="history in historyList" :key="history.id">
             <td class="no-padding">
               <img v-if="history.event === 0" src="../assets/icons/lend.svg" alt="">
               <img v-else-if="history.event === 1" src="../assets/icons/return.svg" alt="">
               <img v-else-if="history.event === 2" src="../assets/icons/transfer.svg" alt="">
               <img v-else src="../assets/icons/transfer.svg" alt="">
             </td>
             <td title="Kas?" v-if="history.event === 1">{{ findName(history.user_id) }}</td>
             <td title="Kas?" v-else >{{ findName(history.sender_id) }}</td>

             <td v-if="history.event === 0">Paskolino</td>
             <td v-else-if="history.event === 1">Grąžino</td>
             <td v-else-if="history.event === 2">Atidavė</td>

             <td title="Kam?" v-if="history.event === 1">{{ findName(history.sender_id) }}</td>
             <td title="Kam?" v-else>{{ findName(history.user_id) }}</td>
             <td title="Kada?">{{ history.created_at.split('T')[0] }}</td>
           </tr>
         </table-component>
       </div><!-- /history container -->

     </div><!-- /main container -->
   </main>

   <!-- Skolinti/Perleisti action -->
   <select-user v-if="selectUserOpen"
                @close="selectUserOpen = false; errorMsg = ''"
                @submitAction="gearAction(...arguments, list.id, actionType)"
                :list="$store.getters.allUsers"
                :type="actionType"
                :gear_owner="list.user_id"
                :errorMsg="errorMsg" />

   <!-- Nurašyti action -->
   <modulus-full v-show="writeOffCardOpen" @close="writeOffCardOpen = false; errorMsg = ''">
     <p>Ar tikrai norite nurašyti <strong>{{ list.name }}</strong>?</p>
     <div class="btn-container">
       <p class="error-msg">{{ errorMsg }}</p>
       <button class="btn" @click="deleteGear(list.id)">Taip</button>
     </div>
   </modulus-full>

   <!-- Grąžinti action -->
   <modulus-full v-show="returnCardOpen" @close="returnCardOpen = false; errorMsg = ''">
     <p>Ar esate pasiruošę grąžinti <strong>{{ list.name }}</strong>?</p>
     <div class="btn-container">
       <p class="error-msg">{{ errorMsg }}</p>
       <button class="btn" @click="returnItem(list.id)">Taip</button>
     </div>
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
  import UsersMixin from "@/components/mixins/UsersMixin";
  import GearActionsMixin from "@/components/mixins/GearActionsMixin";

  export default {
    name: "InventoryInfo",
    mixins: [ DataMixin, UsersMixin, GearActionsMixin ],
    components: {
      ModulusFull,
      SelectUser,
      TableComponent,
      ActionCard,
      Header,
    },
    data() {
      return {
        url: 'https://inventor-system.herokuapp.com/api/gear/' + this.$route.params.inventory_id,
        users_url: 'https://inventor-system.herokuapp.com/api/users',
        actionCardOpen: false,
        selectUserOpen: false,
        writeOffCardOpen: false,
        returnCardOpen: false,
        actionType:'',
        ownersName: '',
        selectedUser: '',
        errorMsg: '',
        // status
        history: {},
        historyList: {},
      }
    },
    created() {
      if(this.$store.getters.user.isAdmin === true){
        this.url = 'https://inventor-system.herokuapp.com/api/gear/all/' + this.$route.params.inventory_id;
        // this.users_url = 'https://inventor-system.herokuapp.com/api/users/all'
      }
      this.getData(this.url, '', () => {
        this.$router.push({name: 'user-inventory'});
      });

      // this.getNames();
      this.getHistory();
    },
    computed: {
      ownerName() {
        if(this.$store.getters.allUsers.length){
          // return `${this.additionalList.filter(user => user.id === this.list.user_id)[0].first_name} ${this.additionalList.filter(user => user.id === this.list.user_id)[0].last_name}`;
          return this.findName(this.list.user_id);
        } else return ''
      },
      statusText(){
        // if(this.$store.getters.user.isAdmin && this.list.user_id !== this.$store.getters.user.id){ // if admin
        if(this.list.user_id === this.$store.getters.user.id ){ // jei savininkas
          if(this.list.lent){ // jei paskolinta
            return 'Paskolintas';
          } else return 'Savininkas'; // nepaskolinta
        } else if(this.$store.getters.user.isAdmin && this.list.user_id !== this.$store.getters.user.id){ // if admin
          return this.list.long_term ? 'Ilgalaikis' : 'Trumpalaikis';
        } else return "Pasiskolinta";
      },
    },
    methods: {
      getHistory() {
        this.$http.get('https://inventor-system.herokuapp.com/api/gear-history/' + this.$route.params.inventory_id, this.config)
          .then(response => this.historyList = response.data)
          .catch(err => console.error(err))
      },

      openSelect(action) {
        this.actionType = action;
        this.selectUserOpen = true;
        this.actionCardOpen = false;
      },
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
    width: fit-content;
    margin-bottom: -2px;
  }

  .specs h3:first-child{
    width: fit-content;
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

  .no-padding img {
    max-width: initial;
    padding-left:.4em; /* gal abi puses? */
  }

  @media (max-width: 550px) {
    .main-content {
      flex-direction: column;
    }
    .specs,
    .history {
      width: 100%;
    }
    .specs {
      margin-bottom: 2em;
    }
  }


</style>