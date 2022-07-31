const TextConfig = {
  text: {
    label: "文本",
    props: {
      text: "我是通用文本组件",
    },
  },
  size: {
    label: "尺寸",
    props: {
      width: 300,
      height: 120,
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
  align: {
    label: "对齐方式",
    props: {
      textAlign: "center",
    },
  },
};

export { TextConfig };
export default TextConfig;
