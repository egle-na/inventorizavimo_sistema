<script>
  export default {
    name: "PostDataMixin",
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
      postData(url, data, routeTo) {
        this.$http.post( url, data, this.config)
          .then(response => {
            console.log(response.data);
            this.$router.push(routeTo)
          }).catch(error => {
            console.error(error);
          })
      }
    }
  }
</script>