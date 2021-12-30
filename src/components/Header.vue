<template>

  <header>
    <img src="../assets/teltonika_logo.png" alt="" class="teltonika-logo">
    <nav>
      <router-link :to="{name: 'user-inventory', params:{}}">Mano Inventorius</router-link>
<!--      <router-link to="/add-inventory" >Pridėti įrangą</router-link>-->
      <router-link to="/notifications">Pranešimai</router-link>
      <router-link v-show="$store.getters.user.isAdmin" to="/all-inventory" >Admin</router-link> <!-- if role = admin -->
    </nav>

    <div class="expand-container">
      <button id="notifications-btn" @click="notificationOpen = !notificationOpen">
        <img src="../assets/icons/Notification-bell.svg" alt="">
        <span v-show="notificationsList.length" id="unread-notification"></span>
      </button>
      <notification-card v-show="notificationOpen" @close="notificationOpen = false" >
        <request-component :requestsList="notificationsList"/>
      </notification-card>
    </div>

    <div class="expand-container">
      <button id="profile-btn" @click="userDropdownOpen = !userDropdownOpen">{{ nameInitials }}</button>
      <action-card v-show="userDropdownOpen" @close="userDropdownOpen = false">

        <user-card />
        <router-link :to="{name: 'user-inventory', params:{}}">Mano Inventorius</router-link>
        <router-link to="/notifications">Visi pranešimai</router-link>
        <button>Keisti slaptažodį</button>
        <button @click="logOut">Atsijungti</button>

      </action-card>
    </div>
  </header>

</template>

<script>
  import NotificationCard from "@/components/NotificationCard";
  import ActionCard from "@/components/ActionCard";
  import UserCard from "@/components/UserCard";
  import DataMixin from "@/components/mixins/DataMixin";
  import RequestComponent from "@/views/RequestComponent";

  // import jwt_decode from "jwt-decode";

  export default {
    name: "Header",
    components: {
      RequestComponent,
      UserCard,
      ActionCard,
      NotificationCard
    },
    // props: [ 'notification', 'name' ],
    mixins: [ DataMixin ],
    data() {
      return {
        notification: true,
        notificationOpen: false,
        userDropdownOpen: false,
      }
    },
    created() {
      this.getNotifications();
    },
    computed: {
      nameInitials() {
        return this.$store.getters.user.first_name.charAt(0) + this.$store.getters.user.last_name.charAt(0);
      },
    },
    methods: {
      logOut() {
        this.$http.post("https://inventor-system.herokuapp.com/api/auth/logout", {}, this.config)
          .then(response => {
            console.log(response.data.message);
            localStorage.clear();
            this.$router.push({path: '/login'});
            this.$store.commit("setUser", {}); //
          }).catch(error => {
            console.log('too bad', error)
            localStorage.clear();
            this.$store.commit("setUser", {}); //
            this.$router.push({path: '/login'});
          })
      },
    },
  }
</script>

<style scoped>

  header {
    position: sticky;
    top:0;
    background-color: var(--clr-accent);
    padding: .5em 5%; /* dešinė pusė */
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-family: var(--ff-roboto-con);
    /*position: relative;*/
    z-index: 2;
    /*filter: drop-shadow(0px 4px 7px rgba(0, 0, 0, 0.25));*/
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  }

  .teltonika-logo {
    margin-right: auto;
    height: 30px;
  }

  a {
    letter-spacing: 1px;
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

  .expand-container {
    position: relative;
  }

  .action-card a,
  .action-card button:not(.close-btn){
    padding: .5em 1em;
  }

</style>