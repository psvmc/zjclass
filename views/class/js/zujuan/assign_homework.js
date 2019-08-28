$(function () {
    //作业名称自动获取焦点
    $(".job_name>input").focus();
    historyarr.pop();
    //点击关闭
    $(".assign_homework_title img").click(function () {
        $(".pop-up_box").css("display", "none");
        $(".mask_layer").css("display", "none");
    })
})
new Vue({
    el: ".assign_homework",
    data: {
        type: 40,
        paper_type: window.paper_type, //1:自由组题 2:智能组题
        papername: window.paper.papername,
        paperid: window.paper.paperid,
        stoptime: new Date().Format("yyyy-MM-dd hh:mm:ss"),
        groups: [],
        checktype: 1,
        operation: true
    },
    mounted: function () {
        if (window.papertype) {
            this.type = window.papertype;
        }
        this.init_date();
        this.load_group();
    },
    methods: {
        change_type: function (type) {
            if (this.paper_type == 1) {
                this.type = type;
                if (type == 41) {
                    this.checktype = 3;
                } else {
                    this.checktype = 1;
                    var _this = this;
                    this.$nextTick(function () {
                        laydate.render({
                            elem: '#expiration_date',
                            type: "datetime",
                            min: _this.stoptime,
                            done: function (value, date) {
                                _this.stoptime = value;
                            }
                        });
                    })
                }
            }
        },
        change_checktype: function (checktype) {
            this.checktype = checktype;
        },
        change_group: function (group) {
            if (this.paper_type == 1) {
                group.checked = !group.checked;
            }
        },
        init_date: function () {
            var _this = this;
            laydate.render({
                elem: '#expiration_date',
                type: "datetime",
                min: _this.stoptime,
                done: function (value, date) {
                    _this.stoptime = value;
                }
            });
        },
        load_group: function () {
            if (this.paper_type == 2) {
                this.groups = window.groups;
            } else {
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
            }
        },

        paper_properties_save: function (committype) {    //保存或发布作业 committype==1保存 committype=2发布
            this.operation = false;
            var groupids = [];
            for (var i = 0; i < this.groups.length; i++) {
                var group = this.groups[i];
                if (group.checked) {
                    groupids.push(group.groupid);
                }
            }
            if (groupids.length > 0) {
                var _this = this;
                var index = layer.load(0, {
                    time: classapi.timeout
                });
                classapi.post.teacherclass_quesitons_paper_properties({
                    papername: this.papername,
                    stoptime: this.stoptime,
                    groupids: JSON.stringify(groupids),
                    checktype: this.checktype,
                    type: this.type,
                    committype: committype,
                    paperid: this.paperid
                }, function (result) {
                    layer.close(index);
                    if (classapi.validata(result)) {
                        if (committype == 1) {
                            layer.msg("保存作业成功");
                        } else if (committype == 2) {
                            layer.msg("发布作业成功");
                        }
                        $(".pop-up_box").css("display", "none");
                        $(".mask_layer").css("display", "none");
                        ajaxRequest("./pages/prepare_lessons.html", $('#content'));
                    }
                });
            } else {
                layer.msg("尚未选择班级！");
            }

        }

    }
});