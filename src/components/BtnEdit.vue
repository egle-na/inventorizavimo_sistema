<template>
  <button title="Redaguoti" @click="$emit('btnClicked')">
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
          d="M23.7934 1.16818C22.2357 -0.389394 19.7103 -0.389394 18.1525 1.16818L2.33931 16.9801C2.23094 17.0884 2.1527 17.2228 2.11184 17.3702L0.0323434 24.8769C-0.0531771 25.1848 0.0337343 25.5143 0.259479 25.7404C0.485562 25.9661 0.815177 26.053 1.12299 25.9679L8.63041 23.8881C8.7779 23.8473 8.91224 23.7691 9.02061 23.6608L24.8335 7.84854C26.3888 6.28993 26.3888 3.76679 24.8335 2.20818L23.7934 1.16818ZM4.27062 17.5561L17.2125 4.615L21.3864 8.78849L8.44414 21.7296L4.27062 17.5561ZM3.43687 19.2289L6.77147 22.5636L2.15892 23.8415L3.43687 19.2289ZM23.5802 6.59529L22.6402 7.53523L18.466 3.36138L19.4063 2.42145C20.2716 1.55628 21.6745 1.55628 22.5397 2.42145L23.5802 3.46145C24.444 4.32765 24.444 5.72943 23.5802 6.59529Z"
          fill="#646464"/>
    </svg>
  </button>
</template>
<script>
  export default {
    name: 'BtnEdit',
  }
</script>
<style scoped>

  .action-divider {
    height: 1.7em;
    width: .1em;
    background-color: var(--clr-grey);
  }

  svg {
    height: 1.35em;
  }

  a,
  button {
    text-align: center;
    line-height: 0;
    height: fit-content;
    padding: 0 .3em;
    align-self: center;
  }

  button:hover svg {
    transform: scale(1.1);
  }

  a:hover path,
  button:hover path {
    fill: var(--clr-accent);
  }


</style>