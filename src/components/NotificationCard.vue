<template>
  <div class="notification-card">
    <button class="close-btn" @click="$emit('close')">&times;</button>

    <slot></slot>

<!--    <div v-if="false">-->
<!--      <p>Šiuo metu naujų pranešimų neturite.</p>-->
<!--    </div>-->

<!--    <div v-else >-->
<!--      <p class="date">2021-12-14</p>-->
<!--      <p>Jonas Jonauskas jums skolina <strong>Dell 17 Monitor | E1715S</strong>.</p>-->

<!--      <div class="btn-container">-->
<!--        <button class="btn faded">Atmesti</button>-->
<!--        <button class="btn">Priimti</button>-->
<!--      </div>-->

<!--      <div class="unread" v-if="true">-->
<!--        <p>... Dar 3 nauji pranešimai</p>-->
<!--      </div>-->

<!--    </div>-->
      <router-link to="/notifications">Visi pranešimai</router-link>

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
    text-decoration: none;
    float: right;
  }

  a:hover {
    color: var(--clr-dark-grey);
  }

  .notification-card {
    position: absolute;
    right: 1em;
    /*top:;*/
    width: 350px;
    padding: 1em;

    background: var(--clr-white);
    border-radius: 5px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);


    font-family: var(--ff-karla);
    /*letter-spacing: initial;*/
  }

  .close-btn {
    position: absolute;
    font-size: 1.5rem;
    top: .5em;
    right: .5em;
    line-height: 1;
    color: var(--clr-dark-grey)
  }

  /*.date {*/
  /*  margin: 0;*/
  /*  color: var(--clr-darker-grey)*/
  /*}*/

  /*.btn-container {*/
  /*  display: flex;*/
  /*  justify-content: flex-end;*/
  /*  padding-bottom: 1em;*/
  /*  border-bottom: solid 2px var(--clr-light-grey);*/
  /*  margin-bottom: 1em;*/
  /*}*/

  /*.notification-card .btn {*/
  /*  margin-left: .5em;*/
  /*  font-size: 1.6rem;*/
  /*}*/

  /*.faded {*/
  /*  border-color: var(--clr-grey);*/
  /*}*/

  /*!*.faded:focus,*!*/
  /*.faded:hover {*/
  /*  border-color: var(--clr-accent);*/
  /*}*/

  /*.unread {*/
  /*  color*/
  /*}*/


</style>