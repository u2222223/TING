const gm = null;
const config = {
  // 根据频道Id获取任务数组
  channelArr: [10066, 10065],
  // 过滤出免费任务
  taskModules: ["game_return_play", "new_game_play"],
};
window.$lib = {
  start,
};
// 初始化函数
async function start(obj) {
  gm = obj;
  const cookie = get_cookies();
  const tasks = await getAllTask({ cookieStr: cookie });
  Promise.all(
    tasks.map((item) => getOneDownload(item.selectGameParams, item))
  ).then();
}

// 获取cookie
function get_cookies() {
  return document.cookie;
}

// 获取所有游戏任务
async function getAllTask({ cookieStr }) {
  const channelArr = config.channelArr;
  const promises = channelArr.map(
    (channel) =>
      new Promise((resolve) => {
        gm.GM_xmlhttpRequest({
          method: "GET",
          url: `https://wan.baidu.com/gameapi?action=bonus_pan_task_list&channel=${channel}`,
          headers: {
            "Content-Type": "application/json",
            Cookie: cookieStr,
          },
          onload: function (response) {
            resolve(JSON.parse(response.responseText));
          },
        });
      })
  );

  const task_result = await Promise.all(promises);

  // 转成平铺数组，所有游戏任务
  const taskOneWei = [];
  task_result.forEach((item) => {
    if (item.errorNo === 0 && item.result && item.result.data) {
      item.result.data.forEach((task) => {
        if (Array.isArray(task.data)) {
          taskOneWei.push(...task.data);
        }
      });
    }
  });

  // 免费的游戏任务
  const taskMianFei = taskOneWei.filter((item) =>
    config.taskModules.includes(item.taskModule)
  );

  const taskReal = taskMianFei.map((item) => {
    let selectGame = getRandomItem(item.taskGames);
    return {
      ...item,
      selectGame,
      selectGameParams: {
        ...url2obj(selectGame.gameUrl),
        cookieStr,
      },
    };
  });

  send_message({ type: "task_result", taskReal });
  return taskReal;
}

// 获取下载卷
async function getOneDownload({ cookieStr, gameId, taskId, activityId }, task) {
  const sendApi = (params) => {
    gm.GM_xmlhttpRequest({
      method: "GET",
      url: `https://wan.baidu.com/gameapi?${obj2url(params)}`,
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStr,
      },
      onload: async function (response) {
        const data = JSON.parse(response.responseText);

        // 剩余时间为0 或 任务完成状态码
        if (
          data.errorNo === 110503 ||
          (data.result &&
            data.result.data &&
            data.result.data.remainingTaskTime === 0)
        ) {
          await setStorage(getId(taskId), 0);
          return send_message({
            type: "task_status_update",
            taskId: params.taskId,
            status: `completed`,
            progress: 100,
          });
        }

        // 接口报错了
        if (data.errorNo !== 0) {
          return send_message({
            type: "task_status_update",
            taskId: params.taskId,
            errorNo: data.errorNo,
            status: `error`,
            progress: 40,
            errorMessage: `${data.message}（请刷新页面 或 重新登录 ）`,
          });
        }

        // 更新剩余时间
        if (
          data.result &&
          data.result.data &&
          data.result.data.remainingTaskTime
        ) {
          let finiTime =
            task.eachTaskNeedPlayTimeSecs - data.result.data.remainingTaskTime;

          send_message({
            type: "task_status_update",
            taskId: params.taskId,
            status: `processing`,
            progress: parseInt(
              (finiTime / task.eachTaskNeedPlayTimeSecs) * 100
            ),
          });
          await setStorage(getId(taskId), data.result.data.remainingTaskTime);
        }

        // 准备下一次循环
        if (
          data.result &&
          data.result.data &&
          data.result.data.nextReportInterval
        ) {
          // 如果有下次上报间隔，则设置定时器
          setTimeout(() => {
            sendApi({ ...params, isFirstReport: 0 });
          }, 10 * 1000);
        }
      },
    });
  };

  sendApi({
    gameId,
    isFirstReport: (await getStorage(getId(taskId))) ? 0 : 1,
    taskId,
    activityId,
    action: "bonus_task_game_play_report",
  });
}

// 随机获取数组中一项
function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// url参数转对象
function url2obj(url) {
  var obj = {};
  var arr = url.split("?")[1].split("&");
  for (var i = 0; i < arr.length; i++) {
    var item = arr[i].split("=");
    if (item[0].trim()) {
      obj[item[0]] = item[1];
    }
  }
  return obj;
}

// 对象转url参数
function obj2url(obj) {
  var url = "";
  for (var key in obj) {
    url += key + "=" + obj[key] + "&";
  }
  return url.substring(0, url.length - 1);
}

function setStorage(key, value) {
  return new Promise((resolve) => {
    gm.GM_setValue(key, value);
    resolve();
  });
}

function getStorage(key) {
  return new Promise((resolve) => {
    resolve(gm.GM_getValue(key, null));
  });
}
