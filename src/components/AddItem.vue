<template>
  <div>
    <h2>{{ $t('gear.add-gear') }}</h2>

    <form-item @onSubmit="addNewGear">
      <!-- Code and Amount -->
      <div>
        <input type="text"
               :placeholder="$t('gear.code')"
               :title="$t('gear.code')"
               v-model="newGear.code"
               @change="checkCode"
               required>
        <input type="number"
               step="1" max="50"
               :placeholder="$t('gear.amount')"
               :title="$t('gear.amount')"
               v-model="newGear.amount"
               required>
      </div>

      <!-- Title -->
      <input type="text"
             :placeholder="$t('gear.title')"
             :title="$t('gear.title')"
             class="input-long"
             v-model="newGear.name"
             required>

      <!-- Description -->
      <textarea maxlength="255"
                :placeholder="$t('gear.description')"
                :title="$t('gear.description')"
                class="input-long"
                v-model="newGear.description"
                required />
      <p class="char-size">{{ $t('chars-left', {num: descriptionCharNum}) }}</p>

      <!-- Serial Nr. and Price -->
      <div class="relative-container">
<!--        <div class="small-container relative-container">-->
          <input type="text"
                 :placeholder="$t('gear.serial-number')"
                 :title="$t('gear.serial-number')"
                 v-model="newGear.serial_number"
                 :class="{'input-error': errorInput.serial_number}"
                 @focus="delete errorInput.serial_number"
                 required>
<!--          <btn-view-eye :pswVisible="serialNumsVisible" @btnClicked="toggleSerialNumsVisibility" />-->
<!--        </div>-->
        <input type="number" step=".01"
               :placeholder="$t('gear.price')"
               :title="$t('gear.price')"
               id="unit-price"
               v-model="newGear.unit_price"
               required>
        <label for="unit-price" id="euro-sign">€</label>
      </div>

      <!-- Long / Short term -->
      <div class="btn-container">
        <div>
          <label>
            <input type="radio" name="long-term" value="true" v-model="newGear.long_term">
            {{ $t('gear.long-term') }}
          </label>
          <label>
            <input type="radio" name="long-term" value="false" v-model="newGear.long_term">
            {{ $t('gear.short-term') }}
          </label>
        </div>

        <!-- Submit btn -->
        <button class="btn">{{ $t('action.add') }}</button>
      </div>

      <!-- Errors -->
      <p v-for="(message, index) in errorInput" :key="index" class="error-msg">{{ $t(message) }}</p>

    </form-item>

<!--    <div class="side-container">-->
<!--      <h4>Serial numbers:</h4>-->
<!--      <p v-for="(number, index) in serialArr" :key="index">-->
<!--        <span>{{ index + 1 }}:</span> {{ number }}-->
<!--      <input type="text" v-model="serialArr[index]" />-->
<!--      </p>-->
<!--    </div>-->

  </div>
</template>

<script>
  import DataMixin from "@/components/mixins/DataMixin";
  import FormItem from "@/components/FormItem";
  import {EventBus} from "@/main";
  // import BtnViewEye from "@/components/BtnViewEye";

  export default {
    name: "AddItem",
    mixins: [ DataMixin ],
    props: [ 'user' ],
    components: {
      // BtnViewEye,
      FormItem
    },
    data() {
      return {
        errorInput: {},
        // serialArr:[],
        serialNumsVisible: false,
        newGear: {
          description:'',
          name: '',
          code:'',
          serial_number: '',
          amount: '',
          unit_price: '',
          long_term: true,
          user_id: this.user,
        },
      }
    },
    computed: {
      descriptionCharNum() {
        return 255 - this.newGear.description.length;
      },
      serialArr(){
        return this.newGear.serial_number.split(/\s*(?:[,;|/\s\\]|$)\s*/);
      }
    },
    methods: {
      addNewGear() {
        this.errorInput = {};
        //check if serial number count matches amount
        // let prep = this.serialArr; // split at any of these:  ,;|/\space

        if(this.serialArr.length !== parseInt(this.newGear.amount)){
          console.log("nope")
          this.errorInput.serial_number = "gear.errors.serial_number-amount";
          return;
        }
        console.log("jap")
        this.newGear.serial_number = this.serialArr.join(',');
        this.newGear.long_term = (this.newGear.long_term !== "false" && this.newGear.long_term !== false);

        this.postData(
            this.$store.getters.API_baseURL + '/gear',
            this.newGear,
            this.addGearSuccess,
            this.addGearError
        )
      },

      addGearSuccess() {
        EventBus.$emit('clearSearch');
        this.errorInput = {};
        this.$emit('success');
      },

      addGearError(error) {
        this.errorInput = {};
        if (error.response.data.error){
          if(error.response.data.error.serial_number) {
            this.errorInput.serial_number = "gear.errors.serial_number";
          }
        }
        if (error.response.data.message === "Gear does not match with other ones with the same code") {
          this.errorInput.code = "gear.errors.code";
        } else if(error.response.data.message === "Serial number amount does not match gear amount"){
          this.errorInput.serial_number = "gear.errors.serial_number-amount";
        } else if(error.response.data.message === "Serial numbers must be unique"){
          this.errorInput.serial_number = "gear.errors.serial_number-unique";
        } else if(error.response.data.message[0].includes("Gear with this serial number already exists")){
          this.errorInput.serial_number = "gear.errors.serial_number";
        }
      },

      checkCode(){
        this.$http.get(this.$store.getters.API_baseURL + "/gear/code/" + this.newGear.code, this.config)
            .then(response => {
               let { name, unit_price, description, long_term } = response.data;
               this.newGear = {...this.newGear, name, unit_price, description, long_term };
            }).catch(error => {
              if(error.response.data.message === "Sorry, gear not found."){
                this.newGear = {...this.newGear, name:"", unit_price:"", description:"", long_term:true };
              } else this.catchErrorTokenExpired(error);
        })
      },
      toggleSerialNumsVisibility() {
        this.serialNumsVisible = !this.serialNumsVisible;
      }
    }
  }
</script>

<style scoped>

  h2 {
    margin-top: 0;
  }

  textarea {
    height: 44px;
    transition: height 400ms;
    resize: vertical;
  }

  textarea:focus {
    height: 90px;
  }

  textarea {
    margin-bottom: 0;
  }

  .char-size {
    text-align: right;
    font-size: .75em;
    color: var(--clr-grey);
    margin: 0 0 1rem;
  }

  .relative-container {
    position: relative;
  }

  .small-container {
    display: inline-block;
    width: 45%;
    margin-right: 10%;
  }
  .small-container input {
    width: 100%;
  }

  .error-msg {
    margin-top: 1em;
  }

  #euro-sign {
    position: absolute;
    top: .7em;
    right: .5em;
    color: grey;
    width: fit-content;
  }

  @media (max-width: 580px) {
    #euro-sign {
      top: calc(.7em + 4.7em);
    }
  }

  .btn-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .btn-container label:not(:first-child) {
    margin-top: .9em;
  }

  .btn-container div{
    color: grey;
    display: flex;
    flex-direction: column;
  }

  .btn-container input{
    width: fit-content;
    margin: 0 1em 0 0;
  }

  /* remove input number spinner button */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
  }

  .show-psw-btn{
    top: .7em;
    right: -1em;
    bottom: unset;
  }

  .side-container{
    background: var(--clr-white);
    min-height: 100px;
    border: #FF6464 solid;
    border-radius: 5px;

    padding: 0 1em;
    position: absolute;
    left: 0;
    translate: -105%;
    bottom: 0;

    max-width: 300px ;
    max-height: 100%;
    overflow-y: auto;
  }

  .side-container span{
    opacity: .4;
  }

</style>