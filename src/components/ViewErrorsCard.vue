<template>
  <modulus-full @close="cardOpen = false" v-if="cardOpen">
    <div class="scroll-container">
      <p v-for="(error, index) in errorArr" :key="index">
        <router-link :to="`/inventory/${error.id}`">{{ error.name }}</router-link>:
        {{ error.message }}
      </p>
    </div>
  </modulus-full>
</template>

<script>
  import ModulusFull from "@/components/ModulusFull";
  import {EventBus} from "@/main";
  export default {
    name: "ViewErrorsCard",
    components: {ModulusFull},
    data() {
      return{
        cardOpen: false,
        errorArr: [],
      }
    },
    watch: {
      $route() {
        this.cardOpen = false;
      }
    },
    created() {
      EventBus.$on("viewErrors", this.showErrors);
    },
    beforeDestroy() {
      EventBus.$off("viewErrors");
    },
    methods: {
      showErrors(errors) {
        this.cardOpen = true;
        this.errorArr = errors;
      }
    }
  }
</script>

<style scoped>
  a {
    color: var(--clr-dark-grey);
  }

  .scroll-container {
    max-height: 70vh;
    overflow: hidden;
    overflow-y: auto;
  }

  /* Scrollbar */
  ::-webkit-scrollbar-thumb {
    background-color:var(--clr-light-grey);
    border-radius: 5px;
  }

  ::-webkit-scrollbar {
    width: 10px;
    height: 90%;
  }

</style>