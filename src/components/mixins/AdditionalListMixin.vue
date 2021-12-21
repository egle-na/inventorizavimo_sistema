<script>
  export default {
    name: "CompanyListMixin",
    data(){
      return {
        additionalList: [],
        config: {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
          }
        },
      }
    },
    methods:{
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
