<template>
  <div class="container">
    <div class="backdrop" @click="$emit('close')"></div>
    <div class="card">
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

  .backdrop {
    background: #ffffffaa;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .container {
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

  .card {
    position: relative;
    width: 500px;
    max-width: 97%;
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
    color: var(--clr-dark-grey);
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

  button {
    margin-left: auto;
  }

  .btn-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .btn-container div{
    display: flex;
    align-items: center;
  }

  .btn-container .btn {
    margin-left: auto;
  }

  .error-msg {
    margin: 0 auto 0 0;
    color: var(--clr-red);
  }

  .error-msg button {
    font-family: var(--ff-karla);
    text-decoration: underline;
    color: var(--clr-red);
    padding: 0;
  }

  @media(max-width: 580px){

    .card {
      padding: 2em 1.5em;
    }

    .backdrop {
      background: #ffffffea;
    }
  }

</style>