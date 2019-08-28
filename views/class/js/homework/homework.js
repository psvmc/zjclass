$(function () {
    var j_size = parseInt($("body").css("fontSize"));
    $(".assignment").height($("#content").height() - 12.8 * j_size);
    $(".assignment_main").height($(".assignment").height() - 12.5 * j_size);
})

var push_homework_main = new Vue({
    el: ".push_homework_main",
    data: {
        loginuser: JSON.parse(zj.getcookie("loginuser")),
        xadatas: []
    },
    filters: {
        xuantypeFilter: function (type) {
            //14同步训练15单元测试16周测月考17阶段检测18专项训练
            var typename = "";
            if (type == 14) {
                typename = "同步训练1";
            } else if (type == 15) {
                typename = "单元测试";
            } else if (type == 16) {
                typename = "周测月考";
            } else if (type == 17) {
                typename = "阶段检测";
            } else if (type == 18) {
                typename = "专项训练";
            }
            return typename;
        },
        timeFilter: function (time) {
            if (time) {
                if (time.length > 16) {
                    time = time.substring(0, 16);
                }
                return time;
            } else {
                return "";
            }
        },
        nameFilter: function (name) {
            if (name.length > 30) {
                name = name.substring(0, 30);
            }
            return name;
        }
    },
    mounted: function () {
        this.loadxadata();
        this.$nextTick(function () {
            $(".assignment_main").height($(".assignment").height() - $(".assignment_title").outerHeight() - $(".alternate").outerHeight() - 22);
        })
    },
    methods: {
        loadxadata: function () {
            var _this = this;
            var cache_data = zj.cache_get("homework_push_data");
            if (cache_data) {
                _this.xadatas = [];
                for (var i = 0; i < cache_data.length; i++) {
                    var itemData = cache_data[i];
                    _this.xadatas.push(itemData);
                }
            } else {
                layer.load(0, {

                    time: classapi.timeout
                });
            }
            classapi.post.teacherclass_prepare_taojuan_lately({
                directorid: _this.loginuser.directorid,
                pagesize: 3
            }, function (result) {
                layer.closeAll();
                if (classapi.validata(result)) {
                    var obj = result.obj;
                    _this.xadatas = obj;
                    zj.cache_save("homework_push_data", _this.xadatas);
                }
            });
        },
        xadetialClick: function (paper) {
            window.paper = paper;
            ajaxRequest("./pages/homework/push_homework_details.html", $('#content'));
        }
    }
})

var assignment = new Vue({
    el: ".assignment",
    data: {
        pagedata: [],
        loginuser: JSON.parse(zj.getcookie("loginuser"))
    },
    filters: {
        typeFilter: function (type) {
            //40预习41随堂42课后作业51章节组题52知识点组题53每日练习54套卷70学生推题80教师周推81教师单推
            var typename = "";
            if (type == 40) {
                typename = "预习作业";
            } else if (type == 41) {
                typename = "随堂练习";
            } else if (type == 42) {
                typename = "课后作业";
            } else if (type == 51) {
                typename = "章节组题练习";
            } else if (type == 52) {
                typename = "知识点组题练习";
            } else if (type == 53) {
                typename = "每日练习";
            } else if (type == 54) {
                typename = "套卷练习";
            } else if (type == 70) {
                typename = "学生推题";
            } else if (type == 80) {
                typename = "周推作业";
            } else if (type == 81) {
                typename = "补偿练习";
            }
            return typename;
        },
        timeFilter: function (time) {
            if (time) {
                if (time.length > 16) {
                    time = time.substring(0, 16);
                }
                return time;
            } else {
                return "";
            }
        }
    },
    mounted: function () {
        this.loadData();
    },
    methods: {
        loadData: function () {
            var _this = this;
            var cache_data = zj.cache_get("homework2_data");
            if (cache_data) {
                _this.pagedata = [];
                for (var i = 0; i < cache_data.length; i++) {
                    var itemData = cache_data[i];
                    _this.pagedata.push(itemData);
                }
            } else {
                layer.load(0, {

                    time: classapi.timeout
                });
            }
            classapi.post.teacherclass_afterclass_paper_lately({
                directorid: _this.loginuser.directorid
            }, function (result) {
                layer.closeAll();
                if (classapi.validata(result)) {
                    var obj = result.obj;
                    _this.pagedata = [];
                    for (var i = 0; i < obj.length; i++) {
                        var itemData = obj[i];
                        _this.pagedata.push(itemData);
                    }
                    zj.cache_save("homework2_data", _this.pagedata);
                }
            });
        },
        buzhiClick: function (homework) {
            if (homework.status == 21) {
                var _this = this;
                var index = layer.load(0, {

                    time: classapi.timeout
                });
                classapi.post.teacherclass_quesitons_paper_tostudent({
                    paperid: homework.paperid,
                    groupid: homework.groupid
                }, function (result) {
                    layer.close(index);
                    if (classapi.validata(result)) {
                        layer.msg("布置成功");
                        homework.status = 22;
                    }
                });
            } else {
                layer.msg("该作业已布置！");
            }
        },
        piyueClick: function (homework) {
            if (homework.tcount > 0 && homework.qcount != homework.tcount) {
                window.homework = homework;
                ajaxRequest("./pages/perusal/read_over.html", $('#content'));
            } else {
                layer.msg("暂无批阅任务！");
            }
        },
        show_detail: function (paper) {
            window.paper = paper;
            ajaxRequest("./pages/homework/homework_details.html", $('#content'));
        },
        paper_more: function () {
            ajaxRequest("./pages/zujuan/manualquestion.html", $('#content'));
            zj.addcookie("pageType", "./pages/prepare_lessons.html")
        },
        paper_next: function () {    //点击下节预习作业
            var _this = this;
            var index = layer.load(0, {
                time: classapi.timeout
            });
            classapi.post.teacherclass_main_director_nextdirector({
                directorid: _this.loginuser.newdirectorid
            }, function (result) {
                console.log(result)
                layer.close(index);
                if (classapi.validata(result)) {
                    var obj = result.obj;
                    if (obj) {
                        window.vue_event.$emit('loginuser_change', _this.loginuser);
                        _this.loginuser.directornow = obj;
                        _this.loginuser.directorid = obj.directorid;        //directorid是模板章节id
                        _this.loginuser.newdirectorid = obj.id;        //id是章节id
                        _this.loginuser.directorname = obj.directorname;
                        _this.loginuser.directorcode = obj.directorcode;
                        zj.addcookie("loginuser", JSON.stringify(_this.loginuser));
                        zj.addcookie("pageType", "./pages/prepare_lessons.html");
                        zj.addcookie("pageTypeNumber", "0");
                       ajaxRequest("./pages/zujuan/manualquestion.html", $('#content'));
                    } else {
                        layer.msg("请手动选择章节");
                    }
                }
            });

        }
    }
});