import { diff } from "json-diff";

// 如果更新来自redo操作，那么即将新增的变化会和history的最后你项相同； 如果更新来自undo，那么即将新增的数据应该和redoQueue最后一项相同
export const updateIsFromHistory = (newHistory, state) => {
  // 后退操作一定不需要加入历史队列(判断时候是最新的一条是因为可能isUndo更新不及时)
  if (state.isUndo) return true;
  // 前进操作，如果diff数据一样，则不新增记录，diff数据不一样，则删除后面的数据并新增
  return diff(state.redoQueue.at(-1)?.diff, newHistory?.diff) === undefined;
};
