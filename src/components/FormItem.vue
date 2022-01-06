<template>
  <form @submit.prevent="$emit('onSubmit')">
    <slot />
  </form>
</template>
<script>
  export default {
    name: 'FormItem'
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

  input.input-error {
    border-color: #FF6464;
    margin-bottom: 0;
  }

  button {
    float: right;
    margin-left: auto;
  }


  /*.error-msg{*/
  /*  !*margin-top: 0;*!*/
  /*  color: #FF6464;*/
  /*}*/

  @media (max-width: 580px){
    input:not([type='checkbox'], .input-long) {
      width: 100%;
    }
  }

</style>