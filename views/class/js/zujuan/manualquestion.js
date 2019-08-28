$(function () {
    var j_size = parseInt($("body").css("fontSize"));
    $(".prepare_lessons_manualquestion_main").height($("#content").height() - j_size);
    $(".question_list").height($(".prepare_lessons_manualquestion_main").height() - 21 * j_size);
})

//试题列表
new Vue({
    el: ".prepare_lessons_manualquestion_main",
    data: {
        question_type_list: [],
        question_list: [],
        select_type: "",
        loginuser: $.parseJSON(zj.getcookie("loginuser")),
        showpage: 10,
        currpage: 1,
        pages: 1,
        sort: "time",
        complexity: 0,
        ques_count: 0,
        shitilan: [],
        width: 0
    },
    computed: {
        selcct_num: function () {
            var num = 0;
            for (var i = 0; i < this.shitilan.length; i++) {
                var item = this.shitilan[i];
                num += item.testids.length;
            }
            return num;
        },
        is_select_all: function () {    //判断选择全部试题的状态
            var select_all = true;
            if (this.ques_count == 0) {
                select_all = false;
            } else {
                for (var i = 0; i < this.question_list.length; i++) {
                    var ques = this.question_list[i];
                    if (ques.inbasket == 0 || ques.inbasket == null) {
                        return false;
                    }
                }
            }
            return select_all;
        }
    },
    mounted: function () {
        this.load_questype_list();
        this.loadpages();
        this.get_shitilan().then(val => {
            this.load_question();
        });
    },
    filters: {
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
        inbasket: function () {    //判断当前题目是否在试题栏中
            var questionlist = this.question_list;
            var shitilan = this.shitilan;
            for (var i = 0; i < questionlist.length; i++) {
                for (var j = 0; j < shitilan.length; j++) {
                    for (var h = 0; h < shitilan[j].testids.length; h++) {
                        if (questionlist[i].testid == shitilan[j].testids[h]) {
                            questionlist[i].inbasket = 1;
                        }
                    }
                }
            }
        },
        basketanimate: function () {
            if (this.width == 0) {
                this.width = 15.2;
            } else {
                this.width = 0;
            }
        },
        gotopage: function (newpage, oldpage) {
            this.currpage = newpage;
            this.load_question();
        },
        loadpages: function () {     //获取当前分页页数和总题量
            var _this = this;
            classapi.post.teacherclass_quesitons_list_num({
                type: "director",
                directorid: this.loginuser.directorid,
                code: this.loginuser.directorcode,
                questionType: this.select_type,
                complexity: this.complexity,
                subjectid: this.loginuser.subjectid
            }, function (result) {
                if (classapi.validata(result)) {
                    _this.pages = result.obj.pagesize;
                    _this.ques_count = result.obj.count;
                    if (_this.currpage > _this.pages) {
                        _this.currpage = 1;
                    }
                }
            });
        },
        load_questype_list: function () {       //获取题型
            var _this = this;
            var index = layer.load(0, {
                time: classapi.timeout
            });
            classapi.post.questionapi_quesitontypenum({
                type: "director",
                subjectid: _this.loginuser.subjectid,
                directorid: _this.loginuser.directorid,
                code: _this.loginuser.directorcode,
                papertype: 0
            }, function (result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    var obj = result.obj;
                    _this.question_type_list = [];
                    for (var i = 0; i < obj.length; i++) {
                        var itemData = obj[i];
                        _this.question_type_list.push(itemData);
                    }
                }
            });
        },
        load_question: function () {    //加载试题
            $(".question_list").scrollTop(0);    //翻页的时候让滚动条置顶
            var _this = this;
            var index = layer.load(0, {
                time: classapi.timeout
            });
            console.log(this.loginuser.directorid,this.loginuser.directorcode,this.select_type,this.sort,this.currpage,this.complexity,this.loginuser.subjectid)
            classapi.post.teacherclass_quesitons_list_questions({
                type: "director",
                directorid: _this.loginuser.directorid,
                code: _this.loginuser.directorcode,
                questionType: _this.select_type,
                sort: _this.sort,
                currentPage: _this.currpage,
                complexity: _this.complexity,
                subjectid: _this.loginuser.subjectid
            }, function (result) {
                console.log(result)
                layer.close(index);
                if (classapi.validata(result)) {
                    var obj = result.obj;
                    _this.question_list = [];
                    for (var i = 0; i < obj.length; i++) {
                        var itemData = obj[i];
                        itemData.docHtml = JSON.parse(itemData.docHtml);
                        _this.question_list.push(itemData);
                    }
                    _this.inbasket();
                }
            });
            return Promise.resolve("");
        },
        type_change: function (type) {    //切换题型
            if (this.select_type != type) {
                this.select_type = type;
                this.currpage = 1;
                this.loadpages();
                this.load_question();
            }
        },
        sort_change: function (sort) {
            if (this.sort != sort) {
                this.sort = sort;
                this.currpage = 1;
                this.loadpages();
                this.load_question();
            }
        },
        complexity_change: function (complexity) {
            if (this.complexity != complexity) {
                this.complexity = complexity;
                this.currpage = 1;
                this.loadpages();
                this.load_question();
            }
        },
        select_ques: function (ques) {    //选题
            var _this = this;
            var index = layer.load(0, {
                time: classapi.timeout
            });
            if (ques.inbasket > 0) {
                //删除试题篮中指定试题类型的试题
                classapi.post.teacherclass_quesitons_basket_deletetest({
                    testids: JSON.stringify([ques.testid])
                }, function (result) {
                    layer.close(index);
                    if (classapi.validata(result)) {
                        layer.msg("取消选题成功");
                        ques.inbasket = 0;
                        _this.get_shitilan();
                    }
                });
            } else {
                var typetestids = [];
                var ques2 = {};
                ques2.typeTextId = ques.typeTextId;
                ques2.testid = ques.testid;
                typetestids.push(ques2);

                classapi.post.teacherclass_quesitons_basket_savebatch({
                    subjectid: this.loginuser.subjectid,
                    typetestids: JSON.stringify(typetestids)
                }, function (result) {
                    layer.close(index);
                    if (classapi.validata(result)) {
                        layer.msg("添加试题篮成功！");
                        ques.inbasket = 1;
                        _this.get_shitilan();
                    }
                });
            }

        },
        select_all_ques: function () {    //选择本页全部试题
            if (this.ques_count == 0) {
                layer.msg("当前没有试题！");
            } else {
                var _this = this;
                var index = layer.load(0, {
                    time: classapi.timeout
                });
                var typetestids = [];
                for (var i = 0; i < this.question_list.length; i++) {
                    var ques = this.question_list[i];
                    if (ques.inbasket == 0 || ques.inbasket == null) {
                        var ques2 = {};
                        ques2.typeTextId = ques.typeTextId;
                        ques2.testid = ques.testid;
                        typetestids.push(ques2);
                    }
                }
                classapi.post.teacherclass_quesitons_basket_savebatch({
                    subjectid: this.loginuser.subjectid,
                    typetestids: JSON.stringify(typetestids)
                }, function (result) {
                    layer.close(index);
                    if (classapi.validata(result)) {
                        layer.msg("添加试题篮成功！");
                        _this.get_shitilan();
                        for (var i = 0; i < _this.question_list.length; i++) {
                            var ques = _this.question_list[i];
                            ques.inbasket = 1;
                        }
                    }
                });
            }
        },
        check_parsing: function (question) { //查看解析
            window.question = question;
            $(".mask_layer").css("display", "block");
            ajaxRequest("./pages/zujuan/check_parsing.html", $('.pop-up_box'));
            $(".pop-up_box").css("display", "block");
        },
        cancel_all_ques: function () {
            var _this = this;
            var index = layer.load(0, {

                time: classapi.timeout
            });

            var quesids = [];
            for (var i = 0; i < this.question_list.length; i++) {
                var ques = this.question_list[i];
                quesids.push(ques.testid);
            }
            //删除试题篮中指定试题类型的试题
            classapi.post.teacherclass_quesitons_basket_deletetest({
                testids: JSON.stringify(quesids)
            }, function (result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    layer.msg("取消选题成功");
                    _this.get_shitilan();
                    for (var i = 0; i < _this.question_list.length; i++) {
                        var ques = _this.question_list[i];
                        ques.inbasket = 0;
                    }
                }
            });
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
        },
        get_shitilan: function () {
            var _this = this;
            var index = layer.load(0, {

                time: classapi.timeout
            });

            classapi.post.teacherclass_quesitons_basket_list({
                subjectid: this.loginuser.subjectid
            }, function (result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    var obj = result.obj;
                    _this.shitilan = obj;
                }
            });
            return Promise.resolve("");
        },
        delete_type: function (typetext) {
            //删除试题篮中指定试题类型的试题
            var _this = this;
            var index = layer.load(0, {

                time: classapi.timeout
            });

            classapi.post.teacherclass_quesitons_basket_deletetype({
                typetextid: typetext.typeTextId
            }, function (result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    layer.msg("删除" + typetext.typeTextName + "成功");
                    _this.get_shitilan();
                    _this.load_question();
                }
            });
        },
        get_dochtml_all: function (selectques) {
            var docHtml = "";
            if (selectques.docHtml && selectques.docHtml.docHtml) {
                docHtml = selectques.docHtml.docHtml;
                var ctype = selectques.ctype;
                if(!ctype){
                    ctype=selectques.docHtml.ctype;
                }
                if (ctype == 6 || ctype == 7 || ctype == 8 || ctype == 11) {
                    var sonquesList = selectques.docHtml.questions;
                    for (var i = 0; i < sonquesList.length; i++) {
                        var sonques = sonquesList[i];
                        var son_ctype = sonques.ctype;
                        docHtml = docHtml + "" + (i + 1) + "." + sonques.docHtml;
                        if (son_ctype == 1 || son_ctype == 2) {
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
        test_paper_generation: function () {  //生成试卷
            if (this.shitilan.length != 0) {
                var _this = this;
                var index = layer.load(0, {
                    time: classapi.timeout
                });
                classapi.post.teacherclass_quesitons_paper_savejson({
                    subjectid: this.loginuser.subjectid,
                    subjectname: this.loginuser.subjectname,
                    directorid: this.loginuser.directorid,
                    typeid_testids: JSON.stringify(this.shitilan),
                    directorcode: this.loginuser.directorcode
                }, function (result) {
                    layer.close(index);
                    if (classapi.validata(result)) {
                        window.paper = result.obj;
                        window.paper_type = 1; //1:自由组题 2:智能组题
                        ajaxRequest("./pages/zujuan/generate_test.html", $('#content'));
                    }
                });
            } else {
                layer.msg("尚未选择试题");
            }
        }
    },
});