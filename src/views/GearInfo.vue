<template>
 <div>

   <Header />
   <main>

     <!-- Title container -->
     <div class="title-container">

       <h1>{{ list.name }} <span>{{ statusText }}</span></h1>

       <!-- Gear Actions -->
       <div class="actions" v-if="statusText !== 'Paskolintas'">
         <btn-option-dots @btnClicked="actionCardOpen = !actionCardOpen" />

         <!-- Actions Card -->
         <action-card v-show="actionCardOpen" @close="actionCardOpen = false">
           <button v-if="statusText === 'Savininkas' || statusText === 'Pasiskolinta'"
                   @click="openSelect('Skolinti')"
           >Skolinti</button>

           <button v-show="!list.lent"
                   @click="openSelect('Perleisti')"
           >Perleisti</button>

           <button v-show="statusText === 'Pasiskolinta'" @click="returnCardOpen = true">Grąžinti</button>
           <button @click="writeOffCardOpen = true">Nurašyti</button>
           <button @click="generatePDF(list.id, list.name)">Generuoti PDF</button>
         </action-card>
       </div>

       <div v-else><!-- Generuoti PDF btn when no other actions are available -->
         <button class="btn non-mobile" @click="generatePDF(list.id, list.name)">Generuoti PDF</button>
         <btn-component :btnType="'PDF'" class="mobile" @btnClicked="generatePDF(list.id, list.name)" title="Generuoti PDF" />
       </div>

     </div><!-- /title container -->

     <!-- Main Content -->
     <div class="main-content">

       <!-- Info container -->
       <div class="specs">
         <h3>Aprašymas</h3>
         <p>{{ list.description }}</p>
         <div>
           <h3>Savininkas</h3>
           <p >{{ ownerName }}</p>
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

         <!-- Action Buttons -->
         <div class="btn-container">
           <button class="btn"
                   v-show="statusText === 'Pasiskolinta'"
                   @click="returnCardOpen = true">Grąžinti</button>
           <button class="btn"
                   v-show="statusText === 'Savininkas' || statusText === 'Pasiskolinta'"
                   @click="openSelect('Skolinti')">Skolinti</button>
           <button class="btn"
                   v-show="!list.lent"
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
                :type="actionType"
                :gear_owner="list.user_id"
                :errorMsg="errorMsg" />

   <!-- Nurašyti action -->
   <delete-card v-show="writeOffCardOpen"
                :errorMsg="errorMsg"
                @close="writeOffCardOpen = false; errorMsg = ''"
                @delete="deleteGear(list.id)">
     <p>Ar tikrai norite nurašyti <strong>{{ list.name }}</strong>?</p>
   </delete-card>

   <!-- Grąžinti action -->
   <delete-card v-show="returnCardOpen"
                :errorMsg="errorMsg"
                @close="returnCardOpen = false; errorMsg = ''"
                @delete="returnItem(list.id)">
     <p>Ar esate pasiruošę grąžinti <strong>{{ list.name }}</strong>?</p>
   </delete-card>

 </div>
</template>

<script>
  import Header from "@/components/Header";
  import ActionCard from "@/components/ActionCard";
  import TableComponent from "@/components/TableComponent";
  import SelectUser from "@/components/SelectUser";
  import DataMixin from "@/components/mixins/DataMixin";
  import UsersMixin from "@/components/mixins/UsersMixin";
  import GearActionsMixin from "@/components/mixins/GearActionsMixin";
  import BtnOptionDots from "@/components/BtnOptionDots";
  import BtnComponent from "@/components/BtnComponent";
  import DeleteCard from "@/components/DeleteCard";

  export default {
    name: "InventoryInfo",
    mixins: [ DataMixin, UsersMixin, GearActionsMixin ],
    components: {
      DeleteCard,
      BtnComponent,
      BtnOptionDots,
      SelectUser,
      TableComponent,
      ActionCard,
      Header,
    },
    data() {
      return {
        url: this.$store.getters.API_baseURL + '/gear/' + this.$route.params.inventory_id,
        users_url: this.$store.getters.API_baseURL + '/users',
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
        checked: false,
        statusText: '',
      }
    },
    created() {
      if(this.$store.getters.user.isAdmin === true){
        this.url = this.$store.getters.API_baseURL + '/gear/all/' + this.$route.params.inventory_id;
      }
      this.getData(this.url,
          () => { this.getStatusText(); },
          () => { this.$router.push({name: 'user-inventory'})
      });
      this.getHistory();
    },
    computed: {
      ownerName() {
        if(this.$store.getters.allUsers.length){
          return this.findName(this.list.user_id);
        } else return ''
      },
    },

    methods: {

      getStatusText() {
        if(this.$store.getters.user.isAdmin) { // Admin

          if(this.list.user_id === this.$store.getters.user.id){ // Admin is owner
            this.statusText = this.list.lent ? "Paskolintas" : "Savininkas"

          } else { // Admin not owner
            this.statusText = this.list.long_term ? 'Ilgalaikis' : 'Trumpalaikis';

            if(this.list.lent) { // Admin not owner but gear is lent
              this.getData(this.$store.getters.API_baseURL + '/gear/' + this.list.id,
                  () => {
                    this.statusText = "Pasiskolinta";
                  },
                  () => {
                    // this.statusText = this.list.long_term ? 'Ilgalaikis' : 'Trumpalaikis';
                  })
            }
          }

        } else { // not Admin
          this.statusText = this.list.own ? this.list.lent ? "Paskolintas" : "Savininkas" : "Pasiskolinta";
        }

      },

      getHistory() {
        this.$http.get(this.$store.getters.API_baseURL + '/gear-history/' + this.$route.params.inventory_id, this.config)
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

  .history {
    width: 55%;
    position: relative;
    margin-top: 1.5rem;
    border: solid 3px var(--clr-grey);
    border-radius: 7px;
    /*max-height: 100%;*/
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

  .table-container { /* nieko nedaro */
    border: none;
  }

  tr:first-child:hover {
    background-color: var(--clr-almost-white);
  }

  .no-padding img {
    max-width: initial;
    padding-left:.4em; /* gal abi puses? */
  }


  @media (max-width: 800px) {
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