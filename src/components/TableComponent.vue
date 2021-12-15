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

  th:not(:first-child),
  .row-selected td:not(:first-child) { /* column dividers for sticky header */
    box-shadow: -1px 0 0 var(--clr-grey);
  }

  tr.head-row { /* keep headers on top of the table  */
    position: sticky;
    top: 1px;
    z-index: 1;
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

  .actions-cell button {
    transform: rotate(0);
    transition: rotate 300ms;
  }

  .actions-cell {
    text-align: right;
    vertical-align: middle; /* jei kažkur sugedo perkelti į visa įranga */
  }

  /* Expanded Table Rules */

  .row-selected {
    /*z-index: -1;*/
    background: var(--clr-light-grey);
    filter: drop-shadow(0 3px 3px #C5C5C5);
    /*box-shadow: 0 2px 4px #C5C5C5;*/
  }
  .row-selected .actions-cell button {
    transform: rotate(180deg);
  }

  .expanded-table {
    display: contents;
  }
  .expanded-table tr {
  }

  .expanded-table th{
    color: var(--clr-dark-grey);
    padding: .3em 1rem;
    /*background: var(--clr-light-grey);*/
    box-shadow: none; /* for chrome */
    background: var(--clr-almost-white);
  }

  .expanded-table td{
    background: var(--clr-almost-white);
  }

  .expanded-table:after{ /* Blue line after expanded table */
    content: '';
    display: table-row;
    width: 100%;
    border-bottom: 2px solid var(--clr-accent);
    background: var(--clr-almost-white);
    box-shadow: 0 4px 5px var(--clr-dark-grey);
  }

  /*tbody {*/
    /*box-shadow: none;*/
  /*}*/

  /*.row-selected .expanded-table {*/
  /*  height: 0;*/
  /*}*/

</style>