var push_homework_main = new Vue({
    el: ".selclass",
    data: {
        class_underway: [],
        onlinestuid: [],
        loginuser: JSON.parse(zj.getcookie("loginuser")),
        lanclassing: false
    },
    filters: {},
    mounted: function () {
        this.loadclassunderway();
    },
    methods: {
        loadclassunderway: function () {    //加载正在进行中的课堂
            var _this = this;
            var index = layer.load(0, {
                time: classapi.timeout
            });
            classapi.post.classroom_room_groups({
                resourcecode: window.corba.resourcecode
            }, function (result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    var obj = result.obj;
                    _this.class_underway = [];
                    for (var i = 0; i < obj.length; i++) {
                        var itemData = obj[i];
                        if (itemData.groupstatus == 1) {
                            _this.lanclassing = true;
                        }
                        _this.class_underway.push(itemData);
                    }
                }
            });
        },
        closeselclass: function () {
            $(".pop-up_box").css("display", "none");
            $(".mask_layer").css("display", "none");
        },
        creating: function (cban) {
            window.corba.groupid = cban.groupid;
            window.corba.groupname = cban.groupname;
            window.corba.floppytype = 0;
            $(".pop-up_box").css("display", "none");
            $(".mask_layer").css("display", "none");
        },
        close_socket: function () {
            var _this = this;
            var msg = {
                "type": 1002,
                "rommid": _this.roomid,
                "fromuser": _this.loginuser.ssouserid,
                "touser": [],
                "device": "webclient"
            };
            msg = JSON.stringify(msg);
            if (lanclass.socket.readyState == 1) {
                lanclass.socket.send(msg);
            }
            lanclass.socket.close();
            window.corba.scrockstate = 0;
        },
        closing_class: function (cban) {    //关闭正在进行中的课堂
            cban.groupstatus = 0;
            var _this = this;
            var index = layer.load(0, {
                time: classapi.timeout
            });
            classapi.post.classroom_room_end({
                crid: cban.schoolid  //正在进行的课堂id
            }, function (result) {
                if (classapi.validata(result)) {
                    layer.close(index);
                    _this.lanclassing = false;
                    if (typeof (lanclass) != "undefined" && lanclass.socket && lanclass.socket.readyState == 1) {
                        _this.close_socket();
                    }
                }
            });
        }
    }
})