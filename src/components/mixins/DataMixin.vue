<script>
  import {EventBus} from "@/main";

  export default {
    name: "DataMixin",
    data() {
      return {
        list: [],
        additionalList: [],
        config: {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
          }
        },
      }
    },
    methods: {
      getData(url, successFn, failFn) {
        this.$http.get(url, this.config)
            .then(response => {
              this.list = response.data;
              if(successFn) successFn(response);

            }).catch(error => {
              if(failFn) failFn();
              this.getDataError(error);
            })
      },

      getDataError(error){
        if(!error){
          EventBus.$emit('displayMessage', this.$t('errors.unknown'));
          return;
        }
        this.catchErrorTokenExpired(error);
        if(error.response.status !== 500){
          EventBus.$emit('displayMessage', this.$t('errors.unknown'));
        }
      },

      setSearch(val) {
        console.log(val)
        this.getDataQuery(this.url, {search: val});
      },

      getDataQuery(url, params) {
        this.$http.get(url, {...this.config, params: params })
            .then(response => {
              this.list = response.data;
            }).catch(error => {
              this.getDataError(error);
            })
      },

      postData(url, data, successFn, failFn) {
        this.$http.post( url, data, this.config)
            .then(response => {
              if(successFn) successFn(response);
            }).catch(error => {
              if(failFn) failFn(error);
              this.catchErrorTokenExpired(error);
            })
      },

      deleteData(url, successFn, failFn){
        this.$http.delete( url, this.config)
            .then(response => {
              if(successFn) successFn(response);
            }).catch(error => {
              if(failFn) failFn(error);
              this.catchErrorTokenExpired(error);
            })
      },

      getAdditionalData(url) {
        this.$http.get(url, this.config)
            .then(response => {
              this.additionalList = response.data;
            }).catch(error => {
              this.catchErrorTokenExpired(error);
            })
      },

      getNotifications(){
        this.$http.get(this.$store.getters.API_baseURL + '/requests/pending', this.config)
            .then(response => {
              this.$store.commit('setNotifications', response.data);
            }).catch(error => {
              this.catchErrorTokenExpired(error);
            })
      },

      catchErrorTokenExpired(error){
        if(error.response.status === 500){
          if(
              error.response.data.message === "Token has expired"
              || error.response.data.message === "The token has been blacklisted"
          ){
            this.logOut();
            EventBus.$emit('displayMessage', this.$t('errors.token'));
          }
        }
      },

      logOut() {
        localStorage.clear();

        this.$store.commit("setUser", {});
        this.$store.commit("setAllUsers", {});
        this.$store.commit("setNotifications", {});

        this.$router.push({path: '/login'});
      }

    }
  }
</script>