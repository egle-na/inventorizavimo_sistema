<template>
<div class="fixed-container">
  <Header />

  <main>
    <!-- Title container -->
    <div class="title-container">
      <h1 v-if="!this.$route.params.user_id">Mano Inventorius</h1>
      <div v-else>
        <p class="title-name">{{ findName(parseInt(this.$route.params.user_id)) }}</p>
        <h1>Inventorius</h1>
      </div>
      <button class="add-btn" @click="addGearOpen = true; mobileActions = false; rowsSelected = []">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 12H8M24 12H8M12 8V0V24" stroke="#C5C5C5" stroke-width="2"/>
        </svg>
      </button>

      <div class="filter-container non-mobile">
        <button class="filter-btn"
                v-if="!this.$route.params.user_id"
                :class="{'filter-selected': filter === 'owned'}"
                @click="setFilter('owned')">Mano įranga</button>
        <button class="filter-btn"
                v-else
                :class="{'filter-selected': filter === 'owned'}"
                @click="setFilter('owned')">Asmeninė</button>
        <button class="filter-btn"
                :class="{'filter-selected': filter === 'borrowed'}"
                @click="setFilter('borrowed')">Pasiskolinta</button>
        <button class="filter-btn"
                :class="{'filter-selected': filter === 'all'}"
                @click="setFilter('all')">Visi</button>
      </div> <!-- /filter container-->

      <!-- Mobile Filter -->
      <div class="mobile mobile-filter-card">
        <button @click="mobileFilterOpen = !mobileFilterOpen">
          <img src="../assets/icons/action-dots.svg" alt="">
        </button>
        <action-card class="mobile-filter" v-show="mobileFilterOpen" @close="mobileFilterOpen = false">
          <button class="first" v-if="!this.$route.params.user_id" @click="setFilter('owned')">Mano įranga</button>
          <button v-else @click="setFilter('owned')">Asmeninė</button>
          <button @click="setFilter('borrowed')">Pasiskolinta</button>
          <button @click="setFilter('all')">Visi</button>
        </action-card>
      </div> <!-- /mobile filter -->
    </div> <!-- /title container -->

    <!-- Deal with selected -->
    <div class="selection-actions">
      <div class="mobile flex">
        <input type="checkbox"
               title="Pasirinkti Viską"
               :class="{'checkbox-hidden': !anySelected}"
               :checked="anySelected"
               @click="$event.target.checked ? selectAll() :  rowsSelected = []">
        <span class="mobile" v-if="anySelected">: {{ rowsSelected.length }}</span>
      </div>

      <div :class="{'hidden': !anySelected}" class="flex">
        <span class="non-mobile">Pasirinkta: {{ rowsSelected.length }}</span>
        <table-actions class="actions">
          <btn-return title="Grąžinti" v-if="!$route.params.user_id" @btnClicked="openCard('multipleReturn')" />

          <btn-lend title="Skolinti" v-if="!$route.params.user_id" @btnClicked="openCard('multipleLend')" />
          <span class="action-divider" v-if="!$route.params.user_id" />

          <btn-transfer title="Perduoti" @btnClicked="openCard('multipleTransfer')" />
          <span class="action-divider" />

          <btn-delete @btnClicked="openCard('multipleDelete')" />
        </table-actions>
      </div>
    </div>

    <!-- Table -->
    <table-component>
      <!-- header row -->
      <tr class="head-row non-mobile">
        <th class="no-padding checkbox-cell">
          <input type="checkbox"
                 title="Pasirinkti Viską"
                 :class="{'checkbox-hidden': !anySelected}"
                 :checked="anySelected"
                 @click="$event.target.checked ? selectAll() :  rowsSelected = []">
        </th>
        <th>Pavadinimas</th>
        <th class="tablet-hide">Gavimo data</th>
        <th>Statusas</th>
        <th>Veiksmai</th>
      </tr><!-- /header row -->

      <tr v-for="(gear, index) in filteredList" :key="gear.id"
          :class="{'row-selected-simple': rowsSelected.includes(index), 'mobile-focus': mobileActions === gear.id}">
        <td @click="selectRow(index, $event)" class="no-padding checkbox-cell">
          <input type="checkbox" :checked="rowsSelected.includes(index)" :class="{'checkbox-hidden': !anySelected}">
        </td>
        <td @click="selectRow(index, $event)" class="no-padding">
<!--          <router-link :to="'/inventory/'+ gear.id" :event="!anySelected ? 'click' : ''">{{ gear.name }}</router-link> &lt;!&ndash; event change to v-slot &ndash;&gt;-->
          <router-link :to="'/inventory/'+ gear.id">{{ gear.name }}</router-link> <!-- event change to v-slot -->
        </td>
        <td @click="selectRow(index, $event)" class="tablet-hide non-mobile">{{ gear.updated_at.split('T')[0] }}</td>
        <td @click="selectRow(index, $event)" class="non-mobile">{{ statusText(gear.lent, gear.own) }}</td>

        <!-- Non Mobile Table Actions -->
        <td class="actions-cell non-mobile">
          <table-actions>
            <btn-downloadPDF v-if="gear.own && gear.lent" />

            <btn-return v-if="!gear.own && gear.lent && !$route.params.user_id" @btnClicked="openCard('return', gear.id)" />
            <span class="action-divider" v-if="!gear.own && gear.lent && !$route.params.user_id" />

            <btn-lend v-if="((gear.own && !gear.lent) || (!gear.own && gear.lent)) && !$route.params.user_id"
                    @btnClicked="openCard('Skolinti', gear.id)" />
            <span class="action-divider" v-if="(gear.own && !gear.lent) && !$route.params.user_id" />

            <btn-transfer v-if="gear.own && !gear.lent" @btnClicked="openCard('Perleisti', gear.id)" />
            <span class="action-divider"  v-if="gear.own && !gear.lent" />

            <btn-delete v-show="gear.own && !gear.lent" @btnClicked="openCard('delete', gear.id)" />
          </table-actions>
        </td>

        <!-- Mobile Table Actions -->
        <td class="mobile mobile-actions">
          <button @click="mobileActions = gear.id">
            <img src="../assets/icons/action-dots.svg" alt="">
          </button>
          <action-card class="mobile-filter" v-if="mobileActions === gear.id" @close="mobileActions = false">
            <button v-if="!gear.own && gear.lent && !$route.params.user_id" @click="openCard('return', gear.id)" >Grąžinti</button>

            <button v-if="((gear.own && !gear.lent) || (!gear.own && gear.lent)) && !$route.params.user_id"
                    @click="openCard('Skolinti', gear.id)" >Skolinti</button>

            <button v-if="gear.own && !gear.lent" @click="openCard('Perleisti', gear.id)" >Perleisti</button>

            <button v-show="gear.own && !gear.lent" @click="openCard('delete', gear.id)" >Nurašyti</button>
            <button @click="generatePDF(gear.id, gear.name)">Generuoti PDF</button>
          </action-card>
        </td>
      </tr>
    </table-component>
  </main>

  <!-- Add item card -->
  <modulus-full v-if="addGearOpen" @close="addGearOpen = false">
    <add-item :user="user_id" @success="addGearSuccess"/>
  </modulus-full>

  <!-- Grąžinti action -->
  <modulus-full v-if="returnCardOpen" @close="returnCardOpen = false; errorMsg = ''">
    <div v-if="returnCardOpen === 'err'">
      <p>Šių daiktų grąžinti negalima.</p>
      <button class="btn" @click="returnCardOpen = false">Uždaryti</button>
    </div>
    <div v-else>
      <p>Ar esate pasiruošę grąžinti
        <strong v-if="!returnCardOpen.length">{{ gearName(returnCardOpen) }}</strong>
        <strong v-else>Šiuos {{ returnCardOpen.length }} daiktus</strong>?</p>
      <div class="btn-container">
        <p class="error-msg">{{ errorMsg }}</p>
        <button class="btn" @click="returnItem(returnCardOpen)">Taip</button>
      </div>
    </div>
  </modulus-full>

  <!-- Nurašyti action -->
  <modulus-full v-if="deleteCardOpen" @close="deleteCardOpen = false; errorMsg = ''">
    <div v-if="deleteCardOpen === 'err'">
      <p>Šių daiktų nurašyti negalima.</p>
      <button class="btn" @click="deleteCardOpen = false">Uždaryti</button>
    </div>
    <div v-else>
      <p>Ar tikrai norite nurašyti
        <strong v-if="!deleteCardOpen.length">{{ gearName(deleteCardOpen) }}</strong>
        <span v-else>šiuos {{ deleteCardOpen.length }} daiktus</span>?</p>
      <div class="btn-container">
        <p class="error-msg">{{errorMsg}}</p>
        <button class="btn" @click="deleteGear(deleteCardOpen)">Taip</button>
      </div>
    </div>
  </modulus-full>

  <!-- Skolinti/Perleisti action err -->
  <modulus-full v-if="selectUserOpen === 'errSkolinti'" @close="selectUserOpen = false">
    <p>Šių daiktų skolinti negalima.</p>
    <button class="btn" @click="selectUserOpen = false">Uždaryti</button>
  </modulus-full>
  <modulus-full v-else-if="selectUserOpen === 'errPerleisti'" @close="selectUserOpen = false">
    <p>Šių daiktų perleisti negalima.</p>
    <button class="btn" @click="selectUserOpen = false">Uždaryti</button>
  </modulus-full>

  <!-- Skolinti/Perleisti action -->
  <select-user v-else-if="selectUserOpen"
               @close="selectUserOpen = false; errorMsg = ''"
               @submitAction="gearAction( ...arguments, selectUserOpen.id, selectUserOpen.type )"
               :type="selectUserOpen.type"
               :gear_owner="selectUserOpen.owner_id"
               :errorMsg="errorMsg" />
<!--               :list="$store.getters.allUsers"-->


</div>
</template>

<script>
  import Header from "@/components/Header";
  import TableActions from "@/components/TableActions";
  import TableComponent from "@/components/TableComponent";
  import DataMixin from "@/components/mixins/DataMixin";
  import ModulusFull from "@/components/ModulusFull";
  import AddItem from "@/components/AddItem";
  import BtnDelete from "@/components/BtnDelete";
  import GearActionsMixin from "@/components/mixins/GearActionsMixin";
  import SelectUser from "@/components/SelectUser";
  import UsersMixin from "@/components/mixins/UsersMixin";
  import BtnDownloadPDF from "@/views/BtnDownloadPDF";
  import BtnReturn from "@/components/BtnReturn";
  import BtnLend from "@/components/BtnLend";
  import BtnTransfer from "@/components/BtnTransfer";
  import ActionCard from "@/components/ActionCard";

  export default {
    name: "UserItems",
    mixins: [ DataMixin, GearActionsMixin, UsersMixin ],
    components: {
      ActionCard,
      BtnTransfer,
      BtnLend,
      BtnReturn,
      BtnDownloadPDF,
      SelectUser,
      BtnDelete,
      AddItem,
      ModulusFull,
      TableComponent,
      TableActions,
      Header
    },
    data() {
      return {
        url: 'https://inventor-system.herokuapp.com/api/gear',
        addGearOpen: false,
        returnCardOpen: false,
        // lendCardOpen: false,
        selectUserOpen: false,
        deleteCardOpen: false,
        // actionType: '',
        mobileFilterOpen: false,
        mobileActions: false,
        filter: 'all',
        rowsSelected: [],
        lastSelected: '',
        user_id: this.$store.getters.user.id,
        errorMsg: '',
      }
    },
    created() {
      if(this.$route.params.user_id){
        this.user_id = this.$route.params.user_id;
        this.url = this.url +'/user/' + this.user_id;
        // this.getAdditionalData('https://inventor-system.herokuapp.com/api/users/' + this.user_id)
      }
      this.getData(this.url);
      // this.getNames(); // store
    },
    computed: {
      anySelected() {
        return this.rowsSelected.length > 0;
      },
      filteredList() {
        let unpackedList = [];
        for(let i = 0; i < this.list.length; i++){
          for(let j = 0; j < this.list[i].gear.length; j++){
            unpackedList.push(this.list[i].gear[j]);
          }
        }

        switch (this.filter){
          case "all":
            return unpackedList;
          case "owned":
            return unpackedList.filter(gear => gear.own === 1);
          case "borrowed":
            return unpackedList.filter(gear => gear.own === 0);
          default :
            return this.list;
        }
      }
    },
    methods: {
      gearName(id) {
        if(this.filteredList.length) {
          return this.filteredList.find(gear => gear.id === id).name;
        }
      },
      statusText(lent, own){
        return !own ? "Pasiskolinta" : lent ? "Paskolintas" : "Savininkas";
      },

      setFilter(filter) {
        if(this.filter !== filter) {
          this.rowsSelected = [];
        }
        this.filter = filter;
        this.mobileFilterOpen = false;
      },

      selectRow(id, event){
        if(event.shiftKey){ // if shift key pressed

          if(!this.rowsSelected.includes(id)){ // check multiple
            if(id > this.lastSelected){ // check multiple from down to up
              for(let i = id; i >= this.lastSelected; i--) {
                this.addIfNotSelected(i);
              }
            } else { // check multiple from up to down
              for(let i = id; i <= this.lastSelected; i++) {
                this.addIfNotSelected(i);
              }
            }

          } else { // uncheck multiple
            let deselect = [];
            if(id > this.lastSelected){ // uncheck multiple from down to up
                console.log("uncheck multiple from down to up");
              for(let i = id; i >= this.lastSelected; i--) {
                console.log(id, this.lastSelected)
                deselect.push(i);
              }
            } else { // uncheck multiple from up to down
                console.log("uncheck multiple from up to down");
              for(let i = id; i <= this.lastSelected; i++) {
                deselect.push(i);
              }
            }
            this.rowsSelected = this.rowsSelected.filter(item => !deselect.includes(item));
          }
          this.lastSelected = id;
        } else { // if shift key not pressed
            this.toggleSelect(id);
          if(!this.rowsSelected.length) { // something is selected
            this.lastSelected = "";
          }
        }
      },

      addIfNotSelected(item){
        if(!this.rowsSelected.includes(item))
        this.rowsSelected.push(item);
      },

      toggleSelect(id){
        if(!this.rowsSelected.includes(id)){
          this.rowsSelected.push(id);
        } else {
          this.rowsSelected = this.rowsSelected.filter(item => item !== id);
        }
        this.lastSelected = id;
      },

      selectAll(){
        for(let i = 0; i < this.filteredList.length; i++){
          this.rowsSelected.push(i);
        }
        console.log('all')
        this.lastSelected = '';
      },

      listSelected(){
        const sendList = this.rowsSelected.map(row => this.list[row]);
        sendList.forEach(item => console.log(item.name));
      },

      addGearSuccess() {
        console.log('success');
        this.addGearOpen = false;
        this.getData(this.url);
      },

      openCard(name, id) {
        if(name === 'return'){
          this.returnCardOpen = id;

        } else if(name === 'delete'){
          this.deleteCardOpen = id;

        } else if(name === 'Perleisti' || name === 'Skolinti'){
          let owner_id = this.filteredList.find(gear => gear.id === id).user_id;
          this.selectUserOpen = {id, type: name, owner_id};

        } else if(name === 'multipleReturn'){ // RETURN multiple

            this.returnCardOpen = [];
            for( let i = 0; i < this.rowsSelected.length; i++ ){
              let gear = this.filteredList[this.rowsSelected[i]];
              if(!gear.own && gear.lent) {
                this.returnCardOpen.push(gear);
              }
            }
            if(!this.returnCardOpen.length) { // Jei nieko negalima grąžinti
              this.returnCardOpen = 'err';
            } else if(this.returnCardOpen.length === 1){ // Jei galima grąžinti tik vieną
              this.returnCardOpen = this.returnCardOpen[0].id;
            }

        } else if(name === 'multipleDelete'){ // DELETE multiple

          this.deleteCardOpen = [];
          for( let i = 0; i < this.rowsSelected.length; i++ ){
            let gear = this.filteredList[this.rowsSelected[i]];
            if(gear.own && !gear.lent) {
              this.deleteCardOpen.push(gear);
            }
          }
          if(!this.deleteCardOpen.length) { // Jei nieko negalima nurašyti
            this.deleteCardOpen = 'err';
          } else if(this.deleteCardOpen.length === 1){ // Jei galima nurašyti tik vieną
            this.deleteCardOpen = this.deleteCardOpen[0].id;
          }

        } else if(name === 'multipleTransfer' || name === 'multipleLend'){ // LEND or TRANSFER multiple
          let type = name === 'multipleTransfer' ? 'Perleisti' : 'Skolinti';
          this.selectUserOpen = { id: [], type, owner_id: []};

          for( let i = 0; i < this.rowsSelected.length; i++ ){
            let gear = this.filteredList[this.rowsSelected[i]];
            if((gear.own && !gear.lent && type === 'Perleisti') ||
                (type === 'Skolinti' && (!gear.own && gear.lent || gear.own && !gear.lent && type))
            ) {
              this.selectUserOpen.id.push(gear.id);
              this.selectUserOpen.owner_id.push(gear.user_id);
            }
          }
          if(!this.selectUserOpen.id.length) { // Jei nieko negalima perduoti ar skolinti
            this.selectUserOpen = 'err' + type;
          } else if(this.selectUserOpen.id.length === 1){ // Jei galima perduoti ar skolinti tik vieną
            this.selectUserOpen.id = this.selectUserOpen.id[0];
            this.selectUserOpen.owner_id = this.selectUserOpen.owner_id[0];
          }
        }
      },


    },
  }
</script>

<style scoped>

  main {
    max-width: 1000px;
    width: 94%;
    margin: 0 auto;
  }

  .title-container {
    display: flex;
    align-items: flex-end;
    margin: 3em 0 1em;
  }

  .title-name {
    font-size: 2rem;
    padding: 0;
    margin: 0;
    /*color: var(--clr-dark-grey);*/
    color: var(--clr-grey);
    font-family: var(--ff-bebas-neue);
    /*font-size: var(--fs-button);*/
    letter-spacing: 0.065em;
  }

  .add-btn {
    color: var(--clr-grey);
    padding: 0;
    margin: 0 .5em;
    line-height: 1;
    transform: translateY(50%);
  }
  .add-btn path{
    stroke: var(--clr-darker-grey);
    transition: stroke 200ms;
  }

  .add-btn:hover path{
    stroke: var(--clr-accent);
  }

  .filter-container {
    margin-left: auto;
    flex-shrink: .5;
    /*display: flex;*/
  }

  .filter-btn {
    color: var(--clr-dark-grey);
    font-family: var(--ff-roboto-con);
    font-size: 1.125rem;
    border-bottom: solid 2px var(--clr-grey);
    padding: .1em .7em;
    margin-left: 1.5em;
    margin-top: .4em;

    transition: border-color 250ms;
  }

  .filter-btn:first-child {
    padding-right: 1.3em;
    padding-left: 4px;
  }

  .filter-btn:hover {
    border-color: var(--clr-accent) ;
  }

  .filter-btn:last-child {
    padding-right: 4px;
    padding-left: 1.3em;
  }

  .filter-selected {
    color: var(--clr-accent);
    border-color: var(--clr-accent);
  }

  /*.no-padding input {*/
    /*margin-left: .9em;*/
    /*width: 120%;*/

    /*margin: 0 auto;*/
    /*align-self: center;*/
  /*}*/

  .checkbox-cell {
    width: 50px;
    text-align: center;
  }

  .checkbox-hidden {
    opacity: 0;
  }

  .checkbox-hidden:hover {
    opacity: .3;
  }

  .row-selected-simple{
    background: #0054A616;
  }

  table .row-selected-simple:hover {
    background: #0054A620;
  }

  .hidden{
    visibility: hidden;
  }

  .selection-actions{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: .5em 0;
  }

  .selection-actions .actions {
    /*display: block;*/
    margin-left: 1.5em;
  }
  .flex {
    display: flex;
    align-items: center;
    /*justify-self: flex-end;*/
  }

  .mobile.flex {
    display: none;
  }

  .actions {
    width: 230px;
  }

  @media (max-width: 960px){
    .filter-container {
      display: flex;
      flex-direction: column-reverse;
      margin-right: 1em;
    }
    .filter-container .filter-btn {
      padding: 0 1em;
    }
  }

  /*@media (max-width: 730px){*/
  /*  .tablet-hide {*/
  /*    display: none;*/
  /*  }*/
  /*}*/

  /* Filter */
  @media (max-width: 580px){
    .mobile-filter-card{
      margin-left: auto;
    }

    .checkbox-hidden {
      opacity: .2;
    }

    .selection-actions{
      justify-content: space-between;
      margin-left: 1.3em;
    }

    .mobile.flex {
      display: flex;
    }

    .filter-container{
      display: none;
    }

    td:first-child {
      border-right: 1px solid var(--clr-grey);
    }
  }




</style>