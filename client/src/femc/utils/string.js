export function getActualWidthOfChars(text, options = {}) {
  const { size = 14, family = 'Microsoft YaHei' } = options;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = `${size}px ${family}`;
  const metrics = context.measureText(text);
  return metrics.width;
}

export function zipText(text, width, options = {}) {
  const { end = 0, font } = options;
  const defaultFont = { size: 14, family: 'Microsoft YaHei' };
  const mergedFont = { ...defaultFont, ...font };
  const actualWidth = getActualWidthOfChars(text, mergedFont);
  if (actualWidth <= width) return text;
  const len = text.length;
  const separator = '...';
  const rightPart = text.slice(len - end);
  const rightPartWidth = getActualWidthOfChars(separator + rightPart, mergedFont);

  let availableLeftWidth = Math.round(width - rightPartWidth);
  let final = '';
  let charIndex = 0;
  while (availableLeftWidth > 0) {
    const char = text[charIndex];

    let charWidth = getActualWidthOfChars(char, mergedFont);

    if (availableLeftWidth - charWidth < 0) {
      break;
    }

    final += char;
    availableLeftWidth -= charWidth;
    charIndex += 1;
  }
  final += `${separator}${rightPart}`;

  return final;
}
