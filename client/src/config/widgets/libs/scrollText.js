const ScrollTextConfig = {
  text: {
    label: "文本",
    props: {
      text: "我是滚动文本啦啦啦",
    },
  },
  size: {
    label: "尺寸",
    props: {
      width: 300,
      height: 60,
      sizeUnit: "px",
    },
  },
  font: {
    label: "字体",
    props: {
      color: "#fff",
      fontSize: 20,
      fontWeight: 600,
      fontFamily: "",
      fontUnit: "px",
    },
  },
  direction: "left", //down up left right
  behavior: "scroll", //alternate 表示在两端之间来回滚动;scroll： 表示由一端滚动到另一端，会重复。slide：  表示由一端滚动到另一端，不会重复。
  // bgcolor: "#666", //设定活动字幕的背景颜色
  // hspace: 10, //设定活动字幕里所在的位置距离父容器水平边框的距离
  // vspace: 2, //设定活动字幕里所在的位置距离父容器垂直边框的距离
  loop: -1, //设定滚动的次数，当loop=-1表示一直滚动下去，默认为-1
  scrollamount: 3, //设定活动字幕的滚动速度，单位pixels
  scrolldelay: 500, //设定活动字幕滚动两次之间的延迟时间，单位millisecond（毫秒）
};

export { ScrollTextConfig };
export default ScrollTextConfig;
