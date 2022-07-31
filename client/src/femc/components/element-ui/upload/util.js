const controller = new AbortController();
export class Scheduler {
  constructor(limit) {
    this.limit = limit;
    this.number = 0;
    this.queue = [];
  }
  addTask(func, data, callback) {
    this.queue.push([func, data, callback]);
  }
  start() {
    if (this.number < this.limit && this.queue.length) {
      const [func, data, callback] = this.queue.shift();
      this.number++;
      func(data, {
        signal: controller.signal,
      }).then(res => {
        callback(res);
        this.number--;
        this.start();
      });
      this.start();
    }
  }
  stop() {
    controller.abort();
    this.number = 0;
    this.queue = [];
  }
}

export function calculateSize(opt) {
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
}
