const config = {
    qq: "882776749"
}
window.$tingConfig = config

window.$baiDuYunLingJuanConfig = {
    // 根据频道Id获取任务数组
    channelArr: [10066, 10065],
    // 过滤出免费任务
    taskModules: ["game_return_play", "new_game_play"],
}

// QQ
window.$openQQ = function () {
    window.open(`https://jq.qq.com/?_wv=1027&k=${window.$tingConfig.qq}`, "_blank");
}

// 打开验证码 - 使用单例模式
const createVerifyCodeModal = (function () {
    let instance = null;
    let submitHandler = null;
    let closeHandler = null;

    return function (onConfirm, onCancel, onClose) {
        // 如果实例已存在，更新回调函数并返回实例
        if (instance) {
            // 更新事件回调
            if (onConfirm || onCancel || onClose) {
                const modal = document.querySelector('.s-top-verifycode');
                const closeBtn = modal.querySelector('.close_jam');
                const submitBtn = modal.querySelector('.tj_jam');
                const codeInput = document.getElementById('code');

                // 移除旧的事件监听器
                if (submitHandler) {
                    submitBtn.removeEventListener('click', submitHandler);
                }
                if (closeHandler) {
                    closeBtn.removeEventListener('click', closeHandler);
                }

                // 创建新的事件处理函数
                submitHandler = function () {
                    const code = codeInput.value.trim();
                    if (onConfirm) onConfirm(code);
                };

                closeHandler = function () {
                    modal.classList.remove('show');
                    if (onClose) onClose();
                    if (onCancel) onCancel();
                };

                // 绑定新的事件监听器
                submitBtn.addEventListener('click', submitHandler);
                closeBtn.addEventListener('click', closeHandler);
            }

            return instance;
        }

        // 检查是否已经存在验证码弹窗
        if (!document.querySelector('.s-top-verifycode')) {
            // 动态添加样式到页面
            const styles = `<style>
    .s-top-verifycode {
        text-align: center;
        display: none;
        position: fixed;
        top: 45%;
        left: 50%;
        z-index: 1999;
        transform: translate(-50%, -50%);
        -moz-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        -webkit-transform: translate(-50%, -50%);
        background: #fff;
        box-shadow: 0 0 30px 6px #d7d7d78a;
        border-radius: 8px;
        padding: 20px;
        display: flex ！important;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .s-top-verifycode.show {
        display: block;
    }

    .s-top-verifycode .tips {
        font-size: 18px;
        font-weight: 700;
        color: #333;
        margin-bottom: 10px;
    }

    .s-top-verifycode img {
        width: 180px;
        height: 180px;
        margin-bottom: 10px;
    }

    .verify-item {
        display: flex;
        justify-content: space-around;
        height: 38px;
        line-height: 38px;
        font-size: 14px;
        margin: 10px 0;
    }

    .verify-item .item-title {
        font-size: 14px;
        font-weight: 700;
        display: inline-block;
        color: red;
    }

    .verify-item .input-inline {
        font-size: 14px;
        display: inline-block;
        border: 1px solid red;
        border-radius: 5px;
        padding: 10px
    }
    button {
        cursor: pointer;
    }
    .s-top-verifycode button {
        margin: 10px 5px 0;
        height: 38px;
        line-height: 38px;
        background: #6464fd;
        color: #fff;
        padding: 0 20px;
        border-radius: 3px;
        border: none;
        cursor: pointer;
        font-size: 14px;
    }

    .s-top-verifycode button:hover {
        background: #5252e0;
    }

    .close_jam {
        background: #bcbcbc !important;
    }
        </style>`;

            // 将样式添加到页面头部
            document.head.insertAdjacentHTML('beforeend', styles);

            // 创建弹窗HTML结构
            const modalHTML = `<div class="s-top-verifycode">
            <iframe src="https://u2233.vip/Tools/getQrcode.html" style="width: 340px;height: 440px;"></iframe>
            <div class="verify-item">
                <span class="item-title">验证码：</span>
                <input type="text" placeholder="请输入验证码" id="code" autocomplete="off" class="input-inline">
            </div>
            <div>
                <button type="button" class="close_jam">关闭</button>
                <button type="button" class="tj_jam">提交</button>
            </div>
        </div>`;

            // 将弹窗添加到页面中
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }

        // 获取弹窗元素和按钮
        const modal = document.querySelector('.s-top-verifycode');
        const closeBtn = modal.querySelector('.close_jam');
        const submitBtn = modal.querySelector('.tj_jam');
        const codeInput = document.getElementById('code');

        // 创建事件处理函数
        submitHandler = function () {
            const code = codeInput.value.trim();
            if (!code) {
                alert('请输入验证码！');
                return;
            }
            if (code.length !== 6) {
                alert('验证码长度错误！请重新输入！');
                return;
            }
            if (onConfirm) onConfirm(code);
        };

        closeHandler = function () {
            modal.classList.remove('show');
            if (onClose) onClose();
            if (onCancel) onCancel();
        };

        // 绑定事件监听器
        submitBtn.addEventListener('click', submitHandler);
        closeBtn.addEventListener('click', closeHandler);

        // 保存实例
        instance = {
            show: () => modal.classList.add('show'),
            hide: () => modal.classList.remove('show'),
            getCode: () => codeInput.value,
            setCode: (code) => { codeInput.value = code; },
            clearCode: () => { codeInput.value = ''; }
        };

        return instance;
    };
})();

window.$createVerifyCodeModal = createVerifyCodeModal;

// 发请求
/**
 * 统一的HTTP请求函数，兼容油猴环境和浏览器环境
 * @param {Object} options - 请求配置
 * @param {string} options.method - HTTP方法 (GET, POST, etc.)
 * @param {string} options.url - 请求地址
 * @param {Object} options.headers - 请求头
 * @param {string|Object} options.body - 请求体
 * @returns {Promise} 返回Promise对象
 */
window.$httpRequest = function (options) {
    return new Promise((resolve, reject) => {
        // 标准化请求配置
        const config = {
            method: options.method || 'GET',
            url: options.url,
            headers: options.headers || {},
            onload: function (response) {
                try {
                    const data = typeof response.responseText === 'string'
                        ? JSON.parse(response.responseText)
                        : response.responseText;
                    resolve({
                        ...response,
                        data: data
                    });
                } catch (e) {
                    resolve(response); // 如果不是JSON，直接返回response
                }
            },
            onerror: function (error) {
                alert(`失败，请联系管理员，qq群${window.$tingConfig.qq}`);
                reject(error);
            },
            ...options // 允许覆盖默认配置
        };

        if (window.GM_xmlhttpRequest) {
            // 油猴环境使用 GM_xmlhttpRequest
            window.GM_xmlhttpRequest(config);
        } else if (typeof fetch !== 'undefined') {
            // 浏览器环境使用 fetch
            const fetchOptions = {
                method: config.method,
                headers: config.headers,
                credentials: 'include'
            };

            // 添加请求体（仅对非GET请求）
            if (config.body) {
                if (typeof config.body === 'object' && config.headers['Content-Type'] === 'application/json') {
                    fetchOptions.body = JSON.stringify(config.body);
                } else {
                    fetchOptions.body = config.body;
                }
            }
            console.log(config.url, fetchOptions);

            fetch(config.url, fetchOptions)
                .then(async (response) => {
                    const responseText = await response.text();
                    const responseData = {
                        status: response.status,
                        statusText: response.statusText,
                        responseText: responseText,
                        responseHeaders: [...response.headers.entries()].reduce((obj, [key, value]) => {
                            obj[key] = value;
                            return obj;
                        }, {}),
                        finalUrl: response.url
                    };

                    try {
                        responseData.data = JSON.parse(responseText);
                    } catch (e) {
                        responseData.data = responseText;
                    }

                    if (response.ok) {
                        config.onload(responseData);
                    } else {
                        config.onerror(new Error(`HTTP Error: ${response.status}`));
                    }
                })
                .catch((error) => {
                    config.onerror(error);
                });
        } else {
            // 不支持任何请求方式
            reject(new Error('No available HTTP request method'));
        }
    });
}