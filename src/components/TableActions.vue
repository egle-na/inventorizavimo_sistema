<template>
  <div class="actions-container">
<!--    &lt;!&ndash; view &ndash;&gt;-->
<!--    <BtnView :id="id"/>-->
<!--    <span class="action-divider" />-->

<!--    &lt;!&ndash; edit &ndash;&gt;-->
<!--    <BtnEdit/>-->

    <slot />

<!--    &lt;!&ndash; add &ndash;&gt;-->
<!--    <BtnAddInventory/>-->
<!--    <span class="action-divider" />-->

<!--    &lt;!&ndash; delete &ndash;&gt;-->
<!--    <btn-delete/>-->

  </div>
</template>

<script>
  // import BtnDelete from "@/components/BtnDelete";
  // import BtnAddInventory from "@/components/BtnAddInventory";
  // import BtnView from "@/components/BtnView";

  export default {
    name: "TableActions",
    // components: {BtnAddInventory, BtnDelete, BtnView },
    props: [ 'id' ]
  }
</script>

<style scoped>
  .actions-container {
    display: flex;
    width: 100%;
    justify-content: space-around;
    padding: 0;
  }

  .action-divider {
    height: 1.7em;
    width: .1em;
    background-color: var(--clr-grey);
  }

  svg {
    height: 1.35em;
  }

  a,
  button {
    text-align: center;
    line-height: 0;
    height: fit-content;
    padding: 0 .3em;
    align-self: center;
  }

  button:hover svg{
    transform: scale(1.1);
  }

  a:hover path,
  button:hover path{
    fill: var(--clr-accent);
  }


</style>