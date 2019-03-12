import Vue from 'vue'
import Vuex from 'vuex'




Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {

  },
  state: {
    token: localStorage.getItem('token'),
    user: null,
    userInitiated: false,
    titleStatement: true,
    usertypes: [],
    professions: [],
    professionsByIds: {},
    objectStatuses: {},
    objectTypes: {},
    buildingTypes: {},
    priceModes: {},
    defaultUserState: 'is_working',
    componentReady: false,
    pageData: {
      title: '',
      metaTitle: ''
    }
    // chat

  },
  mutations: {
    setAppData(state, data) {
      for(let prop in data) {
        state[prop] = data[prop];
      }
    },
    setPageData(state, data) {
      state.pageData = data;
    },
    async login (state, response) {
      localStorage.setItem("token", response.token);
      this.dispatch('setUser', response.user);
      state.token = response.token;
      state.userInitiated = true;

    },
    setUser (state, user) {
      state.user = user;
    },
    initiateUser (state) {
      state.userInitiated = true;
    },
    logout(state) {
      this.commit('setInitialState');
    },
    setInitialState(state) {
      state.user = false;
      state.token = false;
    },
    titleStatement(state, arg) {
      state.titleStatement = arg;
    },
    setComponentReady(state, val) {
      let comp = $('#component-wrapper');
      let compState = $('#component-state');
      if(comp.length && compState.length) {
        if(val) {
          compState.show();
          comp.fadeOut(30);
          compState.fadeOut(500, function () {
            comp.fadeIn(670);
          });
        } else {
          compState.show();
          comp.hide();
        }
      }
      state.componentReady = val;
    }
  },
  actions: {
    setPageData: ({ commit }, data) => {
      commit('setPageData', data);
    },
    async getAppData({ commit }) {
      const resp = await axios.get('/getAppData');
      commit('setAppData', resp.data);
    },
    getProfessions({ state }) {
      return JSON.parse(JSON.stringify(state.professions));
    },
    setComponentReady: ({ commit }, val) => {
      commit('setComponentReady', val);
    },
    checkUser: async ({ dispatch, commit }) => {
      let response = (await axios.get('/auth/user')).data;
      if(response.user) {
        commit('setInitialState');
        commit('login', response);
      } else {
        commit('setInitialState');
      }
      commit('initiateUser');
      return response;
    },
    setInitialState: ({ commit }) => {
      commit('setInitialState');
    },
    async changeUserDataProperty({ commit }, prop, val) {
      commit('changeUserDataProperty', prop, val);
    },
    setUser({ commit }, user) {
      commit('setUser', user);
    },
    logout({ commit }) {
      localStorage.removeItem("token");
      window.axios.defaults.headers.common.token = false;
      window.axios.defaults.headers.post.token = false;
      commit('logout');
    },
    appError({ state }) {
      state.crash = true;
    },
    networkError({ state }, arg) {
      if(state.networkError === arg) { return; }
      let el = $('#network-error');
      if(arg) {
        el.show();
      } else {
        el.hide();
      }
      state.networkError = arg;
    }
  },
  strict: debug
})
