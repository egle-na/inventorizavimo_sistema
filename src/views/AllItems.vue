<template>
<div>
  <admin-desk>
    <!-- Title container -->
    <div class="title-container">
      <h1>Įranga</h1>
      <btn-add @btnClicked="addGearOpen = true" title="Pridėti inventorių" />
    </div>

    <Search @setSearch="setSearch"/>

    <!-- Table -->
    <table-component>
      <tr class="head-row">
<!--        <th class="cell-min"></th>-->
        <th>Pavadinimas</th>
        <th class="tablet-hide">Kodas</th>
        <th>Kiekis</th>
        <th></th>
      </tr>
      <tbody v-for="item in list" :key="item.id">
        <tr class="main-trow" :class="{'row-selected': rowExpanded === item}">
<!--          <td class="cell-min"></td>-->
          <td>{{ item.name }}</td>
          <td class="tablet-hide">{{ item.code }}</td>
          <td>{{ item.count }}</td>
          <td class="cell-min">
            <button @click="expandRow(item)">
              <img src="../assets/icons/ArrowDown.svg" alt="">
            </button>
          </td>
        </tr>

        <tr class="expanded-table" v-show="rowExpanded === item">
          <td colspan="5">
            <table>
              <tr>
                <th class="cell-min non-mobile"></th>
                <th class="non-mobile">Serijos Numeris</th>
                <th class="mobile" colspan="2" >Serijos Nr.</th>
                <th>Savininkas</th>
                <th class="tablet-hide">Statusas</th>
                <th></th>
              </tr>
              <tr v-for="(gear, index) in item.gear" :key="gear.id" class="expanded-trow">
                <td class="cell-min">{{ index + 1 }}</td>
                <td class="no-padding">
                  <router-link :to="'/inventory/'+ gear.id">{{ gear.serial_number }}</router-link>
                </td>
                <td>{{ ownersName(gear.user_id) }}</td>
                <td v-if="gear.long_term" class="tablet-hide">Ilgalaikis</td>
                <td v-else class="tablet-hide">Trumpalaikis</td>
                <td class="actions-cell">
                  <table-actions>
                    <btn-delete @btnClicked="deleteCardOpen = gear.id; gearName = gear.name" />
                  </table-actions>
                </td>
              </tr>
            </table>

          </td>
        </tr>
      </tbody>
    </table-component> <!-- /table container-->
  </admin-desk>

  <modulus-full v-if="addGearOpen" @close="addGearOpen = false">
    <add-item :user="$store.getters.user.id" @success="addGearSuccess"/>
  </modulus-full>

  <!-- Nurašyti action -->
  <modulus-full v-if="deleteCardOpen" @close="deleteCardOpen = false; errorMsg = ''; gearName = ''">
    <p>Ar tikrai norite nurašyti <strong>{{ gearName }}</strong>?</p>
    <div class="btn-container">
      <p class="error-msg">{{errorMsg}}</p>
      <button class="btn" @click="deleteGear(deleteCardOpen)">Taip</button>
    </div>
  </modulus-full>

</div>
</template>

<script>
  import AdminDesk from "@/components/AdminDesk";
  import TableComponent from "@/components/TableComponent";
  import Search from "@/components/Search";
  import TableActions from "@/components/TableActions";
  import DataMixin from "@/components/mixins/DataMixin";
  import ModulusFull from "@/components/ModulusFull";
  import AddItem from "@/components/AddItem";
  import BtnDelete from "@/components/BtnDelete";
  import GearActionsMixin from "@/components/mixins/GearActionsMixin";
  import BtnAdd from "@/views/BtnAdd";
  export default {
    name: "AllItems",
    mixins: [ DataMixin, GearActionsMixin ],
    components: {
      BtnAdd,
      BtnDelete,
      AddItem,
      ModulusFull,
      TableActions,
      Search,
      TableComponent,
      AdminDesk,
    },
    data() {
      return {
        url: 'https://inventor-system.herokuapp.com/api/gear/all',
        companyFilter: '',
        rowExpanded: '',
        addGearOpen: false,
        deleteCardOpen: false,
        errorMsg: '',
        gearName: '',
      }
    },
    created() {
      this.getData(this.url);
    },
    methods: {
      expandRow(item) {
        if (item === this.rowExpanded){
          this.rowExpanded = '';
        } else {
          this.rowExpanded = item;
        }
      },

      addGearSuccess() {
        this.addGearOpen = false;
        this.getData(this.url);
      },

      ownersName(id){
        if(this.$store.getters.allUsers.length) {
          let {first_name, last_name} = this.$store.getters.allUsers.find(user => user.id === id);
          return `${first_name} ${last_name}`
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

  .company-filter {
    margin-left: auto;
    margin-right: 0;
    border-left: none;
    border-bottom: solid 2px var(--clr-accent);
    max-width: 50%;
    color: var(--clr-grey)
  }

  .company-filter {
    color: var(--clr-black);
  }

  option:not([hidden]){
    color: var(--clr-black)
  }

  /* Table */

  tr:hover {
    background: #0054A622;
  }

  .cell-min {
    padding: 1rem;
    width: 45px;
    white-space: nowrap;
    max-height: min-content;
  }

  .main-trow .cell-min {
    padding: .7rem;
  }

  /* Add gear card */

  /*h2 {*/
  /*  margin-top: 0;*/
  /*}*/

  /*textarea {*/
  /*  height: 44px;*/
  /*  transition: height 400ms;*/
  /*  resize: vertical;*/
  /*}*/

  /*textarea:focus {*/
  /*  height: 90px;*/
  /*}*/

  /*.relative-container {*/
  /*  position: relative;*/
  /*}*/

  /*#euro-sign {*/
  /*  position: absolute;*/
  /*  !*top: 50%;*!*/
  /*  bottom: 60%;*/
  /*  right: .5em;*/
  /*  color: grey;*/
  /*}*/

  /*.btn-container {*/
  /*  display: flex;*/
  /*  justify-content: space-between;*/
  /*}*/

  /*.btn-container label:not(:first-child) {*/
  /*  margin-top: .9em ;*/
  /*}*/

  /*.btn-container div{*/
  /*  color: grey;*/
  /*  display: flex;*/
  /*  flex-direction: column;*/
  /*}*/

  /*.btn-container input{*/
  /*  width: fit-content;*/
  /*  margin: 0 1em 0 0;*/
  /*}*/

  /*.btn-container .btn {*/
  /*  align-self: flex-end;*/
  /*}*/

</style>