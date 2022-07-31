import { mapActions, mapMutations, mapGetters } from 'vuex';
import localforage from 'localforage';
import { panelService } from '@/service';
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters('editor', { screen: 'screenData', elements: 'getElements' }),
  },
  async mounted() {},
  methods: {
    ...mapMutations('history', ['startRecordHistory']),
    ...mapMutations('editor', ['updateId', 'useElements', 'useScreen']),
    async fetchData(id) {
      const data = this.$GLOBAL?.useLocal
        ? await localforage.getItem(id)
        : await panelService.getEditorData({ id }).then(res => (res?.data ? res.data[0] : {}));
      const { style, elements } = data;
      style && this.useScreen(JSON.parse(style));
      elements && this.useElements(JSON.parse(elements));
    },
  },
};
