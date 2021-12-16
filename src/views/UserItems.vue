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
        <th></th>
        <th>Pavadinimas</th>
        <th>Gavimo data</th>
        <th>Statusas</th>
        <th>Veiksmai</th>
      </tr>
      <tr v-for="item in 20" :key="item">
        <td>
          <input type="checkbox" v-show="false"> <!-- check when clicked on a row -->
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
      }
    },
    methods: {
      setFilter(filter) {
        this.filter = filter;
        console.log(filter);
      }
    }
  }
</script>

<style scoped>

  /*.fixed-container {*/
  /*  max-height: 100vh;*/
  /*  overflow: hidden;*/
  /*}*/

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

  /*!* Table Design *!*/

  /*.table-container {*/
  /*  border-radius: 10px 10px 7px 7px;*/
  /*  overflow: hidden;*/
  /*  border: solid 1px var(--clr-light-grey);*/
  /*  overflow-y: scroll;*/
  /*  height: 60vh;*/
  /*}*/

  /*::-webkit-scrollbar-thumb {*/
  /*  background-color:var(--clr-grey);*/
  /*  border-radius: 5px;*/
  /*}*/

  /*::-webkit-scrollbar {*/
  /*  width: 10px;*/
  /*}*/

  /*table {*/
  /*  color: var(--clr-black);*/
  /*  border: solid 2px var(--clr-light-grey);*/
  /*  border-collapse: collapse;*/
  /*  width: 100%;*/
  /*  !*position: relative;*!*/
  /*}*/

  /*th, td {*/
  /*  border: solid 1px var(--clr-grey);*/
  /*  padding: 1rem;*/
  /*}*/

  /*.actions-cell {*/
  /*  padding: 0;*/
  /*}*/

  /*th {*/
  /*  color: var(--clr-accent);*/
  /*  background-color: var(--clr-light-grey);*/
  /*  font-size: var(--fs-table-header);*/
  /*  font-family: var(--ff-karla);*/
  /*  font-weight: 400;*/
  /*  text-transform: uppercase;*/
  /*  text-align: left;*/
  /*  letter-spacing: 0.08em;*/
  /*}*/

  /*th:not(:first-child){ !* column dividers fir sticky header *!*/
  /*  box-shadow: -1px 0 0 var(--clr-grey);*/
  /*}*/

  /*tr:first-child { !* keep headers on the top of table  *!*/
  /*  position: sticky;*/
  /*  top: 1px;*/
  /*  box-shadow: 0 2px 4px #C5C5C5;*/
  /*}*/

  /*th:first-child:before{ !* to fill the gap on the top of table  *!*/
  /*  content: '';*/
  /*  display: block;*/
  /*  position: absolute;*/
  /*  top: -1px;*/
  /*  left:0;*/
  /*  width: 100%;*/
  /*  border-top: solid var(--clr-light-grey);*/
  /*}*/

  /*tr:not(:first-child):hover {*/
  /*  background-color: var(--clr-almost-white);*/
  /*}*/

</style>