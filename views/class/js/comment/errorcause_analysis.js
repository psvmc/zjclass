$(function(){
	//删除
	$(".error_analysis>img").click(function(){
		$(".mask_layer").css("display", "none");
		$('.pop-up_box').css("display", "none");
	})
	historyarr.pop();
})

new Vue({
    el: ".error_analysis",
	data: {
        paperid:window.paperid,
        groupid:window.groupid,
        testid:window.testid
    },
    mounted() {
		this.loaderrorcase();
	},
	methods: {
        loaderrorcase: function(){
			var _this = this;
			classapi.post.homework_teacher_singleerrorcause({
				paperid: _this.paperid,
				groupid: _this.groupid,
				questionid: _this.testid
			}, function(result) {
				if(classapi.validata(result)) {
                    var obj = result.obj;
                    var datecolor = ["#ffad00", "#ff5d45", "#4a91e3", "#d7d7d7", "#90b9ed", "#bbe172", "#e8f5fb"];
                    var datas = [];
                    for(var i=0;i<obj.length;i++){
                        var itemdata = obj[i];
                        datas.push({
                            name: itemdata.errorcausename,
                            y: itemdata.errorcauserate,
                            color: datecolor[i]
                        });
                    }
                    _this.loadchart(datas);
				}
			});
        },
        loadchart: function(_datas){
            var datas = _datas;
            $(".error_analysis_main").highcharts({
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
                        return '<p>' + this.key + ':' + this.y * 100 + '%</p>'
                    }
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        depth: 35,
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
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