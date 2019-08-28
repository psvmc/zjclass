$(function() {
    var j_size = parseInt($("body").css("fontSize"));
})
var preview_homework = new Vue({
    el: ".preview_homework",
    data: {
        type_ques_list: [],
        papername: "",
        loginuser: JSON.parse(zj.getcookie("loginuser")),
        onlinestuid: []
    },
    filters: {},
    mounted: function() {
        this.load_paper_detail();
        this.papername = window.corba.papername;
    },
    methods: {
        close_preview: function() { //关闭作业预览页
            window.corba.viework = 0;
            $(".pop-up_box").css("display", "none");
            $(".mask_layer").css("display", "none");
            this.close_preview_socket();
        },
        close_preview_socket: function() { //关闭作业预览页-发送socket
            var _this = this;
            var touser = [];
            touser.push(_this.loginuser.ssouserid);
            var msg = {
                "type": 6002,
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
        check_results: function() { //布置作业
            var _this = this;
            var index = layer.load(0, {
                time: classapi.timeout
            });
            classapi.post.classroom_room_publicjob({
                crid: window.corba.crid,
                paperid: window.corba.paperid,
                groupid: window.corba.groupid
            }, function(result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    for (var i = 0; i < lanclass.homework_list.length; i++) {
                        if (lanclass.homework_list[i].paperid == window.corba.paperid) {
                            lanclass.homework_list[i].status = 22;
                        }
                    }
                    _this.set_studentid();
                }
            });
        },
        check_result_socket: function() { //打开已经布置的作业-发送socket
            var _this = this;
            var touser = _this.onlinestuid;
            touser.push(_this.loginuser.ssouserid);
            var msg = {
                "type": 6011,
                "roomid": window.corba.crid,
                "fromuser": _this.loginuser.ssouserid,
                "touser": touser,
                "bodystr": { "paperid": window.corba.paperid, "position": window.corba.paperposition },
                "device": "web"
            };
            msg = JSON.stringify(msg);
            if (lanclass.socket.readyState == 1) {
                lanclass.socket.send(msg);
            }
        },
        set_studentid: function() { //获取在线所有学生的ssouserid
            var _this = this;
            var index = layer.load(0, {
                time: classapi.timeout
            });
            classapi.post.classroomuser_user_onlineds({
                crid: window.corba.crid
            }, function(result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    _this.onlinestu = result.obj;
                    for (var i = 0; i < _this.onlinestu.length; i++) {
                        if (_this.onlinestu[i].ssouserid == _this.loginuser.ssouserid) {} else {
                            _this.onlinestuid.push(_this.onlinestu[i].ssouserid);
                        }
                    }
                    _this.assignhomeworksocket();
                }
            });
        },
        assignhomeworksocket: function() { //布置作业socket
            var _this = this;
            var touser = _this.onlinestuid;
            touser.push(_this.loginuser.ssouserid);
            var msg = {
                "type": 3001,
                "roomid": window.corba.crid,
                "fromuser": _this.loginuser.ssouserid,
                "touser": touser,
                "bodystr": { "paperid": window.corba.paperid, "papername": window.corba.papername },
                "device": "web"
            };
            msg = JSON.stringify(msg);
            if (lanclass.socket.readyState == 1) {
                lanclass.socket.send(msg);
            }
            $(".mask_layer").css("display", "block");
            ajaxRequest("./pages/lanclass/result_solveproblem.html", $('.pop-up_box'));
            $(".pop-up_box").css("display", "block");
        },
        load_paper_detail: function() { //获取试卷中所有题目
            var _this = this;
            var index = layer.load(0, {
                shade: [0.1, '#fff'], //0.1透明度的白色背景
                time: classapi.timeout
            });
            classapi.post.teacherclass_quesitons_paper_quesitons({
                paperid: window.corba.paperid
            }, function(result) {
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

    }
})