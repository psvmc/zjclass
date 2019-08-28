var prepare_main = new Vue({
    el: ".prepare_main",
    data: {
        pagedata: []
    },
    filters: {
        typeFilter(type) {
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
        timeFilter(time) {
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
    mounted() {
        this.loadData();
        this.$nextTick(function () {
            $(".prepare_body").height($("#content").height() - 4.5 * parseInt($("body").css("fontSize")));
        })
    },
    methods: {
        loadData: function () {
            var _this = this;
            var cache_data = zj.cache_get("prepare_lessons_data");
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
            classapi.post.teacherclass_prepare_work_lately({}, function (result) {
                if (classapi.validata(result)) {
                    var obj = result.obj;
                    _this.pagedata = [];
                    for (var i = 0; i < obj.length; i++) {
                        var itemData = obj[i];
                        _this.pagedata.push(itemData);
                    }
                    zj.cache_save("prepare_lessons_data", _this.pagedata);
                }
                layer.closeAll();
            });
        },
        jiangpingClick: function (homework) {
            //console.info(homework);
            window.homework = homework;
            ajaxRequest("./pages/comment/comment_appraise.html", $('#content'));
        },
        tongjiClick: function (homework) {
            if (homework.tcount > 0) {
                window.homework = homework;
                ajaxRequest("./pages/student_analysis/single_statistics.html", $('#content'));
            }
        },
        piyueClick: function (homework) {
            if (homework.tcount > 0 && homework.qcount != homework.tcount) {
                window.homework = homework;
                ajaxRequest("./pages/perusal/read_over.html", $('#content'));
            }

        },
        show_detail: function (paper) {
            window.paper = paper;
            ajaxRequest("./pages/paper/paper_detail.html", $('#content'));
        }
    }
});

/*
new Vue({
    el: ".push",
    data: {
        loginuser: JSON.parse(zj.getcookie("loginuser")),
        xadatas: []
    },
    filters: {
        xuantypeFilter(type) {
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
        timeFilter(time) {
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
    mounted() {
        this.loadxadata();
    },
    methods: {
        loadxadata: function () {
            var _this = this;
            classapi.post.teacherclass_prepare_taojuan_lately({
                directorid: _this.loginuser.directorid,
                pagesize: 2
            }, function (result) {
                if (classapi.validata(result)) {
                    var obj = result.obj;
                    _this.xadatas = obj;
                }
            });
        },
        show_detail: function (paper) {
            window.paper = paper;
            ajaxRequest("./pages/paper/paper_detail.html", $('#content'));
        },
        xadetialClick: function (paper) {
            window.paper = paper;
            ajaxRequest("./pages/homework/push_homework_details.html", $('#content'));
        }
    }
})*/
