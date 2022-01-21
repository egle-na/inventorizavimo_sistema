<template>
<div>
  <admin-desk >

    <!-- Title container-->
    <div class="title-container">
      <h1>{{ $t('company.companies') }}</h1>
      <btn-component :btnType="'add'" :title="$t('company.action-company', {action: $t('action.add')})" @btnClicked="openAddCompanyCard" />
    </div>

    <Search @setSearch="setSearch" />

    <!-- Table -->
    <table-component @scroll.native="closeMobileAction">

      <!-- table labels -->
      <tr class="head-row non-mobile">
        <th>{{ $t('company.title') }}</th>
        <th class="non-mobile">{{ $t('company.employees') }}</th>
        <th class="mobile"></th>
        <th></th>
      </tr>

      <!-- main data -->
      <tr v-for="item in list" :key="item.id" :class="{'mobile-focus': mobileActions === item.id}">
        <td class="no-padding"><router-link :to="{name: 'all-users', params: {company_id: item.id}}">{{ item.name }}</router-link></td>
        <td class="no-padding"><router-link :to="{name: 'all-users', params: {company_id: item.id}}">{{ item.user_count }}</router-link></td>

        <!-- Non Mobile Table Actions -->
        <td class="actions-cell non-mobile">
          <table-actions>

            <btn-component :btnType="'edit'" @btnClicked="openEditCompanyCard(item.id, item.name)" :title="$t('action.edit')" />
            <span class="action-divider" />
            <btn-component :btnType="'add-action'" @btnClicked="openAddUserCard(item.id)" :title="$t('user.add-user')" />
            <span class="action-divider" />
            <btn-component :btnType="'delete'" @btnClicked="openDeleteCompanyCard(item.id, item.name)" :title="$t('action.delete')" />

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
    <button @click="openEditCompanyCard(mobileActions)">{{ $t('action.edit') }}</button>
    <button @click="openAddUserCard(mobileActions)">{{ $t('user.add-user') }}</button>
    <button @click="openDeleteCompanyCard(mobileActions)">{{ $t('action.delete') }}</button>
  </action-card>

  <!-- Add company card -->
  <modulus-full v-show="addCompanyOpen" @close="closeCard">
    <h3>{{ $t('company.action-company', {action: $t('action.add')}) }}</h3>
      <form @submit.prevent="createCompany">

        <input type="text" :placeholder="$t('company.company-title')" required class="add-input" v-model="newCompanyName">
        <div class="btn-container">
          <p class="error-msg">{{ $t(errorMsg) }}</p>
          <button class="btn">{{ $t('action.add') }}</button>
        </div>

      </form>
  </modulus-full>

  <!-- Edit company card -->
  <modulus-full v-show="editCompanyOpen" @close="closeCard">
    <h3>{{ $t('company.action-company', {action: $t('action.edit')}) }}</h3>
      <form @submit.prevent="editCompany(editCompanyId)">

        <input type="text" :placeholder="$t('company.title')" required class="add-input" v-model="newCompanyName">
        <div class="btn-container">
          <p class="error-msg">{{ $t(errorMsg) }}</p>
          <button class="btn">{{ $t('action.edit') }}</button>
        </div>

      </form>
  </modulus-full>

  <!-- Add user card-->
  <modulus-full v-if="addUserOpen" @close="closeCard">
    <add-user @createUser="addUser" :companyList="list" :errorMsg="errorMsg" :company_id="addUserOpen" />
  </modulus-full>

  <!-- Delete company -->
  <delete-card v-if="deleteCompanyOpen"
               :errorMsg="errorMsg"
               @close="closeCard"
               @delete="deleteCompany(editCompanyId)">
    <p>{{ $t('action.messages.delete-ready') }} <strong>{{newCompanyName}}</strong>?</p>
  </delete-card>

</div>
</template>

<script>
  import DataMixin from "@/components/mixins/DataMixin";
  import UsersMixin from "@/components/mixins/UsersMixin";
  import ActionCard from "@/components/ActionCard";
  import AddUser from "@/components/AddUser";
  import AdminDesk from "@/components/AdminDesk";
  import BtnComponent from "@/components/BtnComponent";
  import DeleteCard from "@/components/DeleteCard";
  import ModulusFull from "@/components/ModulusFull";
  import Search from "@/components/Search";
  import TableActions from "@/components/TableActions";
  import TableComponent from "@/components/TableComponent";
  import {EventBus} from "@/main";
  export default {
    name: "Companies",
    mixins: [ DataMixin, UsersMixin ],
    components: {
      ActionCard,
      AddUser,
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
      document.title = this.$t('company.companies') + this.$t('tab-title_base');
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
        this.mobileActionsPos = event.pageY + 15;
        if((window.innerHeight - event.clientY) < 190){
          this.mobileActionsPos = event.pageY - 180;
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

        ).then(() => {
          this.addCompanyOpen = false;
          this.newCompanyName = '';
          this.errorMsg = "";
          this.getData(this.url);
          EventBus.$emit('clearSearch');
          EventBus.$emit('displayMessage', this.$t('messages.company-add-success'));

        }).catch(error => {
          if(error.response.status === 400){
            if(error.response.data.error.name[0] === "The name has already been taken."){
              this.errorMsg = "company.errors.title";
            }
          }
          else this.errorMsg = "errors.unknown";
        })
      },

      editCompany(id){
        this.$http.put(
            this.url + '/' + id,
            { name: this.newCompanyName },
            this.config

        ).then(() => {
          this.editCompanyOpen = false;
          this.errorMsg = "";
          this.editCompanyId = '';
          this.newCompanyName = '';
          EventBus.$emit('clearSearch');
          this.getData(this.url);
          EventBus.$emit('displayMessage', this.$t('messages.company-edit-success'));

        }).catch(error => {
          if(error.response.status === 400){
            if(error.response.data.error.name[0] === "The name has already been taken."){
              this.errorMsg = "company.errors.title";
            }
          }
        })
      },

      deleteCompany(id){
        this.deleteData(
            `${this.url}/${id}`,
            () => {
              this.deleteCompanyOpen = false;
              EventBus.$emit('clearSearch');
              this.getData(this.url);
              this.newCompanyName = '';
              this.editCompanyId = '';
              this.mobileActions = false;
              this.errorMsg = '';
              EventBus.$emit('displayMessage', this.$t('messages.company-delete-success'));
            },
            () => {
              this.errorMsg = 'company.errors.has-users';
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
    width: 100%;
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
    padding-left: 1em;
    text-align: left;
  }

  /* column dividers for sticky header */
  th:not(:first-child){
    box-shadow: none;
  }

  .actions-container {
    max-width: 180px;
    margin-left: auto;
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