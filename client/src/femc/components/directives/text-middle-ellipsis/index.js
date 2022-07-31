import debounce from 'lodash/debounce';

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

  return boxSizing === BORDER_BOX ? width - borderWidth * 2 - paddingLeft - paddingRight : width;
}

function zipText(el, { value = 1 }) {
  const { fontSize, fontFamily } = window.getComputedStyle(el);
  const font = { size: Number.parseInt(fontSize), family: fontFamily };
  const rawText = el.getAttribute('data-middle-ellipsis-original');
  // 多个空格合并
  const text = rawText.trim().replace(/(?<!\s)\s+(?!\s)/g, ' ');
  const parentWidth = getActualElementWidth(el);
  const realWidth = getActualWidthOfChars(text, font);

  if (parentWidth < realWidth) {
    const endOffset = +value;
    const SEPARATOR = '...';
    const rightPart = text.slice(text.length - endOffset);
    const rightPartWidth = getActualWidthOfChars(SEPARATOR + rightPart, font);
    let availableLeftWidth = Math.round(parentWidth - rightPartWidth);
    let final = '';
    let charIndex = 0;

    while (availableLeftWidth > 0) {
      const char = text[charIndex];

      let charWidth = getActualWidthOfChars(char, font);

      if (availableLeftWidth - charWidth < 0) break;

      final += char;
      availableLeftWidth -= charWidth;
      charIndex += 1;
    }
    final += `${SEPARATOR}${rightPart}`;
    el.innerText = final;
  } else {
    el.innerText = text;
  }
}

let handleResize;

const GTextMiddleEllipsis = {
  bind: (el, { value }) => {
    const originalText = el.innerText;
    el.setAttribute('data-middle-ellipsis-original', originalText.trim());
    el.setAttribute('title', originalText.trim());
    handleResize = debounce(() => {
      zipText(el, { value });
    }, 300);
    window.addEventListener('resize', handleResize);
  },
  inserted: zipText,
  update: zipText,
  unbind: () => {
    window.removeEventListener('resize', handleResize);
  },
  install(Vue) {
    Vue.directive('text-middle-ellipsis', GTextMiddleEllipsis);
  },
};

export { GTextMiddleEllipsis };
