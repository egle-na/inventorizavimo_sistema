<template>
<div>
  <admin-desk>
    <div class="title-container">
      <h1>Įranga</h1>
      <button @click="addGearOpen = true" class="add-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 12H8M24 12H8M12 8V0V24" stroke="#C5C5C5" stroke-width="2"/>
        </svg>
      </button>
      <!-- Company filter-->
<!--      <select class="company-filter" v-model="companyFilter">-->
<!--        <option selected value="">Visos įmonės</option>-->
<!--        <option v-for="item in additionalList" :key="item.name" :value="item.id">{{ item.name }}</option>-->
<!--      </select>-->
    </div> <!-- /title container-->

    <search @setSearch="setSearch"/>

    <table-component>
      <tr class="head-row">
        <th class="cell-min"></th>
        <th>Pavadinimas</th>
        <th>Kodas</th>
        <th>Kiekis</th>
        <th></th>
      </tr>
      <tbody v-for="item in list" :key="item.id">
        <tr class="main-trow" :class="{'row-selected': rowExpanded === item}">
          <td class="cell-min"></td>
          <td>{{ item.name }}</td>
          <td>{{ item.code }}</td>
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
                <th class="cell-min"></th>
                <th>Serijos Numeris</th>
                <th>Savininkas</th>
                <th>Statusas</th>
                <th></th>
              </tr>
              <tr v-for="gear in item.gear" :key="gear.id" class="expanded-trow">
                <td class="cell-min">1</td>
                <td>{{ gear.serial_number }}</td>
                <td>{{ ownersName(gear.user_id) }}</td>
                <td v-if="gear.long_term">Ilgalaikis</td>
                <td v-else>Trumpalaikis</td>
                <td class="actions-cell">
                  <table-actions>
                    <btn-delete/>
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
<!--      <h2>Pridėti Įrangą</h2>-->

<!--      <form-item @onSubmit="addNewGear">-->
<!--        <input type="text" placeholder="Pavadinimas" required class="input-long" v-model="newGear.name" >-->
<!--        <textarea placeholder="Aprašymas" required class="input-long" />&lt;!&ndash; nepriskirta &ndash;&gt;-->
<!--        <div>-->
<!--          <input type="text" placeholder="Kodas" required >&lt;!&ndash; nepriskirta &ndash;&gt;-->
<!--          <input type="text" placeholder="Serijos Numeris" required v-model="newGear.serial_number" >-->
<!--        </div>-->
<!--        <div class="relative-container">-->
<!--          <input type="text" placeholder="Kiekis" required >&lt;!&ndash; nepriskirta &ndash;&gt;-->
<!--          <input type="number" step=".01" placeholder="Vieneto Kaina" id="unit-price" required v-model="newGear.unit_price">-->
<!--          <label for="unit-price" id="euro-sign">€</label>-->
<!--        </div>-->

<!--        <div class="btn-container">-->
<!--          <div>-->
<!--            <label>-->
<!--              <input type="radio" name="long-term" value="true" v-model="newGear.long_term">-->
<!--              Ilgalaikė įranga-->
<!--            </label>-->

<!--            <label>-->
<!--              <input type="radio" name="long-term" value="false" v-model="newGear.long_term">-->
<!--              Trumpalaikė įranga-->
<!--            </label>-->
<!--          </div>-->

<!--          <button class="btn">Pridėti</button>-->
<!--        </div>-->
<!--      </form-item>-->
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
  // import FormItem from "@/components/FormItem";
  import AddItem from "@/components/AddItem";
  import BtnDelete from "@/components/BtnDelete";
  export default {
    name: "AllItems",
    mixins: [ DataMixin ],
    components: {
      BtnDelete,
      AddItem,
      // FormItem,
      ModulusFull,
      TableActions,
      Search,
      TableComponent,
      AdminDesk,
    },
    data() {
      return {
        url: 'https://inventor-system.herokuapp.com/api/gear/all',
        addit_get_url: 'https://inventor-system.herokuapp.com/api/users/all',
        companyFilter: '',
        rowExpanded: '',
        addGearOpen: false,
        // list: [],
        // newGear: {
        //   name: '',
        //   serial_number: '',
        //   // quantity: '',
        //   unit_price: '',
        //   long_term: true,
        //   user_id: this.$store.getters.user.id,
        // },
      }
    },
    created() {
      this.getAdditionalData(this.addit_get_url);
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
      // addNewGear() {
      //   this.postData(
      //       'https://inventor-system.herokuapp.com/api/gear',
      //       this.newGear,
      //       this.addGearSuccess,
      //       this.addGearError )
      // },
      addGearSuccess() {
        this.addGearOpen = false;
        this.getData(this.url);
      },

      ownersName(id){
        if(this.additionalList.length) {
          let {first_name, last_name} = this.additionalList.find(user => user.id === id);
          return `${first_name} ${last_name}`
        }
      },
      // addGearError() {
      //
      // }
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