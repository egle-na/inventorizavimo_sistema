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
                :class="{'filter-selected': filter === 'owned'}"
                @click="setFilter('owned')">Mano įranga</button>
        <button class="filter-btn"
                :class="{'filter-selected': filter === 'borrowed'}"
                @click="setFilter('borrowed')">Pasiskolinta</button>
        <button class="filter-btn"
                :class="{'filter-selected': filter === 'all'}"
                @click="setFilter('all')">Visi</button>
      </div> <!-- /filter container-->
    </div> <!-- /title container-->

    <!-- Table -->
    <table-component>
      <tr class="head-row">
        <th>
          <input type="checkbox"
                 :class="{'checkbox-hidden': !anySelected}"
                 :checked="anySelected"
                 @click="$event.target.checked ? selectAll() :  rowsSelected = []">
        </th>
        <th>Pavadinimas</th>
        <th>Gavimo data</th>
        <th>Statusas</th>
        <th>Veiksmai</th>
      </tr>
      <tbody v-for="(item, index) in list" :key="index">
        <tr v-for="gear in item.gear" :key="gear.id"
            :class="{'row-selected-simple': rowsSelected.includes(index)}"
        >
          <td>
            <input type="checkbox"
                   :checked="rowsSelected.includes(index)"
                   @click="toggleSelect(index)"
                   :class="{'checkbox-hidden': !anySelected}"> <!-- check when clicked on a row -->
          </td>
          <td @click="selectRow(index, $event)" class="no-padding">
            <router-link :to="'/inventory/'+ gear.id">{{ gear.name }}</router-link>
          </td>
          <td @click="selectRow(index, $event)">{{ gear.updated_at.split('T')[0] }}</td>
          <td @click="selectRow(index, $event)">{{ statusText(gear.lent, gear.own) }}</td>
          <td class="actions-cell">
            <table-actions :id="gear.id" /> <!-- item.id -->
          </td>
        </tr>
      </tbody>
    </table-component>

  </main>

  <!-- Add item card -->
  <modulus-full v-if="addGearOpen" @close="addGearOpen = false">
    <add-item :user="user_id" @success="addGearSuccess"/>
  </modulus-full>

</div>
</template>

<script>
  import Header from "@/components/Header";
  import TableActions from "@/components/TableActions";
  import TableComponent from "@/components/TableComponent";
  import DataMixin from "@/components/mixins/DataMixin";
  import ModulusFull from "@/components/ModulusFull";
  import AddItem from "@/components/AddItem";
  export default {
    name: "UserItems",
    mixins: [ DataMixin ],
    components: {
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
        filter: 'all',
        rowsSelected: [],
        lastSelected: '',
        user_id: this.$store.getters.user.id,
        // list: [
        //   {name: 'a Dell 24 Monitor-S2421H', variable: 'alive'},
        //   {name: 'b Dell 24 Monitor-S2421H', variable: 'alive'},
        //   {name: 'c Dell 24 Monitor-S2421H', variable: 'alive'},
        //   {name: 'd Dell 24 Monitor-S2421H', variable: 'alive'},
        //   {name: 'e Dell 24 Monitor-S2421H', variable: 'alive'},
        //   {name: 'f Dell 24 Monitor-S2421H', variable: 'alive'},
        //   {name: 'g Dell 24 Monitor-S2421H', variable: 'alive'},
        //   {name: 'h Dell 24 Monitor-S2421H', variable: 'alive'},
        //   {name: 'i Dell 24 Monitor-S2421H', variable: 'alive'},
        //   {name: 'j Dell 24 Monitor-S2421H', variable: 'alive'},
        //   {name: 'k Dell 24 Monitor-S2421H', variable: 'alive'},
        //   {name: 'l Dell 24 Monitor-S2421H', variable: 'alive'},
        //   {name: 'm Dell 24 Monitor-S2421H', variable: 'alive'},
        //   {name: 'n Dell 24 Monitor-S2421H', variable: 'alive'},
        //   {name: 'o Dell 24 Monitor-S2421H', variable: 'alive'},
        // ],
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
    },
    computed: {
      anySelected() {
        return this.rowsSelected.length > 0;
      },
    },
    methods: {
    statusText(lent, own){
      return !own ? "Pasiskolinta" : lent ? "Paskolintas" : "Savininkas";
    },
    setFilter(filter) {
      this.filter = filter;
      console.log(filter);
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
        if(this.rowsSelected.length) { // something is selected
          this.toggleSelect(id);
          this.lastSelected = id;
        }
        this.lastSelected = "";
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
    },

    selectAll(){
      for(let i = 0; i < this.list.length; i++){
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
    }
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
    margin: 3em 0;
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

</style>