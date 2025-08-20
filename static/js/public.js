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

// 打开验证码
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
        width: 420px;
        transform: translate(-50%, -50%);
        -moz-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        -webkit-transform: translate(-50%, -50%);
        background: #fff;
        box-shadow: 0 0 30px 6px #d7d7d78a;
        border-radius: 8px;
        padding: 20px;
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

    /* 移动端适配 */
    @media only screen and (max-width: 768px) {
        .s-top-verifycode {
            width: 90%;
            padding: 25px 20px;
        }
        
        .s-top-verifycode img {
            width: 160px;
            height: 160px;
        }
        
        .verify-item {
            flex-direction: column;
            height: auto;
            gap: 5px;
        }
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

        // ESC键关闭
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                modal.classList.remove('show');
                if (onClose) onClose();
                if (onCancel) onCancel();
                document.removeEventListener('keydown', escHandler);
            }
        });

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

window.showDialog = function (onConfirm, onCancel, onClose) {
    const modal = createVerifyCodeModal(onConfirm, onCancel, onClose);
    modal.show();
};