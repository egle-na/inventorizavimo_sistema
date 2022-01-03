<template>
  <div class="select-user-container">
    <div class="select-user-backdrop" @click="$emit('close')"></div>
    <div class="select-user-card">
      <button class="close-btn" @click="$emit('close')">&times;</button>

      <slot />

    </div>
  </div>
</template>
<script>
  export default {
    name: 'ModulusFull',
  }
</script>
<style scoped>
  .select-user-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #ffffffaa;
  }

  .select-user-container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
  }


  .select-user-card {
    position: relative;
    width: 500px;
    padding: 2em;

    background: var(--clr-white);
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);

    font-family: var(--ff-karla);
    letter-spacing: initial;
  }

  .close-btn {
    position: absolute;
    font-size: 1.5rem;
    top: .5em;
    right: .5em;
    line-height: 1;
    color: var(--clr-dark-grey)
  }

  h3 {
    padding: 0;
    border: none;
    font-size: 2rem;
    margin-bottom: .8em;
  }

  p {
    color: var(--clr-dark-grey);
  }

  .search-container {
    position: relative;
    margin-bottom: 1em;
  }

  input {
    width: 100%;
    border-left: none;
  }

  .list {
    position: absolute;
    width: 100%;
    max-height: 40vh;
    overflow-y: auto;

    margin: 0;
    padding: 0;
    background: var(--clr-almost-white);
    list-style: none;
  }

  .list li {
    padding: .6em 1.5em;
  }

  .btn-container {
    display: flex;
    justify-content: flex-end;
  }

  div:not(.btn-container) .btn {
    float: right;
  }

  .error-msg {
    margin: 0 auto 0 0;
    color: #FF6464;
  }

</style>