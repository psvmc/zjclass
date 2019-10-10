$(function() {
    //点击头像进个人中心
    // $(".head_portrait").click(function () {
    //     $(".mask_layer").css("display", "block");
    //     ajaxRequest("./pages/person_center/personal_main.html", $('.pop-up_box'));
    //     $('.pop-up_box').css("display", "block");
    // })
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
    $("body").unbind("click");
    if (zj.getcookie("pageType")) {
        ajaxRequest(zj.getcookie("pageType"), $('#content'));
    } else {
        ajaxRequest("./pages/prepare_lessons.html", $('#content'));
    }
    if (zj.getcookie("pageTypeNumber") == "0") {
        $(".prepare_lessons").addClass("pitch_on").siblings().removeClass("pitch_on");
    } else if (zj.getcookie("pageTypeNumber") == "1") {
        $(".give_instruction").addClass("pitch_on").siblings().removeClass("pitch_on");
    } else {
        $(".homework").addClass("pitch_on").siblings().removeClass("pitch_on");
    }
    //退出
    $(".personal>span.exit").click(function() {
        layer.confirm('确定要退出登录吗？', {
            skin: 'layui-layer-lan',
            btn: ['确定', '取消'] //按钮
        }, function() {
            zj.delcookie("loginuser");
            zj.delcookie("device");
            zj.delcookie("xhkjedu");
            zj.delcookie("historyarr");
            window.location.href = "login.html";

        }, function() {

        });

    });
    //规定主要内容高度
    $(".main_important").outerHeight($("body").height() - $(".logo").outerHeight() - 8);
    //切换章节
    $(".knob").click(function(e) {
        if (e && e.stopPropagation) {
            e.stopPropagation(); //因此它支持W3C的stopPropagation()方法
        } else {
            window.event.cancelBubble = true; //否则，我们需要使用IE的方式来取消事件冒泡
        }
        if ($(this).find(".select_chapter_list").css("display") == "block") {
            $(this).find(".select_chapter_list").stop().slideUp();
        } else {
            $(this).find(".select_chapter_list").stop().slideDown();
        }
    });

    $("body").click(function() {
        $(".select_chapter_list").slideUp();
    });
    //切换菜单
    $(".left_menu div").click(function() {
        $(this).addClass("pitch_on").siblings().removeClass("pitch_on");
        zj.addcookie("pageType", $(this).attr("data-url"));
        zj.addcookie("pageTypeNumber", $(this).attr("number"))
    });
    $("body").delegate(".loadurl", "click", function() {
        var url = $(this).attr("data-url");
        $('#content').fadeTo(10, 0);
        setTimeout(function() {
            ajaxRequest(url, $('#content'));
            $('#content').delay(10).fadeTo(600, 1);
        }, 80);


    });
    $(".main").fadeTo(1000, 1);
});
var historyarr = [];
zj.addcookie("historyarr", []);

function ajaxRequest(url, ele, parameter) {
    $.ajax({
        type: "get",
        url: url,
        cache: false,
        async: false,
        success: function(data) {
            if (window.analysistiming) {
                clearInterval(window.analysistiming);
            }
            ele.html(data);
        }
    });
    if (url != "./pages/lanclass/creating_lanclass.html") {
        historyarr.push(url);
    }
}

var event = new Vue();
window.vue_event = event;

new Vue({
    el: ".personal",
    data: {
        loginuser: ""
    },
    mounted: function() {
        var _this = this;
        classapi.post.teacherclass_index_validate_user({ xmid: 1 }, function(result) {
            if (result.code == 0) {
                _this.loginuser = result.obj;
                zj.addcookie("loginuser", JSON.stringify(result.obj));
            } else if (result.code == 1) {
                window.location.href = "login.html";
            }
        });
    }
});

new Vue({
    el: ".select_chapter",
    data: {
        loginuser: "",
        directors: [],
        predirector: {},
        nextdirector: {}
    },
    mounted: function() {
        this.validateuser();
        window.corba = {};
        var _this = this;
        event.$on("loginuser_change", function(loginuser) {
            _this.loginuser = loginuser;
        })
        if (window.innerWidth >= 1920) {
            document.getElementsByTagName("body")[0].style.fontSize = window.innerWidth / 120 + "px";
            document.getElementsByTagName("html")[0].style.fontSize = window.innerWidth / 120 + "px";
        }
        this.openinterval();
    },
    methods: {
        validateuser: function() {
            var _this = this;
            classapi.post.teacherclass_index_validate_user({ xmid: 1 }, function(result) {
                if (result.code == 0) {
                    zj.addcookie("loginuser", JSON.stringify(result.obj));
                    if (window.localStorage) {
                        window.localStorage["loginuser"] = JSON.stringify(result.obj);
                    }
                    if (zj.getcookie("loginuser")) {
                        _this.loginuser = $.parseJSON(zj.getcookie("loginuser"));
                        _this.loadDirectors();
                    } else {
                        location.href = "./login.html";
                    }
                } else if (result.code == 1) {
                    layer.msg(result.msg, { time: 1000 });
                    window.location.href = "login.html";
                }
            });
        },
        loadDirectors: function() { //获取章节目录
            var _this = this;
            var index = layer.load(0, {
                time: classapi.timeout
            });
            classapi.post.baseapi_gradeversiondirs({
                versionid: _this.loginuser.versionid,
                gradeid: _this.loginuser.bookid
            }, function(result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    var obj = result.obj;
                    _this.directors = [];
                    for (var i = 0; i < obj.length; i++) {
                        var itemData = obj[i];
                        _this.traverse_sections(obj[i], obj[i].child);
                        _this.directors.push(itemData);
                    }
                }
            });
        },
        traverse_sections: function(section, sectionchild) { //查找选中的章节
            var _this = this;
            if (section.id == this.loginuser.directorid) {
                this.loginuser.directornow = section;
                zj.addcookie("loginuser", JSON.stringify(this.loginuser));
            } else if (sectionchild && sectionchild.length > 0) {
                for (var i = 0; i < sectionchild.length; i++) {
                    _this.traverse_sections(sectionchild[i], sectionchild[i].child);
                }
            }
        },
        traverse_directors: function(section, sectionchild) { //取出当前章节对应的叶子节点
            var _this = this;
            if (section.leaf == 1) {
                this.directors.push(section.directorid);
            }
            if (sectionchild && sectionchild.length > 0) {
                for (var i = 0; i < sectionchild.length; i++) {
                    _this.traverse_sections(sectionchild[i], sectionchild[i].child);
                }
            }
        },
        loadpredirector: function() { //点击上一节
            var _this = this;
            var index = layer.load(0, {
                time: classapi.timeout
            });
            classapi.post.teacherclass_main_director_predirector({
                directorid: _this.loginuser.newdirectorid
            }, function(result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    var obj = result.obj;
                    if (obj != null) {
                        _this.loginuser.directornow = obj;
                        _this.loginuser.directorid = obj.directorid;
                        _this.loginuser.newdirectorid = obj.id;
                        _this.loginuser.directorname = obj.directorname;
                        _this.loginuser.directorcode = obj.directorcode;
                        zj.addcookie("loginuser", JSON.stringify(_this.loginuser));
                        var thisurl = "";
                        ajaxRequest(historyarr[historyarr.length - 1], $("#content"));
                    } else {
                        layer.msg("请手动选择目录！");
                    }
                }
            });
        },
        loadnextdirector: function() { //切换下一节
            var _this = this;
            var index = layer.load(0, {
                time: classapi.timeout
            });
            classapi.post.teacherclass_main_director_nextdirector({
                directorid: _this.loginuser.newdirectorid
            }, function(result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    var obj = result.obj;
                    if (obj != null) {
                        _this.loginuser.directornow = obj;
                        _this.loginuser.directorid = obj.directorid; //directorid是模板章节id
                        _this.loginuser.newdirectorid = obj.id; //id是章节id
                        _this.loginuser.directorname = obj.directorname;
                        _this.loginuser.directorcode = obj.directorcode;
                        zj.addcookie("loginuser", JSON.stringify(_this.loginuser));
                        ajaxRequest(historyarr[historyarr.length - 1], $("#content"));
                    } else {
                        layer.msg("请手动选择目录");
                    }
                }
            });
        },
        directorclick: function(director) {
            var _this = this;
            if (director.leaf == 1) {
                var index = layer.load(0, {
                    time: classapi.timeout
                });
                classapi.post.teacherclass_main_director_savedirector({
                    directorid: director.id
                }, function(result) {
                    layer.close(index);
                    if (classapi.validata(result)) {
                        _this.loginuser.directornow = director;
                        _this.loginuser.directorid = director.directorid;
                        _this.loginuser.newdirectorid = director.id;
                        _this.loginuser.directorname = director.directorname;
                        _this.loginuser.directorcode = director.directorcode;
                        zj.addcookie("loginuser", JSON.stringify(_this.loginuser));
                        $(".select_chapter_list").slideUp();
                        ajaxRequest(historyarr[historyarr.length - 1], $("#content"));
                    }
                });
            } else {
                layer.msg("当前章节不能切换");
            }
        },
        openinterval: function() {
            setInterval(function() {
                if (typeof(lanclass) == "undefined") {} else {
                    if (lanclass.socket && lanclass.socket.readyState == 1) {
                        var msg = {
                            "type": 0
                        };
                        msg = JSON.stringify(msg);
                        lanclass.socket.send(msg);
                    }
                }
            }, 10000);
        }
    }
});