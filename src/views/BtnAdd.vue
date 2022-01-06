<template>
  <button class="add-btn" @click="$emit('btnClicked')">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 12H8M24 12H8M12 8V0V24" stroke="#C5C5C5" stroke-width="2"/>
    </svg>
  </button>
</template>
<script>
  export default {
    name: 'BtnAdd',
  }
</script>
<style scoped>

  .add-btn {
    color: var(--clr-grey);
    padding: 0;
    margin: 0 .5em;
    line-height: 1;
    transform: translateY(50%);
  }

  .add-btn path {
    stroke: var(--clr-darker-grey);
    transition: stroke 200ms;
  }

  .add-btn:hover path {
    stroke: var(--clr-accent);
  }

</style>