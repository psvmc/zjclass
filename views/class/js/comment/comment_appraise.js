$(function () {
    if ($(".homework_assigned").length > 0) {
        $(".comment_appraise_main .prepare_head").remove();
        $(".comment_appraise_body").height($("#content").height() - $(".prepare_head").height() - $(".homework_assigned").outerHeight() - 24)
    } else {
        $(".comment_appraise_main").height($("#content").height() - 12);
        $(".comment_appraise_body").height($(".comment_appraise_main").height() - $(".prepare_head").height() - 6);
    }

    /*全屏*/
    $(".job_information_main_operation .full").click(function () {
        if ($(this).text() == "全屏") {
            $(".main").addClass("all_screen");
            $(this).html("<img src=\"img/comment/full.png\"/>还原");
            $(".prepare_head").css("display", "none");
            $(".comment_appraise_main").height($("#content").height() - 12);
            $(".comment_appraise_body").height($(".comment_appraise_main").height() - 6);
            $(".backtrack").remove();

        } else {
            $(".main").removeClass("all_screen");
            $(this).html("<img src=\"img/comment/full.png\"/>全屏");
            $(".full").before("<button type=\"button\" class=\"backtrack\"><img src=\"img/public/backtrack.png\"/>返回</button>");
            $(".prepare_head").css("display", "block");
            if ($(".homework_assigned").length > 0) {
                $(".comment_appraise_main .prepare_head").remove();
                $(".comment_appraise_body").height($("#content").height() - $(".prepare_head").height() - $(".homework_assigned").outerHeight() - 24)
            } else {
                $(".comment_appraise_main").height($("#content").height() - 12);
                $(".comment_appraise_body").height($(".comment_appraise_main").height() - $(".prepare_head").height() - 6);
            }
        }
    });
    //点击返回
    $(".job_information_main_operation").delegate(".backtrack", "click", function () {
        ajaxRequest(historyarr[historyarr.length - 2], $('#content'));
    });
    //打开错误原因分析
    //$(".errorcause_analysis").click(function(){
    //	$(".mask_layer").css("display", "block");
    //	ajaxRequest("./pages/comment/errorcause_analysis.html", $('.pop-up_box'));
    //	$('.pop-up_box').css("display", "block");
    //})
});

new Vue({
    el: ".comment_appraise_body",
    data: {
        selectindex: 0,
        paperid: window.homework.paperid,
        groupid: window.homework.groupid,
        homework: window.homework,
        questions: [],
        question_detail: {
            avgtime: "",
            mintime: "",
            uservo: {}
        },
        question_detail2: [],
        errornum: 0
    },
    computed: {
        selectques: function () {
            if (this.questions[this.selectindex]) {
                return this.questions[this.selectindex];
            }
            return {};
        },
        select_dochtml: function () {
            var docHtml = "";
            var _this = this;
            if (this.questions[this.selectindex]) {
                var selectques = this.questions[this.selectindex];
                if (selectques.docHtml && selectques.docHtml.docHtml) {
                    docHtml = selectques.docHtml.docHtml;
                    var ctype = selectques.ctype;
                    if (ctype == 6 || ctype == 7 || ctype == 8 || ctype == 11) {
                        var sonquesList = selectques.docHtml.questions;
                        for (var i = 0; i < sonquesList.length; i++) {
                            var sonques = sonquesList[i];
                            var son_ctype = sonques.ctype;
                            docHtml = docHtml + '<p class="smallquestion"><i>' + (i + 1) + '</i><img src="img/public/smallquestion.png"/></p>' + sonques.docHtml;
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
                            // docHtml = docHtml + selectques.docHtml.selections.join("");
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
            }

            return docHtml;
        },
        select_answers: function () {
            if (this.questions[this.selectindex]) {
                var selectques = this.questions[this.selectindex];
                if (selectques.docHtml) {
                    var ctype = selectques.ctype;
                    if (ctype == 6 || ctype == 7 || ctype == 8 || ctype == 11) {
                        var ans_str = "";
                        var sonquesList = selectques.docHtml.questions;
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
                        var answers = selectques.docHtml.answers;
                        if (answers) {
                            return answers.join("");
                        } else {
                            return "暂无";
                        }
                    }
                } else {
                    return "暂无";
                }
            } else {
                return "暂无";
            }

        },
        select_analyzes: function () {
            if (this.questions[this.selectindex]) {
                var selectques = this.questions[this.selectindex];
                if (selectques.docHtml) {

                    var ctype = selectques.ctype;
                    if (ctype == 6 || ctype == 7 || ctype == 8 || ctype == 11) {
                        var analyzes_str = "";
                        var sonquesList = selectques.docHtml.questions;
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
                        var analyzes = selectques.docHtml.analyzes;
                        if (analyzes && analyzes.length > 0) {
                            return analyzes.join("");
                        } else {
                            return "暂无";
                        }
                    }
                } else {
                    return "暂无";
                }
            } else {
                return "暂无";
            }
        }
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
        rightratefilter(ques) {
            var scount = ques.scount;
            var ccount = ques.ccount;
            if (scount == 0) {
                return 0;
            } else {
                return (parseFloat(ccount) * 100 / scount).toFixed(0);
            }
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
    },
    methods: {
        rightrate_error_show(ques) {
            var scount = ques.scount;
            var ccount = ques.ccount;
            if (scount == 0) {
                return true;
            } else {
                return (parseFloat(ccount) * 100 / scount) < 60;
            }
        },
        loadData: function () {
            var _this = this;
            var index = layer.load(0, {
                time: classapi.timeout
            });
            classapi.post.paperapi_paperquestions({
                paperid: this.paperid,
                groupid: this.groupid
            }, function (result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    var obj = result.obj;
                    _this.questions = [];
                    for (var i = 0; i < obj.length; i++) {
                        var itemData = obj[i];
                        if (itemData.docHtml) {
                            itemData.docHtml = JSON.parse(itemData.docHtml);
                        }

                        _this.questions.push(itemData);
                    }

                    if (_this.questions.length > 0) {
                        _this.loadData2();
                        _this.loadData3();
                        _this.loaderrorcasenum();
                    }
                }
            });
        },
        loadData2: function () {
            var _this = this;
            var index = layer.load(0, {
                time: classapi.timeout
            });
            classapi.post.teacherclass_paper_commented_questionuser({
                paperid: this.paperid,
                groupid: this.groupid,
                questionid: this.questions[this.selectindex].testid
            }, function (result) {
                if (classapi.validata(result)) {
                    var obj = result.obj;
                    if(obj.avgtime>=60) {
                        var avgminutes=parseInt(obj.avgtime/60);
                        var avgseconds=obj.avgtime%60;
                        obj.avgtime=avgminutes+"分"+avgseconds+"秒";
                    }else if(obj.avgtime<60&&obj.avgtime>0){
                        obj.avgtime=obj.avgtime+"秒";
                    }else{
                        obj.avgtime="";
                    }
                    if(obj.mintime>=60) {
                        var mintime=parseInt(obj.avgtime/60);
                        var mintime=obj.avgtime%60;
                        obj.mintime=avgminutes+"分"+avgseconds+"秒";
                    }else if(obj.mintime<60&&obj.mintime>0){
                        obj.mintime=obj.mintime+"秒";
                    }else{
                        obj.mintime="";
                    }
                    _this.question_detail = obj;
                }
            });
        },
        loadData3: function () {
            var _this = this;
            var index = layer.load(0, {

                time: classapi.timeout
            });
            classapi.post.teacherclass_paper_commented_commitstudent({
                paperid: this.paperid,
                groupid: this.groupid,
                questionid: this.questions[this.selectindex].testid
            }, function (result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    var obj = result.obj;
                    _this.question_detail2 = [];
                    for (let i = 0; i < obj.length; i++) {
                        const userans = obj[i];
                        userans.checked = userans.checked || 0;
                        userans.corrected = userans.corrected || 0;
                        userans.useranswer = JSON.parse(userans.useranswer);
                        _this.question_detail2.push(userans);
                    }

                }
            });

        },
        loaderrorcasenum: function () {
            var _this = this;
            classapi.post.teacherclass_paper_question_errorcasenum({
                paperid: _this.paperid,
                groupid: _this.groupid,
                testid: _this.questions[_this.selectindex].testid
            }, function (result) {
                if (classapi.validata(result)) {
                    var obj = result.obj;
                    _this.errornum = obj;
                }
            });
        },
        changeselect: function (_selectindex) {
            this.selectindex = _selectindex;
            this.loadData2();
            this.loadData3();
            this.loaderrorcasenum();
        },
        refresh_page: function () {
            this.loadData();
        },
        show_student_ans: function (user) {
            // var ques = this.questions[this.selectindex];
            // var ctype = ques.ctype;
            // if (ctype == 1 || ctype == 2) {
            //     window.user = user;
            //     window.ques = ques;
            //     $(".mask_layer").css("display", "block");
            //     ajaxRequest("./pages/comment/students_writing_keguan.html", $('.pop-up_box'));
            //     $('.pop-up_box').css("display", "block");
            // } else {
            //     window.user = user;
            //     $(".mask_layer").css("display", "block");
            //     ajaxRequest("./pages/comment/students_writing.html", $('.pop-up_box'));
            //     $('.pop-up_box').css("display", "block");
            // }
            if(user.useranswer!==null&&user.useranswer!==""){
                window.user = user;
                $(".mask_layer").css("display", "block");
                ajaxRequest("./pages/comment/students_writing.html", $('.pop-up_box'));
                $('.pop-up_box').css("display", "block");
            }else{
                layer.msg("当前学生没有答案");
            }        
        },
        erroranalyze: function (errornum) {
            if (errornum > 0) {
                var _this = this;
                $(".mask_layer").css("display", "block");
                window.paperid = _this.paperid;
                window.groupid = _this.groupid;
                window.testid = _this.questions[_this.selectindex].testid;
                ajaxRequest("./pages/comment/errorcause_analysis.html", $('.pop-up_box'));
                $('.pop-up_box').css("display", "block");
            }
        }
    }
});