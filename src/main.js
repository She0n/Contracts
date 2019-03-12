// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import globals from './../globals';
import VueAxios from "vue-axios";
import axios from "axios";
import store from './store/index.js';
import vSelect from 'vue-select';
import Popover from 'vue-js-popover';
Vue.config.productionTip = false;
Vue.router = router;
Vue.use(VueAxios, axios);
Vue.use(Popover);
Vue.use(require('@websanova/vue-auth'), {
  auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
  http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
  router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js')
});
Vue.component('v-select', vSelect);
App.router = Vue.router;

/* eslint-disable no-new */
window.app = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
