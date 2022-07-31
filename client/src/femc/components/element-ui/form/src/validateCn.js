const customValidate = {
  nameEn: value => {
    const result = /^[0-9a-zA-Z_]{0,50}$/.test(value);
    return result || [`只能包含英文字母、下划线、数字, 最大长度为50, 当前: ${value.length}`];
  },
  nameCn: value => {
    const result = /^[\u4e00-\u9fa5a-zA-Z0-9_]{0,20}$/.test(value);
    return result || [`只能包含中、英文字母、下划线、数字, 最大长度为20, 当前: ${value.length}`];
  },
  nameId: value => {
    const result = /^[0-9a-zA-Z_]{0,20}$/.test(value);
    return result || [`只能包含英文字母、下划线、数字, 最大长度为20, 当前: ${value.length}`];
  },
  isInteger: value => {
    const result = (value || value === 0) && Number.isInteger(Number(value));
    return result || [`只支持整数`];
  },
  arrayLen: value => {
    const result = value && Array.isArray(value) && value.length;
    return result || [`不能为空`];
  },
  numberString: value => {
    const result = value && /^[0-9]*(.[0-9]+)?$/.test(value);
    return result || [`只支持数字`];
  },
  nonemojiReg: value => {
    const regExp = new RegExp(
      '[\u{1F601}-\u{1F64F}\u{2702}-\u{27B0}\u{1F680}-\u{1F6C0}\u{1F170}-\u{1F251}\u{1F600}-\u{1F636}\u{1F681}-\u{1F6C5}\u{1F30D}-\u{1F567}]',
      'gu'
    );
    return !regExp.exec(value) || [`不支持emoji表情符号`];
  },
};

const validateCn = {
  fieldIsRequired: '请输入',
  invalidFormat: '非法格式！',

  numberTooSmall: '该数值过小! 最小: {0}',
  numberTooBig: '该数值过大! 最大: {0}',
  invalidNumber: '非法数字',
  invalidInteger: '该值不是整数',

  textTooSmall: '文本字数没有达到长度要求！当前: {0}, 最小: {1}',
  textTooBig: '文本字数超出限制！当前: {0}, 最大: {1}',
  thisNotText: '这不是文本!',

  thisNotArray: '这不是数组!',

  selectMinItems: '最少选择 {0} 项!',
  selectMaxItems: '最多选择 {0} 项!',

  invalidDate: '不合法的日期!',
  dateIsEarly: '该日期小于下限! 当前: {0}, 最小: {1}',
  dateIsLate: '该日期大于上限! 当前: {0}, 最小: {1}',

  invalidEmail: '不合法的邮箱格式!',
  invalidURL: '不合法的URL!',

  invalidCard: 'Invalid card format!',
  invalidCardNumber: 'Invalid card number!',

  invalidTextContainNumber: 'Invalid text! Cannot contains numbers or special characters',
  invalidTextContainSpec: 'Invalid text! Cannot contains special characters',
};

export { validateCn, customValidate };
