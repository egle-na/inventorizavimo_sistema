<template>
  <div>
    <Header />

    <main>
      <div v-for="item in 7" :key="item">

      </div>
    </main>
  </div>
</template>

<script>
  import Header from "@/components/Header";
  export default {
    name: "NotificationHistory",
    components: {
      Header,
    }
  }
</script>

<style scoped>

  main {
    width: 90%;
    margin: 3em auto;
    max-width: 800px;
  }

</style>