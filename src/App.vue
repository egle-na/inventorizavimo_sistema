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
    --clr-darker-grey: #a7a7a7;
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
    color: var(--clr-black);
  }

  img {
    max-width: 100%;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
  }

  .btn {
    background: var(--clr-white);
    border: var(--clr-accent) solid 3px;
    border-radius: 5px;

    color: var(--clr-dark-grey);
    font-family: var(--ff-bebas-neue);
    font-size: var(--fs-button);

    padding: .15em .8em;
  }

  input {
    /*position: relative;*/
    font: inherit;
    color: inherit;
    background: transparent;
    border: none;
    border-left: solid 3px transparent;
    border-bottom: solid 3px var(--clr-grey);
    padding: .7em 1.5em;
  }

  input:focus {
    /*color: var(--clr-accent);*/
    border-width: 3px;
    border-color: var(--clr-accent);
    outline: none;
  }


</style>
