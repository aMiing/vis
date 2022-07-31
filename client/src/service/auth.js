
import xhr from './xhr'
const baseUrl = '/auth/'
class AuthService {
  // 平台用户登录
  login(body) {
    return xhr({
      method: 'post',
      url: baseUrl + 'login',
      body
    }, true)
  }
  // pki方式登陆
  pkiLogin(body) {
    return xhr({
      method: 'post',
      url: baseUrl + 'pkiLogin',
      body
    })
  }
  // 平台用户登出
  logout(body) {
    return xhr({
      method: 'get',
      url: baseUrl + 'logout',
      body
    })
  }
  // 平台获取验证码
  vcode(body) {
    return xhr({
      method: 'get',
      url: baseUrl + 'vcode',
      body
    })
  }
  // 获取当前用户的上一次登录时间
  getCurrentUserLastLoginTime(body) {
    return xhr({
      method: 'get',
      url: baseUrl + 'getCurrentUserLastLoginTime',
      body
    })
  }
  // 根据id获取用户信息
  getUserByUserId(body) {
    return xhr({
      method: 'get',
      url: baseUrl + 'getUserByUserId',
      body
    })
  }
  // 根据角色id获取用户列表
  getUserListByRoleId(body) {
    return xhr({
      method: 'get',
      url: baseUrl + 'getUserListByRoleId',
      body
    })
  }
  // 新增用户
  insertUser(body) {
    return xhr({
      method: 'post',
      url: baseUrl + 'insertUser',
      body
    })
  }
  // 修改密码
  updatePassword(body) {
    return xhr({
      method: 'post',
      url: baseUrl + 'updatePassword',
      body
    })
  }
  // 更新用户信息
  updateUser (body) {
    return xhr({
      method: 'post',
      url: baseUrl + 'updateUser',
      body
    })
  }
  // 根据组织获取组织下的用户列表
  getUserList(body) {
    return xhr({
      method: 'post',
      url: baseUrl + 'getUserListByDepartment',
      body
    })
  }
  // 获取使用场景及回调URL
  getUseTypeInfo(body) {
    return xhr({
      method: 'get',
      url: baseUrl + 'getUseTypeInfo',
      body
    })
  }
}

// 实例化后导出，全局单例
export default new AuthService()
