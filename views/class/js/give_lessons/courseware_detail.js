$(function () {
    var j_size = parseInt($("body").css("fontSize"));
    $(".lecture_main").height($("#content").height() - j_size);
    $(".kejian_detail").height($(".lecture_main").height() - 11.6 * j_size);
    //详情
    $(".class_detail_operation .class_detail_detail_ico").mouseover(function () {
        $(this).find(".class_detail_detail").stop().slideDown();
    })
    $(".class_detail_operation .class_detail_detail_ico").mouseleave(function () {
        $(this).find(".class_detail_detail").stop().slideUp();
    })
    //滚动的高度
    $(".class_detail_main_pic").height($("#content").height() - $(".prepare_head").outerHeight() - $(".class_detail_main").outerHeight() - 24);
    //点击返回
    $(".class_detail_operation").delegate(".backtrack", "click", function () {
        ajaxRequest("./pages/repository/teaching_class.html", $('#content'));
    })
    //点击全屏
    $(".class_detail_operation span.full").click(function () {
        // $(".kejian_detail").height("auto");
        requestFullScreen($(".kejian_detail_main")[0]);
    })
    $(document).keyup(function (event) {
        switch (event.keyCode) {
            case 27:
                alert("ESC");
            case 96:
                alert("ESC");
        }
    });
})
/*全屏*/
var requestFullScreen = function (element) {
    //某个元素有请求
    var requestMethod = element.requestFullScreen
        || element.webkitRequestFullScreen //谷歌
        || element.mozRequestFullScreen  //火狐
        || element.msRequestFullScreen; //IE11
    if (requestMethod) {
        requestMethod.call(element);   //执行这个请求的方法
    } else if (typeof window.ActiveXObject !== "undefined") {  //window.ActiveXObject判断是否支持ActiveX控件
        //这里其实就是模拟了按下键盘的F11，使浏览器全屏
        var wscript = new ActiveXObject("WScript.Shell"); //创建ActiveX
        if (wscript !== null) {    //创建成功
            wscript.SendKeys("{F11}");//触发f11
        }
    }
}
new Vue({
    el: ".class_detail_main",
    data: {
        resource: window.resource,
        resource_detail: {},
        resourceWeb: classapi.config.resourceWeb,
        loginuser: JSON.parse(zj.getcookie("loginuser"))
    },
    filters: {
        timeFilter(time) {
            if (time) {
                var date = new Date(time);
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                m = m < 10 ? ('0' + m) : m;
                var d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                var h = date.getHours();
                h = h < 10 ? ('0' + h) : h;
                var minute = date.getMinutes();
                var second = date.getSeconds();
                minute = minute < 10 ? ('0' + minute) : minute;
                second = second < 10 ? ('0' + second) : second;
                //y + '-' + m + '-' + d+' '+h+':'+minute+':'+second
                return y + '-' + m + '-' + d;
            } else {
                return "";
            }
        }
    },
    mounted() {
        this.loadData();
    },
    methods: {
        loadData: function () {
            var _this = this;
            var index = layer.load(0, {

                time: classapi.timeout
            });
            classapi.post.resourceApi_api_resourceDetail({
                resourcecode: this.resource.resourcecode
            }, function (result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    var obj = result.obj;
                    _this.resource_detail = obj;
                }
            });
        },
        collectClick: function () {
            var that = this;
            var index = layer.load(0, {

                time: classapi.timeout
            });
            if (this.resource_detail.count > 0) {
                classapi.post.resourceApi_api_cancelCollection({
                    resourceid: this.resource_detail.resourceid
                }, function (result) {
                    layer.close(index);
                    if (classapi.validata(result)) {
                        if (result.code == 0) {
                            layer.msg("取消收藏成功！");
                            that.resource_detail.count = 0;
                        }
                    }
                });
            } else {
                classapi.post.resourceApi_api_resourceCollection({
                    resourcecode: this.resource_detail.resourcecode
                }, function (result) {
                    layer.close(index);
                    if (classapi.validata(result)) {
                        if (result.code == 0) {
                            layer.msg("收藏成功！");
                            that.resource_detail.count = 1;
                        }
                    }
                });
            }

        },
        downloadfile: function () {
            var _this = this;
            var params = "token=" + _this.loginuser.token + "&ssouserid=" + _this.loginuser.ssouserid + "&device=webclient"
            location.href = classapi.config.resourceUrl + "resourceApi/api_downloadResource?resourcecode=" + _this.resource_detail.resourcecode + "&" + params;
            _this.resource_detail.downloadnum += 1;
        }
    }
})