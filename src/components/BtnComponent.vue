<template>
  <button :class="{'add-btn': btnType === 'add', 'pdf': btnType === 'PDF'}"
          @click="$emit('btnClicked')">
    <!-- Add -->
    <img v-if="btnType === 'add'" src="../assets/icons/Plus-blue.svg" alt="" class="icon-blue">
    <img v-if="btnType === 'add'" src="../assets/icons/Plus.svg" alt="">

    <!-- Add Action -->
    <img v-if="btnType === 'add-action'" src="../assets/icons/add-blue.svg" alt="" class="icon-blue">
    <img v-if="btnType === 'add-action'" src="../assets/icons/add.svg" alt="">

    <!-- Edit -->
    <img v-if="btnType === 'edit'" src="../assets/icons/edit-blue.svg" alt="" class="icon-blue">
    <img v-if="btnType === 'edit'" src="../assets/icons/edit.svg" alt="">

    <!-- delete -->
    <img v-if="btnType === 'delete'" src="../assets/icons/delete-blue.svg" alt="" class="icon-blue">
    <img v-if="btnType === 'delete'" src="../assets/icons/delete.svg" alt="">

    <!-- Generuoti PDF -->
    <img v-if="btnType === 'PDF'" src="../assets/icons/downloadPDF-blue.svg" alt="" class="icon-blue">
    <img v-if="btnType === 'PDF'" src="../assets/icons/downloadPDF.svg" alt="">

    <!-- Lend -->
    <img v-if="btnType === 'lend'" src="../assets/icons/hand-lend.svg" alt="" class="hand icon-blue">
    <img v-if="btnType === 'lend'" src="../assets/icons/hand-lend.svg" alt="" class="hand">

    <!-- Return -->
    <img v-if="btnType === 'return'" src="../assets/icons/hand-return.svg" alt="" class="hand icon-blue">
    <img v-if="btnType === 'return'" src="../assets/icons/hand-return.svg" alt="" class="hand">

    <!-- Transfer -->
    <img v-if="btnType === 'transfer'" src="../assets/icons/hand-transfer.svg" alt="" class="hand icon-blue">
    <img v-if="btnType === 'transfer'" src="../assets/icons/hand-transfer.svg" alt="" class="hand">

  </button>
</template>

<script>
  export default {
    name: "BtnComponent",
    props: [ 'btnType' ],
  }
</script>

<style scoped>

  button{
    position: relative;
  }

  .add-btn {
    /*color: var(--clr-grey);*/
    padding: 0;
    margin: 0 .5em;
    line-height: 1;
    transform: translateY(50%);
  }

  /* Button hover */

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

  button:not(.add-btn) img:not(.hand) {
    height: 1.35em;
  }

  .add-action-btn {
    height: fit-content;
    padding: 0 .3em;
    align-self: center;
  }

  button:hover img {
    transform: scale(1.1);
  }

  .pdf {
    margin-left: auto;
  }

  button.pdf img:not(.hand) {
    height: 35px;
  }

  button[disabled],
  button[disabled]:hover {
    opacity: 1;
    transform: scale(1);
    cursor: initial;
  }

  button[disabled] img,
  button[disabled]:hover img {
    opacity: 1;
    transform: scale(1);
  }

  button[disabled] .icon-blue,
  button[disabled]:hover .icon-blue {
    opacity: 0;
  }

  @media (max-width: 580px){
    button.pdf img:not(.hand) {
      height: 70px;
      margin-bottom: -8px;
    }

    button.pdf:hover img{
      transform: scale(1);
    }
  }

</style>