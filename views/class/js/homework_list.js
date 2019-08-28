$(function () {
    var j_size = parseInt($("body").css("fontSize"));
    $(".assignment").height($("#content").height() - j_size);
    $(".assignment_main").height($(".assignment").height() - 8.8 * j_size);
})

new Vue({
    el: ".assignment",
    data: {
        pagedata: [],
        showpage: 10,
        currpage: 1,
        pages: 1,
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
        this.loadpages();
    },
    methods: {
        gotopage: function (newpage, oldpage) {
            this.currpage = newpage;
            this.loadData();
        },
        loadData: function () {
            var _this = this;
            var index = layer.load(0, {

                time: classapi.timeout
            });
            classapi.post.teacherclass_afterclass_paper_list({
                currpage: _this.currpage,
                directorid: _this.loginuser.directorid
            }, function (result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    var obj = result.obj;
                    _this.pagedata = [];
                    for (var i = 0; i < obj.length; i++) {
                        var itemData = obj[i];
                        _this.pagedata.push(itemData);
                    }
                }
            });
        },
        loadpages: function () {
            var _this = this;
            classapi.post.teacherclass_afterclass_paper_listnum({
                directorid: _this.loginuser.directorid
            }, function (result) {
                if (classapi.validata(result)) {
                    _this.pages = result.obj;
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
        }
    }
});
