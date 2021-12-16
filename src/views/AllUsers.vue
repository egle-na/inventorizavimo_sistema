<template>
  <admin-desk>

    <div class="title-container">
      <h1>Visi Darbuotojai</h1>
      <router-link to="/add-user" class="add-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 12H8M24 12H8M12 8V0V24" stroke="#C5C5C5" stroke-width="2"/>
        </svg>
      </router-link>

      <select class="company-filter">
        <option selected>Įmonės pavadinimas</option> <!-- Visos įmonės-->
        <option>Pirmos įmonės pavadinimas</option>
      </select>

    </div> <!-- /title container-->

    <Search />

    <table-component>
      <tr class="head-row">
        <th>Vardas Pavardė</th>
        <th>Elektroninis paštas</th>
        <th>Įrangos kiekis</th>
        <th></th>
      </tr>
      <tr v-for="item in 20" :key="item">
        <td>Jonas Jonauskas</td>
        <td>jonas.jonauskas@teltonika.lt</td>
        <td>5</td>
        <td class="actions-cell">
          <table-actions/>
        </td>
      </tr>

    </table-component> <!-- /table container-->


  </admin-desk>
</template>

<script>
  import AdminDesk from "@/components/AdminDesk";
  import Search from "@/components/Search";
  import TableComponent from "@/components/TableComponent";
  import TableActions from "@/components/TableActions";

  export default {
    name: "AllUsers",
    components: {
      TableActions,
      TableComponent,
      Search,
      AdminDesk
    },
  }
</script>

<style scoped>

  .title-container {
    width: 100%;
    display: flex;
    align-items: flex-end;
    margin: 0;
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

  .company-filter {
    margin-left: auto;
    margin-right: 0;
    border-left: none;
    border-bottom: solid 2px var(--clr-accent);
    max-width: 50%;
    color: var(--clr-grey)
  }

  /* Table Design */

  td, th {
    border: none;
    text-align: center;
  }

  th {
    background: var(--clr-white);
    color: var(--clr-dark-grey);
  }

  th:not(:first-child){ /* column dividers fir sticky header */
    box-shadow:none;
  }


</style>