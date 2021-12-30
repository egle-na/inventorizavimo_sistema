<template>
  <div>
    <div v-for="request in notificationsList" :key="request.id" class="message">
      <div>
        <p class="date">{{ request.created_at.split('T')[0] }}</p>
        <p>{{ constructMessage(request) }} <strong>{{ request.gear[0].name }}</strong>.</p>
      </div>

      <div class="btn-container">
        <button class="btn faded" @click="discardRequest(request.id);$emit('responded')">Atmesti</button>
        <button class="btn" @click="acceptRequest(request.id, request.status)">Priimti</button>
      </div>
    </div>
    <div v-if="!notificationsList.length">
      <p>Šiuo metu naujų pranešimų neturite.</p>
    </div>
  </div>
</template>
<script>
  import DataMixin from "@/components/mixins/DataMixin";

  export default {
    name: 'RequestComponent',
    props: [ 'requestsList', 'namesList' ],
    mixins: [ DataMixin ],
    data() {
      return {
        usersList: []
      }
    },
    created() {
      this.getNotifications();
      this.notificationsList = this.requestsList;
      this.usersList = this.namesList;
      // if(!this.namesList && this.notificationsList.length) {
      //   this.getNames();
      // } else this.usersList = this.namesList
    },
    watch: {
      notificationsList() {
        if(!this.usersList){
          this.getNames();
        }
      }
    },
    methods: {
      acceptRequest(id, status){
        let url = ''
        switch (status){
          case 0: // skolina
            url = 'https://inventor-system.herokuapp.com/api/requests/acceptLend/';
            break;
          case 2: // grąžina
            url = 'https://inventor-system.herokuapp.com/api/requests/acceptReturn/';
            break;
          case 3: // perleidžia
            url = 'https://inventor-system.herokuapp.com/api/requests/acceptGiveaway/';
            break;
        }
        this.$http.post(url + id, {}, this.config)
            .then(() => {
              console.log('elp');

              this.$emit('responded'); // doesnt work
              console.log('me is here')
              this.getNotifications();
              // this.getAdditionalData(this.addit_url);
              // this.getData(this.url);
            })
      },

      discardRequest(id) {
        this.$http.delete('https://inventor-system.herokuapp.com/api/requests/'+ id, this.config)
            .then(() => {
              // this.getAdditionalData(this.addit_url);
              // this.getData(this.url);
              console.log('elp');

              this.$emit("responded");
              console.log('me is here', this)

              this.getNotifications();
            })
      },

      constructMessage(item) {
        switch (item.status) {
          case 0:
            return `${this.findName(item.lender_id)} jums skolina`;
          case 2:
            return `${this.findName(item.lender_id)} jums grąžina`;
          case 3:
            return `${this.findName(item.lender_id)} jums perleidžia`;
        }
      },

      findName(id) {
        if(this.usersList){
          let user = this.usersList.filter(user => user.id === id)[0];
          return user ? user.first_name + ' ' + user.last_name : "Nežinomas"
        }
        return ''
      },

      getNames() {
        this.$http.get('https://inventor-system.herokuapp.com/api/users', this.config)
            .then(response => {
              console.log(response.data)
              this.usersList = response.data;
            }).catch(() => {
        })
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