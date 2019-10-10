$(function () {
    /* 检测浏览器版本为ie10以下，显示提示 */
    var DEFAULT_VERSION = 10.0;
    var ua = navigator.userAgent.toLowerCase();
    var isIE = ua.indexOf("msie") > -1;
    var safariVersion;
    if (isIE) {
        safariVersion = ua.match(/msie ([\d.]+)/)[1];
    }
    if (safariVersion <= DEFAULT_VERSION) {
        $(".update_browser").css("display", "block");
    }
    var loginVue = new Vue({
        el: "#login_form",
        data: {
            loginname: "",
            loginpwd: "",
            valicode: "",
            show: true
        },
        methods: {
            loginAction: function () {
                if (this.loginname == "") {
                    window.alert("用户名不能为空！");
                } else if (this.loginpwd == "") {
                    window.alert("密码不能为空！");
                } else {
                    var _this = this
                    var index = layer.load(0, {
                        time: classapi.timeout
                    });
                    classapi.post.userapi_login({
                        loginname: this.loginname,
                        loginpwd: this.loginpwd,
                        device: "pad",
                        xmid: 1
                    }, function (result) {
                        if (classapi.validata(result)) {
                            zj.addcookie("loginuser", JSON.stringify(result.obj));
                            zj.addcookie(classapi.cookiekeyname, result.obj.token);
                            zj.addcookie("device", "token_web_" + result.obj.ssouserid);
                            localStorage.setItem("loginuser", JSON.stringify(result.obj));
                            if (this.show == true) {
                                localStorage.setItem("loginname", this.loginname);
                                localStorage.setItem("loginpwd", this.loginpwd);
                            }
                            window.location.href = "index.html";
                        }
                    });

                }
            },
            remenberpassword: function () {
                this.show = !this.show;
            }
        }
    });
})