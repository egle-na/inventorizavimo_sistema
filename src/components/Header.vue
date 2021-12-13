<template>

  <header>
    <nav>
      <router-link to="/" >Mano Inventorius</router-link>
      <router-link to="/" >Pridėti įrangą</router-link>
      <router-link to="/" >Pranešimai</router-link>
    </nav>

    <button id="notifications-btn">
      <img src="../assets/icons/Notification-bell.svg" alt="">
      <span v-show="notification" id="unread-notification"></span>
    </button>

    <button id="profile-btn">{{ nameInitials }}</button>
  </header>

</template>

<script>
  export default {
    name: "Header",
    // props: [ 'notification', 'name' ],
    data() {
      return {
        notification: true,
        name: 'Vardenis Pavardenis',
      }
    },
    computed: {
      nameInitials() {
        return this.name.charAt(0) + this.name.split(" ")[1].charAt(0);
      }
    }
  }
</script>

<style scoped>

  header {
    background-color: var(--clr-accent);
    padding: .5em 5%; /* dešinė pusė */
    display: flex;
    align-items: center;
    justify-content: end;
    letter-spacing: 1px;
  }

  a {
    color: var(--clr-white);
    font-family: var(--ff-roboto-con);
    font-size: var(--fs-nav);
    /*font-weight: 500;*/
    text-transform: uppercase;
    margin-right: 1em;
  }

  #notifications-btn {
    margin: 0 1em;
    position: relative;
  }

  #unread-notification {
    background: #FF6464;
    height: 13px;
    width: 13px;
    border: solid var(--clr-accent) 2px;
    border-radius: 50%;

    position: absolute;
    right: 1px;
  }

  #profile-btn {
    background: var(--clr-white);
    color: var(--clr-accent);
    font-family: var(--ff-bebas-neue);
    font-size: 1.875rem;
    letter-spacing: 2px;

    height: 44px;
    width: 44px;
    padding-top: 2px;
    border-radius: 50%;
  }

</style>