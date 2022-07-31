<template>
  <div class="widget">
    <el-collapse v-model="activeNames" accordion>
      <el-collapse-item
        v-for="(group, index) in widgetGroup"
        :key="index"
        :title="group.label + `(${group.widgets.length})`"
        :name="group.name"
        :disabled="!group.widgets || !group.widgets.length"
      >
        <div class="charts-content">
          <div
            class="chart"
            v-for="widget in group.widgets"
            draggable="true"
            :key="widget.name"
            @click="UseIt(widget)"
            @dragstart="e => dragstart(e, widget)"
            @dragenter="dragenter"
          >
            <img class="chart-img" :src="widget.img" draggable="false" />
            <div class="chart-label">{{ widget.label }}</div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import { widgetGroup } from "./config/widget";
import widgetsConfig from "@/config/widgets/index";
import { mapActions, mapMutations, mapGetters } from "vuex";
export default {
  name: "Widget",
  data() {
    return {
      activeNames: widgetGroup[0].name,
      widgetGroup,
    };
  },
  methods: {
    ...mapActions("editor", ["addElements"]),
    getRandomId() {
      return Math.random().toString(16).slice(2);
    },
    UseIt(widget) {
      //   从配置项中获取基础配置
      const _widget = this.getWidgetData(widget);
      this.addElements(_widget);
    },
    getWidgetData(widget) {
      const target = widgetsConfig[widget.name] || {};
      const initConfig = Object.keys(target).reduce((total, e) => {
        return Object.assign(total, { ...(target[e]?.props || {}) });
      }, {});
      const { name, label } = widget;
      return {
        name,
        label,
        ...initConfig,
        id: this.getRandomId(),
      };
    },
    dragstart(event, widget) {
      // 获取完整的组件属性
      const _widget = this.getWidgetData(widget);
      // event.dataTransfer.setData 方法，记录数据
      event.dataTransfer.setData("text/plain", JSON.stringify(_widget));
      // 代表拖拽的模式，copy代表复制
      event.dataTransfer.effectAllowed = "copy";
    },
    dragenter(event) {
      console.log("dragenter event", event);
    },
  },
};
</script>
<style scoped lang="scss">
.widget {
  ::v-deep {
    .el-collapse-item__header {
      padding: 0 16px;
    }
  }
  .charts-content {
    padding: 0 8px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .chart {
      flex: 0 0 130px;
      height: 108px;
      margin: 4px 6px;
      text-align: center;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border-radius: 8px;
      box-shadow: 1px 1px 2px var(--grey-2);

      &:hover,
      &.active {
        box-shadow: 0 0 4px var(--grey-10);
      }
      .chart-img {
        width: 100%;
        height: 82px;
        object-fit: cover;
      }
      .chart-label {
      }
    }
  }
}
</style>
