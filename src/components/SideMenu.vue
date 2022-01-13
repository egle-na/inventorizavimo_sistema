<template>
  <div class="side-menu-container">

    <user-card />

    <div class="side-nav-container">
      <ul class="side-nav">
        <li><router-link to="/all-companies">Įmonės</router-link></li>
        <li><router-link to="/all-users">Darbuotojai</router-link></li>
        <li><router-link to="/all-inventory">Inventorius</router-link></li>
      </ul>
    </div>

  </div>
</template>

<script>
  import UserCard from "@/components/UserCard";

  export default {
    name: "SideMenu",
    components: { UserCard },
  }
</script>

<style scoped>

  .side-menu-container {
    background: var(--clr-almost-white);
    height: 100%;
    box-shadow: 4px 0 7px #E5E5E5;

    display: grid;
    grid-template: min-content auto / auto;

    font-family: var(--ff-roboto-con);
    font-size: var(--fs-side-menu);
    text-transform: uppercase;
  }

  .side-nav-container {
    grid-row: 2 / -1;
    grid-column: 1;
    align-self: center;
    min-height: 100px;
    height: 100%;
    max-height: 210px;
  }

  .side-nav {
    list-style: none;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    max-height: 100%;
    margin: 0;
    padding-left: 1.5em;
    padding-right: .5em;
  }

  .side-nav li{
    width: fit-content;
    padding-right: 2em;
  }

  a {
    position: relative;
    text-decoration: none;
    color: inherit;
  }

  a:after {
    position: relative;
    content: '';
    display: block;
    width: 0;
    margin-top: 5px;

    height: 2px;
    background: var(--clr-grey);

    transition: width 250ms, background 250ms;
  }

  .router-link-active {
    color: var(--clr-accent);
  }

  .router-link-active:after,
  a:hover:after{
    width: calc(100% + 1.5em);
  }

  @media (max-width: 960px) {
    .user-card {
      display: none;
    }

    .side-menu-container {
      display: initial;
    }

    .side-nav {
      align-items: center;
      flex-direction: row;
      padding-right: 1.5em;
      margin-bottom: 0;
      justify-content: space-around;
    }

    .side-nav-container {
      min-height: 0;
    }

    .side-nav li {
      padding: 0;
    }

    .router-link-active:after,
    a:hover:after,
    a::after{
      width: calc(100% + 1.5em);
      left: -.8em;
    }

    li:first-child a::after{
      left: 0;
    }

    li:last-child a::after{
      left: -1.5em;
    }

    a:hover:after,
    .router-link-active:after {
      background: var(--clr-accent);
    }
  }

  @media(max-width: 580px) {
    .side-nav{
      padding: 0 .6em;
      justify-content: space-between;
    }

    .side-menu-container {
      z-index: 1;
      font-size: 1.2em;
    }

    .router-link-active:after,
    a:hover:after,
    a::after{
      width: calc(100% + .8em);
      left: -.4em;
    }

    li:last-child a::after{
      left: -.8em;
    }
  }

</style>