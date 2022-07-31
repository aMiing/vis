const state = {
  userInfo: {
    userCode: 'wangcm1',
    userName: '阿明先森',
    userId: '001',
  },
};
const getters = {
  getUserInfo: state => {
    return state.userInfo;
  },
};
const mutations = {
  setUserInfo(state, value) {
    state.userInfo = Object.assign(state.userInfo, { ...value });
  },
  clearUserInfo(state) {
    for (const key in state.userInfo) {
      if (Object.hasOwnProperty.call(state.userInfo, key)) {
        state.userInfo[key] = '';
      }
    }
    state.userInfo;
  },
};

const user = {
  namespaced: true,
  state,
  getters,
  mutations,
};
export default user;
