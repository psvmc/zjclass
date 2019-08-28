$(function () {
    //打开试卷分析
    $(".check_parsing").click(function () {
        $(".mask_layer").css("display", "block");
        ajaxRequest("./pages/repository/examinationpaper_analysis.html", $('.pop-up_box'));
        $(".pop-up_box").css("display", "block");
    })
    //页面高度
    var j_size = parseInt($("body").css("fontSize"));
    $(".prepare_lessons_manualquestion_main").height($("#content").height() - j_size);
    $(".all_question").height($(".prepare_lessons_manualquestion_main").height() - 12.4 * j_size);

    $(".test_paper").delegate(".test_paper_question ul li.unenshrine", "click", function () {
        if ($(this).hasClass("enshrine")) {
            $(this).removeClass("enshrine");
        } else {
            $(this).addClass("enshrine");
        }
    })
});


new Vue({
    el: ".test_paper",
    data: {
        paper: window.paper,
        paperid: window.paper.paperid,
        paper_type: window.paper_type, //1:自由组题 2:智能组题
        groupids: window.groupids,
        loginuser: $.parseJSON(zj.getcookie("loginuser")),
        type_ques_list: [],
        is_star: false,
        papername: window.paper.papername
    },
    mounted() {
        this.load_paper_detail();
        var _this = this;
        window.vue_event.$on("load_paper_detail", function (data) {
            _this.load_paper_detail();
        })
    },
    computed: {
        ques_count: function () {
            var ques_num = 0;
            for (let i = 0; i < this.type_ques_list.length; i++) {
                const ques_type = this.type_ques_list[i];
                ques_num += ques_type.quesitons.length;
            }
            return ques_num;
        }
    },
    methods: {
        load_paper_detail: function () {
            var _this = this;
            var index = layer.load(0, {
                shade: [0.1, '#fff'], //0.1透明度的白色背景
                time: classapi.timeout
            });

            classapi.post.teacherclass_quesitons_paper_quesitons({
                paperid: this.paper.paperid
            }, function (result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    var obj = result.obj;
                    _this.type_ques_list = [];
                    for (var i = 0; i < obj.length; i++) {
                        var type_ques = obj[i];
                        for (var j = 0; j < type_ques.quesitons.length; j++) {
                            var ques = type_ques.quesitons[j];
                            ques.docHtml = JSON.parse(ques.docHtml);
                        }
                        _this.type_ques_list.push(type_ques);
                    }

                }
            });
        },
        get_dochtml_all: function (selectques) {
            var docHtml = "";

            if (selectques.docHtml && selectques.docHtml.docHtml) {
                docHtml = selectques.docHtml.docHtml;
                var ctype = selectques.ctype;
                if (ctype == 6 || ctype == 7 || ctype == 8 || ctype == 11) {
                    var sonquesList = selectques.docHtml.questions;
                    for (var i = 0; i < sonquesList.length; i++) {
                        var sonques = sonquesList[i];
                        var son_ctype = sonques.ctype;
                        docHtml = docHtml + "" + (i + 1) + "." + sonques.docHtml;
                        if (son_ctype == 1 || son_ctype == 2) {
                            //docHtml = docHtml + sonques.selections.join("");
                            var doc = sonques.selections;
                            if (doc[0].indexOf("A.") == -1) {
                                var questionnum = ["A.", "B.", "C.", "D."];
                                for (var i = 0; i < doc.length; i++) {
                                    doc[i] = "<p>" + questionnum[i] + doc[i] + "</p>";
                                    docHtml = docHtml + doc[i];
                                }
                            } else {
                                docHtml = docHtml + sonques.selections.join("");
                            }
                        }
                    }
                } else if (ctype == 1 || ctype == 2) {
                    if (selectques.docHtml.selections) {
                        //docHtml = docHtml + selectques.docHtml.selections.join("");
                        var doc = selectques.docHtml.selections;
                        if (doc[0].indexOf("A.") == -1) {
                            var questionnum = ["A.", "B.", "C.", "D."];
                            for (var i = 0; i < doc.length; i++) {
                                doc[i] = "<p>" + questionnum[i] + doc[i] + "</p>";
                                docHtml = docHtml + doc[i];
                            }
                        } else {
                            docHtml = docHtml + selectques.docHtml.selections.join("");
                        }
                    }
                }
            }

            return docHtml;
        },
        star_paper: function () {
            var _this = this;
            var index = layer.load(0, {
                shade: [0.1, '#fff'], //0.1透明度的白色背景
                time: classapi.timeout
            });

            if (this.is_star) {
                classapi.post.teacherclass_paper_canclecollect({
                    paperid: this.paper.paperid
                }, function (result) {
                    layer.close(index);
                    if (classapi.validata(result)) {
                        layer.msg("取消收藏成功");
                        _this.is_star = false;
                    }
                });
            } else {
                classapi.post.teacherclass_quesitons_paper_quesitons({
                    paperid: this.paper.paperid
                }, function (result) {
                    layer.close(index);
                    if (classapi.validata(result)) {
                        layer.msg("收藏成功");
                        _this.is_star = true;
                    }
                });
            }

        },
        star_ques: function (ques) {
            var _this = this;
            var index = layer.load(0, {
                shade: [0.1, '#fff'], //0.1透明度的白色背景
                time: classapi.timeout
            });
            if (ques.collect > 0) {
                classapi.post.paperQuestion_deleteCollectQuestion({
                    collectiontype: "t_question",
                    collectiontypeid: ques.testid
                }, function (result) {
                    layer.close(index);
                    if (classapi.validata(result)) {
                        layer.msg("取消收藏成功");
                        ques.collect = 0;
                    }
                });
            } else {
                classapi.post.paperQuestion_saveCollectQuestion({
                    collectiontype: "t_question",
                    collectiontypeid: ques.testid
                }, function (result) {
                    layer.close(index);
                    if (classapi.validata(result)) {
                        layer.msg("收藏成功");
                        ques.collect = 1;
                    }
                });
            }
        },
        del_ques: function (type_ques, ques) {
            var _this = this;
            if (this.ques_count == 1) {
                layer.msg("至少保留一个试题");
            } else {
                var index = layer.load(0, {
                    shade: [0.1, '#fff'], //0.1透明度的白色背景
                    time: classapi.timeout
                });
                classapi.post.teacherclass_quesitons_paper_deletequesiton({
                    paperid: this.paperid,
                    testid: ques.testid,
                    typeid: ques.typeTextId
                }, function (result) {
                    layer.close(index);
                    if (classapi.validata(result)) {
                        _this.load_paper_detail();
                        // type_ques.quesitons = _this.remove_arr_obj(type_ques.quesitons, ques);
                        layer.msg("删除试题成功");
                    }
                });
            }

        },
        remove_arr_obj: function (_arr, _obj) {
            var length = _arr.length;
            for (var i = 0; i < length; i++) {
                if (_arr[i] == _obj) {
                    if (i == 0) {
                        _arr.shift(); //删除并返回数组的第一个元素
                        return _arr;
                    } else if (i == length - 1) {
                        _arr.pop(); //删除并返回数组的最后一个元素
                        return _arr;
                    } else {
                        _arr.splice(i, 1); //删除下标为i的元素
                        return _arr;
                    }
                }
            }
        },
        save_as_homework: function () {
            $(".mask_layer").css("display", "block");
            $(".pop-up_box").css("display", "block");
            ajaxRequest("./pages/zujuan/assign_homework.html", $('.pop-up_box'));

        },
        change_que: function (ques) {
            $(".mask_layer").css("display", "block");
            $(".pop-up_box").css("display", "block");
            window.ori_ques = ques;
            var testids_arr = [];
            for (let i = 0; i < this.type_ques_list.length; i++) {
                var type_ques = this.type_ques_list[i];
                for (let j = 0; j < type_ques.quesitons.length; j++) {
                    var quesitem = type_ques.quesitons[j];
                    testids_arr.push(quesitem.testid);
                }
            }
            window.testids = testids_arr.join(",");
            window.papertype = this.paper.type;
            window.groupids = this.groupids;
            window.questionType = ques.typeTextId;
            window.ques = ques;
            ajaxRequest("./pages/zujuan/change_question.html", $('.pop-up_box'));

        }
    }
});