<template>
  <div id="app">
    <router-view />
    <success-msg-component />
  </div>
</template>

<script>

import SuccessMsgComponent from "@/components/SuccessMsgComponent";
export default {
  name: 'App',
  components: {SuccessMsgComponent},
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
    --clr-red: #FF6464;

    --ff-bebas-neue: 'Bebas Neue', cursive;
    --ff-karla: 'Karla', sans-serif;
    --ff-roboto-con: 'Roboto Condensed', sans-serif;

    --ls-bebas: .065em;

    --fw-bold-roboto: 700;
    --fw-bold-karla: 600;

    --fs-nav: 0.875rem;         /* 14px */
    --fs-table-header: 1.25rem; /* 20px */
    --fs-side-menu: 1.5rem;     /* 24px */
    --fs-button: 1.8rem;        /* nebe 30px 1.875 */
  }

  * { box-sizing: border-box; }

  body {
    margin: 0;
    font-family: var(--ff-karla);
    color: var(--clr-black);
    height: 100vh;
  }

  h1, h2, h3 {
    color: var(--clr-dark-grey);
    font-family: var(--ff-roboto-con);
    font-weight: 400;
    display: inline-block;
    border-bottom: solid var(--clr-grey) 2px;
  }

  h1 {
    font-size: 4rem;
    padding-right: 1em;
    padding-bottom: 0;
    line-height: 1;
    margin: 0;
  }

  h2 {
    padding-right: 1.5em;
    padding-bottom: .1em;
    font-size: 3rem;
    border-color: var(--clr-accent);
  }

  h3 {
    font-size: 24px;
    padding-right: 1.5em;
    border-color: var(--clr-accent);
    margin: 0;
  }

  img {
    max-width: 100%;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    min-width: max-content;
  }

  .btn {
    background: var(--clr-white);
    border: var(--clr-accent) solid 3px;
    border-radius: 5px;

    color: var(--clr-dark-grey);
    font-family: var(--ff-bebas-neue);
    font-size: var(--fs-button);
    letter-spacing: var(--ls-bebas);

    padding: .15em .6em;
    transition: background-color 200ms, color 200ms, border-color 200ms;
  }

  .btn:hover {
    background: var(--clr-accent);
    color: var(--clr-white);
  }

  .btn:disabled,
  .btn:disabled:hover,
  .btn:disabled:focus {
    background-color: var(--clr-white);
    border-color: var(--clr-light-grey);
    color: var(--clr-grey);
  }

  .faded {
    border-color: var(--clr-grey);
  }

  .faded:hover {
    border-color: var(--clr-accent);
  }

  input,
  select,
  textarea {
    font: inherit;
    color: inherit;
    background: transparent;
    border: none;
    border-left: solid 3px transparent;
    border-bottom: solid 3px var(--clr-grey);
    padding: .7em 1.5em;
    transition: border-color 300ms;
  }

  input:hover,
  select:hover,
  textarea:hover {
    border-bottom-color: var(--clr-accent);
  }

  input:focus,
  select:focus,
  textarea:focus {
    border-width: 3px;
    border-color: var(--clr-accent);
    outline: none;
  }

  .mobile {
    display: none;
  }

  .hidden{
    visibility: hidden;
  }


  @media (max-width: 580px){
    .mobile {
      display: initial;
    }

    .non-mobile {
      display: none;
    }

    h1 {
      font-size: 2.9rem;
    }

    h2 {
      font-size: 2rem;
    }
  }

  @media(max-width: 820px){
    .tablet-hide {
      display: none;
    }
  }

</style>
