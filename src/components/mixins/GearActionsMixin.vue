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
              EventBus.$emit('clearSearch');
              this.returnCardOpen = false;
              if(response.data.message.includes("Return request created")){
                EventBus.$emit('displayMessage', this.$tc('messages.request-sent'));
              }
            },
            (error) => {
              this.catchErrorTokenExpired(error);

              // one return request was sent and it failed
              if (id.length === 1 && error.response.data.message.length === 1) {
                this.errorMsg = this.errorMessage("return", error.response.data.message[0]).message;

              // if all failed
              } else if (id.length === error.response.data.message.length) {
                this.errorMsg = "gear.errors.remove";
                error.response.data.message.forEach(message => this.errorArr.push(this.errorMessage("return", message)) );

              // if some requests succeeded
              } else {
                let errors = [];
                error.response.data.message.forEach(message => errors.push(this.errorMessage("return", message)) );
                this.returnCardOpen = false;
                this.errorMsg = "";

                EventBus.$emit('displayMessage', this.$tc('messages.gear-return-success', id.length - error.response.data.message.length));
                EventBus.$emit('displayErrorsMessage', this.$tc('error.gear-return', error.response.data.message.length), errors);
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
              EventBus.$emit('displayMessage', this.$tc('messages.gear-remove-success'));
              this.deleteCardOpen = false;
              this.rowsSelected = [];
              this.errorMsg = '';
              EventBus.$emit('clearSearch');
              if (this.$route.name === 'inventory-info') this.$router.go(-1);
              else this.getData(this.url);

            }).catch (error => {
              this.catchErrorTokenExpired(error);

              // one delete request was sent and it failed
              if (id.length === 1 && error.response.data.message.length === 1) {
                this.errorMsg = this.errorMessage("delete", error.response.data.message[0]).message;

              // if all failed
              } else if (id.length === error.response.data.message.length) {
                this.errorMsg = "gear.errors.remove";
                error.response.data.message.forEach(message => this.errorArr.push(this.errorMessage("delete", message)) );

              // if some requests succeeded
              } else {
                let errors = [];
                error.response.data.message.forEach(message => errors.push(this.errorMessage("delete", message)) );
                this.deleteCardOpen = false;
                this.getData(this.url);
                EventBus.$emit('clearSearch');

                EventBus.$emit('displayMessage', this.$tc('messages.gear-remove-success', id.length - error.response.data.message.length));
                EventBus.$emit('displayErrorsMessage', this.$tc('errors.gear-remove', error.response.data.message.length), errors);
              }
            })
      },

      gearAction(user_id, id, actionType){
        if(!user_id) {
          this.errorMsg = 'user.errors.none-selected';
          return;
        }
        this.errorArr = [];
        let endpoint = '';
        if (!id.length) id = [id];

        if (actionType === 'lend') {
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
              EventBus.$emit('clearSearch');

              if(endpoint === '/requests/give-yourself'){
                this.getData(this.url,() => { this.getStatusText(); } );
                EventBus.$emit('displayMessage', this.$t('messages.gear-transfer-admin') );

              } else {
                this.getData(this.url);
                EventBus.$emit('displayMessage', this.$tc('messages.request-sent'));
              }
            },
            (error) => {
              this.catchErrorTokenExpired(error);

              // one request was sent and it failed
              if (id.length === 1 && error.response.data.message.length === 1) {
                this.errorMsg = this.errorMessage(actionType, error.response.data.message[0]).message;

              // if all failed
              } else if (id.length === error.response.data.message.length) {
                this.errorMsg = 'gear.errors.' + actionType.toLowerCase();
                error.response.data.message.forEach(message => this.errorArr.push(this.errorMessage(actionType, message)));

              // if any successful
              } else if(error.response.data.message.length < id.length){
                let errors = [];
                error.response.data.message.forEach(message => errors.push(this.errorMessage(actionType, message)) );
                this.actionType = '';
                this.errorMsg = '';
                this.selectUserOpen = false;
                EventBus.$emit('clearSearch');
                this.getData(this.url);


                EventBus.$emit('displayMessage', this.$tc('messages.request-sent', id.length - error.response.data.message.length));
                EventBus.$emit('displayErrorsMessage', this.$tc('errors.send-request', error.response.data.message.length), errors);
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
            EventBus.$emit('displayMessage', this.$t('messages.pdf-generated'));
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
            if(message.includes("Return request is already sent")) error.message = "gear.errors.return.sent";
            else if(message.includes("Sorry, request not found")) error.message = "gear.errors.return.not-found";
            else error.message = message;
            break;

          case 'delete':
            if (message.includes("Gear has a request")) error.message = 'gear.errors.has-request';
            else if (message.includes("You cannot destroy lent gear")) error.message = 'gear.errors.remove-lent';
            else if (message.includes("You cannot delete lent gear")) error.message = 'gear.errors.remove-lent';
            else if (message.includes("Sorry, gear not found.")) error.message = 'gear.errors.remove-lent';
            else error.message = message;
            break;

          case 'lend':
            if (message.includes("Gear already has a request."))  error.message = 'gear.errors.has-request';
            else if (message.includes("You do not currently hold this gear")) error.message = 'gear.errors.lend';
            else if (message.includes("Sorry, gear not found.")) error.message = 'gear.errors.lend';
            else if (message.includes("User lent you this gear.")) error.message = 'gear.errors.user-lent';
            else error.message = message;
            break;

          case 'transfer':
            if (message.includes("Gear already has a request."))  error.message = 'gear.errors.has-request';
            else if (message.includes("You cannot give away lent gear")) error.message = 'gear.errors.transfer-lent';
            else if (message.includes("You do not currently hold this gear")) error.message = 'gear.errors.transfer';
            else if (message.includes("Sorry, gear not found.") && this.$store.getters.user.isAdmin) error.message = 'gear.errors.transfer-admin';
            else if (message.includes("Sorry, gear not found.")) error.message = 'gear.errors.transfer';
            else error.message = message;
        }
        return error;
      },
    }
  }
</script>