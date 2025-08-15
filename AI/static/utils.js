// sleep函数
window.sleep = function (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
