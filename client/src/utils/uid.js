const randomId = function (len = 8) {
  const S4 = () => Math.random().toString(16).substring(2);
  let res = "";
  while (res.length < len) {
    res += S4().substring(0, len - res.length);
  }
  return res;
};
export { randomId };
export default randomId;
