<template>
<div>
  <admin-desk>
    <!-- Title container -->
    <div class="title-container">
      <h1>{{ $t('navigation.inventory') }}</h1>
      <btn-component :btnType="'add'" @btnClicked="addGearOpen = true" :title="$t('gear.add-gear')" />
    </div>

    <!-- Search -->
    <Search @setSearch="setSearch"/>

    <!-- Table -->
    <table-component>

      <!-- table labels -->
      <tr class="head-row">
        <th>{{ $t('gear.title') }}</th>
        <th class="tablet-hide">{{ $t('gear.code') }}</th>
        <th>{{ $t('gear.amount') }}</th>
        <th></th>
      </tr>

      <!-- main data -->
      <tbody v-for="item in list" :key="item.id">
        <tr class="main-trow" :class="{'row-selected': rowExpanded === item}">
          <td @click="expandRow(item)">{{ item.name }}</td>
          <td @click="expandRow(item)" class="tablet-hide">{{ item.code }}</td>
          <td @click="expandRow(item)">{{ item.count }}</td>
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
                <th class="non-mobile">{{ $t('gear.serial-number') }}</th>
                <th class="mobile" colspan="2" >{{ $t('gear.serial-nr') }}</th>
                <th>{{ $t('gear.owner') }}</th>
                <th class="tablet-hide">{{ $t('gear.status') }}</th>
                <th></th>
              </tr>

              <!-- expanded rows main data -->
              <tr v-for="(gear, index) in item.gear" :key="gear.id" class="expanded-trow">
                <td class="cell-min">{{ index + 1 }}</td>
                <td class="no-padding">
                  <router-link :to="'/inventory/'+ gear.id">{{ gear.serial_number }}</router-link>
                </td>
                <td>{{ ownersName(gear.user_id) }}</td>
                <td v-if="gear.long_term" class="tablet-hide">{{ $t('gear.long-term') }}</td>
                <td v-else class="tablet-hide">{{ $t('gear.short-term') }}</td>
                <td class="actions-cell">
                  <table-actions>
                    <btn-component :btnType="'delete'" @btnClicked="deleteCardOpen = gear.id; gearName = gear.name" :title="$t('action.delete')" />
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
  <delete-card v-if="deleteCardOpen"
               @close="deleteCardOpen = false; errorMsg = ''; gearName = ''"
               :errorMsg="errorMsg"
               @delete="deleteGear(deleteCardOpen)" >
    <p>{{ $t('action.messages.remove-ready') }} <strong>{{ gearName }}</strong>?</p>
  </delete-card>

</div>
</template>

<script>
  import DataMixin from "@/components/mixins/DataMixin";
  import GearActionsMixin from "@/components/mixins/GearActionsMixin";
  import AddItem from "@/components/AddItem";
  import AdminDesk from "@/components/AdminDesk";
  import BtnComponent from "@/components/BtnComponent";
  import DeleteCard from "@/components/DeleteCard";
  import ModulusFull from "@/components/ModulusFull";
  import Search from "@/components/Search";
  import TableActions from "@/components/TableActions";
  import TableComponent from "@/components/TableComponent";
  import {EventBus} from "@/main";
  export default {
    name: "Gear",
    mixins: [ DataMixin, GearActionsMixin ],
    components: {
      AddItem,
      AdminDesk,
      BtnComponent,
      DeleteCard,
      ModulusFull,
      Search,
      TableActions,
      TableComponent,
    },
    data() {
      return {
        url: this.$store.getters.API_baseURL + '/gear/all',
        rowExpanded: '',
        addGearOpen: false,
        deleteCardOpen: false,
        errorMsg: '',
        gearName: '',
      }
    },
    created() {
      document.title = this.$t('navigation.inventory') + this.$t('tab-title_base');
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
        EventBus.$emit('displayMessage', this.$t('messages.gear-add-success'));
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