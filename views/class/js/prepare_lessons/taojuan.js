$(function () {
    var j_size = parseInt($("body").css("fontSize"));
    $(".prepare_lessons_learningcase_main").height($("#content").height() - j_size);
    $(".courseware_list").height($(".prepare_lessons_learningcase_main").height() - 12 * j_size);
})
new Vue({
    el: ".taojuan_list",
    data: {
        loginuser: JSON.parse(zj.getcookie("loginuser")),
        paper_list: [],
        showpage: 10,
        currpage: 1,
        pages: 1
    },
    mounted: function () {
        this.load_data();
        this.loadpages();
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
    methods: {
        gotopage: function (newpage, oldpage) {
            this.currpage = newpage;
            this.load_data();
        },
        load_data: function () {
            var _this = this;
            var index = layer.load(0, {

                time: classapi.timeout
            });
            classapi.post.teacherclass_papers_taojuan_list({
                directorid: this.loginuser.directorid,
                currpage: this.currpage
            }, function (result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    var obj = result.obj;
                    _this.paper_list = [];
                    for (var i = 0; i < obj.length; i++) {
                        var itemData = obj[i];
                        _this.paper_list.push(itemData);
                    }
                }
            });
        },
        loadpages: function () {
            var _this = this;
            classapi.post.teacherclass_papers_taojuan_count({
                directorid: this.loginuser.directorid
            }, function (result) {
                if (classapi.validata(result)) {
                    _this.pages = result.obj;
                }
            });
        },
        show_detail: function (paper) {
            window.paper = paper;
            ajaxRequest("./pages/prepare_lessons/taojuan_detail.html", $('#content'));
        },
    }
});