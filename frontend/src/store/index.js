import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoggedIn: false,
    username: null,
    display_name: null,
    role: "",
  },
  getters: {},
  mutations: {},
  actions: {
    setLoggedInUser(state, payload) {
      state.isLoggedIn = payload.loggedIn;
      state.username = payload.username;
      state.display_name = payload.display_name;
      state.role = payload.role;
    },
    clearUser(state) {
      state.isLoggedIn = false;
      state.username = null;
      state.display_name = null;
      state.role = "";
    },
  },
  modules: {},
});
