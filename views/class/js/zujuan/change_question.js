$(function () {
    $(".change_question .padlock").click(function () {
        $(".mask_layer").css("display", "none");
        $(".pop-up_box").css("display", "none");
    })
})

new Vue({
    el: ".change_question",
    data: {
        loginuser: $.parseJSON(zj.getcookie("loginuser")),
        paper: window.paper,
        paperid: window.paper.paperid,
        paper_type: window.paper_type, //1:自由组题 2:智能组题
        groups: window.groups,
        groupids: window.groupids,
        questionType: window.questionType,
        testids: window.testids,
        papertype: window.papertype,
        ques: window.ques, //原试题
        ques_list: []
    },
    mounted() {
        this.change_que_list();
    },
    filters: {
        complexity_filter: function (complexity) {
            var complexity_str = "";
            for (let i = 0; i < complexity; i++) {
                complexity_str += "★";
            }
            return complexity_str;
        }
    },
    methods: {
        change_que_list: function () {
            var _this = this;
            var index = layer.load(0, {

                time: classapi.timeout
            });

            classapi.post.teacherclass_quesitons_paper_changequestion({
                subjectid: this.loginuser.subjectid,
                groupids: this.groupids,
                directorid: this.loginuser.directorid,
                code: this.loginuser.directorcode,
                startlevel: this.ques.complexity,
                questionType: this.questionType,
                testids: this.testids,
                papertype: this.papertype
            }, function (result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    if (result.obj) {
                        _this.ques_list = [];
                        for (let i = 0; i < result.obj.length; i++) {
                            const ques = result.obj[i];
                            ques.docHtml = JSON.parse(ques.docHtml);
                            _this.ques_list.push(ques);
                        }
                        if (result.obj.length == 0) {
                            layer.msg("没有可换的试题！");
                        }
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
                        //docHtml = docHtml + "" + (i + 1) + "." + sonques.docHtml;
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
        change_ques: function (ques) {

            var _this = this;
            var index = layer.load(0, {

                time: classapi.timeout
            });

            classapi.post.questionapi_changequesiton({
                paperid: this.paperid,
                typeTextId: ques.typeTextId,
                oldtestid: this.ques.testid,
                oldscore: 0,
                newtestid: ques.testid,
                newscore: 0
            }, function (result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    layer.msg("换题成功");
                    $(".pop-up_box").css("display", "none");
                    $(".mask_layer").css("display", "none");
                    event.$emit('load_paper_detail');
                }
            });
        }
    }
});