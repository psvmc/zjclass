$(function () {
    //页面高度
    var j_size = parseInt($("body").css("fontSize"));
    $(".prepare_lessons_manualquestion_main").height($("#content").height() - j_size);
    $(".smart_choice").height($(".prepare_lessons_manualquestion_main").height() - 8 * j_size);
})

new Vue({
    el: ".smart_choice",
    data: {
        loginuser: $.parseJSON(zj.getcookie("loginuser")),
        question_type_list: [],
        groups: [],
        papertype: 41,
        complexity: 2
    },
    mounted: function () {
        this.load_questype_list();
        this.load_group();
    },
    methods: {
        load_questype_list: function () {
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
                        itemData.select_num = 0;
                        _this.question_type_list.push(itemData);
                    }
                }
            });
        },
        change_group: function (group) {
            group.checked = !group.checked;
        },
        change_complexity: function (complexity) {
            this.complexity = complexity;
        },
        change_papertype: function (papertype) {
            this.papertype = papertype;
        },
        load_group: function () {
            var _this = this;
            var index = layer.load(0, {

                time: classapi.timeout
            });
            classapi.post.group_groupteacher({}, function (result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    for (var i = 0; i < result.obj.length; i++) {
                        var group = result.obj[i];
                        group.checked = true;
                        _this.groups.push(group);
                    }
                }
            });
        },
        num_change: function (typetext) {
            if (parseInt(typetext.select_num)) {
                typetext.select_num = parseInt(typetext.select_num);
            } else {
                typetext.select_num = 0;
            }

            if (typetext.select_num > typetext.num) {
                typetext.select_num = typetext.num;
            }
        },
        zuti: function () {
            var _this = this;

            var groupids = [];
            for (let i = 0; i < this.groups.length; i++) {
                const group = this.groups[i];
                if (group.checked) {
                    var groupid_obj = {};
                    groupid_obj.groupid = group.groupid;
                    groupids.push(groupid_obj);
                }
            }
            if (groupids.length == 0) {
                layer.msg("没有选择班级");
            } else {
                var questiontypes = [];
                var num_all = 0;
                for (let i = 0; i < this.question_type_list.length; i++) {
                    const ques_type = this.question_type_list[i];
                    var questiontype = {
                        typeTextId: ques_type.typeTextId,
                        typeTextName: ques_type.typeTextName,
                        num: ques_type.select_num
                    }
                    questiontypes.push(questiontype);
                    num_all += ques_type.select_num;
                }
                if (num_all == 0) {
                    layer.msg("尚未选择试题");
                } else {
                    var index = layer.load(0, {

                        time: classapi.timeout
                    });
                    classapi.post.teacherclass_quesitons_paper_savezhineng({
                        subjectid: this.loginuser.subjectid,
                        subjectname: this.loginuser.subjectname,
                        groupids: JSON.stringify(groupids),
                        questiontypes: JSON.stringify(questiontypes),
                        papertype: this.papertype,
                        directorid: this.loginuser.directorid,
                        code: this.loginuser.directorcode,
                        complexity: this.complexity
                    }, function (result) {
                        layer.close(index);
                        if (classapi.validata(result)) {
                            window.paper = result.obj;
                            window.paper_type = 2; //1:自由组题 2:智能组题
                            window.groups = _this.groups;
                            window.groupids = _this.groupids;
                            window.papertype = _this.papertype;
                            ajaxRequest("./pages/zujuan/generate_test.html", $('#content'));
                        }
                    });
                }

            }

        }
    }
});