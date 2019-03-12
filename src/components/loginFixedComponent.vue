<template>
  <div class="login-fixed-overlay">
    <form @submit.prevent="login">
      <h1 class="title">Вход в систему</h1>
      <div class="form-group d-mb-30">
        <label for="login" class="d-label">Ваш логин:</label>
        <div class="iconed-input-wrapper">
          <input class="d-input-cf" type="text" id="login" v-model="userdata.login" required>
          <i :class="(userdata.login && userdata.login.length > 3) ? 'fas fa-check-circle d-color-success' : 'fas fa-circle d-text-extra-mute'"></i>
        </div>
      </div>
      <div class="form-group d-mb-30">
        <label for="password" class="d-label">Пароль:</label>
        <div class="iconed-input-wrapper">
          <input class="d-input-cf" type="password" id="password" v-model="userdata.password" required>
          <i :class="(userdata.password && userdata.password.length > 5) ? 'fas fa-check-circle d-color-success' : 'fas fa-circle d-text-extra-mute'"></i>
        </div>
      </div>
      <transition name="height">
        <div class="alert alert-danger" v-if="error">
          Неверный логин или пароль
        </div>
      </transition>
      <button class="submit-button" type="submit">
        <img src="/static/images/loader.svg" class="loader fa-spin" v-if="process">
        <span v-if="!process">Продолжить</span>
      </button>
    </form>
    <div :class="'login-bg '+(loginBgShow ? 'active' : '')" >
      <img src="/static/images/login-bg.svg" width="582" height="533">
    </div>
  </div>
</template>
<style lang="scss">
  .login-fixed-overlay {
    background-color: #fff;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 150px;
    justify-content: space-between;
    .title {
      font-size: 36px;
      font-weight: bold;
      color: #2c2c2c;
      margin-bottom: 20px;
    }
    form {
      width: 400px;
    }
    .form-group {
      width: 100%;
    }
    .d-label {
      display: block;
      font-size: 14px;
      color: rgba(#11223e, 0.5);
      margin-bottom: 10px;
    }
    .d-input-cf {
      width: 100%;
      min-height: 40px;
      border: 1px solid rgba(17, 34, 62, 0.15);
      border-radius: 5px;
      font-size: 14px;
      font-weight: 500;
      color: rgba(#11223e, 0.7);
      margin-bottom: 30px;
      transition: all .3s;
      outline: none;
      padding: 12px 15px 11px;
      &:focus {
        box-shadow: 0 0 10px 0 rgba(17, 34, 62, 0.1);
      }
    }
    .iconed-input-wrapper {
      position: relative;
      i {
        position: absolute;
        top: 0;
        right: 15px;
        font-family: 'Font Awesome\ 5 Free';
        line-height: 40px;
      }
      .d-text-extra-mute {
        color: #e3e6eb;
      }
      .d-color-success {
        color: #4cc68b;
      }
    }
    .submit-button {
      width: 100%;
      min-height: 50px;
      background-color: #43be80;
      border: none;
      border-radius: 5px;
      outline: none;
      font-size: 20px;
      color: #fff;
    }
    .alert-danger {
      color: red;
      margin-bottom: 10px;
      overflow: hidden;
    }
    .login-bg {
      transform: translateX(calc(100% + 150px));
      transition: all 1280ms cubic-bezier(.4,0,.2,1);
      &.active {
        transform: translateX(0);
      }
    }
  }
</style>
<script>
  import Component from '@/components/Component.vue';
  const pageData = { title: 'Страница входа', metaTitle: 'Страница входа' };
  export default {
    mixins: [Component],
    data() {
      return {
        pageData: pageData,
        process: 0,
        userdata: {
          login: '',
          password: '',
        },
        error: false,
        loginBgShow: false
      }
    },
    mounted() {
      setTimeout(() => {
        this.loginBgShow = true;
      }, 1100);
    },
    methods: {
      async login() {
        if (this.process) {
          return;
        }
        this.process = 1;
        this.error = false;
        const resp = await this.$auth.login({
          params: {
            username: this.userdata.login,
            password: this.userdata.password
          },
          success: function() {},
          error: function() {
            this.process = 0;
            this.error = true;
          },
          rememberMe: true,
          redirect: '/',
          fetchUser: true
        });
        this.process = 0;
        if(resp.data) {
          if(resp.data.status) {
            this.$store.dispatch('setUser', resp.data.user);
          } else {
            this.error = resp.data.error;
          }
        }
      }
    }
  }
</script>
