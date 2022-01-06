<template>
    <button @click="$emit('btnClicked')">
      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
              d="M11.35 9.65V0H9.65V9.65H0V11.35H9.65V21H11.35V11.35H21V9.65H11.35Z" fill="#646464"/>
      </svg>
    </button>
</template>
<script>
  export default {
    name: 'BtnAddInventory',
  }
</script>
<style scoped>

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

  button:hover svg {
    transform: scale(1.1);
  }

  a:hover path,
  button:hover path {
    fill: var(--clr-accent);
  }


</style>