<template>
  <div>
    <!-- In page requests -->
    <div v-if="type === 'page'">
      <div v-for="request in $store.getters.notifications" :key="request.id" class="message">

        <div>
          <p class="date">{{ request.created_at.split('T')[0] }}</p>
          <i18n :path="constructMessage(request)" tag="p">
            <template #gear>
              <strong>{{ request.gear[0].name }}</strong>
            </template>
            <template v-if="constructMessage(request).includes('return')" #name>
              {{ findName(request.user_id) }}
            </template>
            <template v-else #name>{{ findName(request.sender_id) }}</template>
          </i18n>
        </div>

        <!-- buttons -->
        <div class="btn-container">
          <button class="btn faded" @click="declineRequest(request.id, request.status)">{{ $t('request.decline') }}</button>
          <button class="btn" @click="acceptRequest(request.id, request.status)">{{ $t('request.accept') }}</button>
        </div>

      </div>
    </div>

    <!-- In header card requests -->
    <div v-if="type === 'small'">
      <div v-for="request in $store.getters.notifications" :key="request.id" class="message">

        <p class="date">{{ request.created_at.split('T')[0] }}</p>
        <div class="message-small">

          <i18n :path="constructMessage(request)" tag="p">
            <template #gear>
              <strong>{{ request.gear[0].name }}</strong>
            </template>
            <template v-if="constructMessage(request).includes('return')" #name>
              {{ findName(request.user_id) }}
            </template>
            <template v-else #name>{{ findName(request.sender_id) }}</template>
          </i18n>

          <!-- buttons -->
          <div class="btn-container">
            <button :title="$t('request.accept')" @click="acceptRequest(request.id, request.status)">
              <img src="../assets/icons/Accept.svg" alt="">
            </button>
            <button :title="$t('request.decline')" @click="declineRequest(request.id, request.status)">
              <img src="../assets/icons/Decline.svg" alt="">
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- No requests -->
    <div v-if="!$store.getters.notifications.length">
      <p>{{ $t('request.no-requests') }}</p>
    </div>

  </div>
</template>

<script>
  import DataMixin from "@/components/mixins/DataMixin";
  import UsersMixin from "@/components/mixins/UsersMixin";
  import {EventBus} from "@/main";

  export default {
    name: 'RequestComponent',
    props: [ 'type' ],
    mixins: [ DataMixin, UsersMixin ],
    methods: {
      acceptRequest(id, status){
        let endpoint = '';
        switch (status){
          case 0: // lend request
            endpoint = '/requests/accept-lend/';
            break;
          case 2: // return request
            endpoint = '/requests/accept-return/';
            break;
          case 3: // transfer request
            endpoint = '/requests/accept-giveaway/';
            break;
        }
        this.$http.post(this.$store.getters.API_baseURL + endpoint + id, {}, this.config)
            .then(() => {
              EventBus.$emit('displayMessage', this.$t('messages.request-accept'));
              EventBus.$emit('requestChanged');
              this.getNotifications();
            })
      },

      declineRequest(id, status) {
        if (status === 2) { // return
          this.$http.post(this.$store.getters.API_baseURL + '/requests/decline-return/' + id,{}, this.config)
              .then(() => {
                EventBus.$emit('displayMessage', this.$t('messages.request-decline'));
                this.getNotifications();

              }).catch(this.getNotifications)

        } else {
          this.$http.delete(this.$store.getters.API_baseURL + '/requests/' + id, this.config)
              .then(() => {
                EventBus.$emit('displayMessage', this.$t('messages.request-decline'));
                this.getNotifications();

              }).catch(this.getNotifications)
        }
      },

      constructMessage(item) {
        switch (item.status) {
          case 0:
            return 'request.lend';
          case 2:
            return 'request.return';
          case 3:
            return 'request.transfer';
        }
      },
    }
  }
</script>

<style scoped>

  .message {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: 1em 0;
    border-bottom: solid 3px var(--clr-light-grey);
  }

  .message-small {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
  }

  .date {
    margin: 0;
    color: var(--clr-darker-grey);
  }

  .btn-container{
    white-space: nowrap;
    margin-bottom: .7em;
    margin-left: auto;
    align-self: flex-end;
  }

  .btn-container .btn {
    margin-left: .5em;
  }

  .message-small .btn-container {
    margin: 0;
    align-self: center;
  }

  .message-small img{
    width: 40px;
  }

  .message-small button:hover img{
    transform: scale(1.05);
  }

  header .btn {
    font-size: 1.6rem;
  }

  .faded {
    border-color: var(--clr-grey);
  }

  .faded:hover {
    border-color: var(--clr-accent);
  }

</style>