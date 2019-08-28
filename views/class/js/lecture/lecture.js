$(function () {
    var j_size = parseInt($("body").css("fontSize"));
    $(".lecture_main").height($("#content").height() - j_size);
    $(".lecture_body").height($(".lecture_main").height() - 7.8 * j_size);
});

new Vue({
    el: ".prepare_main",
    data: {
        showpage: 10,
        currpage: 1,
        pages: 1,
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
        this.loadpages();
    },
    methods: {
        gotopage: function (newpage, oldpage) {
            this.currpage = newpage;
            zj.cache_clear("lecture_data");
            this.loadData();
        },
        loadData: function () {
            var _this = this;
            var cache_data = zj.cache_get("lecture_data");
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
            classapi.post.teacherclass_inclass_paper_work({
                currpage: this.currpage,
                status: 22
            }, function (result) {
                layer.closeAll();
                if (classapi.validata(result)) {
                    var obj = result.obj;
                    _this.pagedata = [];
                    for (var i = 0; i < obj.length; i++) {
                        var itemData = obj[i];
                        _this.pagedata.push(itemData);
                    }
                    if (_this.currpage == 1) {
                        zj.cache_save("lecture_data", _this.pagedata);
                    }
                }
            });
        },
        loadpages: function () {
            var _this = this;
            classapi.post.teacherclass_inclass_paper_worknum({
                status: 22
            }, function (result) {
                if (classapi.validata(result)) {
                    _this.pages = result.obj;
                }
            });
        },
        jiangpingClick: function (homework) {
            window.homework = homework;
            ajaxRequest("./pages/give_lessons/shouke_comment.html", $('#content'));
        },
        tongjiClick: function (homework) {
            if (homework.tcount > 0) {
                window.homework = homework;
                ajaxRequest("./pages/give_lessons/shouke_single_statistics.html", $('#content'));
            }
        },
        piyueClick: function (homework) {
            if (homework.tcount > 0) {
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