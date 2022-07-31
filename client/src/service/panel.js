import xhr from './xhr';
const baseUrl = '/panel';
class PanelService {
  getPanelList(body) {
    return xhr(
      {
        method: 'get',
        url: baseUrl,
        body,
      },
      true
    );
  }
  getEditorData(body) {
    return xhr(
      {
        method: 'get',
        url: baseUrl + '/' + body.id,
        body,
      },
      true
    );
  }

  create(body) {
    return xhr(
      {
        method: 'post',
        url: baseUrl,
        body,
      },
      true
    );
  }
  update(body) {
    return xhr(
      {
        method: 'put',
        url: baseUrl + '/' + body.id,
        body,
      },
      false
    );
  }

  delete(body) {
    return xhr(
      {
        method: 'delete',
        url: baseUrl + '/' + body.id,
        body,
      },
      true
    );
  }
  publish(body) {
    return xhr(
      {
        method: 'post',
        url: baseUrl + '/publish',
        body,
      },
      false
    );
  }
}

// 实例化后导出，全局单例
export default new PanelService();
