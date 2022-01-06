<template>
<div>
  <admin-desk >
    <!-- Title container-->
    <div class="title-container">
      <h1>Įmonės</h1>
      <btn-add  title="Pridėti įmonę" @btnClicked="openAddCompanyCard" />
    </div>

    <Search @setSearch="setSearch" />

    <!-- Table -->
    <table-component>
      <tr class="head-row non-mobile">
        <th>Pavadinimas</th>
        <th class="non-mobile">Darbuotojai</th>
        <th class="mobile"></th>
<!--        <th>ID</th>-->
        <th></th>
      </tr>
      <tr v-for="item in list" :key="item.id" :class="{'mobile-focus': mobileActions === item.id}">
        <td class="no-padding"><router-link :to="{name: 'all-users', params: {company_id: item.id}}">{{ item.name }}</router-link></td>
        <td class="no-padding"><router-link :to="{name: 'all-users', params: {company_id: item.id}}">{{ item.user_count }}</router-link></td>
<!--        <td class="no-padding"><router-link :to="{name: 'all-users', params: {company_id: item.id}}">{{ item.id }}</router-link></td>-->
        <!-- Non Mobile Table Actions -->
        <td class="actions-cell non-mobile">
          <table-actions>
            <btn-edit @btnClicked="openEditCompanyCard(item.id, item.name)" />
            <span class="action-divider" />
            <btn-add-inventory @btnClicked="openAddUserCard(item.id)" title="Pridėti darbuotoją" />
            <span class="action-divider" />
            <btn-delete @btnClicked="openDeleteCompanyCard(item.id, item.name)" />
          </table-actions>
        </td>
        <!-- Mobile Table Actions -->
        <td class="mobile mobile-actions">
          <button @click="openMobileActions(item.id, $event)">
            <img src="../assets/icons/action-dots.svg" alt="">
          </button>
<!--          <action-card :style="{top :mobileActionsPos+'px'}" class="mobile-actions-card" v-if="mobileActions === item.id" @close="mobileActions = false">-->
<!--            <button @click="openEditCompanyCard(item.id, item.name)">Redaguoti</button>-->

<!--            <button @click="openAddUserCard(item.id)">Pridėti Darbuotoją</button>-->

<!--            <button @click="openDeleteCompanyCard(item.id, item.name)">Ištrinti</button>-->
<!--          </action-card>-->
        </td>
      </tr>
    </table-component> <!-- /table container-->
  </admin-desk>

  <!-- Mobile Table Actions -->
  <action-card :style="{top: mobileActionsPos+'px'}" class="mobile-actions-card" v-if="mobileActions" @close="mobileActions = false">
    <button @click="openEditCompanyCard(mobileActions, 'item.name')">Redaguoti</button>

    <button @click="openAddUserCard(mobileActions)">Pridėti Darbuotoją</button>

    <button @click="openDeleteCompanyCard(mobileActions, 'item.name')">Ištrinti</button>
  </action-card>

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
  import ActionCard from "@/components/ActionCard";
  import BtnAdd from "@/views/BtnAdd";
  export default {
    name: "AllCompanies",
    mixins: [ DataMixin ],
    components: {
      BtnAdd,
      ActionCard,
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
        mobileActions: false,
        mobileActionsPos: '',
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
        // this.editCompanyId = id;
        this.newUser.company_id = id;
        this.addUserOpen = true;
      },

      openDeleteCompanyCard(id, name){
        this.editCompanyId = id;
        this.newCompanyName = name;
        this.deleteCompanyOpen = true;
      },

      openMobileActions(id, event){
        this.mobileActions = id;
        this.mobileActionsPos = event.pageY + 10;
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
          this.mobileActions = false;
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

  .add-input{
    margin-bottom: 1.5em;
  }

  /* Table Design */

  td, th {
    /*border: none;*/
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

  th:not(:first-child){ /* column dividers for sticky header */
    box-shadow:none;
  }

  .error-msg {
    color: #FF6464;
    margin: 0 auto 0 0;
  }

  @media(min-width: 580px){
    td, th {
      border: none;
      /*text-align: center;*/
    }
    .mobile-filter{
      position: absolute;
    }

    .mobile-actions-card{
      position: absolute;
    }
  }


</style>