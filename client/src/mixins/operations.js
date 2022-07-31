import { mapGetters, mapActions, mapMutations } from "vuex";
const themeIconMap = {
  light: "icon-qiansemoshi",
  dark: "icon-shensemoshi",
};
const operations = {
  data() {
    return {
      editorBtnList: [
        {
          name: "保存",
          iconClass: "iconfont icon-baocun",
          click: () => this.save(),
          disabled: () => this.noNeedBeSave,
          reason: "无变更需要保存",
        },
        {
          name: "上一步",
          iconClass: "iconfont icon-houtui-shi",
          click: () => this.undo(),
          disabled: () => !this.canUndo,
          reason: "没有上一步了~",
        },
        {
          name: "下一步",
          iconClass: "iconfont icon-qianjin-shi",
          click: () => this.redo(),
          disabled: () => !this.canRedo,
          reason: "已经是最后一步了",
        },
        {
          name: "发布",
          iconClass: "iconfont icon-fabu",
          disabled: () => this.noElement,
          reason: "没有可发布的内容",
          click: row => this.$refs["publish-dialog"].show(row),
        },
        {
          name: "预览",
          iconClass: "iconfont icon-yulan",
          click: row => this.preview(),
        },
      ],
    };
  },
  computed: {
    ...mapGetters("history", ["noNeedBeSave", "canRedo", "canUndo"]),
    ...mapGetters("editor", ["noElement"]),
    ...mapGetters("common", { theme: "getTheme" }),
    id() {
      return this.$route?.query?.id;
    },

    commonBtnList() {
      return [
        {
          name: "切换主题",
          iconClass: "iconfont " + themeIconMap[this.theme],
          click: () => this.switchTheme(),
        },
      ];
    },
  },
  methods: {
    ...mapActions("editor", ["saveData"]),
    ...mapActions("history", { undo: "undo", redo: "redo" }),
    ...mapActions("common", ["updateTheme"]),

    async save() {
      await this.saveData();
      this.$message.success("保存成功！");
    },
    switchTheme() {
      const themeList = Object.keys(themeIconMap);
      const index = themeList.findIndex(e => e === this.theme);
      this.updateTheme(themeList[index ^ 1]);
    },
    preview() {
      this.$router.push({
        name: "preview",
        query: {
          id: this.id,
        },
      });
    },
  },
};

export default operations;
