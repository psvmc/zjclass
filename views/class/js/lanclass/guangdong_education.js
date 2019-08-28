$(function () {
    var j_size = parseInt($("body").css("fontSize"));
    $(".guangdong_education").height($("#content").height() - 0.8 * j_size);
    $(".guangdong_education_main").height($(".guangdong_education").height() - 9.8 * j_size);
})
var push_homework_main = new Vue({
    el: ".guangdong_education",
    data: {
        currpage: 1,
        showpage: 10,
        pages: 1,
        loginuser: JSON.parse(zj.getcookie("loginuser")),
        class_list: []
    },
    filters: {},
    mounted: function () {
        this.getpaging();
        this.loadDate();
    },
    methods: {
        loadDate: function () {
            var _this = this;
            var index = layer.load(0, {
                time: classapi.timeout
            });
            classapi.post.classroom_room_teacherhistory({
                directorid: _this.loginuser.directorid,
                currpage: this.currpage
            }, function (result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    var obj = result.obj;
                    _this.class_list = [];
                    for (var i = 0; i < obj.length; i++) {
                        obj[i].createtime = new Date(parseInt(obj[i].createtime) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ')
                        _this.class_list.push(obj[i]);
                    }
                }
            });
        },
        getpaging: function () {
            var _this = this;
            var index = layer.load(0, {
                time: classapi.timeout
            });
            classapi.post.classroom_room_teacherhistorycount({
                directorid: _this.loginuser.directorid,
            }, function (result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    this.pages = result.obj
                }
            });
        },
        enterclass: function (ket) {    //进入正在进行中的课堂
            window.corba.floppytype = 1;
            window.corba.groupid = ket.groupid;
            window.corba.crid = ket.crid;
        },
        open_analysis: function (ket) {    //打开课堂统计
            window.corba.crid = ket.crid;
            window.corba.crname = ket.crname;
            window.corba.groupid = ket.groupid;
            ajaxRequest("./pages/lanclass/lanclass_analysis.html", $("#content"));
        }
    }
})