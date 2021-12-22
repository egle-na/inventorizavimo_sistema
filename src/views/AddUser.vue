<template>
  <admin-desk>
      <div class="container-center">
        <h2>Pridėti Darbuotoją</h2>

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
            <option v-for="item in list" :key="item.id" :value="item.id">{{item.name}}</option> <!-- įmonių sąrašas -->
          </select>

          <button class="btn" type="submit">Pridėti</button>
        </form-item>

      </div>
  </admin-desk>
</template>

<script>
  import FormItem from "@/components/FormItem";
  import AdminDesk from "@/components/AdminDesk";
  import DataMixin from "@/components/mixins/DataMixin";

  export default {
    name: "AddUser",
    mixins: [ DataMixin ],
    components: {
      AdminDesk,
      FormItem,
    },
    data() {
      return {
        newUser: {
          first_name: '',
          last_name: '',
          email: '',
          company_id: '',
          role: 0,
        },
        list: [],
      }
    },
    created(){
      this.getData("https://inventor-system.herokuapp.com/api/companies")
    },
    methods: {
      createUser() {
        this.postData( 'https://inventor-system.herokuapp.com/api/users', this.newUser, {name: "all-users"} );
      },
    }
  }
</script>

<style scoped>

  .container-center {
    /*align-self: center;*/
    /*justify-self: center;*/
    max-width: 550px;
    margin: 1em auto;
  }

</style>