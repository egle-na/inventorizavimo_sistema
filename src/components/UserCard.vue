<template>
  <div class="user-card">

    <div class="name-container">
      <span id="profile-btn">{{ nameInitials }}</span>
      <span class="name">{{ name }}</span>
    </div>
    <p class="email">vardenis.pavardenis@teltonika.lt</p>

  </div>
</template>
<script>
  import ProfileImgMixin from "@/components/mixins/ProfileImgMixin";

  export default {
    name: 'UserCard',
    mixins:[ ProfileImgMixin ]
  }
</script>
<style scoped>

  .user-card {
    grid-row: 1;
    grid-column: 1;
    display: grid;
    padding: 0 1.5em;
    margin: 2em 0 1em;
    grid-gap: .4em;
    grid-template-columns: auto auto;
  }

  .name-container {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: start;
  }

  #profile-btn {
    font-family: var(--ff-bebas-neue);
    background: var(--clr-accent);
    color: var(--clr-white);
    font-size: 2.1875rem;
    letter-spacing: 2px;
    line-height: 1;

    display: flex;
    justify-content: center;
    align-items: center;

    flex-shrink: 0;
    height: 51px;
    width: 51px;
    padding-top: 4px;
    border-radius: 50%;
  }

  .name {
    font-family: var(--ff-roboto-con);
    font-size: var(--fs-side-menu);
    text-transform: uppercase;
    margin-left: .3em;
  }

  .email {
    font-size: 1rem;
    font-family: var(--ff-karla);
    text-transform: lowercase;
    grid-column: 2 span;
    margin: 0
  }

</style>