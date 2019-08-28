$(function () {
    $(".check_parsing h2 img").click(function () {
        $(".mask_layer").css("display", "none");
        $(".pop-up_box").css("display", "none");
    })
});
new Vue({
    el: ".check_parsing_main",
    data: {
        question: window.question
    },
    mounted: function () {

    },
    filters: {
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
        get_dochtml_all: function (question) {
            var docHtml = "";
            if (question.docHtml && question.docHtml.docHtml) {
                docHtml = question.docHtml.docHtml;
                var ctype = question.ctype;
                if (ctype == 6 || ctype == 7 || ctype == 8 || ctype == 11) {
                    var sonquesList = question.docHtml.questions;
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
                    if (question.docHtml.selections) {
                        //docHtml = docHtml + question.docHtml.selections.join("");
                        var doc = question.docHtml.selections;
                        if (doc[0].indexOf("A.") == -1) {
                            var questionnum = ["A.", "B.", "C.", "D."];
                            for (var i = 0; i < doc.length; i++) {
                                doc[i] = "<p>" + questionnum[i] + doc[i] + "</p>";
                                docHtml = docHtml + doc[i];
                            }
                        } else {
                            docHtml = docHtml + question.docHtml.selections.join("");
                        }
                    }
                }
            }

            return docHtml;
        },

        get_answer_all: function (question) {
            if (question.docHtml) {
                var ctype = question.ctype;
                if (ctype == 6 || ctype == 7 || ctype == 8 || ctype == 11) {
                    var ans_str = "";
                    var sonquesList = question.docHtml.questions;
                    for (var i = 0; i < sonquesList.length; i++) {
                        var sonques = sonquesList[i];
                        if (sonques.answers && sonques.answers.length > 0) {
                            if (sonques.answers.join("") == "") {
                                ans_str = ans_str + "" + (i + 1) + ". 暂无";
                            } else {
                                ans_str = ans_str + '<p class="smallquestion"><i>' + (i + 1) + '</i><img src="img/public/smallquestion.png"/></p>' + sonques.answers.join("");
                            }

                        } else {
                            ans_str = ans_str + "" + (i + 1) + ". 暂无";
                        }
                    }
                    return ans_str;
                } else {
                    var answers = question.docHtml.answers;
                    if (answers) {
                        return answers.join("");
                    } else {
                        return "暂无";
                    }
                }
            } else {
                return "暂无";
            }
        },
        get_jiexi_all: function (question) {
            if (question.docHtml) {
                var ctype = question.ctype;
                if (ctype == 6 || ctype == 7 || ctype == 8 || ctype == 11) {
                    var analyzes_str = "";
                    var sonquesList = question.docHtml.questions;
                    for (var i = 0; i < sonquesList.length; i++) {
                        var sonques = sonquesList[i];
                        if (sonques.analyzes && sonques.analyzes.length > 0) {
                            if (sonques.analyzes.join("") == "") {
                                analyzes_str = analyzes_str + '<p class="smallquestion"><i>' + (i + 1) + '</i><img src="img/public/smallquestion.png"/></p>' + "暂无";
                            } else {
                                analyzes_str = analyzes_str + '<p class="smallquestion"><i>' + (i + 1) + '</i><img src="img/public/smallquestion.png"/></p>' + sonques.analyzes.join("");
                            }

                        } else {
                            analyzes_str = analyzes_str + '<p class="smallquestion"><i>' + (i + 1) + '</i><img src="img/public/smallquestion.png"/></p>' + "暂无";
                        }
                    }
                    return analyzes_str;
                } else {
                    var analyzes = question.docHtml.analyzes;
                    if (analyzes && analyzes.length > 0) {
                        return analyzes.join("");
                    } else {
                        return "暂无";
                    }
                }
            } else {
                return "暂无";
            }
        },
        star_ques: function (ques) {
            var _this = this;
            var index = layer.load(0, {

                time: classapi.timeout
            });
            if (ques.collect == 1) {
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