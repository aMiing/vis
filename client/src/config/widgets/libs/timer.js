const TimeFormatterConfig = {
  size: {
    label: "尺寸",
    props: {
      width: 260,
      height: 40,
      sizeUnit: "px",
    },
  },

  background: {
    label: "背景",
    props: {
      backgroundColor: "rgba(0,0,0,0)",
      backgroundImage: "",
    },
  },

  font: {
    label: "字体",
    props: {
      color: "#fff",
      fontSize: 20,
      fontWeight: 400,
      fontFamily: "",
      fontUnit: "px",
    },
  },
  timeFormatter: {
    label: "格式",
    props: {
      timeFormatter: "YYYY/MM/DD hh:mm:ss",
    },
  },
};

export { TimeFormatterConfig };
export default TimeFormatterConfig;
