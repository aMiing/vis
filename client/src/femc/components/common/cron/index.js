import GCron from './cron.vue';

GCron.install = Vue => {
  Vue.component(GCron.name, GCron);
};

export { GCron };
