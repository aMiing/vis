<template>
  <el-upload
    ref="upload"
    action=""
    :on-exceed="handleFileLimit"
    :on-remove="handleFileRemove"
    :on-change="handleFileChange"
    :on-error="handleFileError"
    :http-request="handleHttpRequest"
    :file-list="fileList"
    :accept="accept"
    :disabled="disabled"
    :auto-upload="false"
    :limit="1"
    v-bind="options"
  >
    <slot />
  </el-upload>
</template>
<script>
import { Scheduler, calculateSize } from './util';
import SparkMD5 from 'spark-md5';
export default {
  name: 'GUpload',
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
    accept: {
      type: String,
      default: '',
    },
    spliceSize: {
      type: String,
      default: '5M',
    },
    maxSize: {
      type: String,
      default: '1G',
    },
    md5Func: {
      type: Function,
      default: () => {
        return 0;
      },
    },
    postFileFunc: {
      type: Function,
      default: () => {
        return 0;
      },
    },
    fileList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    concurrentLimit: {
      type: Number,
      default: 4,
    },
  },
  data() {
    return {
      fileMd5: '', // 计算的md5，用来确认唯一
      filePath: '', //返回的路径
      isRemove: false, //是否被删除的状态位
      currentChunk: 0, //当前切片
      chunkTotal: 0, //切片总数
      percentage: 0, //进度条
      chunkSpliceSize: 5 * 1024 * 1024, // 默认分片大小
      maxUploadFileSize: 1024 * 1024 * 1024, // 最大的上传文件的大小,默认1G
      chunkList: [], // 缓存分片
      existChunks: [], //断点续传的切片
      fileName: '', // 用做展示的名字
      scheduler: null, //并发调度器
    };
  },
  created() {
    this.scheduler = new Scheduler(this.concurrentLimit);
    this.chunkSpliceSize = calculateSize(this.spliceSize);
    this.maxUploadFileSize = calculateSize(this.maxSize);
  },
  destroyed() {
    this.handleFileRemove();
  },
  methods: {
    handleHttpRequest(options) {
      if (!options.file) return;
      // 切片前显示出进度条
      options.onProgress({ percent: this.percentage });
      this._sliceChunk(options.file); // 文件分片函数
      try {
        if (this.chunkList.length === this.existChunks.length) {
          this.handleFileSuccess();
          // 将文件设置为上传成功状态
          options.onSuccess();
        } else {
          this._uploadLoop(options);
          this.scheduler.start();
        }
      } catch (err) {
        console.log(err);
        options.onError(err);
      }
    },
    // 上传失败时
    handleFileError(err, file) {
      console.log(err);
      this.$confirm('意外中断，是否继续上传？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this._computeMD5(file);
        })
        .catch(() => {
          this.handleFileRemove();
        });
    },
    // 计算md5
    _computeMD5(file) {
      this.isRemove = false;
      this.fileName = file.name;
      const fileReader = new FileReader();
      //此处打印file可看到file下的raw为文件属性
      const dataFile = file.raw;
      const spark = new SparkMD5.ArrayBuffer();
      //获取文件二进制数据
      fileReader.readAsArrayBuffer(dataFile);

      //异步执行函数
      fileReader.onload = async e => {
        spark.append(e.target.result);
        // 通过md5实现断点续传
        this.fileMd5 = spark.end();
        const { existChunks, filePath } = await this.md5Func(this.fileMd5);
        if (filePath) {
          this.handleFileSuccess();
          // 将文件设置为上传成功状态
          const that = this.$refs.upload;
          that.handleSuccess(null, that.uploadFiles[0]);
        } else {
          this.existChunks = existChunks;
          this.$refs.upload.submit();
        }
      };
    },
    // 分片切割
    _sliceChunk(file) {
      const totalSize = file.size; // 文件总大小
      this.chunkTotal = Math.max(1, Math.ceil(totalSize / this.chunkSpliceSize)); // totalPart 向上取整
      let start = 0; // 每次上传的开始字节
      let end = start + this.chunkSpliceSize; // 每次上传的结尾字节
      while (start < totalSize) {
        // 根据长度截取每次需要上传的数据
        // File对象继承自Blob对象，因此包含slice方法
        const blob = file.slice(start, end);
        this.chunkList.push(blob);
        start = end;
        end = start + this.chunkSpliceSize;
      }
    },
    // 改变进度条
    _percentageChange(options) {
      try {
        this.percentage = this.percentage + Number((100 / this.chunkTotal).toFixed(1));
        options.onProgress({ percent: this.percentage });
      } catch (error) {
        console.log('停止上传' + error);
      }
    },
    // 循环上传函数
    _uploadLoop(options) {
      if (this.existChunks.includes(this.currentChunk)) {
        // 如果已经上传过了，则跳到下一个
        this.currentChunk++;
        this._percentageChange(options);
        this._uploadLoop(options);
        return;
      }
      if (this.currentChunk >= this.chunkTotal || this.filePath) {
        return;
      }
      const formdata = new FormData();
      formdata.append('chunk', this.currentChunk);
      formdata.append('chunkTotal', this.chunkTotal);
      formdata.append('fileMd5', this.fileMd5);
      formdata.append('file', this.chunkList[this.currentChunk]);

      this.scheduler.addTask(this.postFileFunc, formdata, res => {
        this._percentageChange(options);
        if (res) {
          this.filePath = res;
          options.onSuccess();
          this.handleFileSuccess();
        }
      });
      this.currentChunk++;
      this._uploadLoop(options);
    },

    // 文件上传数量限制
    handleFileLimit() {
      this.$message({
        message: `最多只能上传1个文件,请先移除已有文件，再上传`,
        type: 'error',
      });
    },

    // 删除文件
    handleFileRemove() {
      // 停止请求
      this.scheduler.stop();
      this.$refs.upload?.abort();
      this.$refs.upload?.clearFiles();
      // 初始化数据
      this.isRemove = true;
      this.chunkList = [];
      this.filePath = '';
      this.currentChunk = 0;
      this.chunkTotal = 0;
      this.fileMd5 = '';
      this.percentage = 0;
      this.existChunks = [];
      // 事件抛出
      this.$emit('file-remove');
      this.$forceUpdate();
    },

    // 文件校验
    handleFileChange(file) {
      if (file.status === 'ready') {
        const maxSize = this.maxUploadFileSize;
        if (file.size > maxSize) {
          this.$message({
            message: `请上传大小不超过${this.maxSize}的文件`,
            type: 'error',
          });
          this.$refs.upload?.clearFiles();
        } else {
          this._computeMD5(file);
        }
      }
    },
    // 上传成功
    handleFileSuccess(filePath) {
      if (this.isRemove) return this.handleFileRemove();
      // 上传成功后的操作
      this.$emit('on-success', { filePath, fileMd5: this.fileMd5, fileName: this.fileName });
    },
  },
};
</script>
