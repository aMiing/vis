let observer;

let style;

function setStyle(el, value, isHover) {
  style = {};
  Object.entries(value).forEach(([key, val]) => {
    const [cssvar, opacity] = val;
    const opacityStr = Math.ceil(255 * opacity).toString(16);
    const color = window.getComputedStyle(document.documentElement).getPropertyValue(cssvar).trim();
    style[key] = color + opacityStr;
  });

  if (isHover) {
    el.addEventListener('mouseover', handleMouseOver);
    el.addEventListener('mouseout', handleMouseOut);
  } else {
    Object.assign(el.style, style);
  }
}

function handleMouseOver(e) {
  if (style) Object.assign(e.currentTarget.style, style);
}

function handleMouseOut(e) {
  if (style) {
    Object.keys(style).forEach(key => {
      e.currentTarget.style[key] = '';
    });
  }
}

const GHyalinizedCssvarStyle = {
  bind: (el, { value, modifiers }) => {
    let cacheTheme = document.documentElement.getAttribute('theme');
    value = value || {};
    const { hover } = modifiers;
    setStyle(el, value, hover);
    observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes') {
          let theme = document.documentElement.getAttribute('theme');
          if (cacheTheme === theme) return;
          cacheTheme = theme;
          setStyle(el, value, hover);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
  },
  unbind(el, { modifiers }) {
    if (observer) {
      observer.disconnect();
      observer = null;
    }

    if (modifiers.hover) {
      el.removeEventListener('mouseover', handleMouseOver);
      el.removeEventListener('mouseout', handleMouseOut);
      style = null;
    }
  },
  install(Vue) {
    Vue.directive('hyalinized-cssvar-style', GHyalinizedCssvarStyle);
  },
};

export { GHyalinizedCssvarStyle };
