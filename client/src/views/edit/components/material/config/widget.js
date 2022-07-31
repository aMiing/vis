export const widgetGroup = [
  {
    label: "基础组件",
    name: "common",
    icon: "fa fa-bar-chart",
    widgets: [
      {
        label: "文本",
        name: "commonText",
        img: require("@/assets/widgets/common-title.png"),
      },
      {
        label: "滚动字幕",
        name: "scrollText",
        img: require("@/assets/widgets/scrollText.png"),
      },
      {
        label: "多行文本",
        name: "multilineText",
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
      {
        label: "边框",
        name: "Border",
        img: require("@/assets/widgets/border.png"),
      },
    ],
  },
  {
    label: "图表",
    name: "chart",
    icon: "fa fa-bar-chart",
    widgets: [
      {
        label: "折线图",
        name: "Line",
        img: require("@/assets/widgets/line.png"),
      },
      {
        label: "柱状图",
        name: "Bar",
        img: require("@/assets/widgets/bar.png"),
      },
      {
        label: "饼状图",
        name: "Pie",
        img: require("@/assets/widgets/pie.png"),
      },
      {
        label: "环形图",
        name: "Ring",
        img: require("@/assets/widgets/ring.png"),
      },
      {
        label: "气泡图",
        name: "Points",
        img: require("@/assets/widgets/points.png"),
      },
    ],
  },
  {
    label: "仿真模型",
    name: "model",
    icon: "fa fa-bar-chart",
    widgets: [
      {
        label: "仪表盘",
        name: "DashBoard",
        img: require("@/assets/widgets/dashboard.png"),
      },
      {
        label: "水球图",
        name: "Level",
        img: require("@/assets/widgets/level.png"),
      },
    ],
  },
  {
    label: "平面图标",
    name: "icon",
    icon: "fa fa-bar-chart",
    widgets: [],
  },
  {
    label: "地理图形",
    name: "map",
    icon: "fa fa-bar-chart",
    widgets: [
      {
        label: "普通地图",
        name: "CommonMap",
        img: require("@/assets/widgets/common-map.png"),
      },
      {
        label: "3D地图",
        name: "3DMap",
        img: require("@/assets/widgets/3D-map.png"),
      },
    ],
  },
];
