<template>
<div>
  <admin-desk>

    <!-- Title container -->
    <div class="title-container">
      <!-- title -->
      <div class="no-shrink">
        <h1>Darbuotojai</h1>
        <btn-component :btnType="'add'" title="Pridėti darbuotoją" @btnClicked="addUserOpen=true; mobileActions = false"/>
      </div>

      <!-- filter -->
      <select class="company-filter" v-model="params.company" @change="getDataQuery(url, params); mobileActions = false">
        <option selected value="" class="placeholder">Visi darbuotojai</option> <!-- Visos įmonės-->
        <option v-for="item in additionalList" :key="item.id" :value="item.id">{{ item.name }}</option>
      </select>
    </div> <!-- /title container-->

    <Search @setSearch="setSearch" />

    <!-- Table -->
    <table-component @scroll.native="closeMobileAction">

      <!-- table labels -->
      <tr class="head-row">
        <th>Vardas Pavardė</th>
        <th class="tablet-hide">Elektroninis paštas</th>
        <th>Įranga</th>
        <th></th>
      </tr>

      <!-- main data -->
      <tr v-for="item in list" :key="item.id" :class="{'mobile-focus': mobileActions === item.id}">
        <td class="no-padding"><router-link :to="{path: 'user-inventory/' + item.id}">{{ item.first_name }} {{ item.last_name }}</router-link></td>
        <td class="tablet-hide">{{ item.email }}</td>
        <td>{{ item.gear_count }}</td>

        <!-- Non Mobile Table Actions -->
        <td class="actions-cell non-mobile">
          <table-actions>

            <btn-component :btnType="'edit'" @btnClicked="openEditUser(item.id)" title="Redaguoti" />
            <span class="action-divider" />
            <btn-component :btnType="'add-action'" title="Priskirti įrangos" @btnClicked="addGearToUser(item.id)" />
            <span class="action-divider" />
            <btn-component :btnType="'delete'" @btnClicked="deleteUserOpen = item.id" title="Ištrinti" />

          </table-actions>
        </td>

        <!-- Mobile Table Actions -->
        <td class="mobile mobile-actions">
          <button @click="openMobileActions(item.id, $event)">
            <img src="../assets/icons/action-dots.svg" alt="">
          </button>
        </td>
      </tr>
    </table-component> <!-- /table container-->
  </admin-desk>

  <!-- Mobile table actions card -->
  <action-card :style="{top :mobileActionsPos+'px'}" class="mobile-actions-card" v-if="mobileActions" @close="mobileActions = false">
    <button @click="openEditUser(mobileActions, 'item.name')">Redaguoti</button>
    <button @click="addGearToUser(mobileActions)">Priskirti inventorių</button>
    <button @click="deleteUserOpen = mobileActions">Ištrinti</button>
  </action-card>

  <!-- Add user card-->
  <modulus-full v-if="addUserOpen" @close="closeCard">
    <add-user @createUser="addUser" :companyList="additionalList" :errorMsg="errorMsg" />
  </modulus-full>

  <!-- Edit user card-->
  <modulus-full v-if="editUserCardOpen" @close="closeCard">
    <h3>Redaguoti Darbuotoją</h3>
    <form-item @onSubmit="editUser(selectedUser)">

      <div>
        <input type="text" placeholder="Vardas" required v-model="selectedUser.first_name">
        <input type="text" placeholder="Pavardė" required v-model="selectedUser.last_name">
      </div>
      <input type="email" placeholder="Elektroninis paštas" class="input-long" required v-model="selectedUser.email">
      <label v-show="selectedUser.role === 0">
        <input type="checkbox" v-model="selectedUser.changeRole">Suteikti administratoriaus teises</label>
      <label v-show="selectedUser.role === 1">
        <input type="checkbox" v-model="selectedUser.changeRole">Pašalinti administratoriaus teises</label>

      <div class="button-container">
        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
        <button class="btn" type="submit">Redaguoti</button>
      </div>
    </form-item>
  </modulus-full>

  <!-- Add gear to user card-->
  <modulus-full v-if="addGearOpen" @close="closeCard">
    <add-item :user="selectedUser.id" @success="addGearSuccess"/>
  </modulus-full>

  <!-- Delete user -->
  <modulus-full v-if="deleteUserOpen" @close="deleteUserOpen = false; errorMsg = ''">
    <p>Ar tikrai norite ištrinti <strong>{{ findName(deleteUserOpen) }}</strong>?</p>
    <div class="btn-container">
      <p class="error-msg">{{errorMsg}}</p>
      <button class="btn" @click="deleteUser(deleteUserOpen)">Taip</button>
    </div>
  </modulus-full>

</div>
</template>

<script>
  import DataMixin from "@/components/mixins/DataMixin";
  import UsersMixin from "@/components/mixins/UsersMixin";
  import ActionCard from "@/components/ActionCard";
  import AddItem from "@/components/AddItem";
  import AddUser from "@/components/AddUser";
  import AdminDesk from "@/components/AdminDesk";
  import FormItem from "@/components/FormItem";
  import ModulusFull from "@/components/ModulusFull";
  import Search from "@/components/Search";
  import TableActions from "@/components/TableActions";
  import TableComponent from "@/components/TableComponent";
  import BtnComponent from "@/components/BtnComponent";
  import {EventBus} from "@/main";

  export default {
    name: "AllUsers",
    mixins: [ DataMixin, UsersMixin ],
    components: {
      BtnComponent,
      ActionCard,
      AddItem,
      AddUser,
      AdminDesk,
      FormItem,
      ModulusFull,
      Search,
      TableActions,
      TableComponent,
    },
    data(){
      return {
        url: this.$store.getters.API_baseURL + "/users/all",
        addUserOpen: false,
        editUserCardOpen: false,
        deleteUserOpen: false,
        addUserError: false,
        addGearOpen: false,
        selectedUser: { },
        mobileActions: false,
        mobileActionsPos: '',
        errorMsg: '',
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
    created() {
      if( this.$route.params.company_id ){
        this.params.company = this.$route.params.company_id;
      }
      this.getDataQuery(this.url, this.params);
      this.getAdditionalData(this.$store.getters.API_baseURL + "/companies")
    },

    methods: {
      editUser({id, first_name, last_name, email, changeRole}) {
        this.errorMsg = "";
        let params = {};
        let oldUser = this.list.filter(item => item.id === id)[0];

        if( oldUser.first_name !== first_name ){
          params.first_name = first_name;
        }
        if( oldUser.last_name !== last_name ){
          params.last_name = last_name;
        }
        if( oldUser.email !== email ){
          params.email = email;
        }
        if( changeRole) {
          params.role = oldUser.role === 1 ? 0 : oldUser.role === 0 && 1;
        }

        if(Object.keys(params).length !== 0) { // if some changes are made
          this.$http.put(
              this.$store.getters.API_baseURL + "/users/" + id,
              params,
              this.config
          ).then(() => {
            this.getDataQuery(this.url, this.params);
            this.getUsersList(); // store updated users list
            this.editUserCardOpen = false;
            EventBus.$emit('displayMessage', 'Vartotojo duomenys sėkmingai pakeisti!');
          }).catch(err => {
            if(err.response.data.error) {
              if(err.response.data.error.email){
                this.errorMsg = "Vartotojas šiuo elektroninio pašto adresu jau užregistruotas."
              }
            }
            if(err.response.status === 401){
              this.$router.push('/')
            }
          })

        } else { // if no changes
          this.errorMsg = "Darbuotojo duomenys nepasikeitę."
        }
      },

      addGearToUser(id){
        this.selectedUser.id = id;
        this.addGearOpen = true;
      },

      addGearSuccess() {
        this.selectedUser = {};
        this.addGearOpen = false;
        this.getDataQuery(this.url, this.params);
      },

      openEditUser(id){
        this.selectedUser = {...this.list.find(item => item.id === id)};
        this.editUserCardOpen = true;
      },

      deleteUser(id){
        this.$http.delete(this.$store.getters.API_baseURL + "/users/" + id, this.config)
            .then(() => {
              this.getDataQuery(this.url, this.params);
              this.getUsersList();
              this.mobileActions = false;
            }).catch(() => {
              this.errorMsg = 'Negalima ištinti vartotojo dar turinčio priskirto inventoriaus.'
            })
      },

      setSearch(val) {
        this.params.search = val
        this.getDataQuery(this.url, this.params);
        this.mobileActions = false;
      },

      openMobileActions(id, event){
        this.mobileActions = id;
        this.mobileActionsPos = event.pageY + 15 ; // position the card
        if((window.innerHeight - event.clientY) < 190){
          this.mobileActionsPos = event.pageY - 180 ;
        }
      },

      closeMobileAction(){
        if(this.mobileActions){
          this.mobileActions = false;
        }
      },

      closeCard() {
        this.errorMsg = '';
        this.addUserOpen = false;
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
    flex-wrap: wrap;
  }

  .no-shrink{
    flex-shrink: 0;
    display: flex;
    align-items: flex-end;
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
    text-align: right;
    margin-right: 0;
    border-left: none;
    border-bottom: solid 2px var(--clr-accent);
    max-width: 50%;
    /*color: var(--clr-grey)*/
  }

  .company-filter .placeholder {
    color: var(--clr-dark-grey);
  }

  /* Table Design */

  td, th {
    border: none;
    text-align: center;
  }

  th:first-child,
  td:first-child {
    text-align: left;
  }

  th {
    background: var(--clr-white);
    color: var(--clr-dark-grey);
  }

  th:not(:first-child){ /* column dividers for sticky header */
    box-shadow:none;
  }

  /* Edit user card */

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

  @media (max-width: 730px) {
    .company-filter {
      width: 100%;
      margin-top: 1em;
      max-width: fit-content;
    }
  }

  @media (max-width: 580px) {
    .title-container{
      flex-direction: column;
      align-items: initial;
    }

    .company-filter {
      max-width: 100%;
      text-align: left;
    }

    .mobile-actions-card{
      position: absolute;
    }
  }

</style>