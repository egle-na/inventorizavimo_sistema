<template>
  <div>
    <Header />

    <main>

      <div v-if="$store.getters.notifications.length">
        <h3>Neatsakytos užklausos</h3>
        <request-component @accepted="refresh" />
<!--            :requestsList="notificationsList"-->
<!--                    :namesList="$store.getters.allUsers"-->


      </div>

      <h3>Pranešimų istorija</h3>
      <div v-if="!list.length">
        <p>Pranešimų dar neturite.</p>
      </div>

      <div v-else>
        <div v-for="notification in list" :key="notification.id" class="message">
<!--          <p>{{ findName(notification.lender_id) }} jums {{ requestType(notification.event, 'history') }} <strong>{{ notification.gear[0].name }}</strong>.</p>-->
<!--          <p>{{ constructMessage(notification) }} <strong>{{ notification.gear[0].name }}</strong>.</p>-->
          <p>{{ constructMessage(notification) }} <strong>{{ getGearName(notification) }}</strong>.</p>
          <p class="date">{{ notification.created_at.split('T')[0] }}</p>
        </div>
      </div>


    </main>
  </div>
</template>

<script>
  import Header from "@/components/Header";
  import DataMixin from "@/components/mixins/DataMixin";
  import RequestComponent from "@/components/RequestComponent";
  import UsersMixin from "@/components/mixins/UsersMixin";

  export default {
    name: "NotificationHistory",
    mixins: [ DataMixin, UsersMixin ],
    components: {
      RequestComponent,
      Header,
    },
    data() {
      return {
        url: 'https://inventor-system.herokuapp.com/api/history',
        // addit_url: 'https://inventor-system.herokuapp.com/api/requests',
        // userList: [], // User mixin
      }
    },
    created(){
      this.getData(this.url);
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
              // return `Jūs grąžinote ${this.findName(item.sender_id)}`;
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
        } else return 'Nežinomas' //



      //   if(type === 'history') {
      //     if (item.user_id === this.$store.getters.user.id) {
      //       return `${this.findName(item.lender_id)} jums ${this.requestType(item.event, 'to-user')}`
      //     } else {
      //       return `Jūs ${this.requestType(item.event, 'user')} ${this.findName(item.lender_id)} `
      //     }
      //   } else {
      //     return `${this.findName(item.lender_id)} jums ${this.requestType(item.event)}`
      //   }
      },

      // getNames() { // User mixin
      //   this.$http.get('https://inventor-system.herokuapp.com/api/users', this.config)
      //       .then(response => {
      //         console.log(response.data)
      //         this.userList = response.data;
      //       }).catch(() => {
      //   })
      // },

      // findName(id) { // User mixin
      //   if(this.userList.length){
      //     let user = this.userList.filter(user => user.id === id)[0];
      //     return user ? user.first_name + ' ' + user.last_name : "Nežinomas"
      //   }
      //   return ''
      // },

      // requestType(status, type) {
      //   if(type === 'user') {
      //     switch (status) {
      //       case 0:
      //         return 'paskolino';
      //       case 1:
      //         return 'grąžino';
      //       case 2:
      //         return 'atidavė';
      //     }
      //   } else {
      //     switch (status) {
      //       case 0:
      //         return 'skolina';
      //       case 1:
      //         return 'paskolino';
      //       case 2:
      //         return 'grąžina';
      //       case 3:
      //         return 'perleidžia';
      //     }
      //   }
      // },

    }
  }
</script>

<style scoped>

/*  header {*/
/*    position: sticky;*/
/*    top: 0;*/
/*  }*/

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
    /*margin-bottom: 1em;*/
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
    color: var(--clr-darker-grey)
  }

/*.faded:focus,*/

/*.reverse-flex {*/
/*    display: flex;*/
/*    flex-direction: column-reverse;*/
/*  }*/

</style>