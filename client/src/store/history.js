import { updateIsFromHistory } from "@/utils/compare";
const state = {
  historyQueue: [],
  redoQueue: [],
  maxHistoryLength: 10,
  useHistory: false, //是否记录操作历史
  savedTagId: "", //标记保存状态
  isUndo: false, // 是否是在执行redo
};

const getters = {
  noNeedBeSave(state) {
    return state.savedTagId === (state.historyQueue.at(-1)?.id || "");
  },
  canRedo(state) {
    return state.redoQueue.length > 0;
  },
  canUndo(state) {
    return state.historyQueue.length > 0;
  },
};

const mutations = {
  addHistory(state, value) {
    state.historyQueue.push(value);
  },
  startRecordHistory(state) {
    state.useHistory = true;
  },
  stopRecordHistory(state) {
    state.useHistory = false;
  },
  isUndoOperator(state, value) {
    state.isUndo = value;
  },
  updateSaveTagId(state) {
    state.savedTagId = state.historyQueue.at(-1)?.id;
  },
  addRedo(state) {
    state.redoQueue.push(state.historyQueue.pop());
  },
  removeRedo(state) {
    state.historyQueue.push(state.redoQueue.pop());
  },
};

const actions = {
  addHistory({ state, commit }, value) {
    const fromHistory = updateIsFromHistory(value, state);
    // 更新isUndo
    commit("isUndoOperator", false);
    if (fromHistory || !state.useHistory) return;
    // 新增记录之前清空redo队列
    state.redoQueue = [];
    commit("addHistory", value);
    // 超出长度
    if (state.historyQueue.length > state.maxHistoryLength) {
      state.historyQueue.shift();
    }
  },
  // 向后一步
  async undo({ commit, dispatch, state }) {
    commit("isUndoOperator", true);
    if (state.historyQueue.length) {
      await dispatch(
        "editor/updateFromDiff",
        { history: state.historyQueue.at(-1), next: false },
        { root: true }
      );
      commit("addRedo");
    }
  },
  async redo({ commit, dispatch, state }) {
    commit("isUndoOperator", false);
    // 向前一步
    if (state.redoQueue.length) {
      await dispatch(
        "editor/updateFromDiff",
        { history: state.redoQueue.at(-1), next: true },
        { root: true }
      );
      commit("removeRedo");
    }
  },
};

const history = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
export default history;
