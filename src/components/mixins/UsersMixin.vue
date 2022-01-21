<script>
  import {EventBus} from "@/main";

  export default {
    name: "UsersMixin",
    methods: {

      getUsersList() {
        let endpoint = '/users';
        if(this.$store.getters.user.isAdmin === true){
          endpoint = '/users/all';
        }
        this.$http.get(this.$store.getters.API_baseURL + endpoint, this.config)
            .then(response => {
              this.$store.commit('setAllUsers', response.data );
            }).catch(() => {})
      },

      findName(id) {
        if(this.$store.getters.allUsers.length){
          let user = this.$store.getters.allUsers.filter(user => user.id === id)[0];
          return user ? user.first_name + ' ' + user.last_name : "Nežinomas";
        }
        return '';
      },

      addUser(userData){
        this.postData(
            this.$store.getters.API_baseURL + '/users',
            userData,
            this.userAdded,
            this.userAddError
        );
      },

      userAdded(){
        this.getData(this.url);
        EventBus.$emit('clearSearch');
        this.getUsersList(); // store updated users list
        this.addUserOpen = false;
        this.errorMsg = "";
        EventBus.$emit('displayMessage', this.$t('messages.user-add-success'));
      },

      userAddError(error) {
        if(error.response.data.error.email){
          this.errorMsg = 'user.errors.email';
        } else this.errorMsg = 'errors.unknown';
      },

      deleteUser(id){
        this.$http.delete(this.$store.getters.API_baseURL + "/users/" + id, this.config)
            .then(() => {
              this.getDataQuery(this.url, this.params);
              this.getUsersList();
              this.mobileActions = false;
              this.deleteUserOpen = false;
            }).catch(error => {
              if(error.response.data.message === "User cannot be deleted, because user has gear"){
                this.errorMsg = 'user.errors.cant-delete';
              } else {
                this.errorMsg = 'errors.unknown';
              }
        })
      },

    }
  }
</script>