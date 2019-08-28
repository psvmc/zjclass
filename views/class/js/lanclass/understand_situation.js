$(function() {
    historyarr.pop();
})

new Vue({
    el: ".error_analysis",
    data: {
        loginuser: JSON.parse(zj.getcookie("loginuser"))
    },
    mounted() {
        this.loaderrorcase();
    },
    methods: {
        close_understand: function() { //关闭页面反馈
            window.corba.open_understand = 0;
            $(".mask_layer").css("display", "none");
            $('.pop-up_box').css("display", "none");
            this.close_understand_socket();
        },
        close_understand_socket: function() { //关闭页面反馈-发送socket
            var _this = this;
            var touser = [];
            touser.push(_this.loginuser.ssouserid);
            var msg = {
                "type": 2004,
                "roomid": window.corba.crid,
                "fromuser": _this.loginuser.ssouserid,
                "touser": touser,
                "bodystr": { "pagenum": window.corba.pagenum },
                "device": "web"
            };
            msg = JSON.stringify(msg);
            if (lanclass.socket.readyState == 1) {
                lanclass.socket.send(msg);
            }
        },
        loaderrorcase: function() {
            var _this = this;
            classapi.post.crresource_resource_understand_num({
                crid: window.corba.crid,
                rid: window.corba.rid,
                pagenum: window.corba.pagenum,
            }, function(result) {
                if (classapi.validata(result)) {
                    var obj = result.obj;
                    var datecolor = ["#ffad00", "#ff5d45", "#4a91e3", "#d7d7d7", "#90b9ed", "#bbe172", "#e8f5fb"];
                    var lijie = 0;
                    var bulijie = 0;
                    window.corba.datas = [{
                        name: '理解',
                        color: '#ffad00',
                        y: 0
                    }, {
                        name: '不理解',
                        color: '#ff5d45',
                        y: 0
                    }]
                    if (obj.length > 0) {
                        for (var i = 0; i < obj.length; i++) {
                            if (obj[i].understand == 1) {
                                window.corba.datas[0].y = obj[i].num;
                            } else if (obj[i].understand == 2) {
                                window.corba.datas[1].y = obj[i].num;
                            }
                        }
                    }
                    _this.loadchart(window.corba.datas);
                }
            });
        },
        loadchart: function(_datas) { //判断是否有数据
            if (_datas[0].y == 0 && _datas[1].y == 0) {
                $(".error_analysis_main").addClass("no-date");
            } else if ($(".error_analysis_main").hasClass("no-date")) {
                $(".error_analysis_main").removeClass("no-date");
                this.createchart(_datas);
            } else {
                this.createchart(_datas);
            }
        },
        createchart: function(_datas) { //统计图
            var datas = _datas;
            $(".error_analysis_main").highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: ''
                },
                legend: {
                    itemStyle: {
                        fontSize: "14px"
                    }
                },
                tooltip: {
                    formatter: function() {
                        return '<p>' + this.key + ':' + this.y + '人</p>'
                    }
                },
                plotOptions: {
                    pie: {
                        animation: false,
                        allowPointSelect: true,
                        cursor: 'pointer',
                        depth: 35,
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.y}人',
                            style: {
                                fontSize: "14px",
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        },
                        showInLegend: true
                    }
                },
                series: [{
                    name: '比例',
                    colorByPoint: true,
                    data: datas
                }],
                credits: {
                    enabled: false
                }
            })
        }
    }
})