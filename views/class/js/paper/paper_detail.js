$(function () {
    $(".prepare_lessons_manualquestion_main").height($("#content").height() - 12);
    $(".all_question").height($(".prepare_lessons_manualquestion_main").height() - $(".prepare_head").outerHeight() - $(".test_paper_title").outerHeight() - $(".test_paper_opreation").outerHeight() - 10)
    //打开试卷分析
    $(".check_parsing").click(function () {
        $(".mask_layer").css("display", "block");
        ajaxRequest("./pages/repository/examinationpaper_analysis.html", $('.pop-up_box'));
        $(".pop-up_box").css("display", "block");
    })
})


new Vue({
    el: ".test_paper",
    data: {
        paper: window.paper,
        paperid: window.paper.paperid,
        paper_type: window.paper_type, //1:自由组题 2:智能组题
        groupids: window.groupids,
        loginuser: $.parseJSON(zj.getcookie("loginuser")),
        type_ques_list: [],
        is_star: false
    },
    mounted() {
        this.load_paper_detail();
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
        get_dochtml_all: function (selectques, index) {
            var docHtml = "";

            if (selectques.docHtml && selectques.docHtml.docHtml) {
                docHtml = docHtml + selectques.docHtml.docHtml;
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
        }

    }
});