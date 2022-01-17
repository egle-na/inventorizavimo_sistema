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

    overflow-y: auto;
    max-height: 60vh;
  }

  table {
    border: solid 2px var(--clr-light-grey);
    border-collapse: collapse;
    width: 100%;
  }

  th, td {
    border: solid 1px var(--clr-grey);
    padding: 1rem;
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

  /* column dividers for sticky header */
  th:not(:first-child),
  .row-selected td:not(:first-child) {
    box-shadow: -1px 0 0 var(--clr-grey);
  }

  /* keep headers on top of the table */
  tr.head-row {
    position: sticky;
    top: 1px;
    z-index: 1;
    box-shadow: 0 2px 4px #C5C5C5;
  }

  /* fill the gap on the top of table */
  th:first-child:before{
    content: '';
    display: block;
    position: absolute;
    top: -1px;
    left:0;
    width: 100%;
    border-top: solid var(--clr-light-grey);
  }

  tr:not(.head-row):hover {
    background-color: var(--clr-almost-white);
  }

  .actions-cell {
    text-align: right;
    padding: 0 .2em;
  }

  .no-padding {
    padding: 0;
  }

  .align-center {
    text-align: center;
  }

  a {
    display: inline-block;
    color: currentColor;
    text-decoration: none;
    width: 100%;
    padding: 1rem;
  }

  a:hover {
    color: var(--clr-accent);
  }

  /* Expanded Table Rules */

  .main-trow .actions-cell button {
    transform: rotate(0);
    transition: rotate 300ms;
  }

  .row-selected .actions-cell button {
    transform: rotate(180deg);
  }

  .expanded-table .actions-cell {
    vertical-align: middle; /* jei kažkur sugedo perkelti į visa įranga */
    padding: 0;
  }

  .expanded-table {
    background: var(--clr-almost-white);
    border-bottom: 2px solid var(--clr-accent);
  }

  .row-selected {
    background: var(--clr-light-grey);
    position: relative;
    box-shadow: 0 5px 5px #C5C5C566;
  }

  .main-trow.row-selected:hover {
    background: var(--clr-light-grey);
  }

  .expanded-table > td {
    padding: 0;
  }

  .expanded-table th{
    color: var(--clr-dark-grey);
    padding: .3em 1rem;
    box-shadow: none; /* for chrome */
    background: var(--clr-almost-white);
  }

  /* Scrollbar */
  ::-webkit-scrollbar-thumb {
    background-color:var(--clr-grey);
    border-radius: 5px;
  }

  ::-webkit-scrollbar {
    width: 10px;
  }

  @media (max-width: 580px){
    td,th {
      border:none;
      border-bottom: 1px solid var(--clr-grey);
    }

    .mobile-actions{
      display: table-cell;
      width: 80px;
      position: relative;
    }

    table .mobile-focus{
      background: var(--clr-light-grey);
    }

    th.mobile {
      display: table-cell;
    }
  }

</style>
