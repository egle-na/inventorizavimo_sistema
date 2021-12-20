<template>
  <ModulusFull :type="type" @close="closeCard">
    <h3>{{ type }}</h3>
    <p>Pasirinkite darbuotoją</p>

    <div class="search-container">
      <input type="text" placeholder="Vardas Pavardė"
             @focus="searchActive = true"
             :value="searchName"
             @blur="closeSearchList"
             @input="doSearch"
             required>
      <!--        <button>&times;</button>-->

      <ul v-show="searchActive" class="list">
        <li v-if="false" class="no-hover">Toks darbuotojas nerastas</li>
        <li v-else v-for="item in 10"
            :key="item"
            @click="searchName = item"
            v-text="item">Vardenis Pavardenis</li> <!-- @click="select(id)" -->
      </ul>
    </div>

    <div class="btn-container">
      <button class="btn">{{ type }}</button>
    </div>
  </ModulusFull>
</template>

<script>
  import ModulusFull from "@/components/ModulusFull";

  export default {
    name: "SelectUser",
    components: {ModulusFull},
    props: [ 'type' ],
    data() {
      return {
        searchActive: false,
        searchName: '',
      }
    },
    methods: {
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

  input {
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