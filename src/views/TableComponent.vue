<template>
  <div class="table-container">
    <table>

      <slot />

    </table>
  </div>
</template>
<script>

  export default {
    name: 'TableComponent',
  }
</script>
<style scoped>

  .table-container {
    border-radius: 10px 10px 7px 7px;
    overflow: hidden;
    border: solid 2px var(--clr-light-grey);
    border-top: solid 1px var(--clr-light-grey);
    border-bottom: solid 3px var(--clr-light-grey);

    overflow-y: scroll;
    height: 60vh;
  }

  ::-webkit-scrollbar-thumb {
    background-color:var(--clr-grey);
    border-radius: 5px;
  }

  ::-webkit-scrollbar {
    width: 10px;
  }

  table {
    color: var(--clr-black);
    border: solid 2px var(--clr-light-grey);
    border-collapse: collapse;
    width: 100%;
    /*position: relative;*/
  }

  th, td {
    border: solid 1px var(--clr-grey);
    padding: 1rem;
  }

  .actions-cell {
    padding: 0;
  }

  th {
    color: var(--clr-accent);
    background-color: var(--clr-light-grey);
    font-size: var(--fs-table-header);
    font-family: var(--ff-karla);
    font-weight: 400;
    text-transform: uppercase;
    text-align: left;
    letter-spacing: 0.08em;
  }

  th:not(:first-child){ /* column dividers fir sticky header */
    box-shadow: -1px 0 0 var(--clr-grey);
  }

  tr:first-child { /* keep headers on the top of table  */
    position: sticky;
    top: 1px;
    box-shadow: 0 2px 4px #C5C5C5;
  }

  th:first-child:before{ /* to fill the gap on the top of table  */
    content: '';
    display: block;
    position: absolute;
    top: -1px;
    left:0;
    width: 100%;
    border-top: solid var(--clr-light-grey);
  }

  tr:not(:first-child):hover {
    background-color: var(--clr-almost-white);
  }


</style>