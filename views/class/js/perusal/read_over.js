$(function () {
    $(".main").addClass("read_over_style");
    sizecomputed();
    $(".padlock").click(function () {
        ajaxRequest("./pages/prepare_lessons.html", $('#content'));
        $(".main").removeClass("read_over_style");
        $(".main_important").outerHeight($("body").height() - $(".logo").outerHeight() - $(".select_chapter").outerHeight() - parseInt($(".main_important").css("margin-top")) - 4);
        $("#content").css("height", $(".main_important").height());

    })
})

function sizecomputed() {
    var j_size = parseInt($("body").css("fontSize"));
    $(".main_important").outerHeight($("body").height() - $(".logo").outerHeight() - parseInt($(".main_important").css("margin-top")) - 4);
    $("#content").css("height", $(".main_important").height() - 14);
    $(".whether_grade").height($(".read_over_main").height() - 1 * j_size);
    $(".not_filed").height($(".whether_grade").height() * 0.2 - 0.5 * j_size)
    $(".submitted_student_list").height($(".submitted").height() - 4.8 * j_size)
    $(".not_filed_main").height($(".not_filed").height() - 3 * j_size);
    $(".correction").width($(".read_over_main").width() - 28 * j_size);
}

var read_over_main = new Vue({
    el: ".read_over_main",
    data: {
        selectstudentindex: -1,
        paperid: window.homework.paperid,
        groupid: window.homework.groupid,
        students: [],
        studentanswers: [],
        showImageUrl: classapi.config.showImageUrl,
        curr: 0
    },
    computed: {
        selectttudent: function () {
            if (this.students[this.selectstudentindex]) {
                return this.students[this.selectstudentindex];
            }
            return {};
        }
    },
    filters: {},
    mounted() {
        this.workstudents();//作业学生
    },

    methods: {
        workstudents: function () {
            var _this = this;
            classapi.post.teacherclass_paper_check_students({
                paperid: _this.paperid,
                groupid: _this.groupid
            }, function (result) {
                if (classapi.validata(result)) {
                    var obj = result.obj;
                    _this.students = obj;
                    for (var i = 0; i < obj.length; i++) {
                        if (obj[i].status > 0 && _this.selectstudentindex == -1) {
                            _this.selectstudentindex = i;
                        }
                    }
                    if (_this.selectstudentindex == -1) {
                        _this.selectstudentindex = 0;
                    }
                    _this.sutdentanswer();
                }
            });
        },
        sutdentanswer: function () {
            var _this = this;
            classapi.post.teacherclass_paper_check_studentanswer({
                paperid: _this.paperid,
                studentid: _this.students[_this.selectstudentindex].userid,
            }, function (result) {
                if (classapi.validata(result)) {
                    var obj = result.obj;
                    _this.studentanswers = [];
                    for (var i = 0; i < obj.length; i++) {
                        var itemDate = obj[i];
                        itemDate.useranswer = JSON.parse(itemDate.useranswer);
                        itemDate.useranswer_html = _this.userans_html(itemDate.useranswer);
                        _this.studentanswers.push(itemDate);
                    }
                }
                _this.$nextTick(function () {
                    _this.top_offset_change();
                    sizecomputed();
                });

            });
        },
        top_offset_change: function () {
            var _this = this;
            $(".correction_main").scroll(function () {
                $(".correction_main .question").each(function (index) {
                    var offset_top = $(this).offset().top;
                    var height = $(this).height();
                    if (Math.abs(offset_top - 193) < 100) {
                        _this.curr = index;
                    }
                })
            })
        },
        growbig_this: function (index) {
            this.curr = index;
        },
        studentchange: function (_selectindex) {
            $(".correction_main").scrollTop(0);
            this.selectstudentindex = _selectindex;
            this.sutdentanswer();
        },
        checkquesiton: function (useranswer, corrected) {
            var _this = this;
            useranswer.checked = 1;
            classapi.post.teacherclass_paper_check_checkquesiton({
                paperid: _this.paperid,
                studentid: _this.students[_this.selectstudentindex].userid,
                questionid: useranswer.questionid,
                corrected: corrected
            }, function (result) {
                if (classapi.validata(result)) {
                    var obj = result.obj;
                    if (result.code == 0) {
                        useranswer.corrected = corrected;
                        //成功
                        if (obj == 1) {
                            layer.msg("该学生已批改完成");
                            _this.workstudents();
                        } else if (obj == 3) {
                            _this.workstudents();
                        }

                    }
                }
            });
        },
        userans_html: function (useranser) {
            if (useranser) {
                var answers = useranser.answers || [];
                var answerstext = useranser.answerstext || [];
                var criticizes = useranser.criticizes || [];
                var html_array = [];
                if (answers) {
                    for (var i = 0; i < answers.length; i++) {
                        var _answers = answers[i] || [];
                        var _answerstext = answerstext[i] || [];
                        var _criticizes = criticizes[i] || [];
                        if (_answers) {
                            for (var j = 0; j < _answers.length; j++) {
                                var zanswers = _answers[j] || "";
                                var zanswerstext = _answerstext[j] || "";
                                var zcriticizes = _criticizes[j] || "";

                                if (zanswers == "") {
                                    html_array.push(zanswerstext);
                                } else {
                                    if (zcriticizes != "" && zcriticizes != null) {
                                        html_array.push("<img src='" + this.showImageUrl + zcriticizes + "' />");
                                    } else {
                                        html_array.push("<img src='" + this.showImageUrl + zanswers + "' />");
                                    }
                                }
                            }
                        }
                    }
                }
                return html_array.join("");
            }

        }
    }
})

