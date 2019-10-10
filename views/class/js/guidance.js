$(function() {
    $(".main_top div").click(function() {
        window.location.href = "index.html",
            zj.addcookie("pageType", $(this).attr("dataurl"));
        zj.addcookie("pageTypeNumber", $(this).attr("number"));
    });
    $(".user>img").click(function() {
        layer.confirm('确定要退出登录吗？', {
            skin: 'layui-layer-lan',
            btn: ['确定', '取消'] //按钮
        }, function() {
            zj.delcookie("loginuser");
            window.location.href = "login.html";

        }, function() {

        });

    })
});

var user_vue = new Vue({
    el: ".user",
    data: {
        loginuser: {}
    },
    mounted() {
        if (zj.getcookie("loginuser")) {
            this.loginuser = $.parseJSON(zj.getcookie("loginuser"));
        } else {
            this.validateuser();
        }
        //屏幕自适应
        var i = 0;
        var thisNode = document.getElementsByTagName("*");
        if (window.innerWidth < 768) {
            for (i = 0; i < thisNode.length; i++) {
                if (thisNode[i].getAttribute(":x_xs") > 0) {
                    thisNode[i].style.width = window.innerWidth / 24 * thisNode[i].getAttribute(":x_xs") + "px";
                }
            }
        } else if (window.innerWidth < 992 && window.innerWidth >= 768) {
            for (i = 0; i < thisNode.length; i++) {
                if (thisNode[i].getAttribute(":x_sm") > 0) {
                    thisNode[i].style.width = window.innerWidth / 24 * thisNode[i].getAttribute(":x_sm") + "px";
                }
            }
        } else if (window.innerWidth >= 992 && window.innerWidth < 1200) {
            for (i = 0; i < thisNode.length; i++) {
                if (thisNode[i].getAttribute(":x_md") > 0) {
                    thisNode[i].style.width = window.innerWidth / 24 * thisNode[i].getAttribute(":x_md") + "px";
                }
            }
        } else if (window.innerWidth >= 1200) {
            for (i = 0; i < thisNode.length; i++) {
                if (thisNode[i].getAttribute(":x_lg") > 0) {

                    thisNode[i].style.width = window.innerWidth / 24 * thisNode[i].getAttribute(":x_lg") + "px";
                }
            }
        }
    },
    filters: {
        nameFilter(name) {
            if (name) {
                if (name.length > 4) {
                    name = name.substring(0, 4);
                }
            } else {
                name = "";
            }

            return name;
        }
    },
    methods: {
        validateuser: function() {
            var _this = this;
            classapi.post.teacherclass_index_validate_user({}, function(result) {
                if (classapi.validata(result)) {
                    zj.addcookie("loginuser", JSON.stringify(result.obj));
                    if (window.localStorage) {
                        window.localStorage["loginuser"] = JSON.stringify(result.obj);
                    }
                    if (zj.getcookie("loginuser")) {
                        _this.loginuser = $.parseJSON(zj.getcookie("loginuser"));
                    } else {
                        location.href = "./login.html";
                    }

                }
            });
        }

    }
});