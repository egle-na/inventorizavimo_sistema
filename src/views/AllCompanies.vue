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
    <table-component v-on:scroll.native="mobileActions = false">

      <tr class="head-row non-mobile">
        <th>Pavadinimas</th>
        <th class="non-mobile">Darbuotojai</th>
        <th class="mobile"></th>
        <th></th>
      </tr>

      <tr v-for="item in list" :key="item.id" :class="{'mobile-focus': mobileActions === item.id}">
        <td class="no-padding"><router-link :to="{name: 'all-users', params: {company_id: item.id}}">{{ item.name }}</router-link></td>
        <td class="no-padding"><router-link :to="{name: 'all-users', params: {company_id: item.id}}">{{ item.user_count }}</router-link></td>

        <!-- Non Mobile Table Actions -->
        <td class="actions-cell non-mobile">
          <table-actions>  <!-- td ikelti vidun -->

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
<!--  <modulus-full v-if="addUserOpen && false" @close="closeCard">-->
<!--    <h3>Pridėti Darbuotoją</h3>-->

<!--    <form-item @onSubmit="addUser">-->
<!--      <div>-->
<!--        <input type="text"-->
<!--               placeholder="Vardas" required-->
<!--               v-model="newUser.first_name">-->
<!--        <input type="text"-->
<!--               placeholder="Pavardė" required-->
<!--               v-model="newUser.last_name">-->
<!--      </div>-->
<!--      <input type="email"-->
<!--             placeholder="Elektroninis paštas"-->
<!--             class="input-long" required-->
<!--             v-model="newUser.email">-->

<!--      <select class="input-long" required v-model="newUser.company_id">-->
<!--        <option selected hidden class="placeholder" value="">Įmonė</option>-->
<!--        <option v-for="item in list" :key="item.id" :value="item.id">{{item.name}}</option> &lt;!&ndash; įmonių sąrašas &ndash;&gt;-->
<!--      </select>-->

<!--      <div class="button-container">-->
<!--        <p v-if="errorMsg" class="error-msg">Vartotojas šiuo elektroninio pašto adresu jau užregistruotas</p>-->
<!--        <button class="btn" type="submit">Pridėti</button>-->
<!--      </div>-->
<!--    </form-item>-->
<!--  </modulus-full>-->

  <modulus-full v-if="addUserOpen" @close="closeCard">
    <add-user @createUser="addUser" :companyList="list" :errorMsg="errorMsg" :company_id="addUserOpen" />
  </modulus-full>

  <!-- Delete card-->
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
  import Search from "@/components/Search";
  import TableComponent from "@/components/TableComponent";
  import TableActions from "@/components/TableActions";
  import ModulusFull from "@/components/ModulusFull";
  import BtnDelete from "@/components/BtnDelete";
  import BtnEdit from "@/components/BtnEdit";
  import BtnAddInventory from "@/components/BtnAddInventory";
  import ActionCard from "@/components/ActionCard";
  import BtnAdd from "@/views/BtnAdd";
  import AddUser from "@/components/AddUser";
  export default {
    name: "AllCompanies",
    mixins: [ DataMixin ],
    components: {
      AddUser,
      BtnAdd,
      ActionCard,
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
          this.getData(this.url) // need to clear search input
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
          this.errorMsg = '';
        }, () => {
          this.errorMsg = 'Negalima ištrinti įmonės, kurioje dar yra darbuotojų'
        })
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

    /*.mobile-filter{*/
    /*  position: absolute;*/
    /*}*/

    .mobile-actions-card{
      position: absolute;
    }
  }


</style>