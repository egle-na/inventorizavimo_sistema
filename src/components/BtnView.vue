<template>
<!--  <router-link :to="'/inventory/' + id" title="Peržiūrėti">-->
  <router-link :to="routeTo" title="Peržiūrėti">
    <svg width="32" height="23" viewBox="0 0 32 23" fill="none" xmlns="http://www.w3.org/2000/svg" class="view">
      <path class="view-open" fill-rule="evenodd" clip-rule="evenodd"
            d="M27.5038 9.95738C19.6757 5.13166 9.70818 5.51187 2.27044 10.9199L1.09427 9.3023C9.18805 3.41726 20.0348 3.00352 28.5534 8.25488L31.0348 9.78461L29.9853 11.4871L27.5038 9.95738Z"
            fill="#646464"/>
      <path class="view-open"
            d="M20.7882 8.1666C20.7882 11.3883 18.497 13.9999 15.6706 13.9999C12.8442 13.9999 10.553 11.3883 10.553 8.1666C10.553 4.94494 13.1736 5.49989 16 5.49989C18.8264 5.49989 20.7882 4.94494 20.7882 8.1666Z"
            fill="#646464"/>
      <path class="view-closed" fill-rule="evenodd" clip-rule="evenodd"
            d="M31.072 10.1664L29.1431 11.95C28.7489 12.3145 28.3439 12.6601 27.9293 12.9867L30.4712 16.528L28.8464 17.6943L26.2981 14.1441C25.125 14.8907 23.8928 15.5017 22.6232 15.9777L24.1409 21.5134L22.2121 22.0422L20.7159 16.5848C19.1657 16.9934 17.5776 17.2111 15.9882 17.2397V22.5556H13.9882V17.1757C12.8301 17.0806 11.6794 16.8846 10.5506 16.5885L8.75956 21.352L6.88751 20.6481L8.64139 15.9834C7.61271 15.5993 6.61029 15.1278 5.64586 14.5693L3.14955 17.7308L1.57987 16.4914L3.9611 13.4756C2.88757 12.6985 1.87599 11.802 0.945279 10.7869L0.26947 10.0499L1.74362 8.69824L2.41943 9.43532C9.12555 16.7494 20.4996 17.2186 27.7853 10.4816L29.7141 8.698L31.072 10.1664Z"
            fill="#646464"/>
    </svg>
  </router-link>
</template>
<script>
  export default {
    name: 'BtnView',
    props: [ 'routeTo' ],
  }
</script>
<style scoped>

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

  .view-open,
  tr:hover .view-closed {
    display: none;
  }

  .view-closed,
  tr:hover .view-open {
    display: initial;
  }


</style>