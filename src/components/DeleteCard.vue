<template>

  <modulus-full @close="$emit('close')">

    <slot></slot>

    <div class="btn-container">
      <p class="error-msg">
        {{ $t(errorMsg) }}
        <button v-if="errorArr && errorArr.length" @click="openErrorsCard">
          {{ $t('errors.check') }}
        </button>
      </p>
      <div class="buttons">
        <button class="btn faded" @click="$emit('close')">{{ $t('no') }}</button>
        <button class="btn" @click="$emit('delete')">{{ $t('yes') }}</button>
      </div>
    </div>
  </modulus-full>

</template>

<script>
  import ModulusFull from "@/components/ModulusFull";
  import {EventBus} from "@/main";
  export default {
    name: "DeleteCard",
    props: [ 'errorMsg', 'errorArr' ],
    components: { ModulusFull },
    methods: {
      openErrorsCard() {
        EventBus.$emit('viewErrors', this.errorArr);
      }
    }
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