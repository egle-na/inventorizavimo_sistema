<script>
  import {EventBus} from "@/main";

  export default {
    name: "GearActionsMixin",
    methods: {
      returnItem(id) {
        if (!id.length){
          id = [id];
        }

        this.postData(this.$store.getters.API_baseURL + '/requests/return',
            {gear_id: [...id]},
            (response) => {
              this.returnCardOpen = false;
              this.getData(this.url);
              if(response.data.message === "Return request created"){
                // Užklausa sėkmingai išsiųsta
                EventBus.$emit('displayMessage', 'Užklausa sėkmingai išsiųsta!');
              }
            },
            (error) => {
              if(error.response.data.message === "Return request is already sent"){
                this.errorMsg = "Grąžinimo užklausa jau pateikta"
              } else {
                this.errorMsg = error.response.data.message; // išversti
                // this.errorMsg = error.response.data.message; // išversti
              }
            }
        )
      },

      deleteGear(id) {
        if(id.length){
          // delete multiple
        }
        // id = this.$route.params.inventory_id;
        this.$http.delete(this.$store.getters.API_baseURL + '/gear/' + id, this.config)
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
              EventBus.$emit('displayMessage', 'Inventorius sėkmingai nurašytas!');
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
        let endpoint = '';
        console.log(id);
        if (!id.length){
          id = [id];
        }

        if(actionType === 'Skolinti'){
          endpoint = '/requests/lend'
        } else if(actionType === 'Perleisti'){
          if(user_id === this.$store.getters.user.id && this.$store.getters.user.isAdmin){
            endpoint = '/requests/give-yourself';
          } else endpoint = '/requests/giveaway';
        }

        this.postData(
            this.$store.getters.API_baseURL + endpoint,
            { user_id, gear_id: id },
            () => {
              this.actionType = '';
              this.selectUserOpen = false;
              this.errorMsg = '';
              this.getData(this.url);
              // show a message that request is pending, change status(get new data)?
              EventBus.$emit('displayMessage', 'Užklausa sėkmingai išsiųsta!');
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
        this.$http.get(this.$store.getters.API_baseURL + '/gear/pdf/' + id, {...this.config, responseType: 'arraybuffer'})
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
              EventBus.$emit('displayMessage', 'PDF sugeneruotas!');
            })
      },
    }
  }
</script>

<style scoped>

</style>