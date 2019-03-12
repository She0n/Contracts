<template>
  <div id="app">
    <div id="preloader" v-if="!$auth.ready()">
      <div class="loading-content">
        <div class="m-loader"></div>
        <span class="u-text-dark">загрузка...</span>
      </div>
    </div>
    <div v-else>
      <loginFixedComponent v-if="!$auth.check()"></loginFixedComponent>
      <div v-else>
        <sidebar></sidebar>
        <div class="o-page__content u-relative">
        <header class="title-block">
          <div class="page-title" v-html="$store.state.pageData.title"></div>
          <!--<div class="profile-header">
            <div class="c-dropdown dropdown">
              <a href="#" id="dropdownAvatar" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="c-avatar c-avatar--xsmall has-dropdown dropdown-toggle">
                <img src="/static/images/user.svg" width="36" height="36">
              </a>
              <div aria-labelledby="dropdownAvatar" class="c-dropdown__menu dropdown-menu dropdown-menu-right">
                <router-link to="/profile" class="c-dropdown__item dropdown-item">Профиль</router-link>
                <a @click.prevent="$auth.logout()" class="c-dropdown__item dropdown-item">Выход</a>
              </div>
            </div>
          </div>-->
        </header>
        <div id="component-state">
          <div class="loading-content">
            <div class="m-loader"></div>
            <span class="u-text-dark">загрузка...</span>
          </div>
        </div>
        <div id="component-wrapper">
          <router-view class="c-content"/>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  @import './styles/style.scss';
</style>
<script>
  import sidebar from '@/components/elements/sidebar.vue';
  import loginFixedComponent from '@/components/loginFixedComponent.vue';
  export default {
    name: 'App',
    data() {
      return {
        loginInitiated: false
      };
    },
    async created() {
      await this.$store.dispatch('getAppData');
    },
    components: {
      sidebar, loginFixedComponent
    }
  }
</script>
