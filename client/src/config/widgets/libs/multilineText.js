const TextConfig = {
  text: {
    label: "文本",
    props: {
      text: "我是多行文本组件，所以我会长一点，希望能达到换行的长度~",
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
  rowStyle: {
    label: "行样式",
    props: {
      indent: 2,
      indentUnit: "em",
      lineHeight: 20,
      lineHeightUnit: "px",
    },
  },
};

export { TextConfig };
export default TextConfig;
