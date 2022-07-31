<template>
  <transition name="el-loading-fade" @after-leave="handleAfterLeave">
    <div
      v-show="visible"
      class="el-loading-mask"
      :style="{ backgroundColor: background || '' }"
      :class="[customClass, { 'is-fullscreen': fullscreen }]"
    >
      <div class="el-loading-spinner --cover">
        <img
          draggable="false"
          :class="[`el-loading-${type}`, { '--small': small }]"
          :src="imgUrl"
          alt="loading"
        />
        <p v-if="text" class="el-loading-text">{{ text }}</p>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      text: null,
      spinner: null,
      background: null,
      fullscreen: true,
      visible: false,
      customClass: '',
      page: false,
      waiting: false,
      computing: false,
      small: false,
    };
  },
  computed: {
    type() {
      if (this.page) return 'page';
      if (this.waiting) return 'waiting';
      if (this.computing) return 'computing';
      return 'default';
    },
    imgUrl() {
      const ext = this.type === 'default' ? 'gif' : 'png';
      return require(`./img/${this.type}.${ext}`);
    },
  },
  methods: {
    handleAfterLeave() {
      this.$emit('after-leave');
    },
    setText(text) {
      this.text = text;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-loading {
  @mixin common($size) {
    user-select: none;
    object-fit: cover;
    width: $size;
    height: $size;
  }

  &-default {
    @include common(60px);
  }

  &-page {
    @include common(100px);
  }

  &-waiting {
    @include common(160px);

    &.--small {
      @include common(64px);
    }
  }

  &-computing {
    @include common(160px);

    &.--small {
      @include common(64px);
    }
  }

  &-spinner.--cover {
    margin-top: 0;
    transform: translateY(-50%);
  }
}
</style>
