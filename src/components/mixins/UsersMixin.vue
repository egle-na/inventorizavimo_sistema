<script>
  import {EventBus} from "@/main";

  export default {
    name: "UsersMixin",
    data(){
      return {
        // userList: [],
      }
    },
    methods: {

      getUsersList() {
        // console.log('get names')
        let endpoint = '/users';
        if(this.$store.getters.user.isAdmin === true){
          endpoint = '/users/all'
        }
        this.$http.get(this.$store.getters.API_baseURL + endpoint, this.config)
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

      addUser(){
        this.postData(
            this.$store.getters.API_baseURL + '/users',
            this.newUser,
            this.userAdded,
            this.userAddError
        );
      },

      userAdded(){
        this.getData(this.url);
        this.getUsersList(); // store updated users list
        this.addUserOpen = false;
        this.errorMsg = '';
        EventBus.$emit('displayMessage', 'Vartotojas sėkmingai pridėtas!');
      },

      userAddError(error) {
        if(error.response.status === 400 && error.response.data.message === "The email has already been taken"){
          this.errorMsg = 'Vartotojas šiuo elektroninio pašto adresu jau pridėtas.';
        }
      },

    }
  }
</script>