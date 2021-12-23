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

  input {
    width: 45%;
  }

  input:first-child:not(.input-long, [type='radio']) {
    margin-right: 10%;
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
    border-bottom-color: #0054A6;
  }

  button {
    float: right;
  }

</style>