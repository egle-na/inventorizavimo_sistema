<template>
  <div class="actions-container">

    <slot />

  </div>
</template>

<script>
  export default {
    name: "TableActions",
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