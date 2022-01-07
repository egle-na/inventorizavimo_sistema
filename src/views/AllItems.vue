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

      <!-- table labels -->
      <tr class="head-row">
        <th>Pavadinimas</th>
        <th class="tablet-hide">Kodas</th>
        <th>Kiekis</th>
        <th></th>
      </tr>

      <!-- main data -->
      <tbody v-for="item in list" :key="item.id">
        <tr class="main-trow" :class="{'row-selected': rowExpanded === item}">
          <td>{{ item.name }}</td>
          <td class="tablet-hide">{{ item.code }}</td>
          <td>{{ item.count }}</td>
          <td class="cell-min">
            <button @click="expandRow(item)">
              <img src="../assets/icons/ArrowDown.svg" alt="">
            </button>
          </td>
        </tr>

        <!-- expanded rows -->
        <tr class="expanded-table" v-show="rowExpanded === item">
          <td colspan="5">
            <table>
              <tr><!-- expanded rows column labels -->
                <th class="cell-min non-mobile"></th>
                <th class="non-mobile">Serijos Numeris</th>
                <th class="mobile" colspan="2" >Serijos Nr.</th>
                <th>Savininkas</th>
                <th class="tablet-hide">Statusas</th>
                <th></th>
              </tr>

              <!-- expanded rows main data -->
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
  import DataMixin from "@/components/mixins/DataMixin";
  import GearActionsMixin from "@/components/mixins/GearActionsMixin";
  import AddItem from "@/components/AddItem";
  import AdminDesk from "@/components/AdminDesk";
  import BtnAdd from "@/components/BtnAdd";
  import BtnDelete from "@/components/BtnDelete";
  import ModulusFull from "@/components/ModulusFull";
  import Search from "@/components/Search";
  import TableActions from "@/components/TableActions";
  import TableComponent from "@/components/TableComponent";
  export default {
    name: "AllItems",
    mixins: [ DataMixin, GearActionsMixin ],
    components: {
      AddItem,
      AdminDesk,
      BtnAdd,
      BtnDelete,
      ModulusFull,
      Search,
      TableActions,
      TableComponent,
    },
    data() {
      return {
        url: 'https://inventor-system.herokuapp.com/api/gear/all',
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

</style>