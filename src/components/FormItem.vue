<template>
  <form @submit.prevent="$emit('onSubmit')">
    <slot />
  </form>
</template>

<script>
  export default {
    name: 'FormItem',
  }
</script>

<style scoped>

  input,
  select,
  textarea {
    margin-bottom: 2em;
  }

  input:not([type='checkbox'], .input-long) {
    width: 45%;
  }

  label {
    display: block;
    width: 100%;
  }

  input:first-child:not(.input-long, [type='radio'], [type='checkbox']) {
    margin-right: 10%;
  }

  label input {
    margin-right: 1em;
  }

  .input-long {
    width: 100%;
  }

  select:invalid {
    color: gray;
  }

  option {
    color: initial;
  }

  input:valid,
  select:valid,
  textarea:valid {
    border-bottom-color: var(--clr-accent);
  }

  input.input--error {
    border-color: var(--clr-red);
    margin-bottom: 0;
  }

  .button-container {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }

  .button-container .btn{
    margin-left: auto;
  }

  .error-msg{
    margin: 0;
    color: var(--clr-red);
  }

  @media (max-width: 580px){
    input:not([type='checkbox'], .input-long) {
      width: 100%;
    }
  }

</style>