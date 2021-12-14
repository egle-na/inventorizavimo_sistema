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

    <span id="profile-btn">{{ nameInitials }}</span>
  </header>

</template>

<script>
  import ProfileImgMixin from "@/components/mixins/ProfileImgMixin";

  export default {
    name: "Header",
    // props: [ 'notification', 'name' ],
    mixins: [ ProfileImgMixin ],
    data() {
      return {
        notification: true,
      }
    },
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
    font-family: var(--ff-roboto-con);
    position: relative;
    z-index: 1;
    filter: drop-shadow(0px 4px 7px rgba(0, 0, 0, 0.25));
  }

  a {
    color: var(--clr-white);
    font-size: var(--fs-nav);
    /*font-weight: 500;*/
    text-transform: uppercase;
    margin-right: 1.5em;
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

    display: flex;
    justify-content: center;
    align-items: center;

    height: 44px;
    width: 44px;
    padding-top: 2px;
    border-radius: 50%;
  }

</style>