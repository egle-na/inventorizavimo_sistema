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
        this.getUsersList(); // store updated users list
        this.addUserOpen = false;
        this.errorMsg = "";
        EventBus.$emit('displayMessage', 'Vartotojas sėkmingai pridėtas!');
      },

      userAddError(error) {
        if(error.response.data.error.email){
          this.errorMsg = 'Vartotojas šiuo elektroninio pašto adresu jau pridėtas.';
        } else this.errorMsg = 'Įvyko Klaida.';
      },

    }
  }
</script>