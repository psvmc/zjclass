$(function() {
    var j_size = parseInt($("body").css("fontSize"));
    $(".prepare_lessons_class_detail_main").height($("#content").height() - j_size);
    $(".kejian_detail").height($(".prepare_lessons_class_detail_main").height() - 14 * j_size);
    //详情
    $(".class_detail_operation .class_detail_detail_ico").mouseover(function() {
        $(this).find(".class_detail_detail").stop().slideDown();
    })
    $(".class_detail_operation .class_detail_detail_ico").mouseleave(function() {
            $(this).find(".class_detail_detail").stop().slideUp();
        })
        //点击返回
    $(".class_detail_operation").delegate(".backtrack", "click", function() {
        ajaxRequest(historyarr[historyarr.length - 2], $('#content'));
    })
})

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
        loadData: function() {
            var _this = this;
            var index = layer.load(0, {

                time: classapi.timeout
            });
            classapi.post.resourceApi_api_resourceDetail({
                resourcecode: this.resource.resourcecode
            }, function(result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    var obj = result.obj;
                    _this.resource_detail = obj;
                }
            });
        },
        collectClick: function() {
            var that = this;
            var index = layer.load(0, {

                time: classapi.timeout
            });
            if (this.resource_detail.count > 0) {
                classapi.post.resourceApi_api_cancelCollection({
                    resourceid: this.resource_detail.resourceid
                }, function(result) {
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
                }, function(result) {
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
        delClick: function() {
            var that = this;
            layer.confirm('确定要删除该资源吗？', {
                skin: 'layui-layer-lan',
                btn: ['确定', '取消'] //按钮
            }, function() {

                var index = layer.load(0, {

                    time: classapi.timeout
                });
                classapi.post.resourceApi_api_deleteResource({
                    resourceid: this.resource_detail.resourceid
                }, function(result) {
                    layer.close(index);
                    if (classapi.validata(result)) {
                        if (result.code == 0) {
                            layer.msg("删除成功！");
                            that.loadData();
                        }
                    }
                });

            }, function() {

            });

        },
        downloadfile: function() {
            var token = zj.getcookie("xhkjedu");
            var _this = this;
            var params = "token=" + token + "&ssouserid=" + _this.loginuser.ssouserid + "&device=webclient"
            location.href = classapi.config.resourceUrl + "resourceApi/api_downloadResource?resourcecode=" + _this.resource_detail.resourcecode + "&" + params;
            _this.resource_detail.downloadnum += 1;
        }
    }
})