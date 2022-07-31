import xhr from './xhr'
const baseUrl = '/user'
class UserService {
  // 平台用户登录
  getMyInfo(body) {
    return xhr({
      method: 'get',
      url: baseUrl + '/getMyInfo',
      body
    }, true)
  }
  getUser(body) {
    return xhr({
      method: 'get',
      url: baseUrl,
      body
    }, true)
  }
  createUser(body) {
    return xhr({
      method: 'post',
      url: baseUrl,
      body
    }, true)
  }
}

// 实例化后导出，全局单例
export default new UserService()