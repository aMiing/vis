const path = require("path");
const files = require.context("./", false, /\.vue$/);

const modules = {};
files.keys().forEach(key => {
  const name = path.basename(key, ".vue");
  const component = files(key)?.default;
  // const componentName = component?.name || name;
  modules[name] = component || files(key);
});

export default modules;
