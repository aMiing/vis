const borderConfig = {
  border: {
    label: "边框",
    props: {
      borderWidth: [1, 1, 1, 1],
      borderStyle: ["dashed", "solid"],
      borderColor: ["#8bf"],
      borderUnit: "px",
    },
  },

  radius: {
    label: "圆角",
    props: {
      borderRadius: [10, 10, 10, 10],
      radiusUnit: "px",
    },
  },
};

export { borderConfig };
export default borderConfig;
