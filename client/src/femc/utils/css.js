import Vue from 'vue';

function getCssvar(cssvar) {
  return window.getComputedStyle(document.documentElement).getPropertyValue(cssvar).trim();
}

function getTheme() {
  let theme = document.documentElement.getAttribute('theme').trim();
  return theme === 'light' ? 'light' : 'dark';
}

let observer;

function createObserver(notify) {
  if (observer) return;
  let cacheTheme = getTheme();

  observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'attributes') {
        let theme = getTheme();
        if (cacheTheme === theme) return;
        cacheTheme = theme;
        notify();
      }
    });
  });

  observer.observe(document.documentElement, { attributes: true });
}

const cache = Vue.observable({
  dark: {},
  light: {},
  data: {},
});

export function getComputedCssVar(cssvar, opacity) {
  createObserver(() => {
    const theme = getTheme();
    cache.data = cache[theme];
  });

  const key = opacity ? `${cssvar}_${opacity}` : cssvar;
  const { data } = cache;
  if (data[key]) return data[key];
  let opacityStr = '';
  if (opacity) opacityStr = Math.ceil(255 * opacity).toString(16);

  const color = getCssvar(cssvar);
  const result = color + opacityStr;
  Vue.set(data, key, result);

  return data[key];
}
