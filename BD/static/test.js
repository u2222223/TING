window.$test = function (newWindow) {
  console.log(newWindow, "test");
};

// test.js
(function (global, factory) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    // CommonJS/Node 环境 (模块化加载)
    factory(global, true);
  } else {
    // 浏览器环境 (直接加载)
    factory(global, false);
  }
})(typeof window !== "undefined" ? window : this, function (global, isModule) {
  async function start() {
    console.log("start function executed", GM_xmlhttpRequest);
    // 你的逻辑
  }

  // 暴露接口
  const lib = { start };

  if (isModule) {
    // 模块化环境导出
    if (typeof module !== "undefined" && module.exports) {
      module.exports = lib;
    }
  } else {
    // 浏览器环境挂载到全局
    global.$lib = lib;
  }
});
