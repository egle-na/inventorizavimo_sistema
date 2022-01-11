<template>
  <ModulusFull @close="closeCard">
    <form @submit.prevent="submitAction" @keydown.enter.prevent="submitAction">
    <h3>{{ type }}</h3>
    <p>Pasirinkite darbuotoją:</p>
<!--   ----------------------------------------------------------------------------------------------    -->

    <div v-if="searchActive" class="select-backdrop" @click="searchActive = false"></div>
    <div class="select-container">

      <input type="text" placeholder="Vardas Pavardė"
             v-model="searchUser"
             @focus="searchActive = true"
             @keyup="searchActive = true"
             @input="searchUser = $event.target.value"
             @keydown.enter="selectUser(filteredList[0].id)"
             @keydown.down="$event.target.nextElementSibling.firstChild.focus()">

      <div class="select" v-show="searchActive">
        <button v-for="user in filteredList" :key="user.id"
                @keydown.enter="selectUser(user.id)"
                @keydown.down="focusNext($event, 'down')"
                @keydown.up="focusNext($event,'up')"
                @click="selectUser(user.id)">{{ findName(user.id) }}</button>
      </div>
    </div>

    <div class="btn-container">
      <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
      <button class="btn">{{ type }}</button>
    </div>
    </form>

  </ModulusFull>
</template>

<script>
  import ModulusFull from "@/components/ModulusFull";
  import UsersMixin from "@/components/mixins/UsersMixin";

  export default {
    name: "SelectUser",
    mixins: [ UsersMixin ],
    components: { ModulusFull },
    props: [ 'type', 'errorMsg', 'gear_owner'],
    data() {
      return {
        searchActive: false,
        // searchName: '',
        selectedUser: '',

        searchUser: '',
      }
    },
    computed: {
      userList() {
        if(this.gear_owner.length){
          if(this.type === "Skolinti" ) {
            return this.$store.getters.allUsers.filter( user => user.id !== this.$store.getters.user.id && !this.gear_owner.includes(user.id) )
          } else {
            return this.$store.getters.user.isAdmin ? this.$store.getters.allUsers.filter(user => !this.gear_owner.includes(user.id))
                : this.$store.getters.allUsers.filter(user => user.id !== this.$store.getters.user.id && !this.gear_owner.includes(user.id))
          }
        } else {
          if (this.type === "Skolinti") {
            return this.$store.getters.allUsers.filter(user => user.id !== this.$store.getters.user.id && user.id !== this.gear_owner)
          } else {
            return this.$store.getters.user.isAdmin ? this.$store.getters.allUsers.filter(user => user.id !== this.gear_owner)
                : this.$store.getters.allUsers.filter(user => user.id !== this.$store.getters.user.id && user.id !== this.gear_owner)
          }
        }
      },
      filteredList() {
        let search = this.searchUser.toLowerCase()
        return this.userList.filter(user => this.findName(user.id).toLowerCase().indexOf(search) > -1 );
      }
    },
    methods: {

      // userName(user){
      //   return user.first_name + ' ' + user.last_name
      // },

      focusNext(event, dir){
        if (dir === 'down'){
          if(event.target.nextElementSibling) {
            event.target.nextElementSibling.focus();
          }
        } else if(dir === 'up'){
          if(event.target.previousSibling){
            event.target.previousSibling.focus();
          } else {
            event.target.parentElement.parentElement.firstChild.focus();
          }
        }
      },

      submitAction() {
        if(!this.searchActive){
          this.$emit('submitAction', this.selectedUser);
        }
      },

      selectUser(id){
        this.searchUser = this.findName(id);
        this.selectedUser = id;
        setTimeout(() => {this.searchActive = false;}, 200);
      },

      doSearch(event) {
        this.searchName = event.target.value;

      },

      closeSearchList() { // idk, doesn't feel right
        setTimeout (() => {
          this.searchActive = false;
        }, 100)
      },

      closeCard() {
        this.searchName = '';
        this.$emit('close');
      }
    },

  }
</script>

<style scoped>

  h3 {
    padding: 0;
    border: none;
    font-size: 2rem;
    margin-bottom: 0;
  }

  p {
    color: var(--clr-dark-grey);
  }

  input{
    width: 100%;
    border-left: none;
  }


  .list li {
    padding: .6em 1.5em;
  }

  .list li:not(.no-hover):hover {
    background: #0054A622;
  }

  .user-select {
    width: 100%;
    margin-bottom: 1em;
    border-left: none;
  }

  .error-msg {
    margin-right: auto;
    color: #FF6464;
  }

  .select-container {
    position: relative;
    margin-bottom: 1em;
  }

  .select {
    position: absolute;
    width: 100%;
    background: var(--clr-almost-white);
    border-radius: 0 0 5px 5px;
  }

  .select button {
    display: block;
    width: 100%;
    text-align: left;
    padding: .8em 1.5em;
    border-bottom: solid 2px var(--clr-light-grey);
  }

  .select button:hover{
    background: #0054A611;
    color: var(--clr-accent);
  }

  .select button:focus {
    background: #0054A622;
  }

  .select-backdrop{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  @media (max-width: 580px){
    .select button{
      padding: 1em 1.5em;
    }
  }



</style>