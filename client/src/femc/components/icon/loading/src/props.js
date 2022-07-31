export const getProps = defaultColor => ({
  color: {
    type: String,
    default: defaultColor,
  },
  size: {
    type: [Number, String],
  },
});
