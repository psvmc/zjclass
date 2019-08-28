$(function () {
    var j_size = parseInt($("body").css("fontSize"));
    $(".lanclass_analysis_main").height($("#content").height() - 6.5 * j_size);
})
var lanclass_analysis = new Vue({
    el: ".lanclass_analysis",
    data: {
        isshow: 1,
        crname: window.corba.crname,
        pages: 1,
        class_ppt: null,  // 获取ppt
        class_ranking: null,  //  获取学生排行
        docHtmls: [],  // 获取试题及答案
        showImageUrl: classapi.config.showImageUrl,
    },
    mounted() {
        this.get_ppt();
        this.get_ranking();
        this.get_teacher();
    },
    methods: {
        change_section: function (index) {    //切换展示项
            this.isshow = index;
        },
        get_ppt: function () {    //获取ppt的理解情况
            var _this = this;
            var index = layer.load(0, {
                time: classapi.timeout
            });
            classapi.post.crresource_teacher_understand_student({
                crid: window.corba.crid
            }, function (result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    var obj = result.obj;  // 获取ppt图片
                    for (var i = 0; i < obj.length; i++) {
                        var item = obj[i];
                        if (item.rpath.indexOf("http") == -1) {
                            item.rpath = classapi.config.resourceWeb + item.rpath;
                        }
                        item.lijienum = item.ljlst.length;
                        item.unlijienum = item.unljlst.length;
                    }
                    _this.class_ppt = obj;
                    _this.$nextTick(function () {  // 获取 人数 后渲染饼状图
                        _this.rander_highcharts();
                    })
                }
            });
        },
        rander_highcharts: function () {  //  理解  不理解  人数
            var understand_domarr = $(".understand");
            for (var i = 0; i < this.class_ppt.length; i++) {
                var item = this.class_ppt[i];
                var data = [
                    {name: '理解', y: item.lijienum},
                    {name: '不理解', y: item.unlijienum}
                ];
                this.render_item(understand_domarr.eq(i), data);
            }
        },
        render_item: function (jqdom, data) {  // 饼状图
            var char = jqdom.highcharts({
                chart: {
                    type: 'pie'
                },
                colors: ["#fb6e52", "#bfbfbf"],
                credits: {
                    enabled: false
                },
                legend: {
                    align: 'center',
                    verticalAlign: 'bottom',
                    symbolHeight: 12,
                    symbolWidth: 12,
                    symbolRadius: 0,
                    labelFormatter: function () {
                        return this.name + ":" + this.y + "人"
                    }
                },
                title: {
                    floating: true,
                    text: '理解情况',
                    useHTML: true,
                    style: {
                        color: '#333333',      //字体颜色
                        fontSize: "12px",   //字体大小
                        fontWeight: 'bold'
                    }
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.y}人</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false
                        },
                        showInLegend: true
                    }
                },
                series: [{
                    type: 'pie',
                    innerSize: '40%',
                    data: data
                }]
            }, function (c) { // 图表初始化完毕后的会掉函数
                // 环形图圆心
                var centerY = c.series[0].center[1],
                    titleHeight = parseInt(c.title.styles.fontSize);
                // 动态设置标题位置
                c.setTitle({
                    y: centerY + titleHeight / 2
                });
            })
        },
        get_teacher: function () {  // 作业信息
            var _this = this
            classapi.post.crpaper_papers_teacher({
                crid: window.corba.crid,
                groupid: window.corba.groupid,
            }, function (result) {
                var obj = result.obj;
                if (classapi.validata(result)) {
                    if (obj.length) {  // 判断有没有数据 解决没有数据事报错
                        for (var i = 0; i < obj.length; i++) {
                            for (var j = 0; j < obj[i].questions.length; j++) {
                                obj[i].questions[j].docHtml = JSON.parse(obj[i].questions[j].docHtml)
                                _this.docHtmls.push(obj[i].questions[j]);
                            }
                        }
                    }
                }
            })
        },
        get_dochtml_all: function (selectques) {    //获取题目内容
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
        select_answers: function (selectques) {    //获取答案
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
        select_analyzes: function (selectques) {     //获取解析
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
        get_ranking: function () {  //  学生活跃度排名
            var _this = this;
            var index = layer.load(0, {
                time: classapi.timeout
            });
            classapi.post.cranswer_teacher_single_studentsactive({
                crid: window.corba.crid
            }, function (result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    for (var i = 0; i < result.obj.length; i++) {
                        if (result.obj[i].headportrait == "") {
                            result.obj[i].headportrait = classapi.config.showImageUrl+"img/lanclass/header.png";
                        } else {
                            result.obj[i].headportrait=classapi.config.showImageUrl+result.obj[i].headportrait
                        }
                    }
                    _this.class_ranking = result.obj
                }
            });
        },
    },
})