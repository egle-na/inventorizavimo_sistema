<script>
  export default {
    name: "UsersMixin",
    data(){
      return {
        // userList: [],
      }
    },
    methods: {
      // getNames() { // delete
      //   console.log('get names')
      //   let url = 'https://inventor-system.herokuapp.com/api/users';
      //   if(this.$store.getters.user.isAdmin === true){
      //     url = 'https://inventor-system.herokuapp.com/api/users/all'
      //   }
      //   this.$http.get(url, this.config)
      //       .then(response => {
      //         console.log(response.data)
      //         this.userList = response.data;
      //       }).catch(() => {
      //   })
      // },
      getUsersList() {
        // console.log('get names')
        let url = 'https://inventor-system.herokuapp.com/api/users';
        if(this.$store.getters.user.isAdmin === true){
          url = 'https://inventor-system.herokuapp.com/api/users/all'
        }
        this.$http.get(url, this.config)
            .then(response => {
              // console.log(response.data)
              this.$store.commit('setAllUsers', response.data );
            }).catch(() => {
        })
      },

      findName(id) {
        if(this.$store.getters.allUsers.length){
          // let user = this.userList.filter(user => user.id === id)[0];
          let user = this.$store.getters.allUsers.filter(user => user.id === id)[0];
          return user ? user.first_name + ' ' + user.last_name : "Nežinomas"
        }
        return ''
      },

    }
  }
</script>