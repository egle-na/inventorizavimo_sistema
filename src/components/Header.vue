<template>
  <header>

    <!-- Teltonika Logo -->
    <router-link to="/" class="header-logo">
      <img src="../assets/teltonika_logo.png" alt="" class="teltonika-logo">
    </router-link>

    <!-- Navigation -->
    <nav>
      <router-link :to="{name: 'user-inventory', params:{}}">Mano Inventorius</router-link>
      <router-link class="tablet-hide" to="/notifications">Pranešimai</router-link>
      <router-link v-show="$store.getters.user.isAdmin" to="/all-inventory" >Admin</router-link> <!-- if role = admin -->
    </nav>

    <!-- Notifications container -->
    <div class="expand-container">
      <button id="notifications-btn" @click="notificationOpen = !notificationOpen">
        <img src="../assets/icons/Notification-bell.svg" alt="">
        <span v-show="$store.getters.notifications.length" id="unread-notification"></span>
      </button>
      <notification-card v-show="notificationOpen" @close="notificationOpen = false" >
        <request-component :type="'small'" />
      </notification-card>
    </div>

    <!-- Name Tag and menu -->
    <div class="expand-container">
      <button id="profile-btn" @click="userDropdownOpen = !userDropdownOpen">{{ nameInitials }}</button>
      <action-card v-show="userDropdownOpen" @close="userDropdownOpen = false">

        <user-card />
        <router-link :to="{name: 'user-inventory', params:{}}">Mano Inventorius</router-link>
        <router-link to="/notifications">Visi pranešimai</router-link>
        <router-link v-show="$store.getters.user.isAdmin" to="/all-inventory" class="mobile">Admin</router-link>
        <router-link to="/change-password">Keisti slaptažodį</router-link>
        <button @click="logOut">Atsijungti</button>

      </action-card>
    </div>
  </header>
</template>

<script>
  import DataMixin from "@/components/mixins/DataMixin";
  import UsersMixin from "@/components/mixins/UsersMixin";
  import ActionCard from "@/components/ActionCard";
  import NotificationCard from "@/components/NotificationCard";
  import RequestComponent from "@/components/RequestComponent";
  import UserCard from "@/components/UserCard";

  export default {
    name: "Header",
    mixins: [ DataMixin, UsersMixin ],
    components: {
      ActionCard,
      NotificationCard,
      RequestComponent,
      UserCard,
    },
    data() {
      return {
        notificationOpen: false,
        userDropdownOpen: false,
      }
    },

    created() {
      if(!this.$store.getters.allUsers.length){
        this.getUsersList();
      }
      this.getNotifications();
    },

    computed: {
      nameInitials() {
        return this.$store.getters.user.first_name.charAt(0) + this.$store.getters.user.last_name.charAt(0);
      },
    },

    methods: {
      logOut() {
        this.$http.post(this.$store.getters.API_baseURL + "/auth/logout", {}, this.config)
          .then(() => {
            localStorage.clear();
            this.$router.push({path: '/login'});
            this.$store.commit("setUser", {});
          }).catch(() => {
            localStorage.clear();
            this.$store.commit("setUser", {});
            this.$router.push({path: '/login'});
          })
      },
    },
  }
</script>

<style scoped>

  header {
    background-color: var(--clr-accent);
    font-family: var(--ff-roboto-con);

    position: sticky;
    top:0;
    padding: .5em 5%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);

    display: flex;
    align-items: center;
    justify-content: flex-end;
    z-index: 2;
  }

  .header-logo {
    margin-right: auto;
  }

  .teltonika-logo {
    height: 30px;
  }

  a {
    color: var(--clr-white);
    font-size: var(--fs-nav);
    letter-spacing: 1px;
    text-transform: uppercase;
    text-decoration: none;
    margin-right: 1.5em;
  }

  #notifications-btn {
    margin: 0 1em;
    position: relative;
  }

  #unread-notification {
    background: var(--clr-red);
    border: solid var(--clr-accent) 2px;
    border-radius: 50%;

    position: absolute;
    right: 1px;
    height: 13px;
    width: 13px;
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

  @media (max-width: 580px){
    nav{
      display: none;
    }

    .expand-container {
      position: initial;
    }
  }

</style>