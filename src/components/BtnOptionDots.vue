<template>

  <button @click="$emit('btnClicked')">
    <img src="../assets/icons/action-dots.svg" alt="">
  </button>

</template>

<script>
  export default {
    name: "BtnOptionDots"
  }
</script>

<style scoped>

  button {
    padding: 0;
  }

  img{
    min-width: 100%;
  }

</style>