### TODO lIST

- [ ] ~~主舞台缩放比例范围扩大到 2 倍~~
- [ ] 组件列表样式调整 只显示图标，点击在下面展示名称和简介 (待定)

- [x] 前进后退 (基本完成)
- [x] 前进后退快捷键操作
- [x] 更换自由变换组件（完成）
- [x] 组件的 删除、复制 功能 (完成)
- [x] 右键菜单功能
- [ ] bug: 拖动超出屏幕之后，组件内部会触发属性修正，会被异常加入到历史记录中
- [x] 全屏功能
- [x] 预览功能
- [x] 发布与分享
- [ ] bug: 预览界面刷新路由无法跳转
- [ ] **代码导出功能**（[参考](https://github.com/vuegg/vuegg)）
- [x] 一键换肤

  > vuegg 的导出功能是吧整个工程的源码导出来，不适合我们的场景。

  #### undo\redo 思路

  - `store.subscribe(() => {})` 监听 mutations 的变化 <https://v3.vuex.vuejs.org/zh/api/#subscribe>
  - `json-diff`比较数据的变化 <https://github.com/andreyvit/json-diff> 备选<https://github.com/benjamine/jsondiffpatch>
  - 存储并维护快照数组 <https://juejin.cn/post/6990296167468761095>

> 保存状态是不是可以通过快照数组获取呢？ 给快照数组添加标记，记录当期按步骤是否已被后端保存。 这样做的好处是回退到某个步骤，如果该步骤已保存，可避免重复提交保存。

1. 无历史数据时`isFirstHistory, isLastHistory`都为 true.

监听数据变化的坑：

1. elements 是数组，当其中某个 element 的属性发生变化时。watch 到的 oldVal 和 newVal 是同一个应用对象，完全相等。
   > Watch 只是侦听到数据改变了，并不会把之前的老值给缓存下来，引用类型直接指向了引用地址
   > 解决方案： 利用 computed 深拷贝数据，watch 这个计算属性。 这样当原数据变化时，会触发 computed 生成另一份新的数据，两份数据指向不同的存储空间。

vue-drag-resize-rotate 组件的坑：

1. 限制父级时 resizestop 事件回调行为异常， 边缘计算未正确更新 right 数据，导致最终计算的宽高窜在问题。[issue]<https://github.com/gausszhou/vue-drag-resize-rotate/issues/14>

### 数据思路

- 配置数据和记录数据分开
- screenData && screenConfig
- scale 缩放数据不应该作为屏幕数据被存储，会污染属性， scale 的生命周期仅存在于当前次的编辑。

<!-- ### 数据变更（解耦） -->

<!-- 属性配置面板数据变化之后应该作为一次 commit 提交到 store， store 更新数据触发主舞台预览 -->

### 开发指南

1. 依赖安装
   npm run install
2. 启动
   npm run dev
3. deployed
   npm run build
