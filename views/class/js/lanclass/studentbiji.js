var biji = new Vue({
    el: ".studentbiji_content",
    data: {
        stupic: [],
        stuname: "",
        showImageUrl: classapi.config.showImageUrl,
        loginuser: JSON.parse(zj.getcookie("loginuser"))
    },
    filters: {},
    mounted: function() {
        this.stuname = window.corba.stubiji.username;
        this.load_data();
    },
    methods: {
        close_preview: function() { //关闭简答题笔迹
            $('.studentbiji').remove();
            this.close_preview_socket();
        },
        close_preview_socket: function() { //关闭简答题笔迹-发送socket
            var _this = this;
            var msg = {
                "type": 6042,
                "roomid": window.corba.crid,
                "fromuser": _this.loginuser.ssouserid,
                "touser": lanclass.touserarr,
                "bodystr": { "paperid": window.corba.paperid, "papername": window.corba.papername, },
                "device": "web"
            };
            msg = JSON.stringify(msg);
            if (lanclass.socket.readyState == 1) {
                lanclass.socket.send(msg);
            }
        },
        load_data: function() {
            for (var i = 0; i < window.corba.stubiji.useranswer.answers.length; i++) {
                if (window.corba.stubiji.useranswer.answers[i].length) {
                    for (var j = 0; j < window.corba.stubiji.useranswer.answers[i].length; j++) {
                        if (window.corba.stubiji.useranswer.answers[i][j].indexOf("http") == -1) {
                            window.corba.stubiji.useranswer.answers[i][j] = this.showImageUrl + window.corba.stubiji.useranswer.answers[i][j]
                        }
                        this.stupic.push(window.corba.stubiji.useranswer.answers[i][j]);
                    }
                } else {
                    if (window.corba.stubiji.useranswer.answers[i].indexOf("http") == -1) {
                        window.corba.stubiji.useranswer.answers[i] = this.showImageUrl + window.corba.stubiji.useranswer.answers[i]
                    }
                    this.stupic.push(window.corba.stubiji.useranswer.answers[i]);
                }

            }
        }
    }
})