<template>
  <li class="g-card" :class="`--${status}`">
    <div class="g-card__header">
      <div class="g-card__title-wrapper">
        <el-tooltip effect="dark" :content="title">
          <div class="g-card__title">{{ title }}</div>
        </el-tooltip>
        <div v-if="hasExtra" class="g-card__title-extra">
          <slot v-if="$slots.extra" name="extra" />
          <template v-else-if="extra">
            <g-badge :status="extra.status || status" :text="extra.text || extra" />
          </template>
        </div>
      </div>
      <div v-if="hasMeta1st" class="g-card__meta-wrapper" :class="getMetaClass(meta1st)">
        <slot v-if="$slots.meta1st" name="meta1st" />
        <template v-else>
          <span v-if="meta1st.left" class="g-card__text">{{ meta1st.left }}</span>
          <span v-if="meta1st.right" class="g-card__text">{{ meta1st.right }}</span>
        </template>
      </div>
      <div v-if="hasMeta2nd" class="g-card__meta-wrapper" :class="getMetaClass(meta2nd)">
        <slot v-if="$slots.meta2nd" name="meta2nd" />
        <template v-else>
          <span v-if="meta2nd.left" class="g-card__text">{{ meta2nd.left }}</span>
          <span v-if="meta2nd.right" class="g-card__text">{{ meta2nd.right }}</span>
        </template>
      </div>
    </div>
    <div class="g-card__body">
      <g-empty
        v-if="img && img.type === 'none'"
        size="64"
        :img="img.src || '模型为空'"
        :description="img.title"
      />
      <g-image v-else :src="img" fit="scale-down">
        <template #placeholder>
          <g-empty
            size="64"
            :img="img.src || '图片加载中'"
            :description="img.title || '图片加载中'"
          />
        </template>
        <template #error>
          <g-empty size="64" :img="img.src || '模型为空'" :description="img.title" />
        </template>
      </g-image>
      <slot name="operator" />
    </div>
  </li>
</template>

<script>
import { GBadge } from '../../../element-ui/badge';
import GImage from './image';

export default {
  name: 'GCard',
  components: {
    GBadge,
    GImage,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    extra: {
      type: [Boolean, String, Object],
      default: '',
    },
    meta1st: Object,
    meta2nd: Object,
    status: {
      type: String,
      validator(val) {
        return ['success', 'processing', 'default', 'fail', 'pending'].indexOf(val) > -1;
      },
      default: 'default', // success|processing|fail|default|pending
    },
    img: { type: [Object, String], default: '' },
    empty: {
      type: [Boolean, Object],
      default: false,
    },
  },
  computed: {
    hasExtra() {
      return this.$slots.extra || this.status;
    },
    hasMeta1st() {
      return this.$slots.meta1st || this.meta1st;
    },
    hasMeta2nd() {
      return this.$slots.meta2nd || this.meta2nd;
    },
  },
  methods: {
    getMetaClass(item) {
      if (item) {
        if (item.left && !item.right) {
          return '--tl';
        } else if (!item.left && item.right) {
          return '--tr';
        }
      }

      return '';
    },
  },
};
</script>
