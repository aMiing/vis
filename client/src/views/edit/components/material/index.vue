<template>
  <div class="material">
    <!-- <div class="tabs-content">
      <el-tabs type="card" v-model="activeName" :stretch="true">
        <el-tab-pane class="radio-item" name="widget" label="组件素材"></el-tab-pane>
        <el-tab-pane class="radio-item" name="layer" label="图层管理"></el-tab-pane>
      </el-tabs>
    </div> -->
    <div class="material__main">
      <widgetsVue v-show="activeName === 'widget'"></widgetsVue>
      <!-- <layerVue v-show="activeName === 'layer'"></layerVue> -->
    </div>
  </div>
</template>
<script>
import layerVue from "../layer.vue";
import widgetsVue from "./widget.vue";
export default {
  name: "Material",
  components: { layerVue, widgetsVue },
  data() {
    return {
      activeName: "widget",
    };
  },
  methods: {},
};
</script>
<style scoped lang="scss">
.material {
  display: flex;
  flex-direction: column;
  height: calc(100% - 36px);
  .material__main {
    flex: 1;
    padding-bottom: 12px;
    overflow: auto;
  }
}
</style>
