import GCard from './src/card.vue';
import GCardList from './src/card-list.vue';

import './style/index.scss';

GCard.install = Vue => {
  Vue.component(GCard.name, GCard);
};

GCardList.install = Vue => {
  Vue.component(GCardList.name, GCardList);
};

export { GCard, GCardList };
