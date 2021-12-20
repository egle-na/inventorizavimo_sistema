<template>
  <div class="search-container">
    <input type="text" placeholder="Paieška" v-model="search">
    <button @click="search = ''" v-show="search" id="clear-btn">&times;</button>
  </div>
</template>
<script>
  export default {
    name: 'Search',
    data() {
      return {
        search: '',
      }
    },
  }
</script>
<style scoped>

  .search-container {
    margin: 1.5em 0 2em;

  }

  .search-container input {
    width: 100%;
    border: none;
    border-bottom: solid 2px #E5E5E5;
    /*box-shadow: 0px 4px 6px rgba(229, 229, 229, 0.76);*/
    filter: drop-shadow( 0 6px 5px var(--clr-grey));
  }

  .search-container input::placeholder{
    color: var(--clr-dark-grey)
  }

  #clear-btn {
    position: absolute;
    right: 1em;

    color: var(--clr-grey);
    font-size: 2rem;
    transform: rotate(0);
    transition: transform 400ms, color 400ms;
  }

  #clear-btn:hover {
    transform: rotate(90deg);
    color: var(--clr-dark-grey);
  }

</style>