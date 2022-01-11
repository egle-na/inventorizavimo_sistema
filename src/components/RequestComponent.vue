<template>
  <div>
    <div v-for="request in $store.getters.notifications" :key="request.id" class="message">
      <div>
        <p class="date">{{ request.created_at.split('T')[0] }}</p>
        <p>{{ constructMessage(request) }} <strong>{{ request.gear[0].name }}</strong>.</p>
      </div>

      <div class="btn-container">
        <button class="btn faded" @click="declineRequest(request.id, request.status);$emit('responded')">Atmesti</button>
        <button class="btn" @click="acceptRequest(request.id, request.status)">Priimti</button>
      </div>
    </div>
    <div v-if="!$store.getters.notifications.length">
      <p>Šiuo metu naujų pranešimų neturite.</p>
    </div>
  </div>
</template>
<script>
  import DataMixin from "@/components/mixins/DataMixin";
  import UsersMixin from "@/components/mixins/UsersMixin";

  export default {
    name: 'RequestComponent',
    props: [ 'requestsList', 'namesList' ],
    mixins: [ DataMixin, UsersMixin ],
    data() {
      return {
        // usersList: []
      }
    },
    created() {
      // this.getNotifications();
      // this.notificationsList = this.requestsList;
      // this.usersList = this.namesList;
      // if(!this.namesList && this.notificationsList.length) {
      //   this.getNames();
      // } else this.usersList = this.namesList
    },
    // computed:{
    //   requests() {
    //     return this.$store.state.notifications;
    //   }
    // },
    // watch: {
    //   notificationsList() {
    //     if(!this.usersList){
    //       this.getNames();
    //     }
    //   }
    // },
    methods: {
      acceptRequest(id, status){
        let endpoint = ''
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
              // this.$router.go(0); // man nepatinka šitas
              // console.log('elp');

              // this.$emit('responded'); // doesnt work
              // console.log('me is here')
              this.getNotifications();
              this.$emit('accepted');
              // this.getAdditionalData(this.addit_url);
              // this.getData(this.url);
            })
      },

      declineRequest(id, status) {
        if (status === 2) {
          this.$http.post(this.$store.getters.API_baseURL + '/requests/decline-return/' + id,{}, this.config)
              .then(this.getNotifications) // is it too short?
              .catch(this.getNotifications)
        } else {
          this.$http.delete(this.$store.getters.API_baseURL + '/requests/' + id, this.config)
              .then(this.getNotifications)
              .catch(this.getNotifications)
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
    margin: 1em 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: solid 3px var(--clr-light-grey);
    /*margin-bottom: 1em;*/
    flex-wrap: wrap;
  }

  .date {
    margin: 0;
    color: var(--clr-darker-grey)
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

  header .btn {
    font-size: 1.6rem;
  }

  .faded {
    border-color: var(--clr-grey);
  }

  /*.faded:focus,*/
  .faded:hover {
    border-color: var(--clr-accent);
  }

</style>