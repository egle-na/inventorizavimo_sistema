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
    width: max-content;
    max-width: 310px;
    padding: 0;
    display: flex;
    flex-direction: column;

    background: var(--clr-white);
    box-shadow: 0 0 20px 0 #00000022;
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
    color: var(--clr-dark-grey);
  }

  .action-card a,
  button:not(.close-btn) {
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

  .action-card a:nth-child(2),
  button:not(.close-btn):nth-child(2) {
    padding-top: .5em;
  }

  .action-card a:last-child,
  button:not(.close-btn):last-child {
    padding-bottom: .5em;
    border-bottom: none;
  }

  .action-card a:hover,
  button:not(.close-btn):hover {
    color: var(--clr-accent);
    background: var(--clr-almost-white);
  }

  a {
    text-decoration: none;
  }

  @media (max-width: 580px){
    .action-card {
      right: 3%;
    }

    .close-btn {
      font-size: 2rem;
      padding: .5em;
      top: 0;
      right: 0;
      margin: 0;
    }

    .action-card a:nth-child(2),
    button:not(.close-btn):nth-child(2) {
      padding-top: 1em;
    }

    .action-card a,
    button:not(.close-btn) {
      padding: .5em 1.8em .5em 1em;
    }
  }

</style>