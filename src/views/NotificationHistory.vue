<template>
  <div>
    <Header />

    <main>

      <div v-if="requestList.length">
        <h3>Neatsakytos užklausos</h3>
        <div v-for="request in requestList" :key="request.id" class="message">
          <div>
            <p class="date">{{ request.created_at.split('T')[0] }}</p>
<!--            <p>{{ findName(request.lender_id) }} jums {{ requestType(request.status) }} <strong>{{ request.gear[0].name }}</strong>.</p>-->
            <p>{{ constructMessage(request, 'request') }} <strong>{{ request.gear[0].name }}</strong>.</p>
          </div>

          <div class="btn-container">
            <button class="btn faded" @click="discardRequest(request.id)">Atmesti</button>
            <button class="btn" @click="acceptRequest(request.id, request.status)">Priimti</button>
          </div>
        </div>
      </div>

      <h3>Pranešimų istorija</h3>
      <div class="reverse-flex">
        <div v-for="notification in list" :key="notification.id" class="message">
<!--          <p>{{ findName(notification.lender_id) }} jums {{ requestType(notification.event, 'history') }} <strong>{{ notification.gear[0].name }}</strong>.</p>-->
          <p>{{ constructMessage(notification, 'history') }} <strong>{{ notification.gear[0].name }}</strong>.</p>
          <p class="date">{{ notification.created_at.split('T')[0] }}</p>
        </div>
      </div>

      <div v-if="!list.length">
        <p>Pranešimų dar neturite.</p>
      </div>

    </main>
  </div>
</template>

<script>
  import Header from "@/components/Header";
  import DataMixin from "@/components/mixins/DataMixin";
  export default {
    name: "NotificationHistory",
    mixins: [ DataMixin ],
    components: {
      Header,
    },
    data() {
      return {
        url: 'https://inventor-system.herokuapp.com/api/history',
        addit_url: 'https://inventor-system.herokuapp.com/api/requests',
        userList: [],
      }
    },
    created(){
      console.log("notification history list:")
      this.getData(this.url);
      this.getAdditionalData(this.addit_url);
      this.getNames();
    },

    computed:{
      requestList(){
        return this.additionalList.filter(request => request.status !== 1);
      }
    },

    methods: {

      constructMessage(item, type) {

        if(type === 'request'){
          switch (item.status){
            case 0:
              return `${this.findName(item.lender_id)} jums skolina`;
            case 2:
              return `${this.findName(item.lender_id)} jums grąžina`;
            case 3:
              return `${this.findName(item.lender_id)} jums perleidžia`;
          }
        } else if(type === 'history' && item.user_id === this.$store.getters.user.id) {
          switch (item.event){
            case 0:
              return `${this.findName(item.lender_id)} jums paskolino`;
            case 1:
              return `${this.findName(item.lender_id)} jums grąžino`;
            case 2:
              return `${this.findName(item.lender_id)} jums atidavė`;
          }
        } else if (type === 'history' && item.user_id !== this.$store.getters.user.id) {
          switch (item.event){
            case 0:
              return `Jūs paskolinote ${this.findName(item.lender_id)}`;
            case 1:
              return `Jūs grąžinote ${this.findName(item.lender_id)}`;
            case 2:
              return `Jūs perleidote ${this.findName(item.lender_id)}`;
          }
        } else return 'elp' //



        if(type === 'history') {
          if (item.user_id === this.$store.getters.user.id) {
            return `${this.findName(item.lender_id)} jums ${this.requestType(item.event, 'to-user')}`
          } else {
            return `Jūs ${this.requestType(item.event, 'user')} ${this.findName(item.lender_id)} `
          }
        } else {
          return `${this.findName(item.lender_id)} jums ${this.requestType(item.event)}`
        }
      },

      getNames() {
        this.$http.get('https://inventor-system.herokuapp.com/api/users', this.config)
            .then(response => {
              console.log(response.data)
              this.userList = response.data;
            }).catch(() => {
        })
      },

      findName(id) {
        if(this.userList.length){
          let user = this.userList.filter(user => user.id = id)[0];
          return user ? user.first_name + ' ' + user.last_name : "Nežinomas"
        }
      },
      requestType(status, type) {
        if(type === 'user') {
          switch (status) {
            case 0:
              return 'paskolino';
            case 1:
              return 'grąžino';
            case 2:
              return 'atidavė';
          }
        } else {
          switch (status) {
            case 0:
              return 'skolina';
            case 1:
              return 'paskolino';
            case 2:
              return 'grąžina';
            case 3:
              return 'perleidžia';
          }
        }
      },

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
            .then(response => {
              this.getAdditionalData(this.addit_url);
              this.getData(this.url);
              console.log(response.data)
            })
      },

      discardRequest(id) {
        this.$http.delete('https://inventor-system.herokuapp.com/api/requests/'+ id, this.config)
          .then(response => {
            this.getAdditionalData(this.addit_url);
            // this.getData(this.url);
            console.log(response.data)
          })
      }
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

  .btn-container .btn{
    margin-left: .5em;
  }

  .faded {
    border-color: var(--clr-grey);
  }

  /*.faded:focus,*/
  .faded:hover {
    border-color: var(--clr-accent);
  }

  .reverse-flex {
    display: flex;
    flex-direction: column-reverse;
  }

</style>