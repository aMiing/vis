<template>
  <div class="widgets-list">
    <el-menu
      class="el-menu-demo"
      mode="horizontal"
      @select=""
      text-color="#fff"
      active-text-color="#6bf"
      default-active="1"
    >
      <el-submenu v-for="item in widgetTabs" :key="item.name" :index="item.name">
        <template slot="title">
          <i :class="item.icon" :title="item.name"></i>
        </template>
        <div class="charts-content">
          <div
            class="chart"
            v-for="widget in item.widgets"
            :key="widget.name"
            @click="UseIt(widget)"
          >
            <img class="chart-img" :src="widget.img" />
            <div class="chart-label">{{ widget.label }}</div>
          </div>
        </div>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import widgetsConfig from "@/config/widgets/index";
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      widgetTabs: [
        {
          label: "基础组件",
          name: "common",
          icon: "fa fa-bar-chart",
          widgets: [
            {
              label: "文本",
              name: "commonText",
              img: require("@/assets/widgets/3D-map.png"),
            },
            {
              label: "滚动字幕",
              name: "scrollText",
              img: require("@/assets/widgets/scrollText.png"),
            },
            {
              label: "多行文本",
              name: "linesText",
              img: require("@/assets/widgets/linesText.png"),
            },
            {
              label: "时间控件",
              name: "timer",
              img: require("@/assets/widgets/time.png"),
            },
            {
              label: "图片",
              name: "commonImage",
              img: require("@/assets/widgets/image.png"),
            },
          ],
        },
        {
          label: "图表",
          name: "chart",
          icon: "fa fa-bar-chart",
        },
        {
          label: "仿真模型",
          name: "model",
          icon: "fa fa-bar-chart",
        },
        {
          label: "平面图标",
          name: "icon",
          icon: "fa fa-bar-chart",
        },
      ],
    };
  },
  computed: {
    widgets() {
      return this.widgetTabs.map(e => e.widgets);
    },
  },
  methods: {
    ...mapActions("editor", ["addElements"]),
    async UseIt(widget) {
      const randomId = Math.random().toString(16).slice(2);
      //   从配置项中获取基础配置
      const _widget = {
        ...widget,
        ...widgetsConfig[widget.name],
        id: randomId,
      };
      console.log("_widget", _widget);
      await this.addElements(_widget);
    },
  },
};
</script>

<style lang="scss" scoped>
.widgets-list {
  width: 100%;
  height: 100%;
  ::v-deep .el-menu--horizontal {
    .el-submenu {
      .el-submenu__title {
        height: 60px;
      }
    }
  }
}
.charts-content {
  display: flex;
  justify-content: flex-start;
  text-align: center;
  padding: 16px;
  .chart {
    display: flex;
    flex: 0 1 140px;
    flex-direction: column;
    box-shadow: 0 0 2px red;
    .chart-img {
      height: 84px;
      width: 140px;
      object-fit: scale-down;
    }
    .chart-label {
      //    height: 30px;
      padding: 5px;
    }
  }
}
</style>
