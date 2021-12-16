<template>
  <div class="action-card">
    <button class="close-btn" @click="$emit('close')">&times;</button>

    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'ActionCard'
  }
</script>
<style scoped>

  .action-card {
    position: absolute;
    right: 0;
    z-index: 1;
    /*top:;*/
    width: max-content;
    padding: 0;
    display: flex;
    flex-direction: column;

    background: var(--clr-white);
    box-shadow: 0 0 20px 0 #E5E5E5;
    border-radius: 7px;

    font-family: var(--ff-karla);
    letter-spacing: initial;
    overflow: hidden;
  }

  .close-btn {
    position: absolute;
    font-size: 1.5rem;
    top: .5em;
    right: .5em;
    line-height: 1rem;
    color: var(--clr-dark-grey)
  }

  .action-btn {
    color: var(--clr-dark-grey);
    font-family: var(--ff-roboto-con);
    font-size: var(--fs-side-menu);
    text-transform: uppercase;
    text-align: left;
    letter-spacing: .025em;

    width: 100%;
    padding: .2em 1em;

    border-bottom: solid 1px var(--clr-light-grey);
  }

  .action-btn:nth-child(2) {
    padding-top: .5em;
  }

  .action-btn:last-child {
    padding-bottom: .5em;
    border-bottom: none;
  }

  .action-btn:hover {
    color: var(--clr-accent);
    background: var(--clr-almost-white);
  }


</style>