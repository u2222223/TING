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
                headers: config.headers
            };

            // 添加请求体（仅对非GET请求）
            if (config.body) {
                if (typeof config.body === 'object' && config.headers['Content-Type'] === 'application/json') {
                    fetchOptions.body = JSON.stringify(config.body);
                } else {
                    fetchOptions.body = config.body;
                }
            }

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

// 打开验证码 - 使用单例模式，支持验证码缓存和有效性检查
const createVerifyCodeModal = (function () {
    let instance = null;
    let submitHandler = null;
    let closeHandler = null;
    let cachedCaptcha = null; // 缓存的验证码

    // 从本地存储获取缓存的验证码
    function getCachedCaptcha() {
        try {
            const stored = localStorage.getItem('tingCaptcha');
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('获取缓存验证码失败:', error);
            return null;
        }
    }

    // 保存验证码到本地存储
    function setCachedCaptcha(captcha) {
        try {
            const captchaData = {
                code: captcha,
                timestamp: Date.now()
            };
            localStorage.setItem('tingCaptcha', JSON.stringify(captchaData));
            cachedCaptcha = captchaData;
        } catch (error) {
            console.error('保存验证码失败:', error);
        }
    }

    // 清除缓存的验证码
    function clearCachedCaptcha() {
        try {
            localStorage.removeItem('tingCaptcha');
            cachedCaptcha = null;
        } catch (error) {
            console.error('清除验证码缓存失败:', error);
        }
    }

    // 检查验证码是否有效
    async function validateCaptcha(captcha) {
        try {
            const response = await window.$httpRequest({
                method: 'GET',
                url: `https://dl-test.infiniteworlds.com.cn/TING/checkCaptcha?captcha=${captcha}`,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data && response.data.code === 0;
        } catch (error) {
            console.error('验证码有效性检查失败:', error);
            return false;
        }
    }

    // 创建弹窗UI
    function createModalUI() {
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
        min-width: 400px;
    }

    .s-top-verifycode.show {
        display: block;
    }

    .verify-item {
        display: flex;
        justify-content: space-around;
        height: 38px;
        line-height: 38px;
        font-size: 14px;
        margin: 10px 0;
        width: 100%;
    }

    .verify-item .item-title {
        font-size: 14px;
        font-weight: 700;
        display: inline-block;
        color: red;
        width: 80px;
        text-align: right;
        margin-right: 10px;
    }

    .verify-item .input-inline {
        font-size: 14px;
        display: inline-block;
        border: 1px solid red;
        border-radius: 5px;
        padding: 10px;
        flex: 1;
        max-width: 200px;
    }
    
    .verify-loading {
        color: #666;
        font-size: 14px;
        margin: 10px 0;
    }
    
    .verify-status {
        font-size: 14px;
        margin: 10px 0;
        padding: 8px;
        border-radius: 4px;
    }
    
    .verify-status.success {
        background: #d4edda;
        color: #155724;
    }
    
    .verify-status.error {
        background: #f8d7da;
        color: #721c24;
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
    
    .s-top-verifycode button:disabled {
        background: #ccc;
        cursor: not-allowed;
    }

    .close_jam {
        background: #bcbcbc !important;
    }
        </style>`;

            // 将样式添加到页面头部
            document.head.insertAdjacentHTML('beforeend', styles);

            // <div style="color: red;">服务升级中，请输入任意6位数字验证码</div>
            // 创建弹窗HTML结构
            const modalHTML = `<div class="s-top-verifycode">
            <div class="verify-status" id="verify-status" style="display: none;"></div>
            <div class="verify-loading" id="verify-loading" style="display: none;">正在检查验证码...</div>
            <iframe src="https://u2233.vip/Tools/getQrcode.html" style="height: 440px;"></iframe>
            <div class="verify-item">
                <span class="item-title">验证码：</span>
                <input type="text" placeholder="请输入验证码" id="code" autocomplete="off" class="input-inline">
            </div>
            <div>
                <button type="button" class="close_jam">关闭</button>
                <button type="button" class="tj_jam" id="submit-btn">提交</button>
            </div>
        </div>`;

            // 将弹窗添加到页面中
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
    }

    // 显示状态消息
    function showStatus(message, type = 'info') {
        const statusEl = document.getElementById('verify-status');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.className = `verify-status ${type}`;
            statusEl.style.display = 'block';

            // 3秒后自动隐藏
            setTimeout(() => {
                statusEl.style.display = 'none';
            }, 3000);
        }
    }

    // 显示/隐藏加载状态
    function showLoading(show, message = '正在处理...') {
        const loadingEl = document.getElementById('verify-loading');
        const submitBtn = document.getElementById('submit-btn');

        if (loadingEl) {
            loadingEl.textContent = message;
            loadingEl.style.display = show ? 'block' : 'none';
        }

        if (submitBtn) submitBtn.disabled = show;
    }

    return async function (onConfirm, onCancel, onClose) {
        // 初始化缓存验证码
        if (!cachedCaptcha) {
            cachedCaptcha = getCachedCaptcha();
        }

        // 检查缓存的验证码是否有效
        if (cachedCaptcha && cachedCaptcha.code) {

            const isValid = await validateCaptcha(cachedCaptcha.code);

            if (isValid) {

                // 验证码有效，直接执行回调
                if (onConfirm) {
                    try {
                        await onConfirm(cachedCaptcha.code);
                        return; // 成功后直接返回，不显示弹窗
                    } catch (error) {
                        console.error('回调执行失败:', error);
                    }
                }
                return;
            } else {
                clearCachedCaptcha();
            }
        }

        // 创建UI并显示弹窗
        createModalUI();

        const modal = document.querySelector('.s-top-verifycode');
        const closeBtn = modal.querySelector('.close_jam');
        const submitBtn = document.getElementById('submit-btn');
        const codeInput = document.getElementById('code');

        // 显示弹窗
        modal.classList.add('show');

        // 移除旧的事件监听器
        if (submitHandler) {
            submitBtn.removeEventListener('click', submitHandler);
        }
        if (closeHandler) {
            closeBtn.removeEventListener('click', closeHandler);
        }

        // 提交验证码事件
        submitHandler = async function () {
            const code = codeInput.value.trim();
            if (!code) {
                showStatus('请输入验证码！', 'error');
                return;
            }
            if (code.length !== 6) {
                showStatus('验证码长度错误！请重新输入！', 'error');
                return;
            }

            try {
                showLoading(true, '正在验证验证码...');
                const isValid = await validateCaptcha(code);
                showLoading(false);

                if (isValid) {
                    // 验证码有效，保存到缓存
                    setCachedCaptcha(code);
                    showStatus('验证码验证成功！', 'success');

                    // 执行回调函数
                    if (onConfirm) {
                        try {
                            await onConfirm(code);
                            modal.classList.remove('show');
                        } catch (error) {
                            console.error('回调执行失败:', error);
                            showStatus('操作执行失败: ' + error.message, 'error');
                        }
                    } else {
                        modal.classList.remove('show');
                    }
                } else {
                    showStatus('验证码无效或已过期，请重新输入！', 'error');
                    codeInput.value = '';
                    codeInput.focus();
                }
            } catch (error) {
                showLoading(false);
                showStatus('验证失败: ' + error.message, 'error');
            }
        };

        // 关闭弹窗事件
        closeHandler = function () {
            modal.classList.remove('show');
            if (onClose) onClose();
            if (onCancel) onCancel();
        };

        // 绑定事件监听器
        submitBtn.addEventListener('click', submitHandler);
        closeBtn.addEventListener('click', closeHandler);

        // 回车键提交
        codeInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                submitHandler();
            }
        });

        // 保存实例
        instance = {
            show: () => modal.classList.add('show'),
            hide: () => modal.classList.remove('show'),
            getCode: () => codeInput.value,
            setCode: (code) => { codeInput.value = code; },
            clearCode: () => { codeInput.value = ''; },
            getCachedCaptcha: () => cachedCaptcha,
            clearCache: clearCachedCaptcha
        };

        return instance;
    };
})();

window.$createVerifyCodeModal = createVerifyCodeModal;
