<template>
  <div>
    <h2>{{ $t('user.add-user') }}</h2>

    <form-item @onSubmit="createUser">
      <!-- Name Surname -->
      <div>
        <input type="text" required
               :placeholder="$t('user.name')"
               :title="$t('user.name')"
               v-model="newUser.first_name">
        <input type="text" required
               :placeholder="$t('user.surname')"
               :title="$t('user.surname')"
               v-model="newUser.last_name">
      </div>
      <!-- Email -->
      <input type="email" required
             :placeholder="$t('login.email')"
             :title="$t('login.email')"
             class="input-long"
             v-model="newUser.email">

      <!-- Company -->
      <select class="input-long" required v-model="newUser.company_id">
        <option selected hidden class="placeholder" value="">{{ $t('user.company') }}</option>
        <option v-for="item in companyList" :key="item.id" :value="item.id">{{item.name}}</option>
      </select>

      <!-- Errors and Submit btn -->
      <div class="button-container">
        <p class="error-msg">{{ $t(errorMsg) }}</p>
        <button class="btn" type="submit">{{ $t('action.add') }}</button>
      </div>

    </form-item>
  </div>
</template>

<script>
  import FormItem from "@/components/FormItem";

  export default {
    name: "AddUser",
    props: [ 'companyList', 'errorMsg', 'company_id' ],
    components: { FormItem },
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
    },
    methods:{
      createUser() {
        this.$emit('createUser', this.newUser);
      },
    }
  }
</script>

<style scoped>

  h2{
    margin-top: .4em;
  }

</style>