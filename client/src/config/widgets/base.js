const BaseConfig = {
  size: {
    label: "尺寸",
    props: {
      width: 200,
      height: 200,
      sizeUnit: "px",
    },
  },
  position: {
    label: "位置",
    props: {
      posX: 200,
      posY: 200,
      positionUnit: "px",
    },
  },
  background: {
    label: "背景",
    props: {
      backgroundColor: "#1b1f25",
      backgroundImage: "",
    },
  },
  // font: {
  //   label: "字体",
  //   props: {
  //     color: "#fff",
  //     fontSize: 14,
  //     fontWeight: 400,
  //     fontFamily: "",
  //     fontUnit: "px",
  //   },
  // },
  zoom: {
    label: "旋转",
    props: {
      rotate: 0,
    },
  },
  border: {
    label: "边框",
    props: {
      borderWidth: [0, 0, 0, 0],
      borderStyle: ["dashed"],
      borderColor: [],
      borderUnit: "px",
    },
  },
  radius: {
    label: "圆角",
    props: {
      borderRadius: [0, 0, 0, 0],
      radiusUnit: "px",
    },
  },
  padding: {
    label: "边距",
    props: {
      padding: [0, 0, 0, 0],
      paddingUnit: "px",
    },
  },
  layer: {
    label: "层级",
    props: {
      zIndex: "auto",
    },
  },
};

export { BaseConfig };
export default BaseConfig;
