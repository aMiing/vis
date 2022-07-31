const defaultImg = require("@/assets/widgets/image.png");
const ImageConfig = {
  background: {
    label: "背景",
    props: {
      backgroundColor: "rgba(0,0,0,0)",
    },
  },
  src: {
    label: "链接地址",
    props: {
      url: defaultImg,
    },
  },
  objectFit: {
    label: "平铺方式",
    props: {
      objectFit: "scale-down",
    },
  },
};

export { ImageConfig };
export default ImageConfig;
