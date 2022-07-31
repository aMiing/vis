function addRouterGuard(router) {
  // 设置code和路由的map对象
  const routes = router.getRoutes();
  const map = {};
  routes.forEach(i => {
    const { auth, pageId } = i.meta || {};
    // 注册pageId对应路由，code为兼容方案
    if (pageId) {
      map[pageId] = i.name;
    }
    if (auth) {
      let key = null;
      Array.isArray(auth)
        ? // 建模，壳是数组
          (key = auth.join())
        : // 治理是字符串
          (key = auth);
      map[key || i.name] = i.name;
    }
  });
  router.addRoute({
    name: 'redirect',
    path: '/redirect/:_pageCode?',
    beforeEnter: (to, from, next) => {
      const query = to.query.query ? JSON.parse(decodeURIComponent(to.query.query)) : {};
      const { _pageCode } = to.params;
      next({
        name: map[query.pageId] || map[_pageCode],
        params: query.params || {},
        query: query.query || {},
        replace: true,
      });
    },
  });
}

function routeStringify({ pageId, code, params = {}, query = {} }) {
  return `redirect/${code}?query=${encodeURIComponent(JSON.stringify({ params, query, pageId }))}`;
}

export { routeStringify, addRouterGuard };
