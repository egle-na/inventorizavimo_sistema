<template>

  <header>
    <nav>
      <router-link to="/" >Mano Inventorius</router-link>
      <router-link to="/" >Pridėti įrangą</router-link>
      <router-link to="/" >Pranešimai</router-link>
    </nav>

    <button id="messages-btn">
      <img src="../assets/icons/Notification-bell.svg" alt="">
    </button>

    <button id="profile-btn">VP</button>
  </header>

</template>

<script>
  export default {
    name: "Header"
  }
</script>

<style scoped>

  header {
    background-color: var(--clr-accent);
    padding: .5em 5%; /* dešinė pusė */
    display: flex;
    align-items: center;
    justify-content: end;
  }

  a {
    color: var(--clr-white);
    font-family: var(--ff-roboto-con);
    font-size: var(--fs-nav);
    /*font-weight: 500;*/
    text-transform: uppercase;
    margin-right: 1em;
  }

  #messages-btn {
    margin-right: 1em;

  }

  #profile-btn {
    background: var(--clr-white);
    color: var(--clr-accent);
    font-family: var(--ff-bebas-neue);
    font-size: 1.875rem;
    letter-spacing: 2px;
    /*padding-top:;*/

    /*margin: .2em;*/
    height: 44px;
    width: 44px;
    border-radius: 50%;
  }

</style>