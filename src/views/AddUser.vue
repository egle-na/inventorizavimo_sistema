<template>
  <admin-desk>
      <div class="container-center">
        <h2>Pridėti Darbuotoją</h2>

        <form-item>
          <div>
            <input type="text" placeholder="Vardas" required>
            <input type="text" placeholder="Pavardė" required>
          </div>
          <input type="email" placeholder="Elektroninis paštas" class="input-long" required>

          <select class="input-long" required>
            <option selected hidden class="placeholder" value="">Įmonė</option>
            <option v-for="item in 5" :key="item" :value="item">Įmonės Pavadinimas {{item}}</option> <!-- įmonių sąrašas -->
          </select>

          <button class="btn" disabled>Pridėti</button>
        </form-item>

      </div>
  </admin-desk>
</template>

<script>
  import FormItem from "@/components/FormItem";
  import AdminDesk from "@/components/AdminDesk";

  export default {
    name: "AddUser",
    components: {
      AdminDesk,
      FormItem,
    }
  }
</script>

<style scoped>

  .container-center {
    /*align-self: center;*/
    /*justify-self: center;*/
    max-width: 550px;
    margin: 1em auto;
  }

</style>