$(function () {

	//关闭
	$(".padlock").click(function () {
		$(".pop-up_box").css("display", "none");
		$(".mask_layer").css("display", "none");
	})
})


new Vue({
	el: ".examinationpaper_analysis_main_table",
	data: {
		paperid: window.paperid,
		paperanalyze: {},
		knowledgepoints: []
	},
	mounted() {
		loadData();
	},
	methods: {
		loadData: function () {
			var _this = this;
			var index = layer.load(0, {
				
				time: classapi.timeout
			});
			classapi.post.paperQuestion_paperAnalysisAjax({
				paperid: _this.paperid
			}, function (result) {
				layer.close(index);
				if (classapi.validata(result)) {
					var obj = result.obj;
					_this.paperanalyze = obj.testPaperAnalysis;
					_this.knowledgepoints = obj.knowledgePoints;
					_this.loadchart(_this.paperanalyze);
				}
			});
		},
		loadchart: function (paperanalyze) {
			var map = paperanalyze.map;
			var data = [];
			for (var key in map) {
				if (key == "one") {
					data.push({
						y: map[key],
						name: "很简单",
						color: "#9A56FB"
					});
				}
				if (key == "two") {
					data.push({
						y: map[key],
						name: "简单",
						color: "#73E22B"
					});
				}
				if (key == "three") {
					data.push({
						y: map[key],
						name: "中等",
						color: "#FBBD38"
					});
				}
				if (key == "foure") {
					data.push({
						y: map[key],
						name: "困难",
						color: "#48CAEF"
					});
				}
				if (key == "five") {
					data.push({
						y: map[key],
						name: "很困难",
						color: "#d93c00"
					});
				}
			}

			Highcharts.chart('difficulty_structure', {
				chart: {
					plotBackgroundColor: null,
					plotBorderWidth: null,
					plotShadow: false,
					type: 'pie'
				},
				title: {
					text: ''
				},
				tooltip: {
					pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
				},
				plotOptions: {
					pie: {
						allowPointSelect: true,
						cursor: 'pointer',
						dataLabels: {
							enabled: true,
							format: '<b>{point.name}</b>: {point.percentage:.1f} %',
							style: {
								color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
							}
						}
					}
				},
				series: [{
					name: 'Brands',
					colorByPoint: true,
					data: data
				}],
				credits: {
					enabled: false
				}
			});
		}
	}
})