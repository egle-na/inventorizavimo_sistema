<script>
  // import jwt_decode from "jwt-decode";

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
        // user: {},
      }
    },
    methods: {
      getData(url) {
        this.$http.get(url, this.config)
          .then(response => {
            console.log(response.data);
            this.list = response.data;
            this.refreshUsersToken();
          }).catch(error => {
            console.error(error);
            if(error.response.data.message === "Token has expired" ||
                error.response.data.message === "The token has been blacklisted" ||
                error.response.data.status === 401 ){
              localStorage.clear();
              this.$router.push({name: 'login'});
            }
        })
      },

      getDataError(error){
        console.error(error);
        if(error.response.data.message === "Token has expired" ||
            error.response.data.message === "The token has been blacklisted" ||
            error.response.data.status === 401 ){
          localStorage.clear();
          this.$router.push({name: 'login'});
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
        this.$http.post('https://inventor-system.herokuapp.com/api/auth/refresh', {}, this.config)
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
            successFn();
            // this.$router.push(routeTo)
          }).catch(error => {
            console.error(error);
            failFn(error);
          })
      },

      deleteData(url, successFn, failFn){
        this.$http.delete( url, this.config)
          .then(response => {
            console.log(response.data);
            successFn();
            // this.$router.push(routeTo)
          }).catch(error => {
            console.error(error);
            failFn(error);
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

    }
  }
</script>