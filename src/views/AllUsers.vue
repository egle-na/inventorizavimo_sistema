<template>
<div>
  <admin-desk>

    <!-- title -->
    <div class="title-container">
      <h1>Darbuotojai</h1>
      <button class="add-btn" title="Pridėti darbuotoją" @click="addUserCardOpen=true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 12H8M24 12H8M12 8V0V24" stroke="#C5C5C5" stroke-width="2"/>
        </svg>
      </button>

      <select class="company-filter" v-model="params.company" @change="getDataQuery(url, params)">
        <option selected value="" class="placeholder">Visi darbuotojai</option> <!-- Visos įmonės-->
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
        <td class="no-padding"><router-link :to="{path: 'user-inventory/' + item.id}">{{ item.first_name }} {{ item.last_name }}</router-link></td>
        <td>{{ item.email }}</td>
        <td>{{ item.gear_count }}</td>
        <td class="actions-cell">
          <!-- prideti suteikti admino teises-->
          <table-actions>
<!--            <btn-view :to="'inventory' + item.id" /> &lt;!&ndash; fix &ndash;&gt;-->
<!--            <span class="action-divider" />-->
            <btn-edit @btnClicked="openEditUser(item.id)" />
            <span class="action-divider" />
            <btn-add-inventory title="Priskirti įrangos" @btnClicked="addGearToUser(item.id)" />
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

  <modulus-full v-if="addGearOpen" @close="closeCard">
    <add-item :user="selectedUser.id" @success="addGearSuccess"/>
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
  import AddItem from "@/components/AddItem";
  import usersMixin from "@/components/mixins/UsersMixin";
  // import BtnView from "@/components/BtnView";

  export default {
    name: "AllUsers",
    mixins: [ DataMixin, usersMixin ],
    data(){
      return {
        url: "https://inventor-system.herokuapp.com/api/users/all",
        // companyFilter: '',
        addUserCardOpen: false,
        editUserCardOpen: false,
        addUserError: false,
        addGearOpen: false,
        selectedUser: { },
        newUser: {
          first_name: '',
          last_name: '',
          email: '',
          company_id: '',
          role: 0,
        },
        params: {
          search: '',
          company: '',
        }
      }
    },
    components: {
      AddItem,
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
      if( this.$route.params.company_id ){
        this.params.company = this.$route.params.company_id;
      }
      this.getDataQuery(this.url, this.params);
      // this.getUsersList(); // get users list
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
        this.getUsersList(); // store updated users list
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
        let oldUser = this.list.filter(item => item.id === id)[0];
        console.log('old: ',oldUser);

        if( oldUser.first_name !== first_name ){
          params.first_name = first_name;
        }
        if( oldUser.last_name !== last_name ){
          params.last_name = last_name;
        }
        if( oldUser.email !== email ){
          params.email = email;
        }

        // console.log(changeRole) //
        if( changeRole) {
          params.role = oldUser.role === 1 ? 0 :
              oldUser.role === 0 && 1;
        }

        if(Object.keys(params).length !== 0) {
          console.log('params: ',params)
          this.$http.put(
              "https://inventor-system.herokuapp.com/api/users/" + id,
              params,
              this.config
          ).then(() => {
            this.editUserCardOpen = false;
            // this.errorMsg = '';
            this.refreshUsersToken(); // do I?
            this.getDataQuery(this.url, this.params);
            this.getUsersList(); // store updated users list
          }).catch(err => {
            if(err.response.status === 401){
              this.$router.push('/')
            }
          })
        }
      },

      addGearToUser(id){
        this.selectedUser.id = id;
        this.addGearOpen = true;
        console.log('add inventory to: ', id);
      },

      addGearSuccess() {
        this.selectedUser = {};
        this.addGearOpen = false;
        this.getDataQuery(this.url, this.params);
        // get updated users list?
      },

      openEditUser(id){
        console.log('edit: ', id);
        this.selectedUser = {...this.list.find(item => item.id === id)};
        this.editUserCardOpen = true;
      },

      openDeleteUser(id){
        console.log('delete: ', id);
      },

      setSearch(val) {
        this.params.search = val
        this.getDataQuery(this.url, this.params);
      },

      closeCard() {
        this.addUserCardOpen = false;
        this.editUserCardOpen = false;
        this.addGearOpen = false;
        this.selectedUser = {};
        this.newUser = {
          first_name: '',
          last_name: '',
          email: '',
          company_id: '',
          role: 0,
        };
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