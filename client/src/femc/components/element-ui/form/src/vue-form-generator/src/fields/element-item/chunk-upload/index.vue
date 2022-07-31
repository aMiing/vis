<template>
  <div class="chunk-upload">
    <el-upload
      ref="upload"
      :on-exceed="fileLimit"
      :on-remove="fileRemove"
      :on-change="fileChange"
      :file-list="fileList"
      :before-upload="beforeAvatarUpload"
      :http-request="uploadFunc"
      :accept="accept"
      :disabled="disabled"
      :auto-upload="false"
      v-bind="uploadOpts.options"
    >
      <!-- <div class="el-upload__tip">
        <span class="el-upload__tip">注：</span><br>
        <span>支持直接上传{{uploadOpts.options.limit}}个{{uploadOpts.fileTypes}}格式文件</span><br>
        <span>单个文件大小不超过1G。</span>
      </div> -->
      <template v-if="!uploading">
        <el-image class="img" :src="uploadImg"></el-image>
        <div class="ele-submit-btn__wrap">
          <span :disabled="disabled || uploading">点击上传文件 </span>
        </div>
        <slot name="info"></slot>
      </template>
    </el-upload>
  </div>
</template>
<script>
let componentIsActive; // 检测组件是否可用, 用来修复  http://pm.getui.net:8090/zentao/bug-view-7070.html  如果在同一页面使用多个改组件这个值会出现共用的问题
export default {
  props: {
    uploadOpts: {
      type: Object,
      default: () => ({}),
    },
    serviceId: {
      type: String,
      default: () => '',
    },
    disabled: Boolean,
  },
  data() {
    return {
      source: null,
      fileVaild: true, // 判断上传的文件是否合法
      file_path: '',
      isRemove: false,
      timer: null,
      uploadId: null, // 该上传的文件的专属ID,用来区分分片属于哪个文件
      uploading: false, // 文件上传状态
      currentStart: 0,
      currentIndex: 0,
      chunkCount: 0,
      fileName: '',
      chunkSpliceSize: 1024 * 1024 * 1024, // 默认分片大小1G
      maxUploadFileSize: 1024 * 1024 * 100, // 最大的上传文件的大小,默认100M
      fileList: [],
      chunkList: [], // 缓存分片
      uploadImg: require('./upload.png'),
    };
  },
  computed: {
    accept() {
      return this.uploadOpts.fileTypes.replace(/\//g, ',');
    },
  },
  watch: {
    // 传出上传的状态
    uploading(val) {
      this.$emit('uploading-status', val);
    },
    // 传出表单验证的状态
    fileVaild(val) {
      this.$emit('vaild-change', val);
    },
  },

  created() {
    this.chunkSpliceSize = this.calculateSize(this.uploadOpts.chunkSpliceSize);
    this.maxUploadFileSize = this.calculateSize(this.uploadOpts.maxUploadFileSize);
    componentIsActive = true;
  },
  mounted() {
    // 改写上传组件上传进度方法，最多显示99%
    this.$refs.upload.$children[1].parsePercentage = val => {
      const percent = parseInt(val, 10);
      return percent > 99 ? 99 : percent;
    };
  },
  destroyed() {
    this.source && this.source.cancel('Operation canceled by the user.');
    componentIsActive = false;
  },
  methods: {
    beforeAvatarUpload() {
      this.$emit('beforeUpload');
    },
    uploadFunc(options) {
      if (this.uploading || !options.file) return;
      this.uploading = true;
      this.isRemove = false;

      this.sliceChunk(options.file); // 文件分片函数
      this.uploadLoop(options);
    },

    // 分片切割
    sliceChunk(file) {
      const totalSize = file.size;
      this.chunkCount = Math.max(1, Math.ceil(totalSize / this.chunkSpliceSize)); // totalPart 向上取整
      this.fileName = file.name;

      for (let chunkIndex = 0, start = 0; chunkIndex < this.chunkCount; chunkIndex++) {
        const computedEnd = start + this.chunkSpliceSize;
        const amendEnd = computedEnd < totalSize ? computedEnd : totalSize;
        const chunkSize = amendEnd - start;

        this.chunkList.push({
          start,
          end: amendEnd,
          chunkIndex,
          chunkSize,
        });
        start = amendEnd;
      }
    },
    postFile(param, onProgress) {
      onProgress({
        total: 100,
        loaded: 1,
        get percent() {
          return (this.loaded / this.total) * 100;
        },
      });
      const config = {
        onUploadProgress: progressEvent => {
          const customEvent = {
            total: progressEvent.total,
            loaded: progressEvent.loaded,
            get percent() {
              return (this.loaded / this.total) * 100;
            },
          };
          onProgress(customEvent);
        },
      };
      return this.uploadOpts.options.axios
        .post(this.uploadOpts.options.action, param, config)
        .then(response => {
          return response;
        })
        .catch(res => {
          this.$message.error(res || '文件上传失败');
        });
    },
    // 循环上传函数
    async uploadLoop(options) {
      const { file, onProgress, onSuccess, onError } = options;
      if (this.currentIndex >= this.chunkCount) {
        window.clearTimeout(this.timer);
        // this.uploadId = null
        this.fileSuccess(this.file_path, file, onSuccess);
        return;
      }
      const { start, end } = this.chunkList[this.currentIndex];
      // const piece = fileSlice(file, start, end)

      try {
        const formdata = new FormData();
        formdata.append('file', file);
        this.source = this.uploadOpts.options.CancelToken.source();
        const data = await this.postFile(formdata, onProgress);
        if (!data) {
          const el = this.$refs.upload.$el.querySelector('.el-upload-list__item');
          el.style.display = 'none';
          this.uploading = false;
          this.fileRemove();
          return;
        }
        this.file_path = data;
        this.currentStart = start;
        // this.currentIndex = data.nextIndex ? data.nextIndex : this.currentIndex + 1
        this.currentIndex = this.currentIndex + 1;
        // this.uploadId = data.uploadId
        window.clearTimeout(this.timer);
        // 进度条显示
        const customEvent = {
          total: file.size,
          loaded: end,
          get percent() {
            return 100;
          },
        };
        // 显示文件大小
        this.fileInProgress({
          total: file.size,
          piece: end,
        });

        onProgress(customEvent);
        this.timer = setTimeout(() => this.uploadLoop(options), 500);
      } catch (error) {
        console.log(error);
        this.uploading = false;
        this.fileVaild = false;

        if (this.isRemove) return this.fileRemove();

        if (!componentIsActive) return;

        this.$confirm('意外中断，是否继续上传？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.fileVaild = true;
            this.uploading = false;
            this.uploadLoop(options);
          })
          .catch(() => {
            onError(error);
            this.fileRemove();
          });
      }
    },

    // 文件上传数量限制
    fileLimit() {
      this.$message({
        message: `最多只能上传${this.uploadOpts.options.limit}个文件,请先移除已有文件，再上传`,
        type: 'error',
      });
    },

    // 删除文件
    fileRemove() {
      this.source && this.source.cancel('Operation canceled by the user.');
      this.isRemove = true;
      this.$refs.upload.clearFiles();
      this.fileVaild = false;
      this.chunkList.length = 0;
      this.file_path = '';
      this.uploading = false;
      this.currentStart = 0;
      this.currentIndex = 0;
      this.chunkCount = 0;
      this.fileName = '';
      this.uploadId = null;
      this.$emit('file-remove');
      this.$forceUpdate();
    },

    // 文件校验
    fileChange(file, fileList) {
      const maxSize = this.maxUploadFileSize;
      const types = this.uploadOpts.fileTypes.split('/');

      let filterTypes = '(' + types[0] + ')';
      for (let i = 1; i < types.length; i++) {
        filterTypes += '|(' + types[i] + ')';
      }

      let uploadDisabled = false;
      const ft = new RegExp('^.+(' + filterTypes + ')$', 'i');
      fileList
        .filter(item => item.status === 'ready')
        .forEach(item => {
          if (item.size > maxSize || !ft.test(item.name)) {
            uploadDisabled = true;
            this.$message({
              message: `请上传大小不超过${this.uploadOpts.maxUploadFileSize}的${this.uploadOpts.fileTypes}文件`,
              type: 'error',
            });
            this.$refs.upload.clearFiles();
            this.fileVaild = false;
          }
        });
      if (!uploadDisabled) {
        this.startUpload();
      }
    },

    // 开始上传
    startUpload() {
      this.fileVaild = true;
      this.$refs.upload.submit();
    },

    // 上传过程中，显示文件大小
    fileInProgress(file) {
      const size = this.formatSize(file.total);
      if (!this.$refs.upload.$el) return;
      const el = this.$refs.upload.$el.querySelector('.el-upload-list__item-name');
      const sizeNotice = el.querySelector('.size-notice');

      if (!sizeNotice) {
        const newNode = document.createElement('span');
        newNode.setAttribute('class', 'size-notice');
        newNode.innerHTML = size;
        el.appendChild(newNode);
      }
    },

    formatSize(file) {
      let size = null;
      if (file < 1024) {
        size = file + 'Byte';
      } else if (file < 1024 * 1024) {
        size = (file / 1024).toFixed(2) + 'KB';
      } else if (file < 1024 * 1024 * 1024) {
        size = (file / 1024 / 1024).toFixed(2) + 'MB';
      } else {
        size = (file / 1024 / 1024 / 1024).toFixed(2) + 'GB';
      }
      return size;
    },

    // 计算文件大小
    calculateSize(opt) {
      let fileSize = null;
      const size = opt.replace(/[^\d]/g, '');
      const type = opt.replace(/[^a-zA-Z]/g, '');
      if (type === 'Byte' || type === 'B' || type === 'b' || '') {
        fileSize = size;
      } else if (type === 'KB' || type === 'kb' || type === 'K' || type === 'k') {
        fileSize = size * 1024;
      } else if (type === 'MB' || type === 'mb' || type === 'M' || type === 'm') {
        fileSize = size * 1024 * 1024;
      } else if (type === 'GB' || type === 'gb' || type === 'G' || type === 'g') {
        fileSize = size * 1024 * 1024 * 1024;
      }
      return fileSize;
    },

    // 上传成功
    fileSuccess(filePath, file, onSuccess) {
      if (this.isRemove) return this.fileRemove();
      this.fileVaild = true;
      this.$emit('successUpload', { filePath, file });
      // 上传成功后的操作
      onSuccess();
    },
  },
};
</script>
<style lang="scss">
.chunk-upload {
  text-align: center;
  .img {
    width: 40px;
    height: 40px;
  }
  .el-upload__tip {
    line-height: 1.4;
    margin-top: 0;
    color: #ccc;
    text-align: left;

    .el-upload__tip-span {
      margin-top: 7px;
    }
  }
  .el-upload-list__item-name {
    margin-right: 105px;
    text-align: left;
    margin-left: 10px;
    .size-notice {
      position: absolute;
      right: 45px;
    }
  }
  .el-upload-list__item .el-progress {
    background: transparent !important;
    vertical-align: middle !important;
    margin: 0px;
  }

  .el-upload-list__item .el-progress-bar {
    margin: 0 !important;
    padding: 0px 60px 0px 10px !important;
    height: 8px !important;
  }

  .el-progress-bar__outer {
    height: 8px !important;
  }
  .el-upload-list__item:hover .el-progress__text {
    display: inline;
  }
  .el-progress__text {
    top: 3px !important;
    margin-right: 10px !important;
    margin-left: 0px !important;
  }
}
</style>
