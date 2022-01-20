<template>
<div class="fixed-container">
  <Header />
  <main>
    <!-- Title container -->
    <div class="title-container">
      <h1 v-if="!this.$route.params.user_id">{{ $t('navigation.my-inventory') }}</h1>
      <div v-else>
        <p class="title-name">{{ findName(user_id) }}</p>
        <h1>{{ $t('navigation.inventory') }}</h1>
      </div>
      <btn-component :btnType="'add'"
                     :title="$t('gear.add-gear')"
                     @btnClicked="addGearOpen = true; mobileActions = false; rowsSelected = []" />

      <!-- Max width filter -->
      <div class="wide-filter filter non-mobile">
        <button class="filter-btn"
                v-if="!this.$route.params.user_id"
                :class="{'filter-selected': filter === 'owned'}"
                @click="setFilter('owned')">{{ $t('my-inventory.owned') }}</button>
        <button class="filter-btn"
                v-else
                :class="{'filter-selected': filter === 'owned'}"
                @click="setFilter('owned')">{{ $t('my-inventory.personal') }}</button>
        <button class="filter-btn"
                :class="{'filter-selected': filter === 'borrowed'}"
                @click="setFilter('borrowed')">{{ $t('my-inventory.borrowed') }}</button>
        <button class="filter-btn"
                :class="{'filter-selected': filter === 'lent'}"
                @click="setFilter('lent')">{{ $t('my-inventory.lent') }}</button>
        <button class="filter-btn"
                :class="{'filter-selected': filter === 'all'}"
                @click="setFilter('all')">{{ $t('my-inventory.all') }}</button>
      </div>

      <!-- Medium filter -->
      <select class="medium-filter filter non-mobile" v-model="filter" @change="rowsSelected = []">
        <option selected value="all" class="placeholder">{{ $t('my-inventory.all') }} {{ $t('gear.gear') }}</option>
        <option value="owned" class="placeholder">{{ $t('my-inventory.personal') }} {{ $t('gear.gear') }}</option>
        <option value="lent" class="placeholder">{{ $t('my-inventory.lent') }} {{ $t('gear.gear') }}</option>
        <option value="borrowed" class="placeholder">{{ $t('my-inventory.borrowed') }} {{ $t('gear.gear') }}</option>
      </select>

      <!-- Mobile Filter -->
      <div class="mobile mobile-filter filter">
        <btn-option-dots @btnClicked="mobileFilterOpen = !mobileFilterOpen" />
        <action-card class="mobile-filter-card" v-show="mobileFilterOpen" @close="mobileFilterOpen = false">

          <button @click="setFilter('all')">{{ $t('my-inventory.all') }}</button>
          <button class="first" v-if="!this.$route.params.user_id" @click="setFilter('owned')">{{ $t('my-inventory.owned') }}</button>
          <button v-else @click="setFilter('owned')">{{ $t('my-inventory.personal') }}</button>
          <button @click="setFilter('borrowed')">{{ $t('my-inventory.borrowed') }}</button>
          <button @click="setFilter('lent')">{{ $t('my-inventory.lent') }}</button>

        </action-card>
      </div>
    </div> <!-- /title container -->

    <!-- Deal with selected -->
    <div class="selection-container">
      <Search @setSearch="setSearch(...arguments); rowsSelected = []" />

      <div :class="{'hidden': !anySelected}" class="flex selection-actions">

        <!-- mobile checkbox -->
        <div class="mobile flex">
          <input type="checkbox"
                 :title="$t('my-inventory.select-all')"
                 :class="{'checkbox-hidden': !anySelected}"
                 :checked="anySelected"
                 @click="$event.target.checked ? selectAll() : rowsSelected = []">
          <span class="mobile" v-if="anySelected">: {{ rowsSelected.length }}</span>
        </div>

        <!-- other actions -->
        <span class="non-mobile">{{ $t('my-inventory.selected') }}: {{ rowsSelected.length }}</span>
        <table-actions class="actions">

          <btn-hands :btnType="'return'" :title="$t('action.return')" v-if="!$route.params.user_id" @btnClicked="openCard('multipleReturn')" />
          <span class="action-divider" v-if="!$route.params.user_id" />
          <btn-hands :btnType="'lend'" :title="$t('action.lend')" v-if="!$route.params.user_id" @btnClicked="openCard('multipleLend')" />
          <span class="action-divider" v-if="!$route.params.user_id" />
          <btn-hands :btnType="'transfer'" :title="$t('action.transfer')" @btnClicked="openCard('multipleTransfer')" />
          <span class="action-divider" />
          <btn-component :btnType="'delete'" :title="$t('action.delete')" @btnClicked="openCard('multipleDelete')" />

        </table-actions>
      </div>
    </div>

    <!-- Table -->
    <table-component @scroll.native.passive="closeMobileAction">
      <!-- header row -->
      <tr class="head-row non-mobile">
        <th class="no-padding checkbox-cell">
          <input type="checkbox"
                 :title="$t('my-inventory.select-all')"
                 :class="{'checkbox-hidden': !anySelected}"
                 :checked="anySelected"
                 @click="$event.target.checked ? selectAll() :  rowsSelected = []">
        </th>
        <th>{{ $t('gear.title') }}</th>
        <th class="tablet-hide align-center">{{ $t('gear.code') }}</th>
        <th class="tablet-hide">{{ $t('gear.serial-number') }}</th>
        <th>{{ $t('gear.status') }}</th>
        <th>{{ $t('gear.actions') }}</th>
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

        <td @click="selectRow(index, $event)" class="tablet-hide non-mobile align-center">{{ gear.code }}</td>
        <td @click="selectRow(index, $event)" class="tablet-hide non-mobile">{{ gear.serial_number }}</td>
        <td @click="selectRow(index, $event)" class="non-mobile">{{ $t(`my-inventory.${statusText(gear.lent, gear.own)}`) }}</td>

        <!-- Non Mobile Table Actions -->
        <td class="actions-cell non-mobile">
          <table-actions>
            <btn-hands :btnType="'return'"
                       :title="$t('action.return')"
                       :disabled="!gear.current_holder"
                       v-if="statusText(gear.lent, gear.own) === 'borrowed' && !$route.params.user_id"
                       @btnClicked="openCard('return', gear.id)" />
            <span class="action-divider" v-if="statusText(gear.lent, gear.own) === 'borrowed' && !$route.params.user_id" />

            <btn-hands :btnType="'lend'"
                       :title="$t('action.lend')"
                       v-if="!$route.params.user_id"
                       :disabled="gear.current_holder && ((gear.own && gear.lent) || (!gear.own && !gear.lent))"
                      @btnClicked="openCard('lend', gear.id)" />
            <span class="action-divider" v-if="gear.own && !$route.params.user_id" />

            <btn-hands :btnType="'transfer'"
                       :title="$t('action.transfer')"
                       v-if="gear.own || $route.params.user_id"
                       :disabled="gear.lent" @btnClicked="openCard('transfer', gear.id)" />
            <span class="action-divider"  v-if="gear.own || $route.params.user_id" />

            <btn-component :btnType="'delete'"
                           :title="$t('action.delete')"
                           v-if="gear.own || $route.params.user_id"
                           :disabled="gear.lent" @btnClicked="openCard('delete', gear.id)" />
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
    <button v-if="!mobileActions.own && mobileActions.lent && !$route.params.user_id"
            @click="openCard('return', mobileActions.id)">
      {{ $t('action.return') }}
    </button>
    <button v-if="((mobileActions.own && !mobileActions.lent) || (!mobileActions.own && mobileActions.lent)) && !$route.params.user_id"
            @click="openCard('lend', mobileActions.id)"
    >{{ $t('action.return') }}</button>
    <button v-if="mobileActions.own && !mobileActions.lent" @click="openCard('transfer', mobileActions.id)" >Perleisti</button>
    <button v-show="mobileActions.own && !mobileActions.lent" @click="openCard('delete', mobileActions.id)" >Nurašyti</button>
    <button @click="generatePDF(mobileActions.id, mobileActions.name)">Generuoti PDF</button>
  </action-card>

  <!-- Add item card -->
  <modulus-full v-if="addGearOpen" @close="addGearOpen = false">
    <add-item :user="user_id" @success="addGearSuccess"/>
  </modulus-full>

  <!-- Grąžinti action -->
  <modulus-full v-if="returnCardOpen === 'err'" @close="returnCardOpen = false">
    <p>{{ $t('action.messages.cant-do', {action: $t('action.return').toLowerCase()}) }}</p>
    <button class="btn btn-right" @click="returnCardOpen = false">{{ $t('close') }}</button>
  </modulus-full>

  <delete-card v-else-if="returnCardOpen"
               :errorMsg="errorMsg"
               :errorArr="errorArr"
               @close="returnCardOpen = false; errorMsg = ''; errorArr = ''"
               @delete="returnItem(returnCardOpen)">
    <p>{{ $t('action.messages.return-ready') }}
      <strong v-if="!returnCardOpen.length">{{ gearName(returnCardOpen) }}</strong>
      <strong v-else>{{ $t('action.messages.gear-count', {count: returnCardOpen.length}) }}</strong>?</p>
  </delete-card>

  <!-- Nurašyti action -->
  <modulus-full v-if="deleteCardOpen === 'err'" @close="deleteCardOpen = false">
    <p>{{ $t('action.messages.cant-do', {action: $t('action.remove').toLowerCase()}) }}</p>
    <button class="btn btn-right" @click="deleteCardOpen = false">{{ $t('close') }}</button>
  </modulus-full>

  <delete-card v-else-if="deleteCardOpen"
               :errorMsg="errorMsg"
               :errorArr="errorArr"
               @close="deleteCardOpen = false; errorMsg = ''; errorArr = ''"
               @delete="deleteGear(deleteCardOpen)">
    <p>{{ $t('action.messages.remove-ready') }}
      <strong v-if="!deleteCardOpen.length">{{ gearName(deleteCardOpen) }}</strong>
      <span v-else>{{ $t('action.messages.gear-count', {count: deleteCardOpen.length}) }}</span>?</p>
  </delete-card>

  <!-- Action Unavailable -->
  <modulus-full v-if="selectUserOpen === 'errlend'" @close="selectUserOpen = false">
    <p>{{ $t('action.messages.cant-do', {action: $t('action.lend').toLowerCase()}) }}</p>
    <button class="btn btn-right" @click="selectUserOpen = false">{{ $t('close') }}</button>
  </modulus-full>

  <modulus-full v-else-if="selectUserOpen === 'errtransfer'" @close="selectUserOpen = false">
    <p>{{ $t('action.messages.cant-do', {action: $t('action.transfer').toLowerCase()}) }}</p>
    <button class="btn btn-right" @click="selectUserOpen = false">{{ $t('close') }}</button>
  </modulus-full>

  <!-- Skolinti/Perleisti action -->
  <select-user v-else-if="selectUserOpen"
               @close="selectUserOpen = false; errorMsg = ''; errorArr = ''"
               @submitAction="gearAction( ...arguments, selectUserOpen.id, selectUserOpen.type )"
               :type="selectUserOpen.type"
               :gear_owner="selectUserOpen.owner_id"
               :errorArr="errorArr"
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
  import Search from "@/components/Search";

  export default {
    name: "UserItems",
    mixins: [ DataMixin, GearActionsMixin, UsersMixin ],
    components: {
      Search,
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
      document.title = this.$t('navigation.my-inventory') + this.$t('tab-title_base');
      this.loadData();
      // delete this -----------------------------------------------------------------------------

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
        document.title = this.$t('navigation.my-inventory') + this.$t('tab-title_base');
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
          case "lent":
            return unpackedList.filter(gear => gear.own === 1 && gear.current_holder === 0);
          default :
            return this.list;
        }
      }
    },
    methods: {
      loadData() {
        if(this.$route.params.user_id){
          this.user_id = parseInt(this.$route.params.user_id);
          this.url = this.url +'/user/' + this.user_id;
          document.title = `${this.findName(this.user_id)} ${this.$t('navigation.inventory')}${this.$t('tab-title_base')}`;
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
        return !own ? "borrowed" : lent ? "lent" : "personal";
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
        EventBus.$emit('displayMessage', this.$t('messages.gear-add-success'));
      },

      openMobileActions(item, event){
        let rows = 1; // find how tall the card will be
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

        } else if(name === 'transfer' || name === 'lend'){
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
          if(!this.returnCardOpen.length) { // unable to return anything
            this.returnCardOpen = 'err';
          } else if(this.returnCardOpen.length === 1){ // abele to return only 1
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
          if(!this.deleteCardOpen.length) { // unable to delete anything
            this.deleteCardOpen = 'err';
          } else if(this.deleteCardOpen.length === 1){ // able to delete only 1
            this.deleteCardOpen = this.deleteCardOpen[0];
          }

        } else if(name === 'multipleTransfer' || name === 'multipleLend'){ // LEND or TRANSFER multiple
          let type = name === 'multipleTransfer' ? 'transfer' : 'lend';
          this.selectUserOpen = { id: [], type, owner_id: []};

          for( let i = 0; i < this.rowsSelected.length; i++ ){
            let gear = this.filteredList[this.rowsSelected[i]];
            if((gear.own && !gear.lent && type === 'transfer') ||
                (type === 'lend' && (!gear.own && gear.lent || gear.own && !gear.lent && type))
            ) {
              this.selectUserOpen.id.push(gear.id);
              this.selectUserOpen.owner_id.push(gear.user_id);
            }
          }
          if(!this.selectUserOpen.id.length) { // unable to lend or transfer anything
            this.selectUserOpen = 'err' + type;
          } else if(this.selectUserOpen.id.length === 1){ // able to lend or transfer only one
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
    max-width: 1200px;
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

  /* Filter */

  .filter {
    margin-left: auto;
  }

  .wide-filter {
    flex-shrink: 0;
  }

  .medium-filter {
    display: none;
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


  .mobile-filter button:first-child {
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

  .search-container {
    margin: 0 auto 1em 0;
    /*margin-right: auto;*/
    width: 45%;
    transition: width 250ms;
  }

  .selection-container{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: .5em 0;
  }

  .selection-container .actions {
    margin-left: 1.5em;
  }

  .selection-actions {
    align-items: center;
  }

  .table-container{
    max-height: calc(100vh - 50px - 18rem);
  }

  .checkbox-cell {
    width: 50px;
    text-align: center;
  }

  .checkbox-hidden {
    opacity: .3;
  }

  .checkbox-hidden:hover {
    opacity: .9;
  }

  .row-selected-simple{
    background: #0054A616;
  }

  table .row-selected-simple:hover {
    background: #0054A620;
  }

  .flex {
    display: flex;
    /*align-items: center;*/
    justify-content: space-between;
    align-self: stretch;
  }

  .mobile.flex {
    display: none;
  }

  .actions {
    width: 230px;
  }

  @media (max-width: 1100px){
    .wide-filter {
      display: none;
    }
    .medium-filter{
      display: initial;
      border-left: none;
    }
    .table-container{
      max-height: calc(100vh - 50px - 16rem);
    }
  }

  @media (max-width: 820px){
    h1 {
      font-size: 3.3rem;
    }
    .selection-container {
      flex-direction: column;
    }
    .search-container {
      width: 100%;
    }
    .selection-container .actions {
      margin-left: 1.5em;
    }

    .table-container{
      max-height: calc(100vh - 50px - 17rem);
    }
  }

  @media (max-width: 715px){
    h1 {
      font-size: 2.9rem;
    }
  }

  @media (max-width: 580px){
    .mobile-filter{
      margin-left: auto;
    }

    .checkbox-hidden {
      opacity: .2;
    }

    .selection-container{
      justify-content: space-between;
    }

    .mobile.flex {
      margin-left: 1.3em;
      display: flex;
      align-items: center;
      min-width: 50px;
      justify-content: flex-start;
    }

    td:first-child {
      border-right: 1px solid var(--clr-grey);
    }

    .mobile-actions-card{
      position: absolute;
      right: 10%;
    }

    .non-mobile {
      display: none;
    }
  }
</style>
