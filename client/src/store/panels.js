import localforage from 'localforage';
import { panelService } from '@/service';
import GLOBAL from '@/global.config.js';
const { useLocal } = GLOBAL;
const state = {
  list: [],
};
const getters = {
  getList(state) {
    return state.list;
  },
};
const mutations = {
  setList(state, value) {
    state.list = value;
  },
  addList(state, value) {
    state.list.unshift(value);
  },
  deleteItem(state, value) {
    const index = state.list.findIndex(e => e.id === value);
    state.list.splice(index, 1);
  },
};

const actions = {
  async getPanelList({ commit }) {
    const panelList = useLocal
      ? await localforage.getItem('panelList')
      : await panelService.getPanelList().then(res => res.data);
    commit('setList', panelList || []);
  },
  async addList({ state, commit }, value) {
    try {
      if (useLocal) {
        commit('addList', value);
        await localforage.setItem('panelList', state.list);
      } else {
        await panelService.create(value);
      }
    } catch (error) {
      console.log('error', error);
    }
  },
  async deleteDataById({ commit }, id) {
    if (useLocal) {
      commit('deleteItem', id);
      await localforage.setItem('panelList', state.list);
    } else {
      await panelService.delete({ id });
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
