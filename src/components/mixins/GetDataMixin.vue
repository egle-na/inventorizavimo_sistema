<script>
  export default {
    name: "GetDataMixin",
    data() {
      return {
        config: {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
          }
        },
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
            if(error.response.status === 500){
              if(error.response.data.message === "Token has expired" ||
                  error.response.data.message === "The token has been blacklisted"){
                localStorage.clear();
                this.$router.push({name: 'login'});
              }
            }
        })
      },

      refreshUsersToken(){
        this.$http.post('https://inventor-system.herokuapp.com/api/auth/refresh', {}, this.config)
          .then(response => {
            localStorage.setItem("access_token", response.data.access_token);
          }).catch(error => {
            console.error(error);
        })
      },
    }
  }
</script>