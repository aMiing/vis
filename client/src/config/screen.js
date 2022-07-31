const ScreenConfig = {
  size: {
    label: "尺寸",
    props: {
      width: 1440,
      height: 900,
      sizeUnit: "px",
    },
  },
  background: {
    label: "背景",
    props: {
      backgroundColor: "#000",
      backgroundImage: "",
    },
  },
  font: {
    label: "字体",
    props: {
      fontColor: "#fff",
      fontSize: 14,
      fontUnit: "px",
      fontWeight: 400,
      fontFamily: "",
    },
  },
  gride: {
    label: "网格",
    props: {
      gride: 20,
    },
  },
};

export { ScreenConfig };
export default ScreenConfig;
