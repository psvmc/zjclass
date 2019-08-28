$(function () {
    var j_size = parseInt($("body").css("fontSize"));
    $(".single_statistics_body").height($("#content").height() - j_size);
    $(".single_statistics_detail").height($(".single_statistics_body").height() - 10.2 * j_size);

    finishtime();//题目完成用时
    typetext();//题型正确率

})

//加载作业名称和班级
var single_statistics_head = new Vue({
    el: ".single_statistics_head",
    data: {
        homework: window.homework
    }
});
/*题目完成用时*/

//题目完成用时请求
function finishtime() {
    var index = layer.load(0, {

        time: classapi.timeout
    });
    classapi.post.homework_teacher_singletime({
        paperid: window.homework.paperid,
        groupid: window.homework.groupid
    }, function (result) {
        layer.close(index);
        if (classapi.validata(result)) {
            var datas = result.obj;
            if (datas != null && datas.length > 0) {
                var xtitle = new Array();//x名称
                var shortime = new Array();//最短用时
                var avgtime = new Array();//平均用时

                for (var i = 0; i < datas.length; i++) {
                    xtitle.push("第" + (i + 1) + "题");
                    shortime.push(datas[i].shorttime);
                    avgtime.push(datas[i].averagetime);
                }

                loadfinishtime(xtitle, shortime, avgtime);
            } else {
                $(".problem_done").addClass("no-date");
            }
        }
    });
}

//题目完成用时--统计图
function loadfinishtime(xtitle, shortime, avgtime) {
    $('.problem_done').highcharts({
        //标题
        title: {
            text: '',
        },
        //副标题
        subtitle: {
            text: '',
        },
        //横坐标
        xAxis: {
            lineWidth: 2,
            gridLineColor: '#444444',
            gridLineDashStyle: "dash",
            gridLineWidth: 1,
            lineColor: '#444444',
            tickColor: '#ffffff',
            categories: xtitle,
            tickmarkPlacement: 'on',
            labels: {
                style: {
                    color: "#294f89",
                    fontFamily: "simsun",
                    fontSize: "12px"
                }
            }
        },
        //纵坐标
        yAxis: {
            title: {
                offset: -10,
                rotation: 0,
                y: -12,
                align: "high",
                text: '时间（s）',
                style: {
                    color: "#294f89",
                    fontFamily: "microsoft yahei",
                    fontSize: "13px"
                }
            },
            gridLineColor: '#444444',
            gridLineWidth: 1,
            lineWidth: 2,
            lineColor: '#444444',
            showFirstLabel: true,
            showLastLabel: true,
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
            itemMarginBottom: 0,
            itemStyle: {
                "font-size": "10.5",
                "font-family": "microsoft yahei",
                "color": "#284f88"
            }
        },
        series: [{
            color: "#566eed",
            name: '平均用时',
            data: avgtime
        },
            {
                color: "#4bdbba",
                name: '最短用时',
                data: shortime
            }
        ],
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true,
                    format: '{y} s'
                }
            }
        },
        credits: {
            enabled: false
        }
    });
}

/*作业各题型正确率*/

//题型正确率
function typetext() {
    var index = layer.load(0, {

        time: classapi.timeout
    });
    classapi.post.homework_teacher_singletypetext({
        paperid: window.homework.paperid,
        groupid: window.homework.groupid
    }, function (result) {
        layer.close(index);
        if (classapi.validata(result)) {
            var datas = result.obj;
            if (datas != null && datas.length > 0) {
                var typetextname = new Array();//x名称
                var avgaccuarcy = new Array();//个人正确率
                var maxaccuracy = new Array();
                for (var i = 0; i < datas.length; i++) {
                    typetextname.push(datas[i].typetextname);
                    avgaccuarcy.push(parseInt(datas[i].averageAccuracy * 100));
                    maxaccuracy.push(parseInt(datas[i].highAccuracy * 100));
                }

                loadtypetext(typetextname, avgaccuarcy, maxaccuracy);
            } else {
                $(".homework_correct").addClass("no-date");
            }
        }
    });
}

//题型正确率统计图
function loadtypetext(typetextname, avgaccuarcy, maxaccuracy) {
    $('.homework_correct').highcharts({
        chart: {
            type: 'column'
        },
        //标题
        title: {
            text: '',
        },
        //副标题
        subtitle: {
            text: '',
        },
        //横坐标
        xAxis: {
            lineWidth: 2,
            gridLineColor: '#444444',
            gridLineDashStyle: "dash",
            gridLineWidth: 1,
            lineColor: '#444444',
            tickColor: '#ffffff',
            categories: typetextname,
            labels: {
                style: {
                    color: "#294f89",
                    fontFamily: "simsun",
                    fontSize: "12px"
                }
            }
        },
        //纵坐标
        yAxis: {
            title: {
                offset: -10,
                rotation: 0,
                y: -12,
                align: "high",
                text: '正确率（%）',
                style: {
                    color: "#294f89",
                    fontFamily: "microsoft yahei",
                    fontSize: "13px"
                }
            },
            gridLineColor: '#444444',
            gridLineWidth: 1,
            lineWidth: 2,
            lineColor: '#444444',
        },
        //显示框
        tooltip: {
            enabled: false
        },
        legend: {
            layout: 'vertical',
            align: 'right', //程度标的目标地位
            verticalAlign: 'top', //垂直标的目标地位
            borderWidth: 0, //边框大小
            x: 0,
            y: -10,
            symbolHeight: 14,
            symbolWidth: 14,
            symbolRadius: 0,
            layout: "horizontal",
            itemDistance: 16,
            itemMarginBottom: 0,
            itemStyle: {
                "font-size": "10.5",
                "font-family": "microsoft yahei",
                "color": "#284f88"
            }
        },
        series: [{
            color: "#566eed",
            name: '平均正确率',
            data: avgaccuarcy
        },
            {
                color: "#ff5a62",
                name: '最高正确率',
                data: maxaccuracy
            }
        ],
        credits: {
            enabled: false
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '{y} %',
                    style: {
                        color: "#444444",
                        fontSize: 14,
                        fontFamily: "microsoft yahei",
                        fontWeight: 400
                    }
                }
            }
        }
    })
}