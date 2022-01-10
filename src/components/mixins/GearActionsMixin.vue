<script>
  export default {
    name: "GearActionsMixin",
    methods: {
      returnItem(id) {
        if (!id.length){
          id = [id];
        }

        this.postData('https://inventor-system.herokuapp.com/api/requests/return',
            {gear_id: [...id]},
            (response) => {
              this.returnCardOpen = false;
              this.getData(this.url);
              if(response.data.message === "Return request created"){
                // Užklausa sėkmingai išsiųsta
              }
            },
            (error) => {
              if(error.response.data.message === "Return request is already sent"){
                this.errorMsg = "Grąžinimo užklausa jau pateikta"
              } else {
                this.errorMsg = error.response.data.message; // išversti
                this.errorMsg = error.response.data.message; // išversti
              }
            }
        )
      },

      deleteGear(id) {
        if(id.length){
          // delete multiple
        }
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
        let url = '';
        console.log(id);
        if (!id.length){
          id = [id];
        }

        if(actionType === 'Skolinti'){
          url = 'https://inventor-system.herokuapp.com/api/requests/lend'
        } else if(actionType === 'Perleisti'){
          if(user_id === this.$store.getters.user.id && this.$store.getters.user.isAdmin){
            url = 'https://inventor-system.herokuapp.com/api/requests/give-yourself';
          } else url = 'https://inventor-system.herokuapp.com/api/requests/giveaway';
        }

        this.postData(
            url,
            { user_id, gear_id: id },
            () => {
              this.actionType = '';
              this.selectUserOpen = false;
              this.errorMsg = '';
              this.getData(this.url);
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
                case "Sorry, gear not found.":
                  if (actionType === 'Perleisti' && this.$store.getters.user.isAdmin){
                    this.errorMsg = "Svetimo inventoriaus perleisti kitiems negalite.";
                  } else this.errorMsg = "Negalite "+ actionType +" šio inventoriaus";
                  break
                default:
                  this.errorMsg = err.response.data.message;
              }
              // this.errorMsg = err.response.data.message;
              // console.log(err.response);
            }
        )
      },

      generatePDF(id, name) {
        console.log('PDF sugeneruotas');
        // if(this.$store.getters.user.isAdmin) {
        //
        // }
        this.$http.get('https://inventor-system.herokuapp.com/api/gear/pdf/' + id, {...this.config, responseType: 'arraybuffer'})
            .then(response => {
              const blob = new Blob([response.data], {type: 'application/pdf'});
              if(window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveBlob(blob, name);
              }
              else{
                const elem = window.document.createElement('a');
                elem.href = window.URL.createObjectURL(blob);
                elem.download = name;
                document.body.appendChild(elem);
                elem.click();
                document.body.removeChild(elem);
                // window.URL.revokeObjectURL(blob);
              }
              this.actionCardOpen = false;
            })
      },
    }
  }
</script>

<style scoped>

</style>