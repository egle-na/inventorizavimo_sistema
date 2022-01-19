<template>
  <button class="show-psw-btn" @click="$emit('btnClicked')" type="button" :title="$t('login.peek')">
    <img v-show="pswVisible === false" src="../assets/icons/view-eye-closed-blue.svg" alt="" class="icon-blue">
    <img v-show="pswVisible === false" src="../assets/icons/view-eye-closed.svg" alt="">
    <img v-show="pswVisible === true" src="../assets/icons/view-blue.svg" alt="" class="icon-blue">
    <img v-show="pswVisible === true" src="../assets/icons/view.svg" alt="">
  </button>
</template>
<script>
  export default {
    name: 'BtnViewEye',
    props: [ 'pswVisible' ]
  }
</script>
<style scoped>

  .show-psw-btn {
    position: absolute;
    right: 0;
    bottom: .3em;
    width: 40px;
  }

  button img {
    opacity: 1;
    transition: opacity 200ms;
  }

  button img.icon-blue {
    position: absolute;
    opacity: 0;
  }

  button:hover img.icon-blue{
    opacity: 1;
  }

  button:hover img:not(.icon-blue){
    opacity: 0;
  }

  button img {
    height: 1.35em;
  }

</style>