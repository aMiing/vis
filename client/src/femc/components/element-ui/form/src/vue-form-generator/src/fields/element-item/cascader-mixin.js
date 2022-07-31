export default {
  data() {
    return {
      removeNode: null,
    };
  },
  computed: {
    options: {
      get: function () {
        const _options = this.getOptions(this.schema.values);
        return _options;
      },
    },
    selectOptions() {
      return this.schema.selectOptions || {};
    },
    showAllLevels() {
      return this.selectOptions.showAllLevels instanceof Boolean
        ? this.selectOptions.showAllLevels
        : true;
    },
    props() {
      return {
        ...this.selectOptions,
        emitPath:
          this.selectOptions.emitPath instanceof Boolean ? this.selectOptions.emitPath : true,
      };
    },
  },
  methods: {
    // 将最后一层节点的空children数组设置为null
    handlerTreeData(data) {
      if (!data) return;
      const children = this.selectOptions.children;
      for (let i = 0; i < data.length; i++) {
        if (data[i][children] && data[i][children].length < 1) {
          data[i][children] = undefined;
          if (this.selectOptions.disableLeaf) {
            data[i].disabled = true;
          }
        } else if (data[i][children]) {
          this.handlerTreeData(data[i][children]);
        } else {
          if (this.selectOptions.disableLeaf) {
            data[i].disabled = true;
          }
        }
      }
      return data;
    },
    handleChange() {
      (((this.$refs.cascader || {}).$refs || {}).panel || {}).$emit('close');
    },
  },
};
