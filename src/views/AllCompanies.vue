<template>
<div>
  <admin-desk >
    <div class="title-container">
      <h1>Visos Įmonės</h1>
      <button class="add-btn" @click="openAddCompanyCard">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 12H8M24 12H8M12 8V0V24" stroke="#C5C5C5" stroke-width="2"/>
        </svg>
      </button>
    </div> <!-- /title container-->

    <Search />

    <table-component>
      <tr class="head-row">
        <th>Įmonės pavadinimas</th>
        <th>Darbuotojų skaičius</th>
        <th>Įrangos kiekis</th>
        <th></th>
      </tr>
      <tr v-for="item in list" :key="item.id">
        <td class="no-padding"><router-link to="/">{{ item.name }}</router-link></td>
        <td class="no-padding"><router-link to="/">23</router-link></td>
        <td class="no-padding"><router-link to="/">94</router-link></td>
        <td class="actions-cell">
          <table-actions/>
        </td>
      </tr>

    </table-component> <!-- /table container-->
  </admin-desk>

  <modulus-full v-show="addCompanyOpen" @close="addCompanyOpen = false">
    <h3>Pridėti naują įmonę</h3>

<!--    <input ref="firstInput" type="text" placeholder="Įmonės pavadinimas" required class="add-input">-->
    <input type="text" placeholder="Įmonės pavadinimas" required class="add-input" v-model="newCompanyName">

    <div class="btn-container">
      <p v-show="errorMsg" class="error-msg">{{ errorMsg }}</p>
      <button @click="createCompany" class="btn">Pridėti</button>
    </div>
  </modulus-full>

</div>
</template>

<script>
  import AdminDesk from "@/components/AdminDesk";
  import Search from "@/components/Search";
  import TableComponent from "@/components/TableComponent";
  import TableActions from "@/components/TableActions";
  import ModulusFull from "@/components/ModulusFull";
  import GetDataMixin from "@/components/mixins/GetDataMixin";
  export default {
    name: "AllCompanies",
    mixins:[ GetDataMixin ],
    components: {
      ModulusFull,
      TableActions,
      TableComponent,
      Search,
      AdminDesk
    },
    data() {
      return {
        addCompanyOpen: false,
        newCompanyName: '',
        errorMsg: '',
        list: [],
      }
    },
    created() {
      this.getData('https://inventor-system.herokuapp.com/api/companies');
    },
    methods: {
      openAddCompanyCard(){
        this.addCompanyOpen = true;
        // this.$refs.firstInput.focus() // doesnt work
      },

      createCompany() {
        this.$http.post(
            'https://inventor-system.herokuapp.com/api/companies',
            { name: this.newCompanyName },
            this.config
        ).then(response => {
          console.log(response.data);
          this.errorMsg = "";
          this.addCompanyOpen = false;
          this.getData('https://inventor-system.herokuapp.com/api/companies');
        }).catch(error => {
          console.log(error);
          if(error.response.status === 400){
            if(error.response.data.error.name[0] === "The name has already been taken."){
              this.errorMsg = "Šiuo pavadinimu įmonė jau pridėta"
            }
          }
        })
      },
    }
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

  .add-input{
    margin: 1.5em 0;
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
  th:first-child,
  td:first-child {
    padding-left: 1em ;
    text-align: left;
  }

  th:not(:first-child){ /* column dividers fir sticky header */
    box-shadow:none;
  }

  .error-msg {
    color: #FF6464;
    margin: 0 auto 0 0;
  }


</style>