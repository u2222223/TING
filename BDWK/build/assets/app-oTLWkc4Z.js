function geturlid$1(e) {
    var o = "";
    e.indexOf("?") != -1 && (e = e.split("?")[0]),
        e.indexOf("#") != -1 && (e = e.split("#")[0]),
        e = e.replace(/(\/*$)/g, "");
    var t = e.split("/");
    return o = t[t.length - 1],
        o = o.replace(".html", ""),
        o
}
window.geturlid = geturlid$1;
var readerinfo, pngdata = [];
function showgetMessage(e) {
    $(".loadmsg").html(e),
        $(".loader").show()
}
function showMessage(e, o = 3e3) {
    const t = document.querySelector(".s-top-message");
    if (!e) {
        t.classList.remove("show");
        return
    }
    let s;
    t.classList.add("show"),
        document.querySelector(".s-top-message .s-message").innerHTML = e,
        clearTimeout(s),
        s = setTimeout(() => t.classList.remove("show"), o)
}
function showVerifycode() {
    document.querySelector(".s-top-verifycode").classList.add("show")
}
function closeVerifycode() {
    document.querySelector(".s-top-verifycode").classList.remove("show")
}
function getinfo() {
    let link, width = window.innerWidth;
    width <= 768 ? link = document.querySelector(".mobile").value : link = document.querySelector(".webv").value;
    let id = geturlid(link);
    if (!id) {
        showMessage("您还没有输入文档链接哦！");
        return
    }
    let token = hex_md5(id + "jam_mounui")
        , verifycode = document.querySelector("#code").value;
    if (!verifycode) {
        showMessage("请输入验证码");
        return
    }
    document.querySelector("#code").value = "",
        document.querySelector(".s-top-verifycode").classList.remove("show");
    let url = "/api/v1/wkapi";
    showgetMessage("正在获取网页数据，需要一些时间，请耐心等待..."),
        document.querySelector(".bd_click").setAttribute("disabled", "disabled"),
        $.post(url, {
            id,
            token,
            code: verifycode
        }, function (res) {
            let message = res.message;
            if (res.code == 0) {
                let e = res == null ? void 0 : res.file_type;
                if (readerinfo = res.readerinfo,
                    e == "txt") {
                    window.txtinfo = {
                        title: res.title,
                        text: res.docdata
                    },
                        document.querySelector(".docsinfo").innerHTML = `
                <div class="item"><span class="item-title">文档ID:</span><span class="item-info">${id}</span></div>
                <div class="item"><span class="item-title">文档名称:</span><span class="item-info doc-title">${res.title}</span></div>
                <div class="item"><span class="item-title">总页数:</span><span class="item-info">共${readerinfo.page}页</span><span class="item-title">可下载页数:</span><span class="item-info">${readerinfo.showPage}页</span></div>
                <div class="downline"><button type="button" class="downbtn" onclick="savetxt()">下载</button></div>`;
                    return
                }
                let o = getreaderpages(res.readerinfo, res.docdata);
                window.ceader = {
                    readerinfo,
                    readerpages: o
                },
                    document.querySelector(".docsinfo").innerHTML = `
            <div class="item"><span class="item-title">文档ID:</span><span class="item-info">${id}</span></div>
            <div class="item"><span class="item-title">文档名称:</span><span class="item-info doc-title">${res.title}</span></div>
            <div class="item"><span class="item-title">总页数:</span><span class="item-info">共${readerinfo.page}页</span><span class="item-title">可下载页数:</span><span class="item-info">${readerinfo.showPage}页</span></div>
            <div class="downline"><label class="item-title">分批下载:</label><div class="input-inline"><input id="start" type="number"  placeholder="开始"><span style="line-height: 38px;margin: 0 10px;">-</span><input id="end" type="number" placeholder="结束"></div><button type="button" class="downbtn" onclick="savedocs()">下载</button></div>`
            } else
                res.code == -3 && (eval(message),
                    message = ""),
                    res.code == -2 && (message = "验证码已失效，请从新获取网页数据！"),
                    showMessage(message)
        }, "json").done(function () {
            $(".loader").hide(),
                document.querySelector(".bd_click").removeAttribute("disabled")
        })
}
function getreaderpages(e, o) {
    var a, n, r;
    let t = [];
    if (o != "" && ((a = e == null ? void 0 : e.htmlUrls) != null && a.json)) {
        (n = e == null ? void 0 : e.htmlUrls) != null && n.png && (pngdata = e.htmlUrls.png);
        for (let p = 0; p < o.length; p++)
            if (t[p] = {
                index: p + 1,
                nodes: "",
                picsrc: "",
                readerinfo: e
            },
                o[p] != null) {
                for (let y = 0; y < pngdata.length; y++) {
                    let v = pngdata[y].pageIndex - 1;
                    p == v && (o[p].picsrc = pngdata[y].pageLoadUrl,
                        t[p].picsrc = pngdata[y].pageLoadUrl)
                }
                if (((r = e == null ? void 0 : e.htmlUrls) == null ? void 0 : r.ttf) != "")
                    var s = getwordnode(o[p]);
                else
                    s = getpicnode(e, o[p]);
                t[p].nodes = s
            }
    } else {
        e.htmlUrls.ttf = [];
        for (let p = 0; p < e.htmlUrls.length; p++) {
            t[p] = {
                index: p + 1,
                nodes: [],
                picsrc: e.htmlUrls[p],
                readerinfo: e
            };
            let y = {
                matrix: null,
                picPos: {
                    ih: e.pageInfo.pageHeight,
                    iw: e.pageInfo.pageWidth,
                    ix: 0,
                    iy: 0
                },
                pos: {
                    h: e.pageInfo.pageHeight,
                    opacity: 1,
                    w: e.pageInfo.pageWidth,
                    x: "",
                    y: "",
                    z: ""
                },
                scaleX: 1,
                scaleY: 1,
                src: e.htmlUrls[p],
                type: "pic"
            };
            t[p].nodes.push(y)
        }
    }
    return t
}
function getpicnode(e, o, t) {
    let s = o.body
        , a = [];
    for (let n = 0; n < s.length; n++)
        if (s[n].t == "pic") {
            let p = {
                matrix: null,
                picPos: {
                    ih: o.page.ih,
                    iw: o.page.iw,
                    ix: 0,
                    iy: 0
                },
                pos: {
                    h: e.pageInfo.pageHeight,
                    opacity: 1,
                    w: e.pageInfo.pageWidth,
                    x: "",
                    y: "",
                    z: ""
                },
                src: o.picsrc,
                type: "pic"
            };
            a.push(p)
        }
    return a
}
function getwordnode(e, o) {
    var n, r, p, y, v, d, m, i;
    let t = e.body
        , s = [];
    for (let l = 0; l < t.length; l++) {
        let c = {
            matrix: null,
            fontStyle: "normal",
            scaleX: 1,
            scaleY: 1,
            fontWeight: 400,
            letterSpacing: 0
        }
            , w = t[l].t;
        if (w === "word" && t[l].c != " ") {
            c.type = w,
                c.content = t[l].c,
                c.pos = t[l].p,
                (n = t[l].ps) != null && n._scaleX && (c.scaleX = t[l].ps._scaleX),
                (r = t[l].ps) != null && r._scaleY && (c.scaleY = t[l].ps._scaleY),
                (p = t[l]) != null && p.s && ((v = (y = t[l]) == null ? void 0 : y.s) != null && v.color && (c.color = t[l].s.color),
                    (d = t[l]) != null && d.s["font-family"] && (c.fontFamily = t[l].s["font-family"]),
                    (m = t[l]) != null && m.s["font-size"] && (c.fontSize = t[l].s["font-size"]),
                    (i = t[l]) != null && i.s["letter-spacing"] && (c.letterSpacing = t[l].s["letter-spacing"]));
            let f = e.style
                , h = t[l].r;
            if (h && f)
                for (let g = 0; g < f.length; g++) {
                    let u = f[g].c;
                    for (var a = 0; a < h.length; a++)
                        u.indexOf(h[a]) > -1 && (f[g].s["font-size"] && (c.fontSize = f[g].s["font-size"]),
                            f[g].s.bold && (c.fontWeight = 700),
                            f[g].s["font-family"] && (c.fontFamily = f[g].s["font-family"]),
                            f[g].s.color && (c.color = f[g].s.color),
                            f[g].s["letter-spacing"] && (c.letterSpacing = f[g].s["letter-spacing"]));
                    g == f.length - 1
                }
            s.push(c)
        }
        w == "pic" && (c.type = w,
            c.picPos = t[l].c,
            c.pos = t[l].p,
            c.src = e.picsrc,
            s.push(c))
    }
    return s
}
function savedocs() {
    window.localStorage.setItem("isScript", !0);
    var e = window.ceader;
    const o = (d = "", m = -1) => {
        document.querySelector(".s-top").classList.add("show"),
            d && (document.querySelector(".s-panel .s-text").innerHTML = d),
            m >= 0 && (m = Math.min(m, 100),
                document.querySelector(".s-panel .s-progress").style.width = `${Math.floor(m)}%`,
                document.querySelector(".s-panel .s-progress-text").innerHTML = `${Math.floor(m)}%`)
    }
        , t = () => {
            document.querySelector(".s-top").classList.remove("show")
        }
        , s = d => new Promise(async (m, i) => {
            if (!d) {
                m(null);
                return
            }
            let l = await a("GET", d, null, "blob");
            if (l.type.indexOf("image/") == -1) {
                m(null);
                return
            }
            let c = document.createElement("img");
            c.setAttribute("crossorigin", "anonymous"),
                c.setAttribute("referrerpolicy", "no-referrer"),
                c.onabort = c.onerror = () => {
                    m(null)
                }
                ,
                c.src = URL.createObjectURL(l),
                c.onload = () => {
                    m(c)
                }
        }
        )
        , a = (d, m, i, l = "text") => new Promise((c, w) => {
            window.URL = window.URL || window.webkitURL;
            var f = new XMLHttpRequest;
            f.open(d, m, !0),
                f.responseType = l,
                f.send(i),
                f.onload = function (h) {
                    h.target.readyState == 4 && c(l === "text" ? h.target.responseText : h.target.response)
                }
        }
        )
        , n = async (d, m) => {
            const i = "https://wkretype.bdimg.com/retype";
            let l = ["pn=" + m.index, "t=ttf", "rn=1", "v=" + m.readerinfo.pageInfo.version].join("&")
                , c = m.readerinfo.htmlUrls.ttf.find(u => u.pageIndex === m.index);
            if (!c)
                return;
            let w = encodeURI(i + "/pipe/" + m.readerinfo.storeId + "?" + l + c.param)
                , f = await a("GET", w);
            if (!f)
                return;
            f = f.replace(/[\n\r ]/g, "");
            let h = []
                , g = f.matchAll(/@font-face{[^{}]+}/g);
            for (const u of g) {
                const _ = u[0].match(/url\(["']?([^"']+)["']?\)/)
                    , S = u[0].match(/font-family:["']?([^;'"]+)["']?;/)
                    , I = u[0].match(/font-style:([^;]+);/)
                    , b = u[0].match(/font-weight:([^;]+);/);
                if (!_ || !S)
                    throw new Error("failed to parse font");
                h.push({
                    name: S[1],
                    style: I ? I[1] : "normal",
                    weight: b ? b[1] : "normal",
                    base64: _[1]
                })
            }
            for (const u of h)
                d.addFileToVFS(`${u.name}.ttf`, u.base64.slice(u.base64.indexOf(",") + 1)),
                    d.addFont(`${u.name}.ttf`, u.name, u.style, u.weight)
        }
        , r = async (d, m, i) => {
            var l, c, w, f, h, g;
            if (i.type == "word") {
                d.setFont(i.fontFamily, i.fontStyle),
                    d.setTextColor(i.color),
                    d.setFontSize(i.fontSize);
                const u = {
                    charSpace: i.letterSpacing,
                    baseline: "top"
                }
                    , _ = new d.Matrix(((l = i.matrix) == null ? void 0 : l.a) ?? i.scaleX, ((c = i.matrix) == null ? void 0 : c.b) ?? 0, ((w = i.matrix) == null ? void 0 : w.c) ?? 0, ((f = i.matrix) == null ? void 0 : f.d) ?? i.scaleY, ((h = i.matrix) == null ? void 0 : h.e) ?? 0, ((g = i.matrix) == null ? void 0 : g.f) ?? 0);
                d.text(i.content, i.pos.x, i.pos.y, u, _)
            } else if (i.type == "pic") {
                let u = m._pureImg;
                u || (console.debug("[+] page._pureImg is undefined, loading..."),
                    u = await s(i.src)),
                    "x1" in i.pos || (i.pos.x0 = i.pos.x1 = i.pos.x,
                        i.pos.y1 = i.pos.y2 = i.pos.y,
                        i.pos.x2 = i.pos.x3 = i.pos.x + i.pos.w,
                        i.pos.y0 = i.pos.y3 = i.pos.y + i.pos.h);
                const _ = document.createElement("canvas")
                    , [S, I] = [_.width, _.height] = [i.pos.x2 - i.pos.x1, i.pos.y0 - i.pos.y1]
                    , b = _.getContext("2d");
                i.pos.opacity && i.pos.opacity !== 1 && (b.globalAlpha = i.pos.opacity),
                    i.scaleX && i.scaleX !== 1 && b.scale(i.scaleX, i.scaleY),
                    i.matrix && b.transform(i.matrix.a ?? 1, i.matrix.b ?? 0, i.matrix.c ?? 0, i.matrix.d ?? 1, i.matrix.e ?? 0, i.matrix.f ?? 0),
                    b.drawImage(u, i.picPos.ix, i.picPos.iy, i.picPos.iw, i.picPos.ih, 0, 0, i.pos.w, i.pos.h),
                    d.addImage(_, "PNG", i.pos.x1, i.pos.y1, S, I),
                    _.remove()
            }
        }
        , p = async d => {
            var w, f;
            let m = [...Array(e.readerinfo.showPage).keys()], i;
            d != null ? i = d : i = m,
                o("正在加载", 0);
            let l;
            for (let h = 0; h < i.length; h++) {
                if (i[h] >= e.readerpages.length) {
                    console.warn("[!] pageRange[i] >= creader.readerpages.length, skip...");
                    continue
                }
                o("正在准备", (h + 1) / i.length * 100);
                const g = e.readerpages[i[h]]
                    , u = [parseInt(g.readerinfo.pageInfo.pageWidth), parseInt(g.readerinfo.pageInfo.pageHeight)];
                l ? l.addPage(u, u[0] < u[1] ? "p" : "l") : l = new jspdf.jsPDF({
                    orientation: u[0] < u[1] ? "p" : "l",
                    unit: "pt",
                    format: u,
                    compress: !0
                }),
                    o("正在下载图片"),
                    g._pureImg = await s(g.picsrc),
                    o("正在加载字体"),
                    await n(l, g),
                    o("正在绘制");
                for (const _ of g.nodes)
                    r(l, g, _);
                (w = g._pureImg) != null && w.src && URL.revokeObjectURL(g._pureImg.src),
                    (f = g._pureImg) == null || f.remove()
            }
            let c = document.querySelector(".doc-title").innerHTML;
            l.save(`${c}.pdf`)
        }
        , y = (d, m) => Array.from(new Array(m + 1).keys()).slice(d);
    (async () => {
        try {
            let d, m = document.querySelector("#start").value, i = document.querySelector("#end").value;
            if (m != "" && i != "")
                if (parseInt(m) <= parseInt(i)) {
                    if (parseInt(i) > e.readerinfo.showPage || parseInt(m) < 1)
                        throw new Error("页码输入错误,结束页码大于可预览页数或者起始页码小于1");
                    {
                        let l = y(parseInt(m) - 1, parseInt(i) - 1);
                        d = l.length,
                            document.querySelector(".downbtn").setAttribute("disabled", "disabled"),
                            await p(l)
                    }
                } else
                    throw new Error("页码输入错误,结束页码小于或等于开始页码");
            else
                document.querySelector(".downbtn").setAttribute("disabled", "disabled"),
                    await p(),
                    d = e.readerinfo.showPage;
            showMessage(`已成功导出，共计 ${d} 页~`)
        } catch (d) {
            console.error("[x] failed to export:", d),
                showMessage("导出失败：" + (d == null ? void 0 : d.message))
        } finally {
            t(),
                document.querySelector(".downbtn").removeAttribute("disabled")
        }
    }
    )()
}
function savetxt() {
    let e = window.txtinfo
        , o = e.text
        , t = new Blob([o], {
            type: "text/plain"
        })
        , s = document.createElement("a");
    s.download = e.title + ".txt",
        s.href = window.URL.createObjectURL(t),
        s.target = "_blank",
        s.style.display = "none",
        document.body.appendChild(s),
        s.click(),
        document.body.removeChild(s)
}
$(".bd_click").click(function () {
    showVerifycode()
});
$(".close_jam").click(function () {
    closeVerifycode()
});
$(".tj_jam").click(function () {
    getinfo()
});
window.savetxt = savetxt;
window.savedocs = savedocs;
/MicroMessenger/i.test(navigator.userAgent) ? $("body").addClass("mask") : console.log("这不是在微信内打开的网页");
var chrsz = 8;
function hex_md5$1(e) {
    return binl2hex(core_md5(str2binl(e), e.length * chrsz))
}
function core_md5(e, o) {
    e[o >> 5] |= 128 << o % 32,
        e[(o + 64 >>> 9 << 4) + 14] = o;
    for (var t = 1732584193, s = -271733879, a = -1732584194, n = 271733878, r = 0; r < e.length; r += 16) {
        var p = t
            , y = s
            , v = a
            , d = n;
        t = md5_ff(t, s, a, n, e[r + 0], 7, -680876936),
            n = md5_ff(n, t, s, a, e[r + 1], 12, -389564586),
            a = md5_ff(a, n, t, s, e[r + 2], 17, 606105819),
            s = md5_ff(s, a, n, t, e[r + 3], 22, -1044525330),
            t = md5_ff(t, s, a, n, e[r + 4], 7, -176418897),
            n = md5_ff(n, t, s, a, e[r + 5], 12, 1200080426),
            a = md5_ff(a, n, t, s, e[r + 6], 17, -1473231341),
            s = md5_ff(s, a, n, t, e[r + 7], 22, -45705983),
            t = md5_ff(t, s, a, n, e[r + 8], 7, 1770035416),
            n = md5_ff(n, t, s, a, e[r + 9], 12, -1958414417),
            a = md5_ff(a, n, t, s, e[r + 10], 17, -42063),
            s = md5_ff(s, a, n, t, e[r + 11], 22, -1990404162),
            t = md5_ff(t, s, a, n, e[r + 12], 7, 1804603682),
            n = md5_ff(n, t, s, a, e[r + 13], 12, -40341101),
            a = md5_ff(a, n, t, s, e[r + 14], 17, -1502002290),
            s = md5_ff(s, a, n, t, e[r + 15], 22, 1236535329),
            t = md5_gg(t, s, a, n, e[r + 1], 5, -165796510),
            n = md5_gg(n, t, s, a, e[r + 6], 9, -1069501632),
            a = md5_gg(a, n, t, s, e[r + 11], 14, 643717713),
            s = md5_gg(s, a, n, t, e[r + 0], 20, -373897302),
            t = md5_gg(t, s, a, n, e[r + 5], 5, -701558691),
            n = md5_gg(n, t, s, a, e[r + 10], 9, 38016083),
            a = md5_gg(a, n, t, s, e[r + 15], 14, -660478335),
            s = md5_gg(s, a, n, t, e[r + 4], 20, -405537848),
            t = md5_gg(t, s, a, n, e[r + 9], 5, 568446438),
            n = md5_gg(n, t, s, a, e[r + 14], 9, -1019803690),
            a = md5_gg(a, n, t, s, e[r + 3], 14, -187363961),
            s = md5_gg(s, a, n, t, e[r + 8], 20, 1163531501),
            t = md5_gg(t, s, a, n, e[r + 13], 5, -1444681467),
            n = md5_gg(n, t, s, a, e[r + 2], 9, -51403784),
            a = md5_gg(a, n, t, s, e[r + 7], 14, 1735328473),
            s = md5_gg(s, a, n, t, e[r + 12], 20, -1926607734),
            t = md5_hh(t, s, a, n, e[r + 5], 4, -378558),
            n = md5_hh(n, t, s, a, e[r + 8], 11, -2022574463),
            a = md5_hh(a, n, t, s, e[r + 11], 16, 1839030562),
            s = md5_hh(s, a, n, t, e[r + 14], 23, -35309556),
            t = md5_hh(t, s, a, n, e[r + 1], 4, -1530992060),
            n = md5_hh(n, t, s, a, e[r + 4], 11, 1272893353),
            a = md5_hh(a, n, t, s, e[r + 7], 16, -155497632),
            s = md5_hh(s, a, n, t, e[r + 10], 23, -1094730640),
            t = md5_hh(t, s, a, n, e[r + 13], 4, 681279174),
            n = md5_hh(n, t, s, a, e[r + 0], 11, -358537222),
            a = md5_hh(a, n, t, s, e[r + 3], 16, -722521979),
            s = md5_hh(s, a, n, t, e[r + 6], 23, 76029189),
            t = md5_hh(t, s, a, n, e[r + 9], 4, -640364487),
            n = md5_hh(n, t, s, a, e[r + 12], 11, -421815835),
            a = md5_hh(a, n, t, s, e[r + 15], 16, 530742520),
            s = md5_hh(s, a, n, t, e[r + 2], 23, -995338651),
            t = md5_ii(t, s, a, n, e[r + 0], 6, -198630844),
            n = md5_ii(n, t, s, a, e[r + 7], 10, 1126891415),
            a = md5_ii(a, n, t, s, e[r + 14], 15, -1416354905),
            s = md5_ii(s, a, n, t, e[r + 5], 21, -57434055),
            t = md5_ii(t, s, a, n, e[r + 12], 6, 1700485571),
            n = md5_ii(n, t, s, a, e[r + 3], 10, -1894986606),
            a = md5_ii(a, n, t, s, e[r + 10], 15, -1051523),
            s = md5_ii(s, a, n, t, e[r + 1], 21, -2054922799),
            t = md5_ii(t, s, a, n, e[r + 8], 6, 1873313359),
            n = md5_ii(n, t, s, a, e[r + 15], 10, -30611744),
            a = md5_ii(a, n, t, s, e[r + 6], 15, -1560198380),
            s = md5_ii(s, a, n, t, e[r + 13], 21, 1309151649),
            t = md5_ii(t, s, a, n, e[r + 4], 6, -145523070),
            n = md5_ii(n, t, s, a, e[r + 11], 10, -1120210379),
            a = md5_ii(a, n, t, s, e[r + 2], 15, 718787259),
            s = md5_ii(s, a, n, t, e[r + 9], 21, -343485551),
            t = safe_add(t, p),
            s = safe_add(s, y),
            a = safe_add(a, v),
            n = safe_add(n, d)
    }
    return Array(t, s, a, n)
}
function md5_cmn(e, o, t, s, a, n) {
    return safe_add(bit_rol(safe_add(safe_add(o, e), safe_add(s, n)), a), t)
}
function md5_ff(e, o, t, s, a, n, r) {
    return md5_cmn(o & t | ~o & s, e, o, a, n, r)
}
function md5_gg(e, o, t, s, a, n, r) {
    return md5_cmn(o & s | t & ~s, e, o, a, n, r)
}
function md5_hh(e, o, t, s, a, n, r) {
    return md5_cmn(o ^ t ^ s, e, o, a, n, r)
}
function md5_ii(e, o, t, s, a, n, r) {
    return md5_cmn(t ^ (o | ~s), e, o, a, n, r)
}
function safe_add(e, o) {
    var t = (e & 65535) + (o & 65535)
        , s = (e >> 16) + (o >> 16) + (t >> 16);
    return s << 16 | t & 65535
}
function bit_rol(e, o) {
    return e << o | e >>> 32 - o
}
function str2binl(e) {
    for (var o = Array(), t = (1 << chrsz) - 1, s = 0; s < e.length * chrsz; s += chrsz)
        o[s >> 5] |= (e.charCodeAt(s / chrsz) & t) << s % 32;
    return o
}
function binl2hex(e) {
    for (var o = "0123456789abcdef", t = "", s = 0; s < e.length * 4; s++)
        t += o.charAt(e[s >> 2] >> s % 4 * 8 + 4 & 15) + o.charAt(e[s >> 2] >> s % 4 * 8 & 15);
    return t
}
window.hex_md5 = hex_md5$1;
