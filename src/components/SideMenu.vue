<template>
  <div class="side-menu-container">

    <div class="user-card">

      <span id="profile-btn">{{ nameInitials }}</span>
      <span>{{ name }}</span>
      <p class="email" >vardenis.pavardenis@teltonika.lt</p>

    </div>

    <div class="side-nav-container">
      <ul class="side-nav">
        <li><router-link to="/add-inventory">Pridėti įrangą</router-link></li>
        <li><router-link to="/a">Visi įrenginiai</router-link></li>
        <li><router-link to="/add-user">Pridėti Darbuotoją</router-link></li>
        <li><router-link to="/all-users">Visi Darbuotojai</router-link></li>
        <li><router-link to="/a">Nustatymai</router-link></li>
      </ul>
    </div>


  </div>
</template>

<script>
  import ProfileImgMixin from "@/components/mixins/ProfileImgMixin";

  export default {
    name: "SideMenu",
    mixins: [ ProfileImgMixin ],
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

  .user-card {
    grid-row: 1;
    grid-column: 1;
    display: grid;
    padding: 0 1.5em;
    margin: 2em 0;
    grid-gap: .4em;
    grid-template-columns: auto auto;
  }

  #profile-btn {
    background: var(--clr-accent);
    color: var(--clr-white);
    font-family: var(--ff-bebas-neue);
    font-size: 2.1875rem;
    letter-spacing: 2px;

    display: flex;
    justify-content: center;
    align-items: center;

    height: 51px;
    width: 51px;
    padding-top: 2px;
    border-radius: 50%;
  }

  .email {
    font-size: 1rem;
    font-family: var(--ff-karla);
    text-transform: lowercase;
    grid-column: 2 span;
    margin: 0
  }

  .side-nav-container {
    grid-row: 2 / -1;
    grid-column: 1;
    align-self: center;
    min-height: 100px;
    height: 100%;
    max-height: 350px;

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