<template>
  <div>
    <!-- In page requests -->
    <div v-if="type === 'page'">
      <div v-for="request in $store.getters.notifications" :key="request.id" class="message">

        <div>
          <p class="date">{{ request.created_at.split('T')[0] }}</p>
          <p>{{ constructMessage(request) }} <strong>{{ request.gear[0].name }}</strong>.</p>
        </div>

        <!-- buttons -->
        <div class="btn-container">
          <button class="btn faded" @click="declineRequest(request.id, request.status)">Atmesti</button>
          <button class="btn" @click="acceptRequest(request.id, request.status)">Priimti</button>
        </div>

      </div>
    </div>

    <!-- In header card requests -->
    <div v-if="type === 'small'">
      <div v-for="request in $store.getters.notifications" :key="request.id" class="message">

        <p class="date">{{ request.created_at.split('T')[0] }}</p>
        <div class="message-small">
          <p>{{ constructMessage(request) }} <strong>{{ request.gear[0].name }}</strong>.</p>

          <!-- buttons -->
          <div class="btn-container">
            <button title="Priimti" @click="acceptRequest(request.id, request.status)">
              <img src="../assets/icons/Accept.svg" alt="">
            </button>
            <button title="Atmesti" @click="declineRequest(request.id, request.status);$emit('responded')">
              <img src="../assets/icons/Decline.svg" alt="">
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- No requests -->
    <div v-if="!$store.getters.notifications.length">
      <p>Šiuo metu naujų pranešimų neturite.</p>
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
          case 0: // skolina
            endpoint = '/requests/accept-lend/';
            break;
          case 2: // grąžina
            endpoint = '/requests/accept-return/';
            break;
          case 3: // perleidžia
            endpoint = '/requests/accept-giveaway/';
            break;
        }
        this.$http.post(this.$store.getters.API_baseURL + endpoint + id, {}, this.config)
            .then(() => {
              EventBus.$emit('displayMessage', 'Užklausa priimta!');
              EventBus.$emit('requestChanged');
              this.getNotifications();
            })
      },

      declineRequest(id, status) {
        if (status === 2) { // grąžina
          this.$http.post(this.$store.getters.API_baseURL + '/requests/decline-return/' + id,{}, this.config)
              .then(() => {
                EventBus.$emit('displayMessage', 'Užklausa atmesta!');
                this.getNotifications(); // is it too short?

              }).catch(this.getNotifications)

        } else {
          this.$http.delete(this.$store.getters.API_baseURL + '/requests/' + id, this.config)
              .then(() => {
                EventBus.$emit('displayMessage', 'Užklausa atmesta!');
                this.getNotifications();

              }).catch(this.getNotifications)
        }
      },

      constructMessage(item) {
        switch (item.status) {
          case 0:
            return `${this.findName(item.sender_id)} jums skolina`;
          case 2:
            return `${this.findName(item.user_id)} jums grąžina`;
          case 3:
            return `${this.findName(item.sender_id)} jums perleidžia`;
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