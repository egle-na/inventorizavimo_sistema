<template>
<!--  <admin-desk>-->
      <div>
        <h2>Pridėti Darbuotoją</h2>

        <form-item @onSubmit="$emit('createUser', newUser)">
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
            <option v-for="item in companyList" :key="item.id" :value="item.id">{{item.name}}</option> <!-- įmonių sąrašas -->
          </select>

          <div class="button-container">
            <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
            <button class="btn" type="submit">Pridėti</button>
          </div>
        </form-item>

      </div>
<!--  </admin-desk>-->
</template>

<script>
  import FormItem from "@/components/FormItem";

  export default {
    name: "AddUser",
    props: [ 'companyList', 'errorMsg', 'company_id' ],
    components: {
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
      }
    },
    created() {
      if(this.company_id){
        this.newUser.company_id = this.company_id;
      }
    }
  }
</script>

<style scoped>

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

  /*button {*/
  /*  margin-left: auto;*/
  /*}*/


</style>