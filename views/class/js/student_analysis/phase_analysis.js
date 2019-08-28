$(function () {
    var j_size = parseInt($("body").css("fontSize"));
    $(".phase_analysis_body").height($("#content").height() - j_size);
    $(".single_statistics_detail").height($(".phase_analysis_body").height() - 7.8 * j_size);
    laydate.render({
        elem: '#starttime',
        range: true,
        min: '2010-01-01',
        done: function (value, date, endDate) {

            //alert('你选择的日期是：' + value + '\n获得的开始时间对象是' + JSON.stringify(date)+'\n获得的结束时间对象是'+JSON.stringify(endDate));

        }
    });
});

//获取教师任教班级信息
var group = new Vue({
    el: ".phase_analysis_screen",
    data: {
        groupdata: [],
        select_group: 0,
    },
    mounted() {
        this.initWeekDate();
        this.loadData();
    },
    methods: {
        loadData: function () {
            var _this = this;
            //添加缓存之后页面会闪烁
            // var cache_data = zj.cache_get("phase_analysis_data");
            // if (cache_data) {
            //     _this.pagedata = [];
            //     for (var i = 0; i < cache_data.length; i++) {
            //         var itemData = cache_data[i];
            //         _this.groupdata.push(itemData);
            //         if (i == 0) {
            //             _this.select_group = itemData.groupid;
            //         }
            //     }
            //     _this.loadChart();
            // } else {
            //     layer.load(0, {
            //         time: classapi.timeout
            //     });
            // }
            layer.load(0, {
                time: classapi.timeout
            });
            classapi.post.group_groupteacher({}, function (result) {
                if (classapi.validata(result)) {
                    layer.closeAll();
                    var obj = result.obj;
                    _this.groupdata = [];
                    for (var i = 0; i < obj.length; i++) {
                        var itemData = obj[i];
                        _this.groupdata.push(itemData);
                        if (i == 0) {
                            _this.select_group = itemData.groupid;
                        }
                    }
                    //zj.cache_save("phase_analysis_data", _this.groupdata);
                    _this.loadChart();
                }
            });
        },
        groupchange: function () {
            //this.loadChart();
        },
        loadChart: function () {
            var starttime = $("#starttime").text();
            var _starttime = starttime.substring(0, 10);
            var _stoptime = starttime.substring((starttime.length - 10), starttime.length);
            var groupid = this.select_group;
            processknowledge(groupid, _starttime, _stoptime); //知识点分析
            processerrorcause(groupid, _starttime, _stoptime); //错误原因分析
        },
        initWeekDate: function () {
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            var day = date.getDate();
            if (day >= 0 && day <= 9) {
                day = "0" + day;
            }
            var end = year + '-' + month + '-' + day;

            var now = new Date();
            var date = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            var day = date.getDate();
            if (day >= 0 && day <= 9) {
                day = "0" + day;
            }

            var begin = year + '-' + month + '-' + day;
            $("#starttime").text(begin + " - " + end);
        }
    }
})

//知识点分析
function processknowledge(groupid, starttime, stoptime) {
    var phase_analysis_xtitle_1 = zj.cache_get("phase_analysis_xtitle_1");
    var phase_analysis_datathis_1 = zj.cache_get("phase_analysis_datathis_1");
    if (phase_analysis_xtitle_1) {
        loadprocessknowledge(phase_analysis_xtitle_1, phase_analysis_datathis_1);
        $(".problem_done").removeClass("no-date");
    } else {
        layer.load(0, {
            time: classapi.timeout
        });
    }
    classapi.post.homework_teacher_stageknowledge({
        groupid: groupid,
        userid: JSON.parse(zj.getcookie("loginuser")).userid,
        subjectid: JSON.parse(zj.getcookie("loginuser")).subjectid,
        starttime: starttime,
        stoptime: stoptime,
    }, function (result) {
        layer.closeAll();
        if (classapi.validata(result)) {
            var datas = result.obj;
            if (datas != null && datas.length > 0) {
                var xtitle = new Array();
                var datathis = new Array();
                for (var i = 0; i < datas.length; i++) {
                    xtitle.push(datas[i].pointname);
                    datathis.push(parseInt(datas[i].pointaccuracy));
                }
                zj.cache_save("phase_analysis_xtitle_1", xtitle);
                zj.cache_save("phase_analysis_datathis_1", datathis);
                loadprocessknowledge(xtitle, datathis);
                $(".problem_done").removeClass("no-date");
            } else {
                $(".problem_done").html("");
                $(".problem_done").addClass("no-date");
            }
        }
    });
}

//知识点分析--统计图
function loadprocessknowledge(xtitle, datathis) {
    $('.problem_done').highcharts({
        chart: {
            polar: true,
            type: 'line'
        },
        title: {
            text: '',
        },
        xAxis: {
            categories: xtitle,
            tickmarkPlacement: 'on',
            lineWidth: 0,
            labels: {
                style: {
                    color: "#294f89",
                    fontFamily: "simsun",
                    fontSize: "14px",
                    fontWeight: "800"
                }
            }
        },
        yAxis: {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0,
            plotBands: [{
                from: 0,
                to: 80,
                className: 'good'
            }, {
                from: 80,
                to: 100,
                className: 'bad'
            }, {
                from: 100,
                to: 120,
                className: 'ugly'
            }]
        },
        tooltip: {
            shared: true,
            pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y}%</b><br/>'
        },
        legend: {
            layout: 'vertical',
            align: 'right', //程度标的目标地位
            verticalAlign: 'top', //垂直标的目标地位
            borderWidth: 0, //边框大小
            x: 0,
            y: -10,
            layout: "horizontal",
            itemDistance: 16,
            itemMarginBottom: 28,
            itemStyle: {
                "font-size": "14",
                "font-family": "microsoft yahei",
                "color": "#284f88"
            }
        },
        series: [{
            name: '正确率',
            type: "area",
            data: datathis,
            color: "#fab88b",
            pointPlacement: 'on'
        }],
        credits: {
            enabled: false
        }
    });
}

//错误原因分析
function processerrorcause(groupid, starttime, stoptime) {
    var phase_analysis_datathis_2 = zj.cache_get("phase_analysis_datathis_2");
    if (phase_analysis_datathis_2) {
        loadprocesserrorcause(phase_analysis_datathis_2);
        $(".homework_correct").removeClass("no-date");
    } else {
        layer.load(0, {

            time: classapi.timeout
        });
    }
    classapi.post.homework_teacher_stageerrorcause({
        groupid: groupid,
        userid: JSON.parse(zj.getcookie("loginuser")).userid,
        subjectid: JSON.parse(zj.getcookie("loginuser")).subjectid,
        starttime: starttime,
        stoptime: stoptime
    }, function (result) {
        layer.closeAll();
        if (classapi.validata(result)) {
            var datas = result.obj;
            if (datas != null && datas.length > 0) {
                var datecolor = ["#ffad00", "#ff5d45", "#4a91e3", "#d7d7d7", "#90b9ed", "#bbe172", "#e8f5fb"];
                var datathis = new Array();
                for (var i = 0; i < datas.length; i++) {
                    var data_ = {
                        name: datas[i].errorcausename,
                        y: parseInt(datas[i].errorcauserate * 100),
                        color: datecolor[i],
                    };
                    datathis.push(data_);
                }
                zj.cache_save("phase_analysis_datathis_2", datathis);
                loadprocesserrorcause(datathis);
                $(".homework_correct").removeClass("no-date");
            } else {
                $(".homework_correct").html("");
                $(".homework_correct").addClass("no-date");
            }
        }
    });

}

//错误原因分析--统计图
function loadprocesserrorcause(datathis) {
    //作业各题目错误原因分析
    $(".homework_correct").highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45,
                beta: 3
            }
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
            formatter: function () {
                return '<p>' + this.key + ':' + this.y + '%</p>'
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                depth: 35,
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.0f} %',
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
            data: datathis
        }],
        credits: {
            enabled: false
        }
    })
}

//加载日期