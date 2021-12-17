<template>
<div class="fixed-container">
  <Header />

  <main>
    <div class="title-container">
      <h1>Mano Inventorius</h1>
      <router-link to="/add-inventory" class="add-btn">
<!--        <img src="../assets/icons/Plus.svg" alt="">-->
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 12H8M24 12H8M12 8V0V24" stroke="#C5C5C5" stroke-width="2"/>
        </svg>
      </router-link>

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
      <tr v-for="item in 20"
          :key="item"
          :class="{'row-selected-simple': rowsSelected.includes(item)}"
          @click="selectRow(item, $event)">
        <td>
          <input type="checkbox"
                 :checked="rowsSelected.includes(item)"
                 :class="{'checkbox-hidden': !anySelected}"> <!-- check when clicked on a row -->
        </td>
        <td>Dell 24 Monitor-S2421H</td>
        <td>2021-12-14</td>
        <td>Savininkas</td>
        <td class="actions-cell">
          <table-actions :id="item" />
        </td>
      </tr>
    </table-component>

  </main>
</div>
</template>

<script>
  import Header from "@/components/Header";
  import TableActions from "@/components/TableActions";
  import TableComponent from "@/components/TableComponent";
  export default {
    name: "UserItems",
    components: {
      TableComponent,
      TableActions,
      Header
    },
    data() {
      return {
        filter: 'all',
        rowsSelected: [],
        lastSelected: '',
      }
    },
    methods: {
      setFilter(filter) {
        this.filter = filter;
        console.log(filter);
      },
      selectRow(id, event){

        if(event.shiftKey){

          if(!this.rowsSelected.includes(id)){ // check multiple
            console.log("shift");

            if(id > this.lastSelected){ // check multiple from down to up
              for(let i = id; i >= this.lastSelected; i--) {
                this.rowsSelected.push(i);
              }
            } else { // check multiple from up to down
              for(let i = id; i <= this.lastSelected; i++) {
                this.rowsSelected.push(i);
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
                console.log(deselect);
            this.rowsSelected = this.rowsSelected.filter(item => !deselect.includes(item));
          }
        } else { // if shift key not pressed
          if(!this.rowsSelected.includes(id)){ // check
            this.rowsSelected.push(id);
            console.log('add',id);
          } else { // uncheck
            this.rowsSelected = this.rowsSelected.filter(item => item !== id);
            console.log('remove',id);
          }
        }
        this.lastSelected = id;


      },
      selectAll(){
        for(let i = 1; i <= 20; i++){
          this.rowsSelected.push(i);
        }
        console.log('all')
        this.lastSelected = '';
      },
    },
    computed:{
      anySelected() {
        return this.rowsSelected.length > 0;
      },
    }
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