<template>
<div>
  <button v-if="$i18n.locale === 'lt'"
          class="language-btn"
          title="Keisti kalbą"
          @click="setLanguage('en')">EN</button>
  <button v-else-if="$i18n.locale === 'en'"
          title="Change Language"
          class="language-btn"
          @click="setLanguage('lt')">LT</button>
</div>
</template>

<script>
  export default {
    name: "LanguageSwitch",
    methods: {
      setLanguage(lang) {
        localStorage.setItem('lang', lang);
        this.$i18n.locale = lang;
        this.$i18n.setLocaleMessage(lang, require(`../lang/translations/${lang}.json`));
      }
    }
  }
</script>

<style scoped>

  .language-btn {
    margin: 0 1em;
    width: 1.7em;
    color: var(--clr-white);
    font: inherit;
    font-kerning: none;
  }

  .language-btn:hover {
    text-decoration: underline;
  }

</style>