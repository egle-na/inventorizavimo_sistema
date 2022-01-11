<template>
<div>
  <admin-desk >

    <!-- Title container-->
    <div class="title-container">
      <h1>Įmonės</h1>
      <btn-component :btnType="'add'" title="Pridėti įmonę" @btnClicked="openAddCompanyCard" />
    </div>

    <Search @setSearch="setSearch" />

    <!-- Table -->
    <table-component @scroll.native="closeMobileAction">

      <!-- table labels -->
      <tr class="head-row non-mobile">
        <th>Pavadinimas</th>
        <th class="non-mobile">Darbuotojai</th>
        <th class="mobile"></th>
        <th></th>
      </tr>

      <!-- main data -->
      <tr v-for="item in list" :key="item.id" :class="{'mobile-focus': mobileActions === item.id}">
        <td class="no-padding"><router-link :to="{name: 'all-users', params: {company_id: item.id}}">{{ item.name }}</router-link></td>
        <td class="no-padding"><router-link :to="{name: 'all-users', params: {company_id: item.id}}">{{ item.user_count }}</router-link></td>

        <!-- Non Mobile Table Actions -->
        <td class="actions-cell non-mobile">
          <table-actions>  <!-- td ikelti vidun -->

            <btn-component :btnType="'edit'" @btnClicked="openEditCompanyCard(item.id, item.name)" title="Redaguoti" />
            <span class="action-divider" />
            <btn-component :btnType="'add-action'" @btnClicked="openAddUserCard(item.id)" title="Pridėti darbuotoją" />
            <span class="action-divider" />
            <btn-component :btnType="'delete'" @btnClicked="openDeleteCompanyCard(item.id, item.name)" title="Ištrinti" />

          </table-actions>
        </td>

        <!-- Mobile Table Actions -->
        <td class="mobile mobile-actions">
          <button @click="openMobileActions(item.id, $event)">
            <img src="../assets/icons/action-dots.svg" alt="">
          </button>
        </td>
      </tr>
    </table-component>
  </admin-desk>

  <!-- Mobile table actions card -->
  <action-card :style="{top: mobileActionsPos+'px'}" class="mobile-actions-card" v-if="mobileActions" @close="mobileActions = false">
    <button @click="openEditCompanyCard(mobileActions)">Redaguoti</button>
    <button @click="openAddUserCard(mobileActions)">Pridėti Darbuotoją</button>
    <button @click="openDeleteCompanyCard(mobileActions)">Ištrinti</button>
  </action-card>

  <!-- Add company card -->
  <modulus-full v-show="addCompanyOpen" @close="closeCard">
    <h3>Pridėti naują įmonę</h3>
      <form @submit.prevent="createCompany">

        <input type="text" placeholder="Įmonės pavadinimas" required class="add-input" v-model="newCompanyName">
        <div class="btn-container">
          <p v-show="errorMsg" class="error-msg">{{ errorMsg }}</p>
          <button class="btn">Pridėti</button>
        </div>

      </form>
  </modulus-full>

  <!-- Edit company card -->
  <modulus-full v-show="editCompanyOpen" @close="closeCard">
    <h3>Redaguoti įmonę</h3>
      <form @submit.prevent="editCompany(editCompanyId)">

        <input type="text" placeholder="Įmonės pavadinimas" required class="add-input" v-model="newCompanyName">
        <div class="btn-container">
          <p v-show="errorMsg" class="error-msg">{{ errorMsg }}</p>
          <button class="btn">Redaguoti</button>
        </div>

      </form>
  </modulus-full>

  <!-- Add user card-->
  <modulus-full v-if="addUserOpen" @close="closeCard">
    <add-user @createUser="addUser" :companyList="list" :errorMsg="errorMsg" :company_id="addUserOpen" />
  </modulus-full>

  <!-- Delete company -->
  <modulus-full v-if="deleteCompanyOpen" @close="closeCard" >
    <p>Ar tikrai norite ištrinti <strong>{{newCompanyName}}</strong>?</p>
    <div class="btn-container">
      <p v-show="errorMsg" class="error-msg">{{ errorMsg }}</p>
      <button class="btn" @click="deleteCompany(editCompanyId)">Taip</button>
    </div>
  </modulus-full>

</div>
</template>

<script>
  import DataMixin from "@/components/mixins/DataMixin";
  import AdminDesk from "@/components/AdminDesk";
  import ActionCard from "@/components/ActionCard";
  import AddUser from "@/components/AddUser";
  import ModulusFull from "@/components/ModulusFull";
  import Search from "@/components/Search";
  import TableActions from "@/components/TableActions";
  import TableComponent from "@/components/TableComponent";
  import BtnComponent from "@/components/BtnComponent";
  import {EventBus} from "@/main";
  export default {
    name: "AllCompanies",
    mixins: [ DataMixin ],
    components: {
      BtnComponent,
      AddUser,
      AdminDesk,
      ActionCard,
      ModulusFull,
      Search,
      TableActions,
      TableComponent,
    },
    data() {
      return {
        url: this.$store.getters.API_baseURL + '/companies',
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
      },

      openEditCompanyCard(id, name){
        this.editCompanyId = id;
        this.newCompanyName = name;
        this.editCompanyOpen = true;
      },

      openAddUserCard(id){
        this.addUserOpen = id;
      },

      openDeleteCompanyCard(id, name){
        this.editCompanyId = id;
        this.newCompanyName = name;
        this.deleteCompanyOpen = true;
      },

      openMobileActions(id, event){
        this.mobileActions = id;
        this.mobileActionsPos = event.pageY + 15 ;
        if((window.innerHeight - event.clientY) < 190){
          this.mobileActionsPos = event.pageY - 180 ;
        }
      },

      closeMobileAction(){
        if(this.mobileActions){
          this.mobileActions = false;
        }
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
          this.getData(this.url) // need to clear search input
          EventBus.$emit('displayMessage', 'Įmonė pridėta sėkmingai!');
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
          EventBus.$emit('displayMessage', 'Įmonės redagavimas sėkmingas!');
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
          this.errorMsg = '';
          EventBus.$emit('displayMessage', 'Įmonė ištrinta!');
        }, () => {
          this.errorMsg = 'Negalima ištrinti įmonės, kurioje dar yra darbuotojų'
        })
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
    box-shadow: none;
  }

  @media(min-width: 580px){
    td, th {
      border: none;
    }

    .mobile-actions-card{
      position: absolute;
    }
  }


</style>