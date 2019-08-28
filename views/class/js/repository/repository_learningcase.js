$(function () {
    var j_size = parseInt($("body").css("fontSize"));
    $(".prepare_lessons_learningcase_main").height($("#content").height() - j_size);
    $(".learning_list").height($(".prepare_lessons_learningcase_main").height() - 12.2 * j_size);
    //经过效果
    $(".prepare_lessons_learningcase_main").delegate(".courseware_list .courseware_li", "mouseenter", function () {
        $(this).find(".courseware_li_main").css("border-bottom", "1px dashed rgba(255,255,255,0)");
        if ($(this).prev().length == 1) {
            $(this).prev().find(".courseware_li_main").css("border-bottom", "1px dashed rgba(255,255,255,0)");
        }
    })
    $(".prepare_lessons_learningcase_main").delegate(".courseware_list .courseware_li", "mouseleave", function () {
        $(this).find(".courseware_li_main").css("border-bottom", "1px dashed #cacaca");
        if ($(this).prev().length == 1) {
            $(this).prev().find(".courseware_li_main").css("border-bottom", "1px dashed #cacaca");
        }
    })
    //打开试卷分析
    $(".prepare_lessons_learningcase_main").delegate(".learning_case_li_main_information p span.text_analysis", "click", function () {
        $(".mask_layer").css("display", "block");
        ajaxRequest("./pages/repository/examinationpaper_analysis.html", $(".pop-up_box"));
        $(".pop-up_box").css("display", "block");
    })
})

new Vue({
    el: ".prepare_main",
    data: {
        showpage: 10,
        currpage: 1,
        pages: 1,
        pagedata: [],
        loginuser: JSON.parse(zj.getcookie("loginuser"))
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
            this.loadData();
        },
        loadData: function () {
            var _this = this;
            var index = layer.load(0, {

                time: classapi.timeout
            });
            classapi.post.teacherclass_prepare_ckzl_xuean({
                directorid: _this.loginuser.directorid,
                currpage: _this.currpage
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
            classapi.post.teacherclass_prepare_ckzl_xueancount({
                directorid: _this.loginuser.directorid
            }, function (result) {
                if (classapi.validata(result)) {
                    _this.pages = result.obj;
                }
            });
        },
        analyzeClick: function (paperid) {
            window.paperid = paperid;
            $(".mask_layer").css("display", "block");
            ajaxRequest("./pages/repository/examinationpaper_analysis.html", $(".pop-up_box"));
            $(".pop-up_box").css("display", "block");
        },
        show_detail: function (paper) {
            window.paper = paper;
            ajaxRequest("./pages/repository/learningcase_detail.html", $('#content'));
        }
    }
});