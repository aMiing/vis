import localforage from "localforage";
const state = {
  theme: "dark",
  lastUrl: ''
};
const getters = {
  getTheme: state => {
    return state.theme;
  },
};
const mutations = {
  UPDATE_THEME(state, value) {
    state.theme = value;
  },
  SET_LAST_URL(state, value) {
    state.lastUrl = value;
  }
};
const actions = {
  async updateTheme({ commit }, payload) {
    const defaultTheme = payload || (await localforage.getItem("LOCAL_THEME")) || "dark";
    commit("UPDATE_THEME", defaultTheme);
    document.getElementsByTagName("html")[0].setAttribute("theme", defaultTheme);
    localforage.setItem("LOCAL_THEME", defaultTheme);
  },
  setLastUrl({commit}, payload) {
    commit('SET_LAST_URL', payload)
  }
};
const common = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
export default common;
