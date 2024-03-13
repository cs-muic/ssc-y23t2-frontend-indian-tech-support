import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoggedIn: false,
    username: null,
    displayName: null,
    role: "",
  },
  getters: {},
  mutations: {
    setIsLoggedIn(state, isLoggedIn) {
      state.isLoggedIn = isLoggedIn;
    },
    setUsername(state, username) {
      state.username = username;
    },
    setDisplayName(state, displayName) {
      state.displayName = displayName;
    },
    setRole(state, role) {
      state.role = role;
    },
  },
  actions: {
    setLoggedInUser({ commit }, payload) {
      commit("setIsLoggedIn", payload.loggedIn);
      commit("setUsername", payload.username);
      commit("setDisplayName", payload.displayName);
      commit("setRole", payload.role);
    },
    clearUser({ commit }) {
      commit("setIsLoggedIn", false);
      commit("setUsername", null);
      commit("setDisplayName", null);
      commit("setRole", "");
    },
  },
  modules: {},
});
