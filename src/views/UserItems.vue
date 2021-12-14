<template>
<div>
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
      </div>
    </div>

    <div>
      <table>
        <tr>
          <th>Pavadinimas</th>
          <th>Gavimo data</th>
          <th>Statusas</th>
          <th>Veiksmai</th>
        </tr>
        <tr v-for="item in 7" :key="item">
          <td>Dell 24 Monitor-S2421H</td>
          <td>2021-12-14</td>
          <td>Savininkas</td>
          <td>Some data</td>

        </tr>
      </table>
    </div>
  </main>
</div>
</template>

<script>
  import Header from "@/components/Header";
  export default {
    name: "UserItems",
    components: {
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
    line-height: 1rem;
    transform: translateY(50%);
  }
  .add-btn path{
    /*stroke: var(--clr-accent);*/
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

  /* Table Design */

  table {
    width: 100%;
    color: var(--clr-black);
    border: solid 3px var(--clr-light-grey);
    border-radius: 5px 5px 3px 3px; /* does nothing */
    border-collapse: collapse;
  }

  th {
    color: var(--clr-accent);
    background-color: var(--clr-light-grey);
    text-align: left;
    font-family: var(--ff-karla);
    letter-spacing: 0.08em;
    font-weight: 400;
    font-size: var(--fs-table-header);
    text-transform: uppercase;
  }

  th, td {
    border: solid 1px var(--clr-grey);
    padding: 1rem;
  }

  td {
    /*padding: 1em;*/

  }





</style>