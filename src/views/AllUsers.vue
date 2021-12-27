<template>
<div>
  <admin-desk>

    <!-- title -->
    <div class="title-container">
      <h1>Darbuotojai</h1>
      <button class="add-btn" @click="addUserCardOpen=true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 12H8M24 12H8M12 8V0V24" stroke="#C5C5C5" stroke-width="2"/>
        </svg>
      </button>

      <select class="company-filter" v-model="companyFilter">
        <option selected hidden value="" class="placeholder">Įmonės pavadinimas</option> <!-- Visos įmonės-->
        <option v-for="item in additionalList" :key="item.id" :value="item.id">{{ item.name }}</option>
      </select>

    </div> <!-- /title container-->

    <Search @setSearch="setSearch" />
    <!-- table -->
    <table-component>
      <tr class="head-row">
        <th>Vardas Pavardė</th>
        <th>Elektroninis paštas</th>
        <th>Įrangos kiekis</th>
        <th></th>
      </tr>
      <tr v-for="item in list" :key="item.id">
        <td>{{ item.first_name }} {{ item.last_name }}</td>
        <td>{{ item.email }}</td>
        <td>5</td>
        <td class="actions-cell">
          <!-- prideti suteikti admino teises-->
          <table-actions>
<!--            <btn-view :to="'inventory' + item.id" /> &lt;!&ndash; fix &ndash;&gt;-->
<!--            <span class="action-divider" />-->
            <btn-edit @btnClicked="openEditUser(item.id)" />
            <span class="action-divider" />
            <btn-add-inventory @btnClicked="addGearToUser(item.id)" />
            <span class="action-divider" />
            <btn-delete @btnClicked="openDeleteUser(item.id)" />

          </table-actions>
        </td>
      </tr>

    </table-component> <!-- /table container-->
  </admin-desk>

  <!-- add user card-->
  <modulus-full v-if="addUserCardOpen" @close="closeCard">
<!--    <add-user :companyList="additionalList" @createUser="createUser" />-->
    <h3>Pridėti Darbuotoją</h3>

    <form-item @onSubmit="createUser">
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
        <option v-for="item in additionalList" :key="item.id" :value="item.id">{{item.name}}</option> <!-- įmonių sąrašas -->
      </select>

      <div class="button-container">
        <p v-if="addUserError" class="error-msg">Vartotojas šiuo elektroninio pašto adresu jau užregistruotas</p>
        <button class="btn" type="submit">Pridėti</button>
      </div>
    </form-item>
  </modulus-full>

  <!-- edit user card-->
  <modulus-full v-if="editUserCardOpen" @close="closeCard">
    <h3>Redaguoti Darbuotoją</h3>

    <form-item @onSubmit="editUser(selectedUser)">
      <div>
        <input type="text"
               placeholder="Vardas" required
               v-model="selectedUser.first_name">
        <input type="text"
               placeholder="Pavardė" required
               v-model="selectedUser.last_name">
      </div>
      <input type="email"
             placeholder="Elektroninis paštas"
             class="input-long" required
             v-model="selectedUser.email">

      <label v-show="selectedUser.role === 0"><input type="checkbox" v-model="selectedUser.changeRole">Suteikti administratoriaus teises</label>
      <label v-show="selectedUser.role === 1"><input type="checkbox" v-model="selectedUser.changeRole">Pašalinti administratoriaus teises</label>

      <div class="button-container">
        <p v-if="addUserError" class="error-msg">Vartotojas šiuo elektroninio pašto adresu jau užregistruotas</p>
        <button class="btn" type="submit">Redaguoti</button>
      </div>
    </form-item>
  </modulus-full>
</div>
</template>

<script>
  import AdminDesk from "@/components/AdminDesk";
  import Search from "@/components/Search";
  import TableComponent from "@/components/TableComponent";
  import TableActions from "@/components/TableActions";
  import DataMixin from "@/components/mixins/DataMixin";
  import ModulusFull from "@/components/ModulusFull";
  // import AddUser from "@/components/AddUser";
  import FormItem from "@/components/FormItem";
  import BtnDelete from "@/components/BtnDelete";
  import BtnAddInventory from "@/components/BtnAddInventory";
  import BtnEdit from "@/components/BtnEdit";
  // import BtnView from "@/components/BtnView";

  export default {
    name: "AllUsers",
    mixins: [ DataMixin ],
    data(){
      return {
        url: "https://inventor-system.herokuapp.com/api/users",
        // search: '',
        companyFilter: '',
        addUserCardOpen: false,
        editUserCardOpen: false,
        addUserError: false,
        selectedUser: { },
        newUser: {
          first_name: '',
          last_name: '',
          email: '',
          company_id: '',
          role: 0,
        },
      }
    },
    components: {
      // BtnView,
      BtnEdit,
      BtnAddInventory,
      BtnDelete,
      FormItem,
      // AddUser,
      ModulusFull,
      TableActions,
      TableComponent,
      Search,
      AdminDesk
    },
    created() {
      this.getData(this.url);
      this.getAdditionalData("https://inventor-system.herokuapp.com/api/companies")
    },
    methods: {

      createUser() {
        this.postData(
            this.url,
            this.newUser,
            this.userAdded,
            this.userAddError
        );
      },

      userAdded(){
        console.log("success");
        this.getData(this.url);
        this.addUserCardOpen = false;
      },

      userAddError(error) {
        console.log("fail");
        if(error.response.status === 400 && error.response.data.message === "The email has already been taken"){
          this.addUserError = true;
        }
      },

      editUser({id, first_name, last_name, email, changeRole}) {
        let params = {};
        let oldUser = this.list.find(item => item.id = id);

        if( oldUser.first_name !== first_name ){
          params.first_name = first_name;
        }
        if( oldUser.last_name !== last_name ){
          params.last_name = last_name;
        }
        if( oldUser.email !== email ){
          params.email = email;
        }

        console.log(changeRole) //
        if( changeRole) {
          params.role = oldUser.role === 1 ? 0 :
              oldUser.role === 0 && 1;
        }

        if(Object.keys(params).length !== 0) {
          console.log(params)
          // this.$http.put(
          //     "https://inventor-system.herokuapp.com/api/users/" + id,
          //     params,
          //     this.config
          // ).then()
        }
      },

      addGearToUser(id){
        console.log('add inventory to: ', id);
      },

      openEditUser(id){
        console.log('edit: ', id);
        this.editUserCardOpen = true;
        this.selectedUser = {...this.list.find(item => item.id = id)};
      },

      openDeleteUser(id){
        console.log('delete: ', id);
      },

      closeCard() {
        this.addUserCardOpen = false;
        this.selectedUser = {};
        this.newUser = {
          first_name: '',
          last_name: '',
          email: '',
          company_id: '',
          role: 0,
        };
        this.editUserCardOpen = false;
      }
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

  .company-filter:not(.placeholder) {
    color: var(--clr-black);
  }

  /*option[selected]{*/
  /*  color: var(--clr-black)*/
  /*}*/

  /* Table Design */

  td, th {
    border: none;
    text-align: center;
  }

  th {
    background: var(--clr-white);
    color: var(--clr-dark-grey);
  }

  th:not(:first-child){ /* column dividers fir sticky header */
    box-shadow:none;
  }

  h2{
    margin-top: .4em;
  }

  .button-container {
    display: flex;
  }

  .error-msg {
    color: #FF6464;
    margin: 0 1em 0 0;
  }

</style>