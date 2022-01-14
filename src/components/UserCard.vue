<template>
  <div class="user-card">

    <!-- Initials -->
    <span id="profile-btn">{{ nameInitials }}</span>

    <!-- Name Surname -->
    <span class="name">{{ $store.getters.user.first_name }}</span>
    <span class="name">{{ $store.getters.user.last_name }}</span>

    <!-- Email -->
    <p class="email">{{ $store.getters.user.email }}</p>

  </div>
</template>
<script>
  export default {
    name: 'UserCard',
    computed: {
      nameInitials() {
        return this.$store.getters.user.first_name.charAt(0)
            + this.$store.getters.user.last_name.charAt(0);
      }
    }
  }
</script>
<style scoped>

  .user-card {
    grid-row: 1;
    grid-column: 1;
    display: grid;
    padding: 0 1.5em;
    margin: 2em 0 1em;
    grid-template-columns: min-content auto;
  }

  #profile-btn {
    grid-row: 2 span;
    grid-column: 1;
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
    display: block;
    line-height: 1.1em;
  }

  .email {
    font-size: 1rem;
    font-family: var(--ff-karla);
    text-transform: lowercase;
    grid-column: 1 / -1;
    margin: .4em 0 0;
  }

</style>