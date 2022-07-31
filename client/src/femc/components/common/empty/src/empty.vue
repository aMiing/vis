<template>
  <div class="g-empty">
    <div
      :class="{
        [`h-breakpoint--${size}`]: size !== 'fit',
        'has-title': hasTitle || title,
        'has-description': hasDescription || description,
      }"
      class="g-empty__wrapper"
    >
      <template v-if="hasDefault">
        <slot />
      </template>
      <template v-else>
        <div :class="`g-empty-${placement}__wrapper`">
          <slot v-if="hasImg" name="img" class="g-empty__content" :style="customStyle" />
          <img
            v-else-if="img"
            :src="imgSrc"
            alt="空状态"
            class="g-empty__content"
            :style="customStyle"
          />
          <div class="g-empty__text">
            <p
              v-if="hasTitle && (type === 'md' || type === 'lg')"
              class="g-empty__info g-empty__title"
              :class="{ 'align-center': placement === 'bottom' }"
            >
              <slot name="title" />
            </p>
            <p
              v-else-if="title"
              class="g-empty__info g-empty__title"
              :class="{ 'align-center': placement === 'bottom' }"
              v-text="title"
            />
            <p
              v-if="hasDescription"
              class="g-empty__info g-empty__description"
              :class="{ 'align-center': placement === 'bottom' }"
            >
              <slot name="description" />
            </p>
            <p
              v-else-if="description"
              class="g-empty__info g-empty__description"
              :class="{ 'align-center': placement === 'bottom' }"
              v-text="description"
            />
            <p
              v-if="hasButtons"
              class="g-empty__info g-empty__buttons"
              :class="{ 'align-center': placement === 'bottom' }"
            >
              <slot name="buttons" />
            </p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GEmpty',
  inject: {
    injectTheme: {
      type: Function,
      default: () => 'dark',
    },
  },
  props: {
    size: {
      type: [String, Number],
      default: 'lg',
    },
    img: {
      type: String,
      default: '搜索无结果',
      validator(value) {
        const preset = [
          'svg404',
          '404',
          '洞察中', // TODO,视觉更新规规范，待删除
          '洞察失败',
          '计算超时',
          '计算中',
          '加载失败',
          '角色无权限',
          '禁止编辑',
          '空状态',
          '模型为空',
          '上传文件',
          '升级中',
          '搜索无结果',
          '提交成功',
          '图片加载中',
          '网络异常',
        ];
        return preset.includes(value);
      },
    },
    title: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    placement: {
      type: String,
      default: 'bottom',
    },
  },
  data: function () {
    return {
      type: 'md',
    };
  },
  computed: {
    imgSrc() {
      const img = this.img === 'svg404' ? '404' : this.img;
      const zh2CnMap = {
        404: 'not-found',
        洞察中: 'insight',
        计算超时: 'overtime',
        计算中: 'calculating',
        加载失败: 'load-fail',
        洞察失败: 'insight-fail',
        角色无权限: 'no-permission',
        禁止编辑: 'no-edit',
        空状态: 'empty',
        模型为空: 'model-empty',
        上传文件: 'upload-file',
        升级中: 'upgrading',
        搜索无结果: 'no-result',
        提交成功: 'submit-success',
        图片加载中: 'loading-img',
        网络异常: 'network-anomaly',
      };
      const name = zh2CnMap[img] || zh2CnMap['no-result'];
      return require(`./${this.theme}/${name}.svg`);
    },
    hasDefault() {
      return this.$slots.default;
    },
    hasImg() {
      return this.$slots.img;
    },
    hasTitle() {
      return this.$slots.title;
    },
    hasDescription() {
      return this.$slots.description;
    },
    hasButtons() {
      return this.$slots.buttons;
    },
    theme() {
      return typeof this.injectTheme === 'function' ? this.injectTheme() : this.injectTheme;
    },
    customStyle() {
      return isNaN(this.size) ? '' : `with:${this.size}px;height:${this.size}px;`;
    },
  },
  watch: {
    size: {
      immediate: true,
      handler(val) {
        this.type = val;
      },
    },
  },
};
</script>
