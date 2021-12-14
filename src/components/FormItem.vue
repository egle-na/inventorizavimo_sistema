<template>
  <form>
    <slot />
  </form>
</template>
<script>
  export default {
    name: 'FormItem'
  }
</script>
<style scoped>

  form input,
  form select {
    margin-bottom: 2em;
    width: 45%;
  }

  form input:first-child {
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

  button {
    float: right;
  }

  input:valid,
  select:valid {
    border-bottom-color: #0054A6;
  }

</style>