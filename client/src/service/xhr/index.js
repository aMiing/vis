import axios from 'axios';
import Vue from 'vue';
import { GLoading } from '@/femc';

// 封装获取 cookie 的方法
function getCookie(name) {
  var arr,
    reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
  else return null;
}

const ignoreErrorInterfaces = [
  'getUseTypeInfo',
  'getMyInfo',
  'logout',
  'getCurrentUserSubsysList',
  'getCurrentUserMenuList',
  'getContextValue',
  'unread',
  'search_index',
  'login',
];
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
axios.defaults.headers.post['Cache-Control'] = 'no cache';
function poseErrors(url) {
  return ignoreErrorInterfaces.every(key => !~url.indexOf(key));
}
const xhr = ({ method = 'post', url, body = null, prefixPath, headers }, loading) => {
  const queryString = data => {
    let str = '';
    const body = typeof data === 'object' ? data : {};
    Object.keys(body || {}).forEach((key, index) => {
      str += (index === 0 ? '?' : '&') + key + '=' + body[key];
    });
    return str;
  };

  const promise = new Promise((resolve, reject) => {
    const reqPath = `/${prefixPath || 'api'}` + url + (method === 'get' ? queryString(body) : '');
    let loadingInstance = loading ? GLoading.service({ fullscreen: true }) : false;

    axios(reqPath, {
      method,
      url: reqPath,
      data: body,
      headers: Object.assign(headers || {}, {
        'x-csrf-token': getCookie('csrfToken'),
      }),
    })
      .then(res => {
        const { result, msg, success } = res.data;
        if (String(result).startsWith('100008')) {
          // license异常
          return Vue.auth.logout(true);
        }
        if (result !== 0 && !success && poseErrors(reqPath)) {
          const errorInfo = msg || '请求错误';
          Vue.message({
            type: 'error',
            message: errorInfo,
          });
        }
        loadingInstance && loadingInstance.close();
        resolve(res.data || {});
      })
      .catch(({ response }) => {
        loadingInstance && loadingInstance.close();
        if (response) {
          if (response.status === 401) {
            Vue.auth.logout(true);
          } else {
            let msg = '请求失败';
            if (response.data) {
              msg = response.data.msg || msg;
            }
            if (poseErrors(reqPath)) {
              Vue.message({
                type: 'error',
                message: msg,
              });
            }
            reject(msg);
          }
        }
      });
  });
  return promise;
};

export default xhr;
