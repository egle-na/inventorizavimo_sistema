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
      <btn-component :btnType="'add'" @btnClicked="addGearOpen = true; mobileActions = false; rowsSelected = []" />

      <!-- Filter -->
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
      </div>

      <!-- Mobile Filter -->
      <div class="mobile mobile-filter-card">
        <btn-option-dots @btnClicked="mobileFilterOpen = !mobileFilterOpen" />
        <action-card class="mobile-filter" v-show="mobileFilterOpen" @close="mobileFilterOpen = false">
          <button class="first" v-if="!this.$route.params.user_id" @click="setFilter('owned')">Mano įranga</button>
          <button v-else @click="setFilter('owned')">Asmeninė</button>
          <button @click="setFilter('borrowed')">Pasiskolinta</button>
          <button @click="setFilter('all')">Visi</button>
        </action-card>
      </div>
    </div> <!-- /title container -->

    <!-- Deal with selected -->
    <div class="selection-actions">
      <!-- mobile checkbox -->
      <div class="mobile flex">
        <input type="checkbox"
               title="Pasirinkti Viską"
               :class="{'checkbox-hidden': !anySelected}"
               :checked="anySelected"
               @click="$event.target.checked ? selectAll() : rowsSelected = []">
        <span class="mobile" v-if="anySelected">: {{ rowsSelected.length }}</span>
      </div>

      <!-- other actions -->
      <div :class="{'hidden': !anySelected}" class="flex">
        <span class="non-mobile">Pasirinkta: {{ rowsSelected.length }}</span>
        <table-actions class="actions">

          <btn-hands :btnType="'return'" title="Grąžinti" v-if="!$route.params.user_id" @btnClicked="openCard('multipleReturn')" />
          <span class="action-divider" v-if="!$route.params.user_id" />
          <btn-hands :btnType="'lend'" title="Skolinti" v-if="!$route.params.user_id" @btnClicked="openCard('multipleLend')" />
          <span class="action-divider" v-if="!$route.params.user_id" />
          <btn-hands :btnType="'transfer'" title="Perduoti" @btnClicked="openCard('multipleTransfer')" />
          <span class="action-divider" />
          <btn-component :btnType="'delete'" @btnClicked="openCard('multipleDelete')" title="Ištrinti" />

        </table-actions>
      </div>
    </div>

    <!-- Table -->
    <table-component @scroll.native.passive="closeMobileAction">
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
      </tr>

      <!-- main rows -->
      <tr v-for="(gear, index) in filteredList" :key="gear.id"
          :class="{'row-selected-simple': rowsSelected.includes(index), 'mobile-focus': mobileActions === gear.id}">

        <td @click="selectRow(index, $event)" class="no-padding checkbox-cell">
          <input type="checkbox" :checked="rowsSelected.includes(index)" :class="{'checkbox-hidden': !anySelected}">
        </td>

        <td @click="selectIfAnySelected(index, $event)" class="no-padding">
          <!-- link disabled when selection is active  -->
          <router-link :to="'/inventory/'+ gear.id" custom v-slot="{href, navigate}">
            <span v-if="anySelected" class="link">{{ gear.name }}</span>
            <a v-else :href="href" @click="navigate" class="link">{{ gear.name }}</a>
          </router-link>
        </td>

        <td @click="selectRow(index, $event)" class="tablet-hide non-mobile">{{ gear.updated_at.split('T')[0] }}</td>
        <td @click="selectRow(index, $event)" class="non-mobile">{{ statusText(gear.lent, gear.own) }}</td>

        <!-- Non Mobile Table Actions -->
        <td class="actions-cell non-mobile">
          <table-actions>
            <btn-hands :btnType="'return'" v-if="!gear.own && gear.lent && !$route.params.user_id" @btnClicked="openCard('return', gear.id)" />
            <span class="action-divider" v-if="!gear.own && gear.lent && !$route.params.user_id" />

            <btn-hands :btnType="'lend'"
                      title="Skolinti"
                      v-if="!$route.params.user_id"
                      :disabled="gear.current_holder && ((gear.own && gear.lent) || (!gear.own && !gear.lent))"
                      @btnClicked="openCard('Skolinti', gear.id)" />
            <span class="action-divider" v-if="gear.own && !$route.params.user_id" />

            <btn-hands :btnType="'transfer'" title="Perleisti" v-if="gear.own || $route.params.user_id" :disabled="gear.lent" @btnClicked="openCard('Perleisti', gear.id)" />
            <span class="action-divider"  v-if="gear.own || $route.params.user_id" />

            <btn-component :btnType="'delete'" v-if="gear.own || $route.params.user_id" :disabled="gear.lent" @btnClicked="openCard('delete', gear.id)" title="Ištinti" />
          </table-actions>
        </td>

        <!-- Mobile Table Actions -->
        <td class="mobile mobile-actions">
          <btn-option-dots @click.native="openMobileActions(gear, $event)" />
        </td>
      </tr>
    </table-component>
  </main>

  <!-- Mobile table actions card -->
  <action-card :style="mobileActionsPos" ref="mobileCard" class="mobile-actions-card" v-if="mobileActions" @close="mobileActions = false">
    <button v-if="!mobileActions.own && mobileActions.lent && !$route.params.user_id" @click="openCard('return', mobileActions.id)" >Grąžinti</button>
    <button v-if="((mobileActions.own && !mobileActions.lent) || (!mobileActions.own && mobileActions.lent)) && !$route.params.user_id"
            @click="openCard('Skolinti', mobileActions.id)" >Skolinti</button>
    <button v-if="mobileActions.own && !mobileActions.lent" @click="openCard('Perleisti', mobileActions.id)" >Perleisti</button>
    <button v-show="mobileActions.own && !mobileActions.lent" @click="openCard('delete', mobileActions.id)" >Nurašyti</button>
    <button @click="generatePDF(mobileActions.id, mobileActions.name)">Generuoti PDF</button>
  </action-card>

  <!-- Add item card -->
  <modulus-full v-if="addGearOpen" @close="addGearOpen = false">
    <add-item :user="user_id" @success="addGearSuccess"/>
  </modulus-full>

  <!-- Grąžinti action -->
  <modulus-full v-if="returnCardOpen === 'err'" @close="returnCardOpen = false">
    <p>Šių daiktų grąžinti negalima.</p>
    <button class="btn btn-right" @click="returnCardOpen = false">Uždaryti</button>
  </modulus-full>

  <delete-card v-else-if="returnCardOpen"
               :errorMsg="errorMsg"
               @close="returnCardOpen = false; errorMsg = ''"
               @delete="returnItem(returnCardOpen)">
    <p>Ar esate pasiruošę grąžinti
      <strong v-if="!returnCardOpen.length">{{ gearName(returnCardOpen) }}</strong>
      <strong v-else>Šiuos {{ returnCardOpen.length }} daiktus</strong>?</p>
  </delete-card>

  <!-- Nurašyti action -->
  <modulus-full v-if="deleteCardOpen === 'err'" @close="deleteCardOpen = false">
    <p>Šių daiktų nurašyti negalima.</p>
    <button class="btn btn-right" @click="deleteCardOpen = false">Uždaryti</button>
  </modulus-full>

  <delete-card v-else-if="deleteCardOpen"
               :errorMsg="errorMsg"
               @close="deleteCardOpen = false; errorMsg = ''"
               @delete="deleteGear(deleteCardOpen)">
    <p>Ar tikrai norite nurašyti
      <strong v-if="!deleteCardOpen.length">{{ gearName(deleteCardOpen) }}</strong>
      <span v-else>šiuos {{ deleteCardOpen.length }} daiktus</span>?</p>
  </delete-card>

  <!-- Action Unavailable -->
  <modulus-full v-if="selectUserOpen === 'errSkolinti'" @close="selectUserOpen = false">
    <p>Šių daiktų skolinti negalima.</p>
    <button class="btn btn-right" @click="selectUserOpen = false">Uždaryti</button>
  </modulus-full>

  <modulus-full v-else-if="selectUserOpen === 'errPerleisti'" @close="selectUserOpen = false">
    <p>Šių daiktų perleisti negalima.</p>
    <button class="btn btn-right" @click="selectUserOpen = false">Uždaryti</button>
  </modulus-full>

  <!-- Skolinti/Perleisti action -->
  <select-user v-else-if="selectUserOpen"
               @close="selectUserOpen = false; errorMsg = ''"
               @submitAction="gearAction( ...arguments, selectUserOpen.id, selectUserOpen.type )"
               :type="selectUserOpen.type"
               :gear_owner="selectUserOpen.owner_id"
               :errorMsg="errorMsg" />
</div>
</template>

<script>
  import DataMixin from "@/components/mixins/DataMixin";
  import GearActionsMixin from "@/components/mixins/GearActionsMixin";
  import UsersMixin from "@/components/mixins/UsersMixin";
  import ActionCard from "@/components/ActionCard";
  import AddItem from "@/components/AddItem";
  import BtnComponent from "@/components/BtnComponent";
  import BtnHands from "@/components/BtnHands";
  import BtnOptionDots from "@/components/BtnOptionDots";
  import DeleteCard from "@/components/DeleteCard";
  import Header from "@/components/Header";
  import ModulusFull from "@/components/ModulusFull";
  import SelectUser from "@/components/SelectUser";
  import TableActions from "@/components/TableActions";
  import TableComponent from "@/components/TableComponent";
  import {EventBus} from "@/main";

  export default {
    name: "UserItems",
    mixins: [ DataMixin, GearActionsMixin, UsersMixin ],
    components: {
      ActionCard,
      AddItem,
      BtnComponent,
      BtnHands,
      BtnOptionDots,
      DeleteCard,
      Header,
      ModulusFull,
      SelectUser,
      TableActions,
      TableComponent,
    },
    data() {
      return {
        url: this.$store.getters.API_baseURL + '/gear',
        addGearOpen: false,
        returnCardOpen: false,
        selectUserOpen: false,
        deleteCardOpen: false,
        mobileFilterOpen: false,
        mobileActions: false,
        mobileActionsPos: '',
        filter: 'all',
        rowsSelected: [],
        lastSelected: '',
        user_id: this.$store.getters.user.id,
        errorMsg: '',
      }
    },
    created() {
      this.loadData();
    },
    mounted() {
      EventBus.$on('requestChanged', this.refresh);
    },
    beforeDestroy() {
      EventBus.$off('requestChanged');
    },
    watch: {
      $route() {
      // get new data when going from specific user (route with params) to my gear (no params)
        this.url = this.$store.getters.API_baseURL + '/gear';
        this.config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
          }
        }
        this.loadData();
      }
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
      loadData() {
        if(this.$route.params.user_id){
          this.user_id = this.$route.params.user_id;
          this.url = this.url +'/user/' + this.user_id;
        }
        this.getData(this.url);
      },

      refresh() {
        this.getData(this.url);
      },

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

          // Check multiple
          if(!this.rowsSelected.includes(id)){
            if(id > this.lastSelected){ // check multiple from down to up
              for(let i = id; i >= this.lastSelected; i--) {
                this.addIfNotSelected(i);
              }
            } else { // check multiple from up to down
              for(let i = id; i <= this.lastSelected; i++) {
                this.addIfNotSelected(i);
              }
            }
          // Uncheck multiple
          } else {
            let deselect = [];
            if(id > this.lastSelected){ // uncheck multiple from down to up
              for(let i = id; i >= this.lastSelected; i--) {
                deselect.push(i);
              }
            } else { // uncheck multiple from up to down
              for(let i = id; i <= this.lastSelected; i++) {
                deselect.push(i);
              }
            }
            this.rowsSelected = this.rowsSelected.filter(item => !deselect.includes(item));
          }
          this.lastSelected = id;
        } else { // if shift key not pressed
            this.toggleSelect(id);
          if(!this.rowsSelected.length) {
            this.lastSelected = "";
          }
        }
      },

      addIfNotSelected(item){
        if(!this.rowsSelected.includes(item)) {
          this.rowsSelected.push(item);
        }
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
        this.lastSelected = '';
      },

      selectIfAnySelected(index, event) {
        if(this.anySelected){
          this.selectRow(index, event);
        }
      },

      addGearSuccess() {
        this.addGearOpen = false;
        this.getData(this.url);
        EventBus.$emit('displayMessage', 'Inventorius sėkmingai pridėtas!');
      },

      openMobileActions(item, event){
        let rows = 1;
        if (!item.own && item.lent && !this.$route.params.user_id) rows++;
        if (((item.own && !item.lent) || (!item.own && item.lent)) && !this.$route.params.user_id) rows++ ;
        if (item.own && !item.lent) rows++;
        if (item.own && !item.lent) rows++;

        this.mobileActionsPos = {top: (event.pageY + 15) + 'px'};
        if((window.innerHeight - event.clientY) < 15 + rows * 58){
          this.mobileActionsPos = {bottom: (window.innerHeight - event.clientY + 15) + 'px'};
        }
        this.mobileActions = item;
      },

      closeMobileAction(){
        if(this.mobileActions){
          this.mobileActions = false;
        }
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
              this.returnCardOpen.push(gear.id);
            }
          }
          if(!this.returnCardOpen.length) { // Jei nieko negalima grąžinti
            this.returnCardOpen = 'err';
          } else if(this.returnCardOpen.length === 1){ // Jei galima grąžinti tik vieną
            this.returnCardOpen = this.returnCardOpen[0];
          }

        } else if(name === 'multipleDelete'){ // DELETE multiple

          this.deleteCardOpen = [];
          for( let i = 0; i < this.rowsSelected.length; i++ ){
            let gear = this.filteredList[this.rowsSelected[i]];
            if(gear.own && !gear.lent) {
              this.deleteCardOpen.push(gear.id);
            }
          }
          if(!this.deleteCardOpen.length) { // Jei nieko negalima nurašyti
            this.deleteCardOpen = 'err';
          } else if(this.deleteCardOpen.length === 1){ // Jei galima nurašyti tik vieną
            this.deleteCardOpen = this.deleteCardOpen[0];
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
    color: var(--clr-grey);
    font-family: var(--ff-bebas-neue);
    letter-spacing: 0.065em;
  }

  .filter-container {
    margin-left: auto;
    flex-shrink: .5;
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
    border-color: var(--clr-accent);
  }

  .filter-btn:last-child {
    padding-right: 4px;
    padding-left: 1.3em;
  }

  .filter-selected {
    color: var(--clr-accent);
    border-color: var(--clr-accent);
  }

  .mobile-filter-card button:first-child {
    margin: 0 1em;
  }

  .btn-right {
    margin-left: auto;
    float: right;
  }

  a.link,
  span.link {
    color: currentColor;
    text-decoration: none;
    padding: 1em;
  }

  a.link:hover{
    color: var(--clr-accent);
  }

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
    margin-left: 1.5em;
  }

  .flex {
    display: flex;
    align-items: center;
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

    .mobile-actions-card{
      position: absolute;
      right: 10%;
    }
  }
</style>