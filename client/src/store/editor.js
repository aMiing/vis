import { diff } from 'json-diff';
import UUID from '@/utils/uid.js';
import { cloneDeep } from 'lodash';
import screenConfig from '@/config/screen.js';
import { panelService } from '@/service';
import localforage from 'localforage';
import GLOBAL from '@/global.config.js';
const { useLocal } = GLOBAL;
const defaultScreen = Object.keys(screenConfig).reduce((total, e) => {
  return Object.assign(total, { ...screenConfig[e]?.props });
}, {});

const state = {
  elements: [],
  screen: defaultScreen,
  screenId: '',
};
const getters = {
  screenData: state => {
    // 数据解耦
    return state.screen;
  },
  getElements: state => {
    return state.elements;
  },
  noElement: state => {
    return state.elements.length === 0;
  },
};
const mutations = {
  updateId(state, value) {
    state.screenId = value;
  },
  useElements(state, value) {
    state.elements = value;
  },
  useScreen(state, value) {
    Object.assign(state.screen, { ...value });
  },

  pushElements(state, value) {
    state.elements.push(...value);
  },
  insertElement(state, { index, element }) {
    state.elements.splice(index, 0, ...element);
  },
  popElement(state, index = -1) {
    console.log('~index', ~index);
    ~index ? state.elements.splice(index, 1) : state.elements.pop();
  },
  updateScreenProp(state, value) {
    const { key, val } = value;
    state.screen[key] = val;
  },
  updateElementProp(state, { index, key, val }) {
    state.elements[index][key] = val;
  },
  // 删除
  deleteElement(state, id) {
    const index = state.elements.findIndex(e => e.id === id);
    ~index && state.elements.splice(index, 1);
  },
};
const actions = {
  recordDataChange({ dispatch }, value) {
    const { oldV, newV, type } = value;
    const _diff = diff(oldV, newV);
    _diff && dispatch('history/addHistory', { type, id: UUID(), diff: _diff }, { root: true });
  },
  // 提交保存
  async saveData({ commit, state }) {
    const params = {
      elements: JSON.stringify(state.elements),
      style: JSON.stringify(state.screen),
      id: state.screenId,
    };
    if (useLocal) {
      await localforage.setItem(state.screenId, params);
    } else {
      await panelService.update(params);
    }
    // 更新saveTag
    commit('history/updateSaveTagId', null, { root: true });
  },
  // 发布
  async publishNow({ state }) {
    const publishedId = UUID(32);
    const params = { id: publishedId, originId: state.screenId };
    const { result } = useLocal
      ? await localforage.setItem(publishedId, params).then(() => {
          return {
            result: 0,
          };
        })
      : await panelService.publish(params);
    return result === 0 ? '/page/' + publishedId : null;
  },
  addElements({ commit, state }, value) {
    commit('pushElements', [value]);
  },

  copyElement({ commit }, ele) {
    const newEle = cloneDeep({ ...ele, id: UUID(), text: ele.text + '-copy' });
    commit('pushElements', [newEle]);
    return newEle;
  },
  updateFromDiff({ commit, state }, value) {
    // next = false, 后退
    const {
      history: { diff, type = 'screen' },
      next = false,
    } = value;
    const target = next ? '__new' : '__old';
    if (type === 'screen') {
      Object.keys(diff).forEach(async key => {
        await commit('updateScreenProp', { key, val: diff[key][target] });
      });
    } else if (type === 'elements') {
      for (let index = 0; index < diff.length; index++) {
        // diffType: 删除 (-)、新增 (+)、更改的子对象 (~) 或未更改的 (' ')
        const [diffType, data] = diff[index];
        if (diffType === '~') {
          Object.keys(data).forEach(key => {
            commit('updateElementProp', { index, key, val: data[key][target] });
          });
        } else if (diffType === '+') {
          next ? commit('pushElements', [data]) : commit('popElement');
        } else if (diffType === '-') {
          next ? commit('popElement', index) : commit('insertElement', { index, element: [data] });
        }
      }
    }
  },
};
const panel = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
export default panel;
