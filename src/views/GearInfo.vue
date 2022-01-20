<template>
 <div>

   <Header />
   <main>

     <!-- Title container -->
     <div class="title-container">

       <h1>{{ list.name }} <span>{{ $t('my-inventory.' + statusText) }}</span></h1>

       <!-- Gear Actions -->
       <div class="actions" v-if="statusText !== 'lent'">
         <btn-option-dots @btnClicked="actionCardOpen = !actionCardOpen" />

         <!-- Actions Card -->
         <action-card v-show="actionCardOpen" @close="actionCardOpen = false">
           <button v-if="statusText === 'owner' || statusText === 'borrowed'"
                   @click="openSelect('lend')"
           >{{ $t('action.lend') }}</button>

           <button v-show="!list.lent" @click="openSelect('transfer')"
           >{{ $t('action.transfer') }}</button>

           <button v-show="statusText === 'borrowed'" @click="returnCardOpen = true">{{ $t('action.return') }}</button>
           <button @click="writeOffCardOpen = true">{{ $t('action.remove') }}</button>
           <button @click="generatePDF(list.id, list.name)">{{ $t('action.generate-pdf') }}</button>
         </action-card>
       </div>

       <!-- Generuoti PDF btn when no other actions are available -->
       <div v-else>
         <button class="btn non-mobile" @click="generatePDF(list.id, list.name)">{{ $t('action.generate-pdf') }}</button>
         <button class="mobile pdf-btn" @click="generatePDF(list.id, list.name)" :title="$t('action.generate-pdf')" >
           <img src="../assets/icons/downloadPDF-blue.svg" alt="" class="icon-blue">
           <img src="../assets/icons/downloadPDF.svg" alt="">
         </button>
       </div>
     </div><!-- /title container -->

     <!-- Main Content -->
     <div class="main-content">

       <!-- Info container -->
       <div class="specs">
         <h3>{{ $t('gear.description') }}</h3>
         <p>{{ list.description }}</p>
         <div>
           <h3>{{ $t('gear.owner') }}</h3>
           <p >{{ ownerName }}</p>
         </div>
         <div>
           <h3>{{ $t('gear.code') }}</h3>
           <p>{{ list.code }}</p>
         </div>
         <div>
           <h3>{{ $t('gear.serial-number') }}</h3>
           <p>{{ list.serial_number }}</p>
         </div>
         <div>
           <h3>{{ $t('gear.price') }}</h3>
           <p>{{ list.unit_price }} €</p>
         </div>

         <!-- Action Buttons -->
         <div class="btn-container">
           <button class="btn"
                   v-show="statusText === 'borrowed'"
                   @click="returnCardOpen = true">{{ $t('action.return') }}</button>
           <button class="btn"
                   v-show="statusText === 'owner' || statusText === 'borrowed'"
                   @click="openSelect('lend')">{{ $t('action.lend') }}</button>
           <button class="btn"
                   v-show="!list.lent"
                   @click="openSelect('transfer')">{{ $t('action.transfer') }}</button>
         </div>
       </div><!-- /info container -->

       <!-- History container -->
       <div class="history">
         <div class="history-title">
           <h3>{{ $t('history') }}</h3>
         </div>
         <table-component>
           <tr v-for="history in historyList" :key="history.id">
             <td class="no-padding">
               <img v-if="history.event === 0" src="../assets/icons/lend.svg" alt="">
               <img v-else-if="history.event === 1" src="../assets/icons/return.svg" alt="">
               <img v-else-if="history.event === 2" src="../assets/icons/transfer.svg" alt="">
               <img v-else src="../assets/icons/transfer.svg" alt="">
             </td>
             <td :title="$t('gear.who')" v-if="history.event === 1">{{ findName(history.user_id) }}</td>
             <td :title="$t('gear.who')" v-else >{{ findName(history.sender_id) }}</td>

             <td v-if="history.event === 0">{{ $t('action.lent-to') }}</td>
             <td v-else-if="history.event === 1">{{ $t('action.returned-to') }}</td>
             <td v-else-if="history.event === 2">{{ $t('action.transferred-to') }}</td>

             <td :title="$t('gear.to-whom')" v-if="history.event === 1">{{ findName(history.sender_id) }}</td>
             <td :title="$t('gear.to-whom')" v-else>{{ findName(history.user_id) }}</td>
             <td :title="$t('gear.when')">{{ history.created_at.split('T')[0] }}</td>
           </tr>
         </table-component>

       </div><!-- /history container -->
     </div><!-- /main container -->
   </main>

   <!-- Lend/Transfer action -->
   <select-user v-if="selectUserOpen"
                @close="selectUserOpen = false; errorMsg = ''"
                @submitAction="gearAction(...arguments, list.id, actionType)"
                :type="actionType"
                :gear_owner="list.user_id"
                :errorMsg="errorMsg" />

   <!-- Remove action -->
   <delete-card v-show="writeOffCardOpen"
                :errorMsg="errorMsg"
                @close="writeOffCardOpen = false; errorMsg = ''"
                @delete="deleteGear(list.id)">
     <p>{{ $t('action.messages.remove-ready') }} <strong>{{ list.name }}</strong>?</p>
   </delete-card>

   <!-- Return action -->
   <delete-card v-show="returnCardOpen"
                :errorMsg="errorMsg"
                @close="returnCardOpen = false; errorMsg = ''"
                @delete="returnItem(list.id)">
     <p>{{ $t('action.messages.return-ready') }} <strong>{{ list.name }}</strong>?</p>
   </delete-card>

 </div>
</template>

<script>
  import DataMixin from "@/components/mixins/DataMixin";
  import UsersMixin from "@/components/mixins/UsersMixin";
  import GearActionsMixin from "@/components/mixins/GearActionsMixin";
  import ActionCard from "@/components/ActionCard";
  import BtnOptionDots from "@/components/BtnOptionDots";
  import DeleteCard from "@/components/DeleteCard";
  import Header from "@/components/Header";
  import SelectUser from "@/components/SelectUser";
  import TableComponent from "@/components/TableComponent";

  export default {
    name: "GearInfo",
    mixins: [ DataMixin, UsersMixin, GearActionsMixin ],
    components: {
      ActionCard,
      BtnOptionDots,
      DeleteCard,
      Header,
      SelectUser,
      TableComponent,
    },
    data() {
      return {
        url: this.$store.getters.API_baseURL + '/gear/' + this.$route.params.inventory_id,
        actionCardOpen: false,
        selectUserOpen: false,
        writeOffCardOpen: false,
        returnCardOpen: false,
        actionType:'',
        errorMsg: '',
        historyList: {},
        statusText: 'owner',
      }
    },
    created() {
      this.loadPage();
    },
    computed: {
      ownerName() {
        if(this.$store.getters.allUsers.length){
          return this.findName(this.list.user_id);
        } else return '';
      },
    },

    methods: {
      loadPage() {
        if(this.$store.getters.user.isAdmin === true){
          this.url = this.$store.getters.API_baseURL + '/gear/all/' + this.$route.params.inventory_id;
        }
        this.getData(this.url,
            () => {
              document.title = this.list.name + this.$t('tab-title_base');
              this.getStatusText();
            },
            () => { this.$router.push({name: 'user-inventory'})
            });
        this.getHistory();
      },

      getStatusText() {
        // If not Admin checks its gear
        if(!this.$store.getters.user.isAdmin){
          this.statusText = this.list.own ? this.list.lent ? "lent" : "owner" : "borrowed";
          return;
        }

        // If Admin is the owner
        if(this.list.user_id === this.$store.getters.user.id){
          this.statusText = this.list.lent ? "lent" : "owner";

        } else { // If Admin is not the owner

          // gear is not lent to Admin
          this.statusText = this.list.long_term ? 'long-term' : 'short-term';

          // check if ger is lent to Admin
          if(this.list.lent) {
            this.getData(
                this.$store.getters.API_baseURL + '/gear/' + this.list.id,
                () => { this.statusText = "borrowed"; })
          }
        }
      },

      getHistory() {
        this.$http.get(this.$store.getters.API_baseURL + '/gear-history/' + this.$route.params.inventory_id, this.config)
          .then(response => this.historyList = response.data)
          .catch(() => {})
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
    margin-left: 1em;
  }

  .history {
    width: 55%;
    position: relative;
    margin-top: 1.5rem;
    border: solid 3px var(--clr-grey);
    border-radius: 7px;
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
    padding-left: .4em;
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

  @media (max-width: 580px){
    .pdf-btn img {
      height: 70px;
      margin-bottom: -8px;
    }

    .pdf-btn .icon-blue{
      position: absolute;
    }

    .pdf-btn:hover img:not(.icon-blue),
    .pdf-btn .icon-blue{
      opacity: 0;
    }
    .pdf-btn img:not(.icon-blue),
    .pdf-btn:hover .icon-blue{
      opacity: 1;
    }
  }

</style>