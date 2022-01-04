<template>
  <ModulusFull @close="closeCard">
    <form @submit.prevent="$emit('submitAction', selectedUser)">
    <h3>{{ type }}</h3>
    <p>Pasirinkite darbuotoją:</p>

    <slot></slot> <!-- nėra? -->

    <select class="user-select" v-model="selectedUser" required>
      <option selected hidden>Pasirinkite darbuotoją:</option>
      <option v-for="user in userList" :key=" user.id"
              :value="user.id">{{user.first_name + ' ' + user.last_name}}</option>
    </select>

<!--    <input type="text" v-model="selectedUser">-->

    <div class="btn-container">
      <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
      <button class="btn">{{ type }}</button>
    </div>
    </form>

<!--    &lt;!&ndash; Search container &ndash;&gt;-->
<!--    <div class="search-container">-->
<!--      <input type="text" placeholder="Vardas Pavardė"-->
<!--             @focus="searchActive = true"-->
<!--             :value="searchName"-->
<!--             @blur="closeSearchList"-->
<!--             @input="doSearch"-->
<!--             required>-->
<!--      &lt;!&ndash;        <button>&times;</button>&ndash;&gt;-->

<!--      <ul v-show="searchActive" class="list">-->
<!--        <li v-if="false" class="no-hover">Toks darbuotojas nerastas</li>-->
<!--        <li v-else v-for="item in list"-->
<!--            :key="item.id"-->
<!--            @click="searchName = userName(item)"-->
<!--            v-text="userName(item)">Vardenis Pavardenis</li> &lt;!&ndash; @click="select(id)" &ndash;&gt;-->
<!--      </ul>-->
<!--    </div>&lt;!&ndash; /search container &ndash;&gt;-->

  </ModulusFull>
</template>

<script>
  import ModulusFull from "@/components/ModulusFull";

  export default {
    name: "SelectUser",
    components: { ModulusFull },
    props: [ 'type', 'list', 'errorMsg', 'gear_owner'],
    data() {
      return {
        searchActive: false,
        // searchName: '',
        selectedUser: '',
      }
    },
    methods: {

      // userName(user){
      //   return user.first_name + ' ' + user.last_name
      // },

      doSearch(event) {
        this.searchName = event.target.value;

      },

      closeSearchList() { // idk, doesn't feel right
        setTimeout (() => {
          this.searchActive = false;
        }, 200)
      },

      closeCard() {
        this.searchName = '';
        this.$emit('close');
      }
    },
    computed: {
      userList() {
        if(this.type === "Skolinti" ) {
          return this.list.filter( user => user.id !== this.$store.getters.user.id && user.id !== this.gear_owner )
        }
        return this.$store.getters.user.isAdmin ? this.list.filter(user => user.id !== this.gear_owner)
            : this.list.filter( user => user.id !== this.$store.getters.user.id && user.id !== this.gear_owner )
      }
    }
  }
</script>

<style scoped>

  h3 {
    padding: 0;
    border: none;
    font-size: 2rem;
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


</style>