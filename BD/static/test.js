window.$test = function (content) {
  console.log(content, "test");
  console.log($, "test");
  console.log(GM_xmlhttpRequest, "test");
};
