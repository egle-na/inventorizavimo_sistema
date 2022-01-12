<template>
  <div class="notification-card">
    <button class="close-btn" @click="$emit('close')">&times;</button>

    <div class="scroll-container">
      <slot></slot>
    </div>

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
    margin-top: .5em;
  }

  a:hover {
    color: var(--clr-dark-grey);
  }

  .notification-card {
    position: absolute;
    right: 1em;
    /*top:;*/
    width: 400px;
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
    color: var(--clr-dark-grey);
    background: white;
  }

  .scroll-container{
    max-height: 440px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar-thumb {
    background-color:var(--clr-light-grey);
    border-radius: 5px;
  }

  ::-webkit-scrollbar {
    width: 10px;
    height: 90%;
  }

@media (max-width: 580px) {
  .notification-card {
    right: 2.5%;
    margin: 1em auto;
    width: 95%;
  }
}

</style>