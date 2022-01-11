<script>
  // import jwt_decode from "jwt-decode";

  import {EventBus} from "@/main";

  export default {
    name: "DataMixin",
    data() {
      return {
        list: [],
        additionalList: [],
        // notificationsList: [],
        config: {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
          }
        },
        // user: {},
      }
    },

    methods: {
      getData(url, successFn, failFn) {
        this.$http.get(url, this.config)
          .then(response => {
            console.log(response.data);
            this.list = response.data;
            // this.getNotifications();
            if(successFn) successFn(response);

            // this.refreshUsersToken();
          }).catch(error => {
            if(failFn) failFn();
            this.getDataError(error);
          })
      },

      getDataError(error){
        console.error(error);
        if(error.response.data.message === "Token has expired" ||
            error.response.data.message === "The token has been blacklisted" ||
            error.response.data.status === 401 ){
          EventBus.$emit('displayMessage', 'Sesijos laikas baigėsi!');
          localStorage.clear();
          this.$router.push({name: 'login'});
        } else {
          EventBus.$emit('displayMessage', 'Įvyko klaida.');
        }
      },

      setSearch(val) {
        this.getDataQuery(this.url, {search: val});
      },

      getDataQuery(url, params) {
        this.$http.get(url, {...this.config, params: params })
          .then(response => {
            console.log(response.data);
            this.list = response.data;
          }).catch(error => {
            this.getDataError(error);
        })
      },

      refreshUsersToken(){
        this.$http.post(this.$store.getters.API_baseURL + '/auth/refresh', {}, this.config)
          .then(response => {
            localStorage.setItem("access_token", response.data.access_token);
            this.config.headers.Authorization = `Bearer ${localStorage.getItem("access_token")}`;
            // const {email, first_name, last_name, id, role} = jwt_decode(localStorage.getItem("access_token"));
            // this.user = {id, first_name, last_name, email, isAdmin: !!role }
          }).catch(error => {
            console.error(error);
        })
      },

      postData(url, data, successFn, failFn) {
        this.$http.post( url, data, this.config)
          .then(response => {
            console.log(response.data);
            if(successFn) successFn(response);
            // this.$router.push(routeTo)
          }).catch(error => {
            console.error(error);
            if(failFn) failFn(error);
          })
      },

      deleteData(url, successFn, failFn){
        this.$http.delete( url, this.config)
          .then(response => {
            console.log(response.data);
            if(successFn) successFn(response);
            // this.$router.push(routeTo)
          }).catch(error => {
            console.error(error);
            if(failFn) failFn(error);
        })
      },

      getAdditionalData(url) {
        this.$http.get(url, this.config)
            .then(response => {
              console.log("additional List: ", response.data);
              this.additionalList = response.data;
            }).catch(error => {
          console.error(error);
          if(error.response.status === 500){
            if(error.response.data.message === "Token has expired" ||
                error.response.data.message === "The token has been blacklisted"){
              localStorage.clear();
              this.$router.push({name: 'login'});
            }
          }
        })
      },

      getNotifications(){
        // console.log('get notif')
        this.$http.get(this.$store.getters.API_baseURL + '/requests/pending', this.config)
            .then(response => {
              // console.log("notitifations: ", response.data);
              // this.notificationsList = response.data.filter(request => request.status !== 1);
              // this.notificationsList = response.data;
              this.$store.commit('setNotifications', response.data);
            }).catch(error => {
          console.error(error);
          if(error.response.status === 500){
            if(error.response.data.message === "Token has expired" ||
                error.response.data.message === "The token has been blacklisted"){
              localStorage.clear();
              this.$router.push({name: 'login'});
            }
          }
        })
      },
    }
  }
</script>