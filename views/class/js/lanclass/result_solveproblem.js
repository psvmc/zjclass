var resule_solveproblem = new Vue({
    el: ".result_solveproblem",
    data: {
        loginuser: JSON.parse(zj.getcookie("loginuser")),
        question: [],
        select_ques_index: window.corba.questionnum,
        stuanswerpic: [],
        showImageUrl: classapi.config.showImageUrl,
        unsubmitted_students: [],
        submitted_students: [],
        showanswer: false
    },
    computed: {
        selectque: function() {
            if (this.select_ques_index < this.question.length) {
                return this.question[this.select_ques_index];
            } else {
                return {};
            }
        }
    },
    filters: {},
    mounted: function() {
        this.loadData();
        window.corba.open_report = 1;
        if (window.corba.showanswer == 1) {
            this.showanswer = true;
        } else {
            this.showanswer = false;
        }
    },
    methods: {
        loadData: function() { //加载试题数据
            var _this = this;
            var index = layer.load(0, {
                time: classapi.timeout
            })
            classapi.post.paperapi_paperallquestion({
                paperid: window.corba.paperid,
            }, function(result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    if (result.obj && result.obj.length > 0) {
                        for (var i = 0; i < result.obj.length; i++) {
                            var item = result.obj[i];
                            item.docHtml = JSON.parse(item.docHtml)
                            _this.question.push(item);
                        }
                        window.corba.questionall = _this.question;
                        _this.multiple_choice();
                        window.corba.question = _this.question[_this.select_ques_index];
                    }
                    _this.test_submitted();
                }
            });
        },
        get_dochtml_all: function(selectques) { //获取题目内容
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
        select_answers: function(selectques) { //获取答案
            if (selectques) {
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
        select_analyzes: function(selectques) { //获取解析
            if (selectques) {
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
        },
        choosequestion: function(index) { //切换试题
            window.corba.analyaisiopen = 0;
            this.showanswer = false;
            this.select_ques_index = index;
            window.corba.question = this.question[this.select_ques_index];
            window.corba.questionnum = index; //存储当前切换的试题下标
            this.multiple_choice();
            this.choosequestion_socket();
        },
        choosequestion_socket: function() { //切换试题-发送socket
            var _this = this;
            var touser = [];
            touser.push(_this.loginuser.ssouserid);
            var msg = {
                "type": 6021,
                "roomid": window.corba.crid,
                "fromuser": _this.loginuser.ssouserid,
                "touser": touser,
                "bodystr": { "paperid": window.corba.paperid, "questionid": window.corba.question.questionid, "ctype": window.corba.question.ctype, "position": _this.select_ques_index },
                "device": "web"
            };
            msg = JSON.stringify(msg);
            if (lanclass.socket.readyState == 1) {
                lanclass.socket.send(msg);
            }
        },
        multiple_choice: function() { //判断当前是否是单选题
            window.corba.questionid = this.question[this.select_ques_index].testid
            if (this.question[this.select_ques_index].ctype == 1 || this.question[this.select_ques_index].ctype == 2) {
                this.choice_statistics();
            } else {
                this.subjective_statistics();
            }
        },
        close_preview: function() { //关闭做题结果
            window.corba.open_report = 0;
            $(".pop-up_box").html("");
            $(".pop-up_box").css("display", "none");
            $(".mask_layer").css("display", "none");
            lanclass.showloading = true;
            this.close_preview_socket();
        },
        close_preview_socket: function() { //关闭做题结果-发送socket
            var _this = this;
            var touser = [];
            touser.push(_this.loginuser.ssouserid);
            var msg = {
                "type": 6012,
                "roomid": window.corba.crid,
                "fromuser": _this.loginuser.ssouserid,
                "touser": touser,
                "bodystr": { "paperid": window.corba.paperid },
                "device": "web"
            };
            msg = JSON.stringify(msg);
            if (lanclass.socket.readyState == 1) {
                lanclass.socket.send(msg);
            }
        },
        choice_statistics: function(questionid) { //单选题作业统计
            var datecolor = ["#ffad00", "#ff5d45", "#4a91e3", "#d7d7d7", "#90b9ed", "#bbe172", "#e8f5fb"];
            var _this = this;
            var index = layer.load(0, {
                time: classapi.timeout
            });
            classapi.post.crpaper_question_students_xuanze({
                paperid: window.corba.paperid,
                groupid: window.corba.groupid,
                questionid: window.corba.questionid
            }, function(result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    var categories = [];
                    var studata = [];
                    var stu = {};
                    for (var i = 0; i < result.obj.length; i++) {
                        stu = {};
                        categories.push(result.obj[i].xxanswer);
                        stu.y = result.obj[i].stunum;
                        stu.color = datecolor[i];
                        studata.push(stu);
                    }
                    _this.graphing(categories, studata);
                }
            });
        },
        subjective_statistics: function() { //主观题统计
            this.stuanswerpic = [];
            var _this = this;
            var index = layer.load(0, {
                time: classapi.timeout
            });
            classapi.post.crpaper_question_students_zhuguan({
                paperid: window.corba.paperid,
                groupid: window.corba.groupid,
                questionid: window.corba.questionid
            }, function(result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    for (var i = 0; i < result.obj.length; i++) {
                        if (result.obj[i].slurl && result.obj[i].slurl != "") {
                            _this.stuanswerpic.push({
                                "studentid": result.obj[i].userid,
                                "username": result.obj[i].username,
                                "slurl": _this.showImageUrl + result.obj[i].slurl,
                                "useranswer": JSON.parse(result.obj[i].useranswer)
                            })
                        } else {
                            _this.stuanswerpic.push({
                                "username": result.obj[i].username,
                                "slurl": "",
                                "useranswer": JSON.parse(result.obj[i].useranswer)
                            })
                        }
                    }
                }
            });
            $(".answer_statistical").width("60%");
            $(".turnon").css("display", "none");
        },
        test_submitted: function() { //获取已提交试卷学生
            this.submitted_students = [];
            this.unsubmitted_students = [];
            lanclass.showloading = false;
            var _this = this;
            var index = layer.load(0, {
                time: classapi.timeout
            });
            classapi.post.crpaper_paper_students({
                paperid: window.corba.paperid,
                groupid: window.corba.groupid,
            }, function(result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    for (var i = 0; i < result.obj.length; i++) {
                        if (result.obj[i].headportrait && result.obj[i].headportrait != "" && result.obj[i].headportrait != null && result.obj[i].headportrait.indexOf("http") == -1) {
                            result.obj[i].headportrait = _this.showImageUrl + result.obj[i].headportrait
                        }
                        if (result.obj[i].status == 0) {
                            _this.unsubmitted_students.push(result.obj[i]);
                        } else if (result.obj[i].status == 1 || result.obj[i].status == 2) {
                            _this.submitted_students.push(result.obj[i]);
                        }
                    }
                }
            });
        },
        graphing: function(categories, studata) {
            $('.answer_statistical_main').highcharts({
                chart: {
                    type: 'column'
                },
                //标题
                title: {
                    text: '',
                },
                //副标题
                subtitle: {
                    text: '',
                },
                //横坐标
                xAxis: {
                    lineWidth: 2,
                    gridLineColor: '#444444',
                    gridLineDashStyle: "dash",
                    gridLineWidth: 1,
                    lineColor: '#444444',
                    tickColor: '#ffffff',
                    categories: categories,
                    labels: {
                        style: {
                            color: "#294f89",
                            fontFamily: "simsun",
                            fontSize: "12px"
                        }
                    }
                },
                //纵坐标
                yAxis: {
                    title: {
                        offset: -10,
                        rotation: 0,
                        y: -12,
                        align: "high",
                        text: '人数（人）',
                        style: {
                            color: "#294f89",
                            fontFamily: "microsoft yahei",
                            fontSize: "13px"
                        }
                    },
                    gridLineColor: '#444444',
                    gridLineWidth: 1,
                    lineWidth: 2,
                    lineColor: '#444444',
                },
                //显示框
                tooltip: {
                    enabled: false
                },
                legend: {
                    layout: 'vertical',
                    align: 'right', //程度标的目标地位
                    verticalAlign: 'top', //垂直标的目标地位
                    borderWidth: 0, //边框大小
                    x: 0,
                    y: -10,
                    symbolHeight: 14,
                    symbolWidth: 14,
                    symbolRadius: 0,
                    layout: "horizontal",
                    itemDistance: 16,
                    itemMarginBottom: 0,
                    itemStyle: {
                        "font-size": "10.5",
                        "font-family": "microsoft yahei",
                        "color": "#284f88"
                    }
                },
                series: [{
                    name: '人数',
                    data: studata
                }],
                credits: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true,
                            format: '{y} 人',
                            style: {
                                color: "#444444",
                                fontSize: 14,
                                fontFamily: "microsoft yahei",
                                fontWeight: 400
                            }
                        }
                    }
                }
            })
            if (window.corba.analyaisiopen == 1) {
                $(".answer_statistical").width("60%");
                $(".turnon").css("display", "none");
            } else {
                $(".answer_statistical").width("0px");
                $(".turnon").css("display", "block");
            }
        },
        turnoff: function() { //关上统计结果
            var j_size = parseInt($("body").css("fontSize"));
            $(".question_information").width($(".result_solveproblem_bottom").width() - 2 * j_size);
            $(".answer_statistical").width("0");
            $(".turnon").css("display", "block");
            this.turn_socket(0);
        },
        turnon: function() { //打开统计结果
            var j_size = parseInt($("body").css("fontSize"));
            $(".answer_statistical").width($(".submitted").width() * 0.66 - 4 * j_size);
            $(".question_information").width($(".result_solveproblem_bottom").width() * 0.34 - 2 * j_size);
            $(".turnon").css("display", "none");
            this.turn_socket(1);
        },
        turn_socket: function(type) { //显示隐藏统计结果-发送socket
            var _this = this;
            var touser = [];
            touser.push(_this.loginuser.ssouserid)
            var msg = {
                "type": 6032,
                "roomid": window.corba.crid,
                "fromuser": _this.loginuser.ssouserid,
                "touser": touser,
                "bodystr": {
                    "paperid": window.corba.paperid,
                    "papername": window.corba.papername,
                    "position": _this.select_ques_index,
                    "type": type
                },
                "device": "web"
            };
            msg = JSON.stringify(msg);
            if (lanclass.socket.readyState == 1) {
                lanclass.socket.send(msg);
            }
        },
        show_studentbiji: function(stupic) { //打开学生答题笔迹
            window.corba.stubiji = stupic;
            var newpopup = "<div class='studentbiji'></div>";
            $("body").append(newpopup);
            ajaxRequest("./pages/lanclass/studentbiji.html", $('.studentbiji'));
            this.show_studentbiji_socket();
        },
        show_studentbiji_socket: function() { //打开学生答题笔迹-发送socket
            var _this = this;
            var msg = {
                "type": 6041,
                "roomid": window.corba.crid,
                "fromuser": _this.loginuser.ssouserid,
                "touser": lanclass.touserarr,
                "bodystr": {
                    "questionid": window.corba.questionid,
                    "papername": window.corba.papername,
                    "paperid": window.corba.paperid,
                    "userid": window.corba.stubiji.studentid,
                    "username": window.corba.stubiji.username,
                    "headportrait": window.corba.stubiji.slurl,
                    "answers": window.corba.stubiji.useranswer.answers
                },
                "device": "web"
            };
            msg = JSON.stringify(msg);
            if (lanclass.socket.readyState == 1) {
                lanclass.socket.send(msg);
            }
        },
        show_answer: function() { //查看答案解析
            if (this.showanswer) {
                this.showanswer = false;
                this.show_answer_socket(0);
            } else {
                this.showanswer = true;
                this.show_answer_socket(1);
            }
        },
        show_answer_socket: function(type) { //查看答案解析-发送socket
            var _this = this;
            var touser = [];
            touser.push(_this.loginuser.ssouserid)
            var msg = {
                "type": 6031,
                "roomid": window.corba.crid,
                "fromuser": _this.loginuser.ssouserid,
                "touser": touser,
                "bodystr": { "paperid": window.corba.paperid, "position": _this.select_ques_index, "type": type },
                "device": "web"
            };
            msg = JSON.stringify(msg);
            if (lanclass.socket.readyState == 1) {
                lanclass.socket.send(msg);
            }
        }
    }
})