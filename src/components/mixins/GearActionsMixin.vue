<script>
  export default {
    name: "GearActionsMixin",
    methods: {
      returnItem(id) {
        console.log('return');
        // id = this.$route.params.inventory_id
        this.postData('https://inventor-system.herokuapp.com/api/requests/return/' + id,
            {},
            () => {
              this.returnCardOpen = false;
              this.getData(this.url);
            },
            (error) => {
              this.errorMsg = error.response.data.message; // išversti
            }
        )
      },

      // writeOffItem() {
      deleteGear(id) {
        // id = this.$route.params.inventory_id;
        this.$http.delete('https://inventor-system.herokuapp.com/api/gear/' + id, this.config)
            .then(() => {
              console.log('nurašytas');
              // this.writeOffCardOpen = false;
              this.deleteCardOpen = false;
              if(this.$route.name === 'inventory-info') {
                this.$router.go(-1);
              } else {
                this.getData(this.url)
              }
              this.errorMsg = '';
              // display msg, kad nurašytas
            })
            .catch(error => {
              if(error.response.data.message === "Gear has a request" ){
                this.errorMsg = 'Inventorius turi neatsakytą užklausą.';
              } else if(error.response.data.message === "You cannot destroy lent gear" ){
                this.errorMsg = 'Paskolinto inventoriaus išmesti negalima.';
              } else this.errorMsg = error.response.data.message;
            })
      },

      gearAction(user_id, id, actionType){
        console.log(user_id, id);
        let url = '';
        // if(user_id === this.$store.getters.user.id){
        //   this.errorMsg = `Inventoriaus sau ${this.actionType.toLowerCase()} negalima.`
        // }

        if(actionType === 'Skolinti'){
          url = 'https://inventor-system.herokuapp.com/api/requests/lend/'
        } else if(actionType === 'Perleisti'){
          if(user_id === this.$store.getters.user.id && this.$store.getters.user.isAdmin){
            url = 'https://inventor-system.herokuapp.com/api/requests/giveYourself/';
          } else url = 'https://inventor-system.herokuapp.com/api/requests/giveaway/';
        }

        this.postData(
            url + id,
            { user_id },
            () => {
              this.actionType = '';
              this.selectUserOpen = false;
              this.errorMsg = '';
              // show a message that request is pending, change status(get new data)?
            },
            (err) => {
              switch (err.response.data.message) {
                case "Gear already has a request":
                  this.errorMsg = "Inventorius turi neatsakytą užklausą";
                  break;
                  // case "":
                case "You cannot give away lent gear":
                  this.errorMsg = "Negalite perleisti paskolinto inventoriaus";
                  break;
                default:
                  this.errorMsg = err.response.data.message;
              }
              // this.errorMsg = err.response.data.message;
              // console.log(err.response);
            }
        )
      },

      generatePDF() {
        console.log('PDF sugeneruotas');
        // this.$http.get()
        this.actionCardOpen = false;
      },
    }
  }
</script>

<style scoped>

</style>