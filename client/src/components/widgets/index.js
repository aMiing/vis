const files = require.context("./libs", false, /\.vue$/);

const modules = files.keys().reduce((total, key) => {
  const name = key.replaceAll(/\.\/|\.vue/g, "");
  const component = files(key)?.default;
  // modules[name] = component || files(key);
  return Object.assign(total, { [name]: component });
}, {});
console.log("modules", modules);

export default modules;
