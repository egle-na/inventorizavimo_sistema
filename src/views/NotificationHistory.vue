<template>
<div>

  <Header />
  <main>

    <!-- Requests -->
    <div v-if="$store.getters.notifications.length">
      <h3>{{ $t('request.pending') }}</h3>
      <request-component :type="'page'" />
    </div>

    <!-- History -->
    <h3>{{ $t('request.history') }}</h3>
    <div v-if="!list.length">
      <p>{{ $t('request.no-history') }}</p>
    </div>
    <div v-else>
      <div v-for="notification in list" :key="notification.id" class="message">

        <i18n :path="constructMessage(notification)" tag="p">
          <template #gear>
            <strong>{{ getGearName(notification) }}</strong>
          </template>
          <template v-if="constructMessage(notification).includes('.you-')" #name>
            {{ findName(notification.user_id) }}
          </template>
          <template v-else #name>{{ findName(notification.sender_id) }}</template>
        </i18n>

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
      document.title = this.$t('navigation.notifications') + this.$t('tab-title_base');
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
        return notification.gear.length ? notification.gear[0].name : this.$t('request.gear-unknown');
      },

      refresh() {
        this.getData(this.url);
      },

      constructMessage(item) {
        if(item.user_id === this.$store.getters.user.id) {
          switch (item.event){
            case 0:
              return 'request.lent';
            case 1:
              return 'request.returned';
            case 2:
              return 'request.transferred';
          }
        } else if (item.user_id !== this.$store.getters.user.id) {
          switch (item.event){
            case 0:
              return `request.you-lent`;
            case 1:
              return 'request.you-returned';
            case 2:
              return `request.you-transferred`;
          }
        }
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