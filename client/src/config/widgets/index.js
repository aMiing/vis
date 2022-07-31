import { BaseConfig } from "./base";
const modules = require.context("./libs/", false, /(.*?)\.js$/);
const result = modules.keys().reduce((total, key) => {
  const config = modules(key)?.default;
  const name = key.replaceAll(/\.\/|\.js/g, "");
  return Object.assign(total, { [name]: { ...BaseConfig, ...config } });
}, {});

console.log("result", result);

export default result;
