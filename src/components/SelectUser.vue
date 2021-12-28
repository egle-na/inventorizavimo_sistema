<template>
  <ModulusFull @close="closeCard">
    <h3>{{ type }}</h3>
    <p>Pasirinkite darbuotoją:</p>

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

    <slot></slot>

    <div class="btn-container">
      <button class="btn" @click="$emit('submitAction', type)">{{ type }}</button>
    </div>
  </ModulusFull>
</template>

<script>
  import ModulusFull from "@/components/ModulusFull";

  export default {
    name: "SelectUser",
    components: {ModulusFull},
    props: [ 'type', 'list' ],
    data() {
      return {
        searchActive: false,
        searchName: '',
      }
    },
    methods: {

      userName(user){
        return user.first_name + ' ' + user.last_name
      },

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

</style>