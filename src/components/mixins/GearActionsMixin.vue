<script>
  import {EventBus} from "@/main";

  export default {
    name: "GearActionsMixin",
    data() {
      return {
        errorArr: [],
      }
    },
    methods: {
      returnItem(id) {
        this.errorArr = [];
        this.errorMsg = "";
        if (!id.length){
          id = [id];
        }
        this.postData(
            this.$store.getters.API_baseURL + '/requests/return',
            {gear_id: [...id]},
            (response) => {
              this.getData(this.url);
              this.returnCardOpen = false;
              if(response.data.message.includes("Return request created")){
                EventBus.$emit('displayMessage', 'Užklausa sėkmingai išsiųsta!');
              }
            },
            (error) => {
              this.catchErrorTokenExpired(error);

              // one return request was sent and it failed
              if (id.length === 1 && error.response.data.message.length === 1) {
                this.errorMsg = this.errorMessage("return", error.response.data.message[0]).message;

              // if all failed
              } else if (id.length === error.response.data.message.length) {
                this.errorMsg = "Inventoriaus nurašyti nepavyko.";
                error.response.data.message.forEach(message => this.errorArr.push(this.errorMessage("return", message)) );

              // if some requests succeeded
              } else {
                let errors = [];
                error.response.data.message.forEach(message => errors.push(this.errorMessage("return", message)) );
                this.returnCardOpen = false;
                this.errorMsg = "";

                EventBus.$emit('displayMessage', `${id.length - error.response.data.message.length} inventorius grąžintas!`);
                EventBus.$emit('displayErrorsMessage', `${error.response.data.message.length} inventoriaus grąžinti nepavyko!`, errors);
              }
            }
        )
      },

      deleteGear(id) {
        this.errorArr = [];
        if(!id.length){
          id = [id];
        }
        this.$http.delete(this.$store.getters.API_baseURL + '/gear/delete',
            {...this.config, data:{gear_id: id} })
            .then(() => {
              EventBus.$emit('displayMessage', 'Inventorius sėkmingai nurašytas!');
              this.deleteCardOpen = false;
              this.errorMsg = '';

              if (this.$route.name === 'inventory-info') this.$router.go(-1);
              else this.getData(this.url);

            }).catch (error => {
              this.catchErrorTokenExpired(error);

              // one delete request was sent and it failed
              if (id.length === 1 && error.response.data.message.length === 1) {
                this.errorMsg = this.errorMessage("delete", error.response.data.message[0]).message;

              // if all failed
              } else if (id.length === error.response.data.message.length) {
                this.errorMsg = "Inventoriaus nurašyti nepavyko.";
                error.response.data.message.forEach(message => this.errorArr.push(this.errorMessage("delete", message)) );

              // if some requests succeeded
              } else {
                let errors = [];
                error.response.data.message.forEach(message => errors.push(this.errorMessage("delete", message)) );
                this.deleteCardOpen = false;
                this.getData(this.url);

                EventBus.$emit('displayMessage', `${id.length - error.response.data.message.length} inventorius nurašytas!`);
                EventBus.$emit('displayErrorsMessage', `${error.response.data.message.length} inventoriaus nurašyti nepavyko!`, errors);
              }
            })
      },

      gearAction(user_id, id, actionType){
        if(!user_id) {
          this.errorMsg = 'Pasirinkite darbuotoją';
          return;
        }
        this.errorArr = [];
        let endpoint = '';
        let type = actionType === 'Skolinti' ? 'lend' : 'transfer';
        if (!id.length) id = [id];

        if (actionType === 'Skolinti') {
          endpoint = '/requests/lend';
        } else {
          endpoint = (user_id === this.$store.getters.user.id && this.$store.getters.user.isAdmin)
              ? '/requests/give-yourself'
              : '/requests/giveaway';
        }
        this.postData(
            this.$store.getters.API_baseURL + endpoint,
            { user_id, gear_id: id },
            () => {
              this.actionType = '';
              this.selectUserOpen = false;
              this.errorMsg = '';

              if(endpoint === '/requests/give-yourself'){
                this.getData(this.url,() => { this.getStatusText(); } );
                EventBus.$emit('displayMessage', 'Inventorius priskirtas jums!');

              } else {
                this.getData(this.url);
                EventBus.$emit('displayMessage', 'Užklausa sėkmingai išsiųsta!');
              }
            },
            (error) => {
              this.catchErrorTokenExpired(error);

              // one request was sent and it failed
              if (id.length === 1 && error.response.data.message.length === 1) {
                this.errorMsg = this.errorMessage(type, error.response.data.message[0]).message;

              // if all failed
              } else if (id.length === error.response.data.message.length) {
                this.errorMsg = `Inventoriaus ${actionType.toLowerCase()} nepavyko.`;
                error.response.data.message.forEach(message => this.errorArr.push(this.errorMessage(type, message)));

              // if any successful
              } else if(error.response.data.message.length < id.length){
                let errors = [];
                error.response.data.message.forEach(message => errors.push(this.errorMessage(type, message)) );
                this.actionType = '';
                this.errorMsg = '';
                this.selectUserOpen = false;
                this.getData(this.url);

                EventBus.$emit('displayMessage', `${id.length - error.response.data.message.length} užklausos sėkmingai išsiųstos!`);
                EventBus.$emit('displayErrorsMessage', `${error.response.data.message.length} užklausų išsiųsti nepavyko!`, errors);
              }
            })
      },

      generatePDF(id, name) {
        this.$http.get(
            this.$store.getters.API_baseURL + '/gear/pdf/' + id,
            {...this.config, responseType: 'arraybuffer'}
        ).then(response => {
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

      errorMessage(type, message) {
        let error = {};
        error.id = parseInt(message.split(': ')[1].split(")")[0]);
        if(this.filteredList){
          error.name = this.filteredList.find(gear => gear.id === error.id).name;
        }

        switch (type) {
          case 'return':
            if(message.includes("Return request is already sent")) error.message = "Grąžinimo užklausa jau pateikta.";
            else if(message.includes("Sorry, request not found")) error.message = "Inventoriaus grąžinti nepavyko.";
            else error.message = message;
            break;

          case 'delete':
            if (message.includes("Gear has a request")) error.message = 'Inventorius turi neatsakytą užklausą.';
            else if (message.includes("You cannot destroy lent gear")) error.message = 'Paskolinto inventoriaus nurašyti negalima.';
            else if (message.includes("You cannot delete lent gear")) error.message = 'Paskolinto inventoriaus nurašyti negalima.';
            else if (message.includes("Sorry, gear not found.")) error.message = 'Paskolinto inventoriaus nurašyti negalima.';
            else error.message = message;
            break;

          case 'lend':
            if (message.includes("Gear already has a request."))  error.message = "Inventorius turi neatsakytą užklausą";
            else if (message.includes("You do not currently hold this gear")) error.message = "Negalite skolinti šio inventoriaus";
            else if (message.includes("Sorry, gear not found.")) error.message = "Negalite skolinti šio inventoriaus";
            else if (message.includes("User lent you this gear.")) error.message = "Šis darbuotojas paskolino jums šį inventorių";
            else error.message = message;
            break;

          case 'transfer':
            if (message.includes("Gear already has a request."))  error.message = "Inventorius turi neatsakytą užklausą";
            else if (message.includes("You cannot give away lent gear")) error.message = "Negalite perleisti paskolinto inventoriaus";
            else if (message.includes("You do not currently hold this gear")) error.message = "Negalite perleisti šio inventoriaus";
            else if (message.includes("Sorry, gear not found.") && this.$store.getters.user.isAdmin) error.message = "Svetimo inventoriaus perleisti kitiems negalite.";
            else if (message.includes("Sorry, gear not found.")) error.message = "Negalite perleisti šio inventoriaus";
            else error.message = message;
        }
        return error;
      },
    }
  }
</script>