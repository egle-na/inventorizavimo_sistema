<template>
<div class="fixed-container">
  <Header />

  <main>
    <!-- Title container -->
    <div class="title-container">
      <h1 v-if="!this.$route.params.user_id">Mano Inventorius</h1>
      <div v-else>
        <p class="title-name">{{ additionalList.first_name }} {{ additionalList.last_name }}</p>
        <h1>Inventorius</h1>
      </div>
      <button class="add-btn" @click="addGearOpen = true">
<!--        <img src="../assets/icons/Plus.svg" alt="">-->
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 12H8M24 12H8M12 8V0V24" stroke="#C5C5C5" stroke-width="2"/>
        </svg>
      </button>

      <div class="filter-container">
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
    </div> <!-- /title container-->

    <!-- Deal with selected r-->
    <div :class="{'hidden': !anySelected}" class="selection-actions">
      <p>Pasirinkta: <span>{{ rowsSelected.length }}</span></p>
      <table-actions class="actions">
        <btn-return title="Grąžinti" v-if="!$route.params.user_id" />
        <span class="action-divider" v-if="!$route.params.user_id" />

        <btn-lend title="Skolinti" v-if="!$route.params.user_id" />
        <span class="action-divider" v-if="!$route.params.user_id" />

        <btn-transfer title="Perduoti" />
        <span class="action-divider" />

        <btn-delete />
      </table-actions>
    </div>

    <!-- Table -->
    <table-component>
      <tr class="head-row">
        <th class="no-padding">
          <input type="checkbox"
                 title="Pasirinkti Viską"
                 :class="{'checkbox-hidden': !anySelected}"
                 :checked="anySelected"
                 @click="$event.target.checked ? selectAll() :  rowsSelected = []">
        </th>
        <th>Pavadinimas</th>
        <th>Gavimo data</th>
        <th>Statusas</th>
        <th>Veiksmai</th>
      </tr>
      <tr v-for="(gear, index) in filteredList" :key="gear.id" :class="{'row-selected-simple': rowsSelected.includes(index)}">
        <td @click="selectRow(index, $event)" class="no-padding">
          <input type="checkbox"
                 :checked="rowsSelected.includes(index)"
                 :class="{'checkbox-hidden': !anySelected}"> <!-- check when clicked on a row -->
<!--                 @click="toggleSelect(index)"-->
        </td>
        <td @click="selectRow(index, $event)" class="no-padding">
<!--          <router-link :to="'/inventory/'+ gear.id" :event="!anySelected ? 'click' : ''">{{ gear.name }}</router-link> &lt;!&ndash; event change to v-slot &ndash;&gt;-->
          <router-link :to="'/inventory/'+ gear.id">{{ gear.name }}</router-link> <!-- event change to v-slot -->
        </td>
        <td @click="selectRow(index, $event)">{{ gear.updated_at.split('T')[0] }}</td>
        <td @click="selectRow(index, $event)">{{ statusText(gear.lent, gear.own) }}</td>
        <td class="actions-cell">
          <table-actions>

            <btn-downloadPDF v-if="gear.own && gear.lent" />

            <btn-return title="Grąžinti"
                    v-if="!gear.own && gear.lent && !$route.params.user_id"
                    @btnClicked="openCard('return', gear.id)" />
            <span class="action-divider" v-if="!gear.own && gear.lent && !$route.params.user_id" />

            <btn-lend title="Skolinti"
                    v-if="((gear.own && !gear.lent) || (!gear.own && gear.lent)) && !$route.params.user_id"
                    @btnClicked="openCard('Skolinti', gear.id)" />
            <span class="action-divider" v-if="(gear.own && !gear.lent) && !$route.params.user_id" />

            <btn-transfer title="Perduoti"
                    v-if="gear.own && !gear.lent"
                    @btnClicked="openCard('Perleisti', gear.id)" />
            <span class="action-divider"  v-if="gear.own && !gear.lent" />

            <btn-delete v-show="gear.own && !gear.lent" @btnClicked="openCard('delete', gear.id)" />
          </table-actions> <!-- item.id -->
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
    <p>Ar esate pasiruošę grąžinti <strong>{{ gearName(returnCardOpen) }}</strong>?</p>
    <div class="btn-container">
      <p class="error-msg">{{ errorMsg }}</p>
      <button class="btn" @click="returnItem(returnCardOpen)">Taip</button>
    </div>
  </modulus-full>

  <!-- Nurašyti action -->
  <modulus-full v-if="deleteCardOpen" @close="deleteCardOpen = false; errorMsg = ''">
    <p>Ar tikrai norite nurašyti <strong>{{ gearName(deleteCardOpen) }}</strong>?</p>
    <div class="btn-container">
      <p class="error-msg">{{errorMsg}}</p>
      <button class="btn" @click="deleteGear(deleteCardOpen)">Taip</button>
    </div>
  </modulus-full>

  <!-- Skolinti/Perleisti action -->
  <select-user v-if="selectUserOpen"
               @close="selectUserOpen = false; errorMsg = ''"
               @submitAction="gearAction( ...arguments, selectUserOpen.id, selectUserOpen.type )"
               :list="$store.getters.allUsers"
               :type="selectUserOpen.type"
               :gear_owner="selectUserOpen.owner_id"
               :errorMsg="errorMsg"
  >
    <!--     <select class="user-select" v-model="selectedUser">-->
    <!--       <option selected hidden>Pasirinkite darbuotoją:</option>-->
    <!--       <option v-for="user in additionalList" :key=" user.id"-->
    <!--               :value="user.id">{{user.first_name + ' ' + user.last_name}}</option>-->
    <!--     </select>-->
  </select-user>


</div>
</template>

<script>
  import Header from "@/components/Header";
  import TableActions from "@/components/TableActions";
  import TableComponent from "@/components/TableComponent";
  import DataMixin from "@/components/mixins/DataMixin";
  import ModulusFull from "@/components/ModulusFull";
  import AddItem from "@/components/AddItem";
  // import BtnEdit from "@/components/BtnEdit";
  // import BtnAddInventory from "@/components/BtnAddInventory";
  import BtnDelete from "@/components/BtnDelete";
  import GearActionsMixin from "@/components/mixins/GearActionsMixin";
  import SelectUser from "@/components/SelectUser";
  import UsersMixin from "@/components/mixins/UsersMixin";
  import BtnDownloadPDF from "@/views/BtnDownloadPDF";
  import BtnReturn from "@/components/BtnReturn";
  import BtnLend from "@/components/BtnLend";
  import BtnTransfer from "@/components/BtnTransfer";

  export default {
    name: "UserItems",
    mixins: [ DataMixin, GearActionsMixin, UsersMixin ],
    components: {
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
        this.getData(this.url +'/user/' + this.user_id);
        this.getAdditionalData('https://inventor-system.herokuapp.com/api/users/' + this.user_id)
      } else {
        this.getData(this.url);
      }
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
        this.rowsSelected = this.filter !== filter && [];
        this.filter = filter;
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
        if(this.$route.params.user_id){
          this.getData(this.url + '/user/' + this.user_id);
        } else {
          this.getData(this.url);
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
    /*display: flex;*/
  }

  .filter-btn {
    color: var(--clr-dark-grey);
    font-family: var(--ff-roboto-con);
    font-size: 1.125rem;
    border-bottom: solid 2px var(--clr-grey);
    padding: .1em .7em;
    margin-left: 1.5em;

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

  .no-padding input {
    margin-left: .9em;
    /*width: 120%;*/
    align-self: center;
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
  }

  .selection-actions .actions {
    /*display: block;*/
    margin-left: 1.5em;
  }

  .actions {
    width: 230px;
  }

</style>