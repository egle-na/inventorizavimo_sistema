<template>
  <div>
    <Header />

    <main>

      <div v-if="true">
        <h3>Neatsakytos užklausos</h3>
        <div v-for="item in 3" :key="item" class="message">
          <div>
            <p class="date">2021-12-14</p>
            <p>Jonas Jonauskas jums skolina <strong>Dell 17 Monitor | E1715S</strong>.</p>
          </div>

          <div class="btn-container">
            <button class="btn faded">Atmesti</button>
            <button class="btn">Priimti</button>
          </div>
        </div>
      </div>

      <h3>Pranešimų istorija</h3>
      <div v-for="item in 17" :key="item" class="message">
        <p>Jonas Jonauskas jums paskolino <strong>Dell 17 Monitor | E1715S</strong>.</p>
        <p class="date">2021-12-14</p>
      </div>

      <div v-if="false">
        <p>Pranešimų dar neturite.</p>
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

/*  header {*/
/*    position: sticky;*/
/*    top: 0;*/
/*  }*/

  main {
    width: 90%;
    margin: 3em auto;
    max-width: 800px;
  }

  .message {
    margin: 1em 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: solid 3px var(--clr-light-grey);
    /*margin-bottom: 1em;*/
  }

  h3 {
    color: var(--clr-dark-grey);
    margin-bottom: .5em;
  }

  h3:not(:first-child){
    margin-top: 3em;
  }

  .date {
    margin: 0;
    color: var(--clr-darker-grey)
  }

  .btn-container .btn{
    margin-left: .5em;
  }

  .faded {
    border-color: var(--clr-grey);
  }

  /*.faded:focus,*/
  .faded:hover {
    border-color: var(--clr-accent);
  }

</style>