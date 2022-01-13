<template>
<div>

  <Header />
  <main>

    <!-- Requests -->
    <div v-if="$store.getters.notifications.length">
      <h3>Neatsakytos užklausos</h3>
      <request-component :type="'page'" />
    </div>

    <!-- History -->
    <h3>Pranešimų istorija</h3>
    <div v-if="!list.length">
      <p>Pranešimų dar neturite.</p>
    </div>
    <div v-else>
      <div v-for="notification in list" :key="notification.id" class="message">
        <p>{{ constructMessage(notification) }} <strong>{{ getGearName(notification) }}</strong>.</p>
        <p class="date">{{ notification.created_at.split('T')[0] }}</p>
      </div>
    </div>

  </main>
</div>
</template>

<script>
  import DataMixin from "@/components/mixins/DataMixin";
  import UsersMixin from "@/components/mixins/UsersMixin";
  import Header from "@/components/Header";
  import RequestComponent from "@/components/RequestComponent";
  import {EventBus} from "@/main";

  export default {
    name: "NotificationHistory",
    mixins: [ DataMixin, UsersMixin ],
    components: {
      Header,
      RequestComponent,
    },
    data() {
      return {
        url: this.$store.getters.API_baseURL + '/history',
      }
    },
    created(){
      this.getData(this.url);
    },
    mounted() {
      EventBus.$on('requestChanged', this.refresh);
    },
    beforeDestroy() {
      EventBus.$off('requestChanged');
    },
    methods: {
      getGearName(notification) {
        if(notification.gear.length){
          return notification.gear[0].name;
        }
        return 'nežinomą inventorių';
      },

      refresh() {
        this.getData(this.url);
      },

      constructMessage(item) {
        if(item.user_id === this.$store.getters.user.id) {
          switch (item.event){
            case 0:
              return `${this.findName(item.sender_id)} jums paskolino`;
            case 1:
              return `${this.findName(item.sender_id)} jums grąžino`;
            case 2:
              return `${this.findName(item.sender_id)} jums atidavė`;
          }
        } else if (item.user_id !== this.$store.getters.user.id) {
          switch (item.event){
            case 0:
              return `Jūs paskolinote ${this.findName(item.user_id)}`;
            case 1:
              return `Jūs grąžinote ${this.findName(item.user_id)}`;
            case 2:
              return `Jūs perleidote ${this.findName(item.user_id)}`;
          }
        } else return 'Nežinomas';
      },

    }
  }
</script>

<style scoped>

  main {
    width: 90%;
    margin: 3em auto;
    max-width: 800px;
  }

  .message {
    margin: 1em 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: solid 3px var(--clr-light-grey);
  }

  h3 {
    color: var(--clr-dark-grey);
    margin-bottom: .5em;
  }

  h3:not(:first-child){
    margin-top: 3em;
  }

  .date {
    margin: 0;
    color: var(--clr-darker-grey);
  }

</style>