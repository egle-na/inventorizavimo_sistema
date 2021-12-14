<!--<template>-->

<!--  <span id="profile-btn">{{ nameInitials }}</span>-->

<!--</template>-->

<script>
  // change to component
  export default {
    name: "ProfileImgMixin",
    data() {
      return {
        name: 'Vardenis Pavardenis',
      }
    },
    computed: {
      nameInitials() {
        return this.name.charAt(0) + this.name.split(" ")[1].charAt(0);
      }
    }
  }
</script>

<style scoped>

  /*#profile-btn {*/
  /*  background: var(--clr-white);*/
  /*  color: var(--clr-accent);*/
  /*  font-family: var(--ff-bebas-neue);*/
  /*  font-size: 1.875rem;*/
  /*  letter-spacing: 2px;*/

  /*  height: 44px;*/
  /*  width: 44px;*/
  /*  padding-top: 2px;*/
  /*  border-radius: 50%;*/
  /*}*/

</style>