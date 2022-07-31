function getActualWidthOfChars(text, options = {}) {
  const { size = 14, family = 'Microsoft YaHei' } = options;
  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d');
  context.font = `${size}px ${family}`;
  let metrics = context.measureText(text);

  // https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics
  return Math.abs(metrics.actualBoundingBoxLeft) + Math.abs(metrics.actualBoundingBoxRight);
}

function getActualElementWidth(el) {
  const BORDER_BOX = 'border-box';
  const {
    boxSizing,
    width: widthString,
    borderWidth: borderWidthString,
    paddingLeft: paddingLeftString,
    paddingRight: paddingRightString,
  } = window.getComputedStyle(el);

  const width = Number.parseFloat(widthString);
  const paddingLeft = Number.parseFloat(paddingLeftString);
  const paddingRight = Number.parseFloat(paddingRightString);
  const borderWidth = Number.parseFloat(borderWidthString);

  return boxSizing === BORDER_BOX
    ? width - borderWidth * 2 - paddingLeft - paddingRight
    : width - borderWidth * 2;
}

export { getActualWidthOfChars, getActualElementWidth };
