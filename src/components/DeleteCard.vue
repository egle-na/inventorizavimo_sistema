<template>

  <modulus-full @close="$emit('close')">
    <slot></slot>
    <div class="btn-container">
      <p class="error-msg">{{ errorMsg }}</p>
      <div class="buttons">
        <button class="btn faded" @click="$emit('close')">Ne</button>
        <button class="btn" @click="$emit('delete')">Taip</button>
      </div>
    </div>
  </modulus-full>

</template>

<script>
  import ModulusFull from "@/components/ModulusFull";
  export default {
    name: "DeleteCard",
    props: [ 'errorMsg' ],
    components: {ModulusFull},
  }
</script>

<style scoped>

  .buttons {
    margin-left: auto;
  }

  .btn-container .btn {
    margin-left: .5em;
  }

</style>