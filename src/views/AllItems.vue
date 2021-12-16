<template>
  <admin-desk>

    <div class="title-container">
      <h1>Visa Įranga</h1>
      <router-link to="/add-inventory" class="add-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 12H8M24 12H8M12 8V0V24" stroke="#C5C5C5" stroke-width="2"/>
        </svg>
      </router-link>

      <select class="company-filter">
        <option selected>Įmonės pavadinimas</option> <!-- Visos įmonės-->
        <option>Pirmos įmonės pavadinimas</option>
      </select>

    </div> <!-- /title container-->

    <search />

    <table-component>
      <tr class="head-row">
        <th></th>
        <th>Pavadinimas</th>
        <th>Kodas</th>
        <th>Kiekis</th>
        <th></th>
      </tr>
      <tbody v-for="item in 20" :key="item">
        <tr class="main-trow" :class="{'row-selected': rowExpanded === item}">
          <td></td>
          <td>Dell 24 Monitor-S2421H</td>
          <td>KD-55XG9505</td>
          <td>3</td>
          <td class="actions-cell">
            <button @click="expandRow(item)">v</button>
          </td>
        </tr>

        <tr class="expanded-table" v-show="rowExpanded === item">
          <td colspan="5">
            <table>
              <tr>
                <th></th>
                <th>Serijos Numeris</th>
                <th>Savininkas</th>
                <th>Turėtojas</th>
                <th></th>
              </tr>
              <tr class="expanded-trow">
                <td>1</td>
                <td>KD-55XG9505-1245123</td>
                <td>Jonas Jonaitis</td>
                <td>Petras Petraitis</td>
                <td class="actions-cell">
                  <table-actions/>
                </td>
              </tr>
            </table>

          </td>
        </tr>
      </tbody>
    </table-component> <!-- /table container-->



  </admin-desk>
</template>

<script>
  import AdminDesk from "@/components/AdminDesk";
  import TableComponent from "@/components/TableComponent";
  import Search from "@/components/Search";
  import TableActions from "@/components/TableActions";
  export default {
    name: "AllItems",
    components: {
      TableActions,
      Search,
      TableComponent,
      AdminDesk,
    },
    data() {
      return {
        rowExpanded: '',
      }
    },
    methods: {
      expandRow(item) {
        if (item === this.rowExpanded){
          this.rowExpanded = '';
        } else {
          this.rowExpanded = item;
        }
      },
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

  /* Table */

  /*.actions-cell button {*/
  /*  transform: rotate(0);*/
  /*  transition: rotate 300ms;*/
  /*}*/

  /*.actions-cell {*/
  /*  text-align: right;*/
  /*}*/

  /*.row-selected {*/
  /*  background: var(--clr-light-grey);*/
  /*  filter: drop-shadow(0 2px 4px #C5C5C5);*/
  /*  !*box-shadow: 0 2px 4px #C5C5C5;*!*/
  /*}*/
  /*.row-selected .actions-cell button {*/
  /*  transform: rotate(180deg);*/
  /*}*/

  /*.expanded-table {*/
  /*  display: contents;*/
  /*}*/
  /*.expanded-table tr {*/
  /*}*/

  /*.expanded-table th{*/
  /*  color: var(--clr-dark-grey);*/
  /*  background: var(--clr-white);*/
  /*  padding: .3em 1rem;*/
  /*  !*background: var(--clr-light-grey);*!*/
  /*  background: var(--clr-almost-white);*/

  /*}*/

  /*.expanded-table td{*/
  /*  background: var(--clr-almost-white);*/
  /*}*/

  /*.expanded-table:after{*/
  /*  content: '';*/
  /*  display: table-row;*/
  /*  width: 100%;*/
  /*  border-bottom: 2px solid var(--clr-accent);*/
  /*  background: var(--clr-almost-white);*/

  /*}*/

  /*tbody {*/
  /*  box-shadow: none;*/
  /*}*/


</style>