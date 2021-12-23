<template>
  <div class="side-menu-container">

    <user-card />

    <div class="side-nav-container">
      <ul class="side-nav">
        <li><router-link to="/all-companies">Įmonės</router-link></li>
        <li><router-link to="/all-users">Darbuotojai</router-link></li>
        <li><router-link to="/all-inventory">Inventorius</router-link></li>
<!--        <li><router-link to="/add-user">Pridėti Darbuotoją</router-link></li>-->
<!--        <li><router-link to="/add-inventory">Pridėti įrangą</router-link></li>-->
        <li><router-link to="/settings">Nustatymai</router-link></li>
      </ul>
    </div>


  </div>
</template>

<script>
  // import ProfileImgMixin from "@/components/mixins/ProfileImgMixin";
  import UserCard from "@/components/UserCard";

  export default {
    name: "SideMenu",
    components: { UserCard },
    // mixins: [ ProfileImgMixin ],
  }
</script>

<style scoped>

  .side-menu-container {
    background: var(--clr-almost-white) ;
    /*position: fixed;*/
    height: 100%;
    /*width: 330px;*/

    display: grid;
    grid-template: min-content auto / auto;

    font-family: var(--ff-roboto-con);
    font-size: var(--fs-side-menu);
    text-transform: uppercase;

    box-shadow: 4px 0 7px #E5E5E5;
  }

  .side-nav-container {
    grid-row: 2 / -1;
    grid-column: 1;
    align-self: center;
    min-height: 100px;
    height: 100%;
    /*max-height: 350px;*/
    max-height: 250px;

  }

  .side-nav {
    list-style: none;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    max-height: 100%;
    margin: 0;
    padding-left: 2em;
  }

  .side-nav li{
    /*margin-bottom: 2em;*/
    width: fit-content;
    padding-right: 2em;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  a:after {
    content: '';
    display: block;
    width: 0;
    margin-top: 5px;

    height: 2px;
    background: var(--clr-grey);

    transition: width 250ms;
  }

  .router-link-active {
    color: var(--clr-accent);
  }

  .router-link-active:after,
  a:hover:after{
    width: calc(100% + 1.5em);
  }



</style>