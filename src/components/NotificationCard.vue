<template>
  <div class="notification-card">
    <button class="close-btn">&times;</button>

    <div v-if="true">
      <p>Šiuo metu naujų pranešimų neturite.</p>
      <router-link to="/notifications">Visi pranešimai</router-link>
    </div>

    <div v-else >
      <p class="date">2021-12-14</p>
      <p>Jonas Jonauskas jums skolina <strong>Dell 17 Monitor | E1715S</strong>.</p>

      <div class="btn-container">
        <button class="btn faded">Atmesti</button>
        <button class="btn">Priimti</button>
      </div>

    </div>

  </div>
</template>
<script>
  export default {
    name: 'NotificationCard'
  }
</script>
<style scoped>
  a {
    color: var(--clr-grey);
    /*margin-left: auto;*/
    /*margin-right: 0;*/
    text-decoration: none;
    float: right;
  }

  .notification-card {
    position: absolute;
    right: 0;
    width: 350px;
    padding: 1em;

    background: var(--clr-white);
    border-radius: 5px;

    font-family: var(--ff-karla);
    letter-spacing: initial;
  }

  .close-btn {
    position: absolute;
    font-size: 1.3rem;
    top: .5em;
    right: .5em;
    line-height: 1em;
  }

  .date {
    margin: 0;
    color: var(--clr-darker-grey)
  }

  .btn-container {
    display: flex;
    justify-content: end;
  }

  .notification-card .btn {
    margin-left: .5em;
    font-size: 1.6rem;
  }

  .faded {
    border-color: var(--clr-grey);
  }

  .faded:hover {
    border-color: var(--clr-accent);
  }


</style>