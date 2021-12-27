<template>
<div>
  <admin-desk >
    <div class="title-container">
      <h1>Įmonės</h1>
      <button class="add-btn" @click="openAddCompanyCard">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 12H8M24 12H8M12 8V0V24" stroke="#C5C5C5" stroke-width="2"/>
        </svg>
      </button>
    </div> <!-- /title container-->

    <Search @setSearch="setSearch" />
    <!-- table -->
    <table-component>
      <tr class="head-row">
        <th>Įmonės pavadinimas</th>
        <th>Darbuotojų skaičius</th>
        <th>ID</th>
        <th></th>
      </tr>
      <tr v-for="item in list" :key="item.id">
        <td class="no-padding"><router-link :to="{name: item.id}">{{ item.name }}</router-link></td>
        <td class="no-padding"><router-link to="/">{{ item.user_count }}</router-link></td>
        <td class="no-padding"><router-link to="/">{{ item.id }}</router-link></td>
        <td class="actions-cell">
          <table-actions>
            <btn-edit @btnClicked="openEditCompanyCard(item.id, item.name)" />
            <span class="action-divider" />
            <btn-add-inventory @btnClicked="openAddUserCard(item.id)" />
            <span class="action-divider" />
            <btn-delete @btnClicked="openDeleteCompanyCard(item.id, item.name)" />
          </table-actions>
        </td>
      </tr>
    </table-component> <!-- /table container-->
  </admin-desk>

  <!-- add company card -->
  <modulus-full v-show="addCompanyOpen" @close="closeCard">
    <h3>Pridėti naują įmonę</h3>
      <form @submit.prevent="createCompany" >
        <!--    <input ref="firstInput" type="text" placeholder="Įmonės pavadinimas" required class="add-input">-->
        <input type="text" placeholder="Įmonės pavadinimas" required class="add-input" v-model="newCompanyName">

        <div class="btn-container">
          <p v-show="errorMsg" class="error-msg">{{ errorMsg }}</p>
          <button class="btn">Pridėti</button>
        </div>
      </form>
  </modulus-full>

  <!-- edit company card -->
  <modulus-full v-show="editCompanyOpen" @close="closeCard">
    <h3>Redaguoti įmonę</h3>
      <form @submit.prevent="editCompany(editCompanyId)" >
        <!--    <input ref="firstInput" type="text" placeholder="Įmonės pavadinimas" required class="add-input">-->
        <input type="text" placeholder="Įmonės pavadinimas" required class="add-input" v-model="newCompanyName">

        <div class="btn-container">
          <p v-show="errorMsg" class="error-msg">{{ errorMsg }}</p>
          <button class="btn">Redaguoti</button>
        </div>
      </form>
  </modulus-full>

  <!-- add user card-->
  <modulus-full v-if="addUserOpen" @close="closeCard">
    <h3>Pridėti Darbuotoją</h3>

    <form-item @onSubmit="addUser">
      <div>
        <input type="text"
               placeholder="Vardas" required
               v-model="newUser.first_name">
        <input type="text"
               placeholder="Pavardė" required
               v-model="newUser.last_name">
      </div>
      <input type="email"
             placeholder="Elektroninis paštas"
             class="input-long" required
             v-model="newUser.email">

      <select class="input-long" required v-model="newUser.company_id">
        <option selected hidden class="placeholder" value="">Įmonė</option>
        <option v-for="item in list" :key="item.id" :value="item.id">{{item.name}}</option> <!-- įmonių sąrašas -->
      </select>

      <div class="button-container">
        <p v-if="errorMsg" class="error-msg">Vartotojas šiuo elektroninio pašto adresu jau užregistruotas</p>
        <button class="btn" type="submit">Pridėti</button>
      </div>
    </form-item>
  </modulus-full>

  <modulus-full v-if="deleteCompanyOpen" @close="closeCard" >
    <div>
      <p>Ar tikrai norite ištrinti <strong>{{newCompanyName}}</strong>?</p>
      <button class="btn" @click="deleteCompany(editCompanyId)">Taip</button>
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
  import DataMixin from "@/components/mixins/DataMixin";
  import BtnDelete from "@/components/BtnDelete";
  import BtnEdit from "@/components/BtnEdit";
  import BtnAddInventory from "@/components/BtnAddInventory";
  import FormItem from "@/components/FormItem";
  export default {
    name: "AllCompanies",
    mixins: [ DataMixin ],
    components: {
      FormItem,
      BtnAddInventory,
      BtnEdit,
      BtnDelete,
      ModulusFull,
      TableActions,
      TableComponent,
      Search,
      AdminDesk
    },
    data() {
      return {
        url: 'https://inventor-system.herokuapp.com/api/companies',
        addCompanyOpen: false,
        editCompanyOpen: false,
        addUserOpen: false,
        deleteCompanyOpen: false,
        newCompanyName: '',
        editCompanyId: '',
        errorMsg: '',
        newUser: {
          first_name: '',
          last_name: '',
          email: '',
          company_id: '',
          role: 0,
        },
      }
    },
    created() {
      this.getData(this.url);
    },
    methods: {
      openAddCompanyCard(){
        this.addCompanyOpen = true;
        // this.$refs.firstInput.focus() // doesnt work
      },

      openEditCompanyCard(id, name){
        this.editCompanyId = id;
        this.newCompanyName = name;
        this.editCompanyOpen = true;
      },

      openAddUserCard(id){
        this.addUserOpen = true;
        // this.editCompanyId = id;
        this.newUser.company_id = id;
      },

      openDeleteCompanyCard(id, name){
        this.editCompanyId = id;
        this.deleteCompanyOpen = true;
        this.newCompanyName = name;
      },

      createCompany() {
        this.$http.post(
            this.url,
            { name: this.newCompanyName },
            this.config
        ).then(response => {
          console.log(response.data);
          this.addCompanyOpen = false;
          this.newCompanyName = '';
          this.errorMsg = "";
          this.getData(this.url);
          // clear search
        }).catch(error => {
          console.log(error);
          if(error.response.status === 400){
            if(error.response.data.error.name[0] === "The name has already been taken."){
              this.errorMsg = "Šiuo pavadinimu įmonė jau pridėta"
            }
          }
        })
      },

      editCompany(id){
        this.$http.put(
            this.url + '/' + id,
            { name: this.newCompanyName },
            this.config
        ).then(response => {
          console.log(response.data);
          this.editCompanyOpen = false;
          this.errorMsg = "";
          this.editCompanyId = '';
          this.newCompanyName = '';
          // clear search
          this.getData(this.url);
        }).catch(error => {
          console.log(error);
          if(error.response.status === 400){
            if(error.response.data.error.name[0] === "The name has already been taken."){
              this.errorMsg = "Šiuo pavadinimu įmonė jau pridėta"
            }
          }
        })
      },

      deleteCompany(id){
        this.deleteData(`${this.url}/${id}`, () => {
          this.deleteCompanyOpen = false;
          this.getData(this.url);
          this.newCompanyName = '';
          this.editCompanyId = '';
          // clear search
        }, () => {})

      },

      addUser(){
        this.postData(
            'https://inventor-system.herokuapp.com/api/users',
            this.newUser,
            this.userAdded,
            this.userAddError
        );
      },

      userAdded(){
        console.log("add user success");
        this.getData(this.url);
        this.addUserOpen = false;
        this.errorMsg = '';
        // vartotojas sekmingai pridetas
      },

      userAddError(error) {
        console.log("add user fail");
        if(error.response.status === 400 && error.response.data.message === "The email has already been taken"){
          this.errorMsg = true;
        }
      },


      closeCard(){
        this.addCompanyOpen = false;
        this.editCompanyOpen = false;
        this.addUserOpen = false;
        this.deleteCompanyOpen = false;
        this.newCompanyName = '';
        this.editCompanyId = '';
        this.errorMsg = '';
        this.newUser = {
          first_name: '',
              last_name: '',
              email: '',
              company_id: '',
              role: 0,
        };
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
    margin-bottom: 1.5em;
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