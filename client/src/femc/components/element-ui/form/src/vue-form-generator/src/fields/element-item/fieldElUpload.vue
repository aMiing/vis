<template>
  <div class="chunk-upload-module">
    <chunk-upload
      :key="'chunk-upload-module' + schema.id"
      :disabled="disabled"
      :upload-opts="uploadOptions"
      @uploading-status="handleUploadingStatus"
      @file-remove="handleFileRemove"
      @beforeUpload="handleBeforeUpload"
      @successUpload="handleSuccessUpload"
    >
      <template v-if="uploadOptions.descInfo" slot="info">
        <p class="upload-desc">
          <span>{{ uploadOptions.descInfo }} </span>
        </p>
      </template>
    </chunk-upload>
    <p v-if="pathName && !pathName.hidden" style="text-align: center; margin-top: -80px">
      {{ pathName.formatter(value) }}
    </p>
  </div>
</template>
<script>
import abstractField from '../abstractField';
import chunkUpload from './chunk-upload';
export default {
  components: {
    chunkUpload,
  },
  mixins: [abstractField],
  data() {
    return {};
  },
  computed: {
    pathName() {
      return this.schema.pathName;
    },
    uploadOptions() {
      return Object.assign(
        {
          chunkSpliceSize: '1G',
          maxUploadFileSize: '100M',
          descInfo: '',
          fileTypes: '',
          options: {
            action: '',
            'auto-upload': true,
            limit: 1,
          },
        },
        this.schema.uploadOptions || {}
      );
    },
  },
  methods: {
    handleUploadingStatus(val) {
      this.schema.uploadingStatus && this.schema.uploadingStatus(val);
    },
    handleFileRemove() {
      this.schema.remove && this.schema.remove();
    },
    handleSuccessUpload({ filePath }) {
      this.schema.success && this.schema.success(filePath || {});
    },
    handleBeforeUpload(/*value*/) {
      // this.$emit('handleBeforeUpload', value)
    },
  },
};
</script>
<style lang="scss" scoped>
.chunk-upload-module {
  width: 100%;
  min-height: 100px;
  margin: 0px auto 0px auto;
  padding: 20px 15px 20px;
  text-align: center;
  border: 1px var(--grey-10) dashed;
  .upload-desc {
    text-align: center;
    font-size: 14px;
    margin-top: 10px;
  }
}
</style>
