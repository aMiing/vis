/* eslint-disable no-useless-escape */
// ipv4 (127.0.0.1)
export const ip =
  /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;

// port (0～65535)
export const port =
  /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/;

// email
export const email = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

// mac地址
export const macAddr = /^([A-Fa-f0-9]{2}-){5}[A-Fa-f0-9]{2}$/;

// 数字
export const number = /^\d*$/;

// 自然数 0 1 2 3 4
export const naturalNum = /^(0|[1-9]\d*)$/;

// 正整数 1 2 3 4
export const positiveNum = /^[1-9]\d*$/;

//  1～32个字符；不能包含 ' / \ : * ? " < > | 等特殊字符
export const name = /^[^'\/\\:\*\?"<>\|]*$/;

// 1-32个字符，只能用字母、数字、汉字、小数点、下划线、连接符、括号 「设备型号」
export const deviceType = /^[a-zA-Z0-9\.\-_\(\)\u4E00-\u9FA5]*$/;

// 字母、数字、汉字、小数点、下划线、连接符 [设备编码]
export const deviceCode = /^[a-zA-Z0-9\.\-_\u4E00-\u9FA5#()\s]*$/;

// 设备登录用户名 1～32个字符，只能用字母、数字、汉字、小数点、下划线、连接符。
export const deviceUserName = /^[a-zA-Z0-9\.\-_\u4E00-\u9FA5]*$/;

// 字母、数字的组合 「设备编号1-32位」
export const numLetter = /^[\da-zA-Z]*$/;

// 字母、数字、汉字的组合 「工号1-32」「入场播报」「出场播报」「放行播报」
export const numLetterAndCN = /^[\da-zA-Z\u4E00-\u9FA5]*$/;

// 字母、汉字的组合 「职位1-128」
export const numAndCN = /^[a-zA-Z\u4E00-\u9FA5]*$/;

// 字母、数字和除:\"之外的特殊字符 「设备账号1-32位」
export const deviceAccount = /^[a-zA-Z0-9~`!@#\$%^&*()_+\-=\[\];',<.>/|?]{1,32}$/;

// 车牌号
export const licenseNumber = /^[^'\/\\:\*\?"<>\|]{1,16}$/;

// 手机号
export const phoneNum = /^[1][345789][0-9]{9}$/;

// 姓名 1-128个数字、字母、汉字、间隔号（·）和空格
export const personName = /^[\da-zA-Z\u4E00-\u9FA5· ]{1,128}$/;

// 证件号码
export const IDNumber = /^[0-9a-zA-Z]{0,20}$/;

// 身份证号 18位，前17位为数字，尾号为数字或大写字母X。
export const identityCard =
  /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;

// 由公司安全部门制定8~32位数字、字母和特殊字符的组合
export const password =
  /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[=\-~`!@#$%^&*()+_{}\[\];:"'\\|<>?,.\/])[0-9a-zA-Z=\-~`!@#$%^&*()+_{}\[\];:"'\\|<>?,.\/]{8,32}$/;

// 卡号 8-18个字符，只能用数字和大写字母。
export const cardNum = /^[0-9A-Z]{8,18}$/;

// 4-8位数字 「卡密码」「胁迫密码」「超级密码」
export const simplePassword = /^\d{4,8}$/;

// UUID 32位大写英文字母、数字、连接符。
export const uuid = /^[a-zA-Z\d]{8}-[a-zA-Z\d]{4}-[a-zA-Z\d]{4}-[a-zA-Z\d]{4}-[a-zA-Z\d]{12}$/;

// 警号
export const policeNo = /^[0-9A-Za-z]{6}$/;

// UDF函数名 UDF函数名，字母数字下划线
export const udf = /^[a-zA-Z0-9_]{1,20}$/;

// 钉钉账号（手机号）6-20个小写字母数字组成，必须字母开头
export const dingding = /^[a-z][a-z\d]{5,19}$/;

// 微信账号 6-20个字母、数字、下划线和减号；必须以字母开头（字母不区分大小写）；不支持设置中文
export const wechat = /^[a-zA-Z][a-zA-Z\d_-]{5,19}$/;

// 企业微信号 1-64个字母、数字、下划线和减号；以字母或数字开头；不支持设置中文
export const wechatWork = /^[a-zA-Z0-9]{1}[a-zA-Z0-9_\-@.]{0,63}$/;

// 标签 ID 只能包含英文字母、下划线、数字, 最大长度为20
export const tagId = /^[0-9a-zA-Z_]{0,20}$/;

// 标签中文名 只能包含中、英文字母、下划线、数字, 最大长度为20
export const tagCnName = /^[\u4e00-\u9fa5a-zA-Z0-9_]{0,20}$/;

// 标签英文名 只能包含英文字母、下划线、数字, 最大长度为50
export const tagEnName = /^[0-9a-zA-Z_]{0,50}$/;

// API字段名称 数字、字母和下划线构成，不能以数字开头且长度不超过30
export const apiName = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

// S3文件名称前缀 英文字母开头、数字_英文字母组合
export const filename = /^[a-zA-Z]{1}[a-zA-Z0-9_]{0,20}$/;

export const regExp = {
  ip,
  port,
  email,
  macAddr,
  number,
  naturalNum,
  positiveNum,
  name,
  deviceType,
  deviceCode,
  deviceUserName,
  numLetter,
  numLetterAndCN,
  numAndCN,
  deviceAccount,
  licenseNumber,
  phoneNum,
  personName,
  IDNumber,
  identityCard,
  password,
  cardNum,
  simplePassword,
  uuid,
  policeNo,
  udf,
  dingding,
  wechat,
  wechatWork,
  tagId,
  tagCnName,
  tagEnName,
  apiName,
  filename,
};
