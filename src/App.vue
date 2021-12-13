<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  }
}
</script>

<style>

  :root {

    --clr-white: #fff;
    --clr-accent: #0054A6;
    --clr-black: #333;
    --clr-dark-grey: #646464;
    --clr-grey: #c5c5c5;
    --clr-light-grey: #f3f3f3;
    --clr-almost-white: #fafafa;

    --ff-bebas-neue: 'Bebas Neue', cursive;
    --ff-karla: 'Karla', sans-serif;
    --ff-roboto-con: 'Roboto Condensed', sans-serif;

    --fw-bold-roboto: 700;
    --fw-bold-karla: 600;

    --fs-nav: 0.875rem;         /* 14px */
    --fs-table-header: 1.25rem; /* 20px */
    --fs-side-menu: 1.5rem;     /* 24px */
    --fs-button: 1.875rem;      /* 30px */
    --fs-title: 4rem;           /* 64px media 30px */

    /* Add item modal title 48px */
    /* header profile bubble --fs-button 30px */
    /* side menu profile bubble 34px */
    /* side menu profile name --ff-side-menu 24px */
    /* side menu profile email --ff-side-menu 24px */

  }

  * { box-sizing: border-box; }

  body {
    margin: 0;
    font-family: var(--ff-karla);
  }

  button {
    background: none;
    border: none;
  }

</style>
