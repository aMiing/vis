import GBadge from './src/main';
import './style/index.scss';

/* istanbul ignore next */
GBadge.install = function (Vue) {
  Vue.component(GBadge.name, GBadge);
};

export { GBadge };
