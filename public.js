const config = {
    qq: "882776749"
}

window.$tingConfig = config

// QQ
window.$openQQ = function () {
    window.open(`https://jq.qq.com/?_wv=1027&k=${window.$tingConfig.qq}`, "_blank");
}

// 打开验证码
function createVerifyCodeModal() {
    // 检查是否已经存在验证码弹窗
    if (document.querySelector('.s-top-verifycode')) {
        return {
            show: () => document.querySelector('.s-top-verifycode').classList.add('show'),
            hide: () => document.querySelector('.s-top-verifycode').classList.remove('show'),
            getCode: () => document.getElementById('code')?.value || ''
        };
    }

    // 动态添加样式到页面
    const styles = `
        <style>
        .s-top-verifycode {
            text-align: center;
            display: none;
            position: fixed;
            top: 45%;
            left: 50%;
            z-index: 1999;
            width: 320px;
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
        }

        .verify-item .input-inline {
            font-size: 14px;
            display: inline-block;
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
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #999;
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
        </style>
    `;

    // 将样式添加到页面头部
    document.head.insertAdjacentHTML('beforeend', styles);

    // 创建弹窗HTML结构
    const modalHTML = `
        <div class="s-top-verifycode">
            <button type="button" class="close_jam">&times;</button>
            <p class="tips">防止恶意请求，请输入验证码</p>
            <img src="https://res.mounui.com/info/wechat_jam_qrcode.jpg" alt="验证码图片">
            <p style="font-size: 14px;color:#666;margin-bottom: 20px;">微信关注上方公众号，回复"6"获取</p>
            <div class="verify-item">
                <span class="item-title">验证码：</span>
                <input type="text" placeholder="请输入验证码" id="code" autocomplete="off" class="input-inline">
            </div>
            <div>
                <button type="button" class="tj_jam">提交</button>
            </div>
        </div>
    `;

    // 将弹窗添加到页面中
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // 获取弹窗元素和按钮
    const modal = document.querySelector('.s-top-verifycode');
    const closeBtn = modal.querySelector('.close_jam');
    const submitBtn = modal.querySelector('.tj_jam');
    const codeInput = document.getElementById('code');

    // 绑定关闭事件
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    // 点击模态框外部关闭弹窗
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    // 返回操作对象
    return {
        show: () => modal.classList.add('show'),
        hide: () => modal.classList.remove('show'),
        getCode: () => codeInput.value,
        setCode: (code) => { codeInput.value = code; },
        clearCode: () => { codeInput.value = ''; },
        onSubmit: (callback) => {
            submitBtn.addEventListener('click', callback);
        },
        onClose: (callback) => {
            closeBtn.addEventListener('click', callback);
        }
    };
}
const verifyModal = createVerifyCodeModal();
window.$showEWM = verifyModal.show;
verifyModal.onSubmit(() => {
    const code = verifyModal.getCode();
    // 处理验证码提交逻辑
    console.log('验证码:', code);
});