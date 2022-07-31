const PUBLISHED = {
  text: '已发布',
  value: 0,
};
const ONUNCHECKED = {
  text: '上架待审核',
  value: 1,
};
const OFFUNCHECKED = {
  text: '下架待审核',
  value: 2,
};

const ONUNPASSED = {
  text: '发布已拒绝',
  value: 10,
};
const OFFUNPASSED = {
  text: '下架已拒绝',
  value: 20,
};

const ONPASSED = {
  text: '发布已通过',
  value: 11,
};
const OFFPASSED = {
  text: '下架已通过',
  value: 21,
};

const NOTONLINE = {
  text: '未上线',
  value: 10001,
};
const REMOVED = {
  text: '已删除',
  value: 30001,
};
const ONLINE = {
  text: '已上线',
  value: 20001,
};

const modelStatusList = [NOTONLINE, ONLINE];
const outputModel = [
  {
    text: '覆盖模式',
    value: 'overwrite',
  },
  {
    text: '追加模式',
    value: 'append',
  },
  {
    text: '存在检查',
    value: 'errorIfExists',
  },
];
const fileOutputModel = [
  {
    text: '覆盖模式',
    value: 'overwrite',
  },
  {
    text: '追加模式',
    value: 'append',
  },
  {
    text: '存在检查',
    value: 'errorIfExists',
  },
];
const joinTypeList = [
  {
    text: '交集',
    value: 0,
  },
  {
    text: '交集（右）',
    value: 1,
  },
  {
    text: '交集（左）',
    value: 2,
  },
  {
    text: '并集',
    value: 3,
  },
];
const fileTypeList = [
  {
    text: 'TXT',
    value: 0,
  },
  {
    text: 'CSV',
    value: 1,
  },
  {
    text: 'XLS或XLSX',
    value: 5,
  },
];
const s3TypeList = [
  {
    text: 'TXT',
    value: 0,
  },
  {
    text: 'CSV',
    value: 1,
  },
  {
    text: 'GZ',
    value: 6,
  },
  {
    text: '全部文本文件',
    value: 7,
  },
  {
    text: '其他文本文件',
    value: 8,
  },
];
const hdfsTypeList = [
  {
    text: 'TXT',
    value: 0,
  },
  {
    text: 'CSV',
    value: 1,
  },
  // {
  // text: 'ORC',
  // value: 3
  // },
  {
    text: 'PARQUET',
    value: 4,
  },
  {
    text: 'GZ',
    value: 6,
  },
  {
    text: '全部文本文件',
    value: 7,
  },
  {
    text: '其他文本文件',
    value: 8,
  },
];
const filedsSeparatorList = [
  {
    text: '逗号(,)',
    value: ',',
  },
  {
    text: '制表符(tab)',
    value: '\t',
  },
  {
    text: '分号(;)',
    value: ';',
  },
  {
    text: '空格( )',
    value: ' ',
  },
  {
    text: '竖线(|)',
    value: '|',
  },
];
const ORDERLIST = [
  {
    label: '按热度',
    value: 'HEAT',
    order: 'DESC',
  },
  {
    label: '按发布时间',
    value: 'UPDATE_TIME',
    order: 'DESC',
  },
];
export {
  PUBLISHED,
  NOTONLINE,
  REMOVED,
  ONLINE,
  ORDERLIST,
  modelStatusList,
  outputModel,
  joinTypeList,
  fileTypeList,
  hdfsTypeList,
  filedsSeparatorList,
  fileOutputModel,
  s3TypeList,
  ONUNCHECKED,
  OFFUNCHECKED,
  ONUNPASSED,
  OFFUNPASSED,
  ONPASSED,
  OFFPASSED,
};
