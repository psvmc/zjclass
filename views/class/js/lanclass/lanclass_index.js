$(function() {

    //学生栏动画
    var j_size = parseInt($("body").css("fontSize"));
    $(".student_basket_title").click(function() {
        if ($(".student_basket_main").width() !== 0) {
            $(".student_basket_main").width(0);
            $(".lanclass_main").width($(".lanclass").width() - 1.8 * j_size);
        } else {
            $(".student_basket_main").width(13.8 * j_size);
            $(".lanclass_main").width($(".lanclass").width() - 16.4 * j_size);
        }
    })
})
var lanclass = new Vue({
    el: ".lanclass",
    data: {
        begins: 0,
        resourceImages: [],
        homework_list: [],
        current_displayable: {},
        current_count: 0,
        roomid: 0,
        allpagenum: 0,
        onlinestu: [],
        outlinestu: [],
        qingdastu: [],
        showImageUrl: classapi.config.showImageUrl,
        resourceWeb: classapi.config.resourceWeb,
        wsurl: classapi.config.wsurl,
        qingdaid: 0,
        showloading: true,
        heartinerval: null,
        studentnumber: 0,
        j_size: parseInt($("body").css("fontSize")),
        teacheronlinetype: "",
        myinterval: 0,
        socket: null,
        touserarr: [],
        allstudent: [] //所有的学生
    },
    beforeDestroy() {
        this.socket.close();
        window.corba.scrockstate = 0;
    },
    filters: {},
    computed: {
        pptnow: function() {
            if (this.current_displayable.resources) {
                return this.current_displayable.resources[this.current_displayable.currpage - 1].rpath;
            } else {
                return "";
            }
        },
        loginuser: function() {
            if (zj.getcookie("loginuser")) {
                return JSON.parse(zj.getcookie("loginuser"));
            } else {
                layer.msg("用户已失效，请重新登录！", { time: 1000 }, function() {
                    window.location.href = "login.html";
                });
            }
        }
    },
    mounted: function() {
        sessionStorage.clear();
        this.touserarr.push(this.loginuser.ssouserid);
        window.corba.open_understand = 0; //判断是否打开理解统计图0未打开1打开
        window.corba.open_report = 0; //判断是否打开作业报告0未打开1打开
        window.corba.datas = [];
        window.corba.viework = 0; //是否有正在预览的作业
        if (window.corba.floppytype == 0) { //标记是创建互动班级还是进入已经创建过的班级，0是未创建
            this.loadDate();
        } else {
            this.roomid = window.corba.crid;
            this.homework_information();
            this.get_pptcurrent();
            this.connect_socket();
            this.get_onlinestu();
            this.git_vies(); //获取课堂中是否有正在进行中的抢答
        }
        var _this = this;
        this.$nextTick(function() {
            var j_size = parseInt($("body").css("fontSize"));
            $(".lanclass_main").width($(".lanclass").width() - 17.4 * j_size);
            $(".lanclass").height($("#content").height() - j_size);
            $(".ppt .ppt_main").height($(".lanclass").height() - 14 * j_size);
            $(".ppt .ppt_main img").height($(".ppt .ppt_main").height() - j_size);
            $(".online_student_main").height($(".lanclass").height() * 0.5 - 2.3 * j_size);
            $(".start_qingda_main").height($(".lanclass").height() - 4 * j_size);
            $(".quiz").width($(".classroom_quiz").width() - 12 * j_size); //规定课堂作业列表的宽度
            if (window.innerHeight / window.innerWidth > 0.6) {
                $(".ppt_main img").width("100%");
            }
            var ele = document.getElementById("canvas");
            ele.height = parseInt($(".ppt .ppt_main").height() - j_size);
            ele.height = "300";
            setTimeout(function() {
                ele.width = parseInt($(".pptnow").width());
            }, 1000);
            // _this.get_pptcurrent(window.corba.pagenum)
        })
    },
    methods: {
        close: function() {
            this.socket.close();
        },
        isJSON: function(str) { //判断是否为json格式
            try {
                var obj = JSON.parse(str);
                if (typeof obj == 'object' && obj) {
                    return true;
                } else {
                    return false;
                }
            } catch (e) {
                return false;
            }
        },
        connect_socket: function() { //连接socket
            var that = this;
            window.corba.scrockstate = 1; //标记websocket是否主动下线，1是未下线，0是下线
            if (that.socket != null) {
                that.socket = null;
            }
            that.socket = new WebSocket(that.wsurl);
            that.socket.onopen = function() {
                that.teacheronlinetype = "老师上线";
                that.shangxiansocket()
            };
            that.socket.onclose = function() {
                that.teacheronlinetype = "老师离线";
                setTimeout(function() {
                    if (window.corba.scrockstate == 1) { //没有正常关闭需要重连                  
                        that.connect_socket();
                    } else {
                        that.teacheroutline();
                    }
                }, 2000)
            };
            that.socket.onmessage = function(event) {
                if (that.isJSON(event.data)) {
                    var mes = JSON.parse(event.data);
                    console.log(mes);
                    if (mes.type == 1001 && mes.roomid == window.corba.crid) { //收到学生上线消息
                        if (mes.fromuser == that.loginuser.ssouserid) {} else {
                            that.touser = [];
                            that.onlinestu = [];
                            that.outlinestu = [];
                            var allstudent = that.allstudent;
                            for (var i = 0; i < mes.bodystr.onlineuser.length; i++) {
                                var online = mes.bodystr.onlineuser;
                                if (online[i] != that.loginuser.ssouserid) {
                                    that.touser.push(online[i]);
                                    for (var j = 0; j < allstudent.length; j++) {
                                        if (online[i] == allstudent[j].ssouserid) {
                                            that.onlinestu.push(that.allstudent[j]);
                                            allstudent.splice(j, 1);
                                        }
                                    }
                                }
                                that.outlinestu = allstudent;
                            }
                        }
                    } else if (mes.type == 1002 && mes.roomid == window.corba.crid) { //收到学生下线消息
                        if (mes.fromuser == that.loginuser.ssouserid) {} else {
                            that.touser = [];
                            that.onlinestu = [];
                            that.outlinestu = [];
                            var allstudent = that.allstudent;
                            for (var i = 0; i < mes.bodystr.onlineuser.length; i++) {
                                var online = mes.bodystr.onlineuser;
                                if (online[i] != that.loginuser.ssouserid) {
                                    that.touser.push(online[i]);
                                    for (var j = 0; j < allstudent.length; j++) {
                                        if (online[i] == allstudent[j].ssouserid) {
                                            that.onlinestu.push(that.allstudent[j]);
                                            allstudent.splice(j, 1);
                                        }
                                    }
                                }
                                that.outlinestu = allstudent;
                            }
                        }
                    } else if (mes.type == 2002 && mes.roomid == window.corba.crid) { //收到ppt页面反馈
                        if (window.corba.open_understand == 1 && window.corba.pagenum == mes.bodystr.pagenum) {
                            ajaxRequest("./pages/lanclass/understand_situation.html", $('.pop-up_box'));
                        }
                    } else if (mes.type == 2003 && mes.roomid == window.corba.crid) { //收到打开ppt页面反馈
                        that.current_displayable.currpage = mes.bodystr.pagenum;
                        window.corba.open_understand = 1;
                        window.corba.pagenum = mes.bodystr.pagenum;
                        ajaxRequest("./pages/lanclass/understand_situation.html", $('.pop-up_box'));
                        $('.pop-up_box').css("display", "block");
                        $('.mask_layer').css("display", "block");
                    } else if (mes.type == 2004 && mes.roomid == window.corba.crid) { //收到关闭ppt页面反馈
                        that.current_displayable.currpage = mes.bodystr.pagenum;
                        window.corba.open_understand = 0;
                        window.corba.pagenum = mes.bodystr.pagenum;
                        $(".mask_layer").css("display", "none");
                        $('.pop-up_box').css("display", "none");
                    } else if (mes.type == 3002 && mes.roomid == window.corba.crid) { //学生提交试题
                        if (window.corba.open_report == 1 && mes.bodystr.questionid == window.corba.question.testid) {
                            for (var i = 0; i < window.corba.questionall.length; i++) {
                                if (window.corba.questionall[i].testid == window.corba.question.testid) {
                                    window.corba.questionid = window.corba.questionall[i].testid;
                                    window.corba.questionnum = i;
                                    if (window.corba.question.ctype == 1 || window.corba.question.ctype == 2) {
                                        resule_solveproblem.choice_statistics();
                                    } else {
                                        resule_solveproblem.subjective_statistics();
                                    }
                                }
                            }
                        }
                    } else if (mes.type == 3003 && mes.roomid == window.corba.crid) { //学生提交试卷
                        if (window.corba.open_report == 1 && mes.bodystr.paperid == window.corba.paperid) {
                            for (var i = 0; i < resule_solveproblem.unsubmitted_students.length; i++) {
                                if (resule_solveproblem.unsubmitted_students[i].ssouserid == mes.fromuser) {
                                    resule_solveproblem.submitted_students.push(resule_solveproblem.unsubmitted_students[i]);
                                }
                            }
                        }
                    } else if (mes.type == 4002 && mes.roomid == window.corba.crid) { //学生抢答
                        if (mes.bodystr.headportrait && mes.bodystr.headportrait.indexOf("http") == -1) {
                            mes.bodystr.headportrait = that.showImageUrl + mes.bodystr.headportrait
                        }
                        mes.bodystr.isdianming = 0;
                        that.qingdastu.push(mes.bodystr);
                    } else if (mes.type == 2001 && mes.roomid == window.corba.crid) { //收到ppt翻页
                        that.clearcanvas();
                        that.current_displayable.currpage = mes.bodystr.pagenum;
                        window.corba.pagenum = mes.bodystr.pagenum;
                        window.corba.rid = that.current_displayable.resources[mes.bodystr.pagenum - 1].rid;
                        var lines = JSON.parse(window.sessionStorage.getItem(window.corba.pagenum));
                        if (lines && lines.length > 0) {
                            for (var i = 0; i < lines.length; i++) {
                                that.drawcanvas(lines[i]);
                            }
                        }
                    } else if (mes.type == 3001 && mes.roomid == window.corba.crid) { //收到教师下发作业
                        that.homework_information(); //重新获取作业列表
                        //如果当前打开的弹出框是当前作业就在弹出框中打开作业统计
                        if (mes.bodystr.paperid == window.corba.paperid && window.corba.viework == 1) {
                            ajaxRequest("./pages/lanclass/result_solveproblem.html", $('.pop-up_box'));
                        }
                    } else if (mes.type == 4001 && mes.roomid == window.corba.crid) { //收到发起抢答
                        that.begins = 1;
                        that.qingdastu = []; //清空抢答列表
                        $(".student_basket_main").width(14 * that.j_size);
                        $(".lanclass_main").width($(".lanclass").width() - 16.4 * that.j_size);
                    } else if (mes.type == 4003 && mes.roomid == window.corba.crid) { //收到教师结束抢答
                        that.begins = 0;
                    } else if (mes.type == 4004 && mes.roomid == window.corba.crid) { //收到教师选择学生抢答
                        for (var i = 0; i < that.qingdastu.length; i++) {
                            if (that.qingdastu[i].ssouserid == mes.touser[0]) {
                                that.qingdastu[i].isdianming = 1;
                            }
                        }
                    } else if (mes.type == 5001 && mes.roomid == window.corba.crid) { //收到关闭课堂消息
                        if (that.socket.readyState == 1) {
                            that.teacheroutlinesocket();
                            that.socket.close();
                            window.corba.scrockstate = 0;
                        } else {
                            window.corba.scrockstate = 0;
                        }
                        ajaxRequest("./pages/repository/teaching_class.html", $('#content'));
                    } else if (mes.type == 6001 && mes.roomid == window.corba.crid) { //收到打开布置预览界面
                        if ($(".pop-up_box").css("display") == "none" || window.corba.paperid != mes.paperid) {
                            that.assign_homework(mes.bodystr);
                        }
                    } else if (mes.type == 6002 && mes.roomid == window.corba.crid) { //收到关闭布置预览界面
                        window.corba.viework = 0;
                        $(".pop-up_box").css("display", "none");
                        $(".mask_layer").css("display", "none");
                    } else if (mes.type == 6011 && mes.roomid == window.corba.crid) { //收到打开做题结果界面
                        that.check_result(mes.bodystr);
                    } else if (mes.type == 6012 && mes.roomid == window.corba.crid) { //收到关闭做题结果界面
                        window.corba.open_report = 0;
                        $(".pop-up_box").html("");
                        $(".pop-up_box").css("display", "none");
                        $(".mask_layer").css("display", "none");
                        that.showloading = true;
                    } else if (mes.type == 6021 && mes.roomid == window.corba.crid) { //收到切换试题
                        if ($(".pop-up_box").css("display") == "block" && window.corba.paperid == mes.bodystr.paperid && window.corba.openpaper == "check_result") {
                            if (mes.bodystr.ctype != 1 && mes.bodystr.ctype != 2) {
                                window.corba.analyaisiopen = 1;
                                $(".answer_statistical").width("60%");
                                $(".turnon").css("display", "none");
                            } else {
                                window.corba.analyaisiopen = 0;
                            }
                            window.corba.questionnum = mes.bodystr.position;
                            resule_solveproblem.select_ques_index = mes.bodystr.position;
                            resule_solveproblem.multiple_choice();
                        } else { //没有打开当前试卷时      
                            window.corba.questionnum = mes.bodystr.position; //打开做题结果页面设置默认显示的试题
                            that.check_result(mes.bodystr);
                        }
                    } else if (mes.type == 6031 && mes.roomid == window.corba.crid) { //收到显示或隐藏答案解析
                        if ($(".pop-up_box").css("display") == "block" && window.corba.paperid == mes.bodystr.paperid && window.corba.openpaper == "check_result") {
                            if (mes.bodystr.type == 0) {
                                resule_solveproblem.showanswer = false;
                            } else if (mes.bodystr.type == 1) {
                                resule_solveproblem.showanswer = true;
                            }
                        } else {
                            if (mes.bodystr.type == 0) {
                                window.corba.showanswer = 0;
                            } else if (mes.bodystr.type == 1) {
                                window.corba.showanswer = 1;
                            }
                            var homework = mes.bodystr;
                            var index = mes.bodystr.position;
                            window.corba.paperid = homework.paperid;
                            window.corba.paperposition = index;
                            window.corba.papername = homework.papername;
                            window.corba.openpaper = "check_result";
                            window.corba.analyaisiopen = 0;
                            $(".mask_layer").css("display", "block");
                            window.corba.questionnum = 0;
                            ajaxRequest("./pages/lanclass/result_solveproblem.html", $('.pop-up_box'));
                            $(".pop-up_box").css("display", "block");
                        }
                    } else if (mes.type == 6032 && mes.roomid == window.corba.crid) { //收到显示或隐藏统计结果
                        if (mes.bodystr.type == 0) {
                            window.corba.analyaisiopen = 0;
                        } else if (mes.bodystr.type == 1) {
                            window.corba.analyaisiopen = 1;
                        }
                        var homework = mes.bodystr;
                        var index = mes.bodystr.position;
                        window.corba.paperid = homework.paperid;
                        window.corba.paperposition = index;
                        window.corba.papername = homework.papername;
                        window.corba.openpaper = "check_result";
                        console.log($(".mask_layer").css("display"));
                        $(".mask_layer").css("display", "block");
                        console.log($(".mask_layer").css("display"));
                        window.corba.questionnum = 0;
                        ajaxRequest("./pages/lanclass/result_solveproblem.html", $('.pop-up_box'));
                        $(".pop-up_box").css("display", "block");
                    } else if (mes.type == 6041 && mes.roomid == window.corba.crid) { //收到打开学生简答题笔迹
                        var useranswer = {};
                        var stubiji = {};
                        stubiji.useranswer = useranswer;
                        stubiji.username = mes.bodystr.username;
                        useranswer.answers = mes.bodystr.answers;
                        window.corba.stubiji = stubiji;
                        var newpopup = "<div class='studentbiji'></div>";
                        $("body").append(newpopup);
                        ajaxRequest("./pages/lanclass/studentbiji.html", $('.studentbiji'));
                    } else if (mes.type == 6042 && mes.roomid == window.corba.crid) { //收到关闭学生简答题笔迹
                        if ($('.studentbiji').length > 0) {
                            $('.studentbiji').remove();
                        }
                    } else if (mes.type == 7001 && mes.roomid == window.corba.crid) { //收到教师发送绘图
                        //console.log(mes.bodystr.points);
                        var points = mes.bodystr.points;
                        var pagenum = mes.bodystr.pagenum;
                        // 保存当前笔迹
                        var bijinow = window.sessionStorage.getItem(pagenum);
                        if (bijinow !== "") {
                            bijinow = JSON.parse(window.sessionStorage.getItem(pagenum));
                        }
                        if (bijinow && bijinow.length > 0) { //当前页面有保存的笔迹时
                            bijinow.push(points);
                            window.sessionStorage.setItem(pagenum, JSON.stringify(bijinow));
                        } else { //当前页面有保存的笔迹时
                            var arr = [];
                            arr.push(points);
                            window.sessionStorage.setItem(pagenum, JSON.stringify(arr));
                        }
                        if (that.current_displayable.currpage == pagenum) {
                            that.drawcanvas(points);
                        } else {
                            that.nextpage(mes.bodystr.pagenum);
                        }
                    } else if (mes.type == 7002 && mes.roomid == window.corba.crid) { //收到教师清空绘图
                        that.clearcanvas();
                        var pagenum = mes.bodystr.pagenum;
                        window.sessionStorage.setItem(pagenum, "");
                    }
                }
            };
        },
        clearcanvas: function() { //清除canvas画布
            var c = document.getElementById("canvas");
            var cxt = c.getContext("2d");
            c.height = c.height;
        },
        drawcanvas: function(point) { //画图
            var points = [];
            var width = $(".pptnow img").width();
            var height = $(".pptnow img").height();
            for (var i = 0; i < point.length; i++) {
                var p = {};
                p.x = point[i].x * width;
                p.y = point[i].y * height;
                points.push(p);
            }
            const canvas = document.querySelector('#canvas');
            const ctx = canvas.getContext('2d');
            var beginPoint = points[0];
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 1;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (var i = 0; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.stroke();
            ctx.closePath();
        },
        shangxiansocket: function() { //老師上綫
            var _this = this;
            index = layer.load(0, {
                time: classapi.timeout
            });
            classapi.post.classroomuser_user_onlined({
                crid: window.corba.crid,
                onlined: 1,
            }, function(result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    var msg = {
                        "type": 1001,
                        "roomid": _this.roomid,
                        "fromuser": _this.loginuser.ssouserid,
                        "touser": [],
                        "device": "web"
                    };
                    msg = JSON.stringify(msg); // 转换为 JSON 字符串的值
                    if (_this.socket.readyState == 1) {
                        _this.socket.send(msg);
                    }
                }
            })
        },
        teacheroutlinesocket: function() { //老师下线发socket
            var _this = this;
            var msg = {
                "type": 1002,
                "roomid": _this.roomid,
                "fromuser": _this.loginuser.ssouserid,
                "touser": [],
                "device": "web"
            };
            msg = JSON.stringify(msg);
            if (_this.socket.readyState == 1) {
                _this.socket.send(msg);
            }
        },
        teacheroutline: function() { //老师下线
            var _this = this;
            index = layer.load(0, {
                time: classapi.timeout
            });
            classapi.post.classroomuser_user_onlined({
                crid: window.corba.crid,
                onlined: 2,
            }, function(result) {
                layer.close(index);
                if (classapi.validata(result)) {}
            })
        },
        close_class: function() { //结束互动课堂接口
            var _this = this;
            var index = layer.load(0, {
                time: classapi.timeout
            });
            classapi.post.classroom_room_end({
                crid: window.corba.crid
            }, function(result) {
                if (classapi.validata(result)) {
                    window.corba.scrockstate = 0;
                }
            });
        },
        exit_classsocket: function() { //关闭互动课堂socket
            var _this = this;
            var msg = {
                "type": 5001,
                "roomid": _this.roomid,
                "fromuser": _this.loginuser.ssouserid,
                "touser": _this.touserarr,
                "bodystr": {},
                "device": "web"
            };
            msg = JSON.stringify(msg);
            if (_this.socket.readyState == 1) {
                _this.socket.send(msg);
            }
        },
        exit_class: function() { //关闭互动课堂
            this.exit_classsocket();
            if (this.socket.readyState == 1) {
                this.teacheroutlinesocket();
                this.socket.close();
                this.close_class();
                window.corba.scrockstate = 0;
            } else {
                this.close_class();
                window.corba.scrockstate = 0;
            }
            ajaxRequest("./pages/repository/teaching_class.html", $('#content'));
        },
        loadDate: function() { //开始智慧课堂
            var _this = this;
            index = layer.load(0, {
                time: classapi.timeout
            });
            classapi.post.classroom_room_save({
                groupid: window.corba.groupid,
                groupname: window.corba.groupname,
                subjectid: _this.loginuser.subjectid,
                subjectname: _this.loginuser.subjectname,
                directorid: _this.loginuser.directorid,
                directorcode: _this.loginuser.directorcode,
                directorname: _this.loginuser.directorname,
                resourcecode: window.corba.resourcecode
            }, function(result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    _this.roomid = result.obj;
                    window.corba.crid = result.obj;
                    _this.homework_information();
                    _this.get_pptcurrent();
                    _this.connect_socket();
                    _this.get_onlinestu(); //获取班级学生
                }
            })
        },
        homework_information: function() { //获取课堂作业信息
            var _this = this;
            _this.homework_list = [];
            var index = layer.load(0, {
                time: classapi.timeout
            });
            classapi.post.classroom_room_papers({
                groupid: window.corba.groupid,
                directorid: _this.loginuser.directorid,
                crid: window.corba.crid
            }, function(result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    for (var i = 0; i < result.obj.length; i++) {
                        _this.homework_list.push(result.obj[i]);
                    }
                }
            });
        },
        get_pptcurrent: function() { //获取课堂ppt图片
            var _this = this;
            var index = layer.load(0, {
                time: classapi.timeout
            });
            classapi.post.crresource_room_resourcesimg({
                crid: window.corba.crid,
            }, function(result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    for (var i = 0; i < result.obj.resources.length; i++) {
                        if (result.obj.resources[i].rpath && result.obj.resources[i].rpath != null && result.obj.resources[i].rpath != "" && result.obj.resources[i].rpath.indexOf("http") == -1) {
                            result.obj.resources[i].rpath = _this.resourceWeb + result.obj.resources[i].rpath
                        }
                    }
                    _this.current_displayable = result.obj;
                    _this.allpagenum = result.obj.resources.length;
                    _this.current_count = _this.current_displayable.resources.length;
                    window.corba.rid = result.obj.resources[result.obj.currpage - 1].rid;
                    window.corba.pagenum = result.obj.currpage;
                }
            });
        },
        get_onlinestu: function() { //获取班级学生和在线状态
            var _this = this;
            var index = layer.load(0, {
                time: classapi.timeout
            });
            classapi.post.classroomuser_user_all_onlineds({
                crid: window.corba.crid
            }, function(result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    _this.studentnumber = result.obj.length;
                    for (var i = 0; i < result.obj.length; i++) {
                        if (result.obj[i].headportrait && result.obj[i].headportrait != null && result.obj[i].headportrait != "" && result.obj[i].headportrait.indexOf("http") == -1) {
                            result.obj[i].headportrait = _this.showImageUrl + result.obj[i].headportrait;
                        }
                        _this.allstudent = result.obj;
                        if (result.obj[i].onlined == 1) { //获取在线的学生
                            _this.onlinestu.push(result.obj[i])
                            _this.touserarr.push(result.obj[i].ssouserid);
                        } else { //获取不在线的学生
                            _this.outlinestu.push(result.obj[i]);
                        }
                    }
                }
            });
        },
        get_qingdastu: function() { //获取学生抢答排名
            this.qingdastu = [];
            var _this = this;
            var index = layer.load(0, {
                time: classapi.timeout
            });
            classapi.post.cranswer_student_listanswer({
                caid: _this.qingdaid
            }, function(result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    for (var i = 0; i < result.obj.length; i++) {
                        if (result.obj[i].headportrait && result.obj[i].headportrait != "" && result.obj[i].headportrait != null && result.obj[i].headportrait.indexOf("http") == -1) {
                            result.obj[i].headportrait = _this.showImageUrl + result.obj[i].headportrait
                        }
                        _this.qingdastu.push(result.obj[i])
                    }
                }
            });
        },
        qd_begins: function() { //教师发起抢答接口
            this.studentonline();
            this.begins = 1;
            this.qingdastu = []; //清空抢答列表
            $(".student_basket_main").width(14 * this.j_size);
            $(".lanclass_main").width($(".lanclass").width() - 16.4 * this.j_size);
            var _this = this;
            index = layer.load(0, {
                time: classapi.timeout
            });
            classapi.post.cranswer_teacher_saveask({
                crid: window.corba.crid,
            }, function(result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    _this.qingdaid = result.obj;
                    _this.setqiangda_socket();
                }
            })
        },
        setqiangda_socket: function() { //发送发起抢答socket
            var _this = this;
            var msg = {
                "type": 4001,
                "roomid": _this.roomid,
                "fromuser": _this.loginuser.ssouserid,
                "touser": _this.touserarr,
                "bodystr": { "caid": _this.qingdaid },
                "device": "web"
            };
            msg = JSON.stringify(msg);
            _this.socket.send(msg);
        },
        call_roll: function(stu) { //选中学生抢答
            stu.isdianming = 1;
            var _this = this;
            index = layer.load(0, {
                time: classapi.timeout
            });
            classapi.post.cranswer_answer_saveteacherstudent({ //保存教师点名学生回答问题
                userid: stu.userid,
                crid: window.corba.crid,
                caid: _this.qingdaid
            }, function(result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    _this.callroll_socket(stu.ssouserid);
                }
            })
        },
        callroll_socket: function(ssouserid) { //向选中学生发送回答问题socket
            var _this = this;
            var msg = {
                "type": 4004,
                "roomid": _this.roomid,
                "fromuser": _this.loginuser.ssouserid,
                "touser": _this.touserarr,
                "bodystr": {},
                "device": "web"
            };
            msg = JSON.stringify(msg);
            if (_this.socket.readyState == 1) {
                _this.socket.send(msg);
            }
        },
        studentonline: function() { //关闭抢答
            var _this = this;
            this.begins = 0;
            this.qingdastu = [];
            index = layer.load(0, {
                time: classapi.timeout
            });
            classapi.post.cranswer_teacher_endask({
                crid: window.corba.crid,
                caid: _this.qingdaid
            }, function(result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    _this.closeqingda_socket();
                }
            })
        },
        closeqingda_socket: function() { //关闭抢答socket
            var _this = this;
            var msg = {
                "type": 4003,
                "roomid": _this.roomid,
                "fromuser": _this.loginuser.ssouserid,
                "touser": _this.touserarr,
                "bodystr": {},
                "device": "web"
            };
            msg = JSON.stringify(msg);
            _this.socket.send(msg);
        },
        git_vies: function() { //进入课堂时获取是否有正在进行中的抢答
            var _this = this;
            index = layer.load(0, {
                time: classapi.timeout
            });
            classapi.post.cranswer_answer_answering({
                crid: window.corba.crid
            }, function(result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    if (result.obj) {
                        _this.qingdaid = result.obj.caid;
                        _this.begins = 1;
                        _this.get_qingdastu();
                    }
                }
            })
        },
        assign_homework: function(homework, index) { //浏览未布置的作业
            window.corba.paperposition = index;
            window.corba.questionnum = 0;
            window.corba.viework = 1; //打开了作业预览页面
            window.corba.papername = homework.papername;
            window.corba.paperid = homework.paperid;
            window.corba.openpaper = "assign_homework";
            $(".mask_layer").css("display", "block");
            ajaxRequest("./pages/lanclass/preview_homework.html", $('.pop-up_box'));
            $(".pop-up_box").css("display", "block");
            this.assign_homework_socket();
        },
        assign_homework_socket: function() { //打开布置预览页面-发送socket
            var _this = this;
            var touser = [];
            touser.push(_this.loginuser.ssouserid);
            var msg = {
                "type": 6001,
                "roomid": _this.roomid,
                "fromuser": _this.loginuser.ssouserid,
                "touser": touser,
                "bodystr": {
                    "paperid": window.corba.paperid,
                    "position": window.corba.paperposition,
                    "papername": window.corba.papername
                },
                "device": "web"
            };
            msg = JSON.stringify(msg);
            if (_this.socket.readyState == 1) {
                _this.socket.send(msg);
            }
        },
        understand_situation: function() { //打开理解情况
            window.corba.open_understand = 1;
            ajaxRequest("./pages/lanclass/understand_situation.html", $('.pop-up_box'));
            $('.pop-up_box').css("display", "block");
            $('.mask_layer').css("display", "block");
            this.understand_situation_socket();
        },
        understand_situation_socket: function() { //打开理解情况-发送socket
            var _this = this;
            var touser = [];
            touser.push(_this.loginuser.ssouserid);
            var msg = {
                "type": 2003,
                "roomid": _this.roomid,
                "fromuser": _this.loginuser.ssouserid,
                "touser": touser,
                "bodystr": {
                    "pagenum": window.corba.pagenum
                },
                "device": "web"
            };
            msg = JSON.stringify(msg);
            if (_this.socket.readyState == 1) {
                _this.socket.send(msg);
            }
        },
        check_result: function(homework, index) { //打开已经布置的作业
            window.corba.paperid = homework.paperid;
            window.corba.paperposition = index;
            window.corba.papername = homework.papername;
            window.corba.openpaper = "check_result";
            window.corba.analyaisiopen = 0;
            $(".mask_layer").css("display", "block");
            window.corba.questionnum = 0;
            ajaxRequest("./pages/lanclass/result_solveproblem.html", $('.pop-up_box'));
            $(".pop-up_box").css("display", "block");
            this.check_result_socket();
        },
        check_result_socket: function() { //打开已经布置的作业-发送socket
            var _this = this;
            var touser = [];
            touser.push(_this.loginuser.ssouserid);
            var msg = {
                "type": 6011,
                "roomid": _this.roomid,
                "fromuser": _this.loginuser.ssouserid,
                "touser": touser,
                "bodystr": {
                    "paperid": window.corba.paperid,
                    "position": window.corba.paperposition,
                    "papername": window.corba.papername
                },
                "device": "web"
            };
            msg = JSON.stringify(msg);
            if (_this.socket.readyState == 1) {
                _this.socket.send(msg);
            }
        },
        nextpage: function(page) { //切换下一页
            var _this = this;
            if (page <= _this.current_displayable.resources.length && page > 0) {
                _this.clearcanvas();
                this.current_displayable.currpage = page;
                index = layer.load(0, {
                    time: classapi.timeout
                });
                window.corba.rid = _this.current_displayable.resources[_this.current_displayable.currpage - 1].rid;
                classapi.post.crresource_room_updateresource({
                    crid: window.corba.crid,
                    pagenum: _this.current_displayable.currpage,
                    rid: _this.current_displayable.resources[_this.current_displayable.currpage - 1].rid
                }, function(result) {
                    layer.close(index);
                    if (classapi.validata(result)) {
                        window.corba.pagenum = _this.current_displayable.currpage;
                        _this.nowpagedraw(window.corba.pagenum);
                        _this.next_socket();
                    }
                })
            }
        },
        next_socket: function() { //ppt切换下一页保存数据库成功，发送socket
            var _this = this;
            var msg = {
                "type": 2001,
                "roomid": _this.roomid,
                "fromuser": _this.loginuser.ssouserid,
                "touser": _this.touserarr,
                "bodystr": { "pagenum": _this.current_displayable.currpage },
                "device": "web"
            };
            msg = JSON.stringify(msg);
            if (_this.socket.readyState == 1) {
                _this.socket.send(msg);
            }
        },
        nowpagedraw: function(pagenum) { //获取当前页的老师笔迹
            var _this = this;
            var lines = JSON.parse(window.sessionStorage.getItem(pagenum));
            if (lines && lines.length > 0) {
                for (var i = 0; i < lines.length; i++) {
                    _this.drawcanvas(lines[i]);
                }
            }
        }
    }
})