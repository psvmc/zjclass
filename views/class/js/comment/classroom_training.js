$(function () {
    var j_size = parseInt($("body").css("fontSize"));
    $(".lecture_main").height($("#content").height() - j_size);
});


new Vue({
    el: ".homework_assigned_list",
    data: {
        pagedata: [],
        loginuser: JSON.parse(zj.getcookie("loginuser"))
    },
    mounted: function () {
        this.loadData();
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
    methods: {
        loadData: function () {     //获取当堂训练
            var _this = this;
            var index = layer.load(0, {
                time: classapi.timeout
            });
            classapi.post.teacherclass_inclass_paper_list({
                directorid: this.loginuser.directorid
            }, function (result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    var obj = result.obj;
                    _this.pagedata = [];
                    for (var i = 0; i < obj.length; i++) {
                        var itemData = obj[i];
                        itemData.isbuzhi = false;
                        _this.pagedata.push(itemData);
                    }
                }
            });
        },
        buzhi: function (homework) {
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
                    homework.isbuzhi = true;
                    window.homework = homework;
                    ajaxRequest("./pages/give_lessons/shouke_comment_appraise.html", $('.homework_detail'));
                }
            });
        },
        delecthomework: function (homework, num) {    //删除已布置的作业
            var _this = this;
            var index = layer.load(0, {
                time: classapi.timeout
            });
            classapi.post.teacherclass_paper_delete({
                paperid: homework.paperid,
                groupid: homework.groupid
            }, function (result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    _this.pagedata.splice(num, 1);
                }
            });
        }
    }
});