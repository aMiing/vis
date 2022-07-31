import GMessageBox from './src/main.js';
import './style/index.scss';

GMessageBox.install = function (Vue) {
  Vue.prototype.$confirm = GMessageBox.confirm;
};
export { GMessageBox };
