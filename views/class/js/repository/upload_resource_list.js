$(function() {
    var j_size = parseInt($("body").css("fontSize"));
    $(".prepare_lessons_resource_main").height($("#content").height() - j_size);
    $(".resource_list").height($(".prepare_lessons_resource_main").height() - 14 * j_size)
        //经过效果
    $("body").delegate(".courseware_list .courseware_li", "mouseenter", function() {
        $(this).find(".courseware_li_main").css("border-bottom", "1px dashed rgba(255,255,255,0)");
        if ($(this).prev().length == 1) {
            $(this).prev().find(".courseware_li_main").css("border-bottom", "1px dashed rgba(255,255,255,0)");
        }
    })
    $("body").delegate(".courseware_list .courseware_li", "mouseleave", function() {
        $(this).find(".courseware_li_main").css("border-bottom", "1px dashed #cacaca");
        if ($(this).prev().length == 1) {
            $(this).prev().find(".courseware_li_main").css("border-bottom", "1px dashed #cacaca");
        }
    })
})

new Vue({
    el: ".prepare_lessons_resource_main",
    data: {
        res_list: [],
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
            classapi.post.resourceApi_api_listMyUploadResource({
                directorid: _this.loginuser.directorid,
                subjectid: _this.loginuser.subjectid
            }, function(result) {
                layer.close(index);
                if (classapi.validata(result)) {
                    var obj = result.obj;
                    _this.res_list = [];
                    for (var i = 0; i < obj.length; i++) {
                        var itemData = obj[i];
                        _this.res_list.push(itemData);
                    }
                }
            });
        },
        detialClick: function(resource) {
            if (this.is_show_resource(resource.resourceclass)) {
                window.resource = resource;
                ajaxRequest("./pages/prepare_lessons/myresourse_detail.html", $('#content'));
            }
        },
        get_resource_ico: function(suffix) {
            suffix = suffix.toLowerCase();
            var suffix_ico = {
                doc: "ico_word.png",
                docx: "ico_word.png",
                ppt: "ico_ppt.png",
                pptx: "ico_ppt.png",
                xls: "ico_excel.png",
                xlsx: "ico_excel.png",
                pdf: "ico_pdf.png",
                zip: "ico_zip.png",
                rar: "ico_zip.png",
                class: "ico_class.png"
            };

            var ico = suffix_ico[suffix];
            if (!ico) {
                ico = "ico_other.png";
            }
            return ico;
        },
        is_show_resource: function(suffix) {
            suffix = suffix.toLowerCase();
            var suff_arr = ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "pdf"];
            if (suff_arr.indexOf(suffix) != -1) {
                return true;
            }
            return false;
        },
        downloadfile: function(res) {
            var token = zj.getcookie("xhkjedu");
            var _this = this;
            var params = "token=" + token + "&ssouserid=" + _this.loginuser.ssouserid + "&device=webclient"
            location.href = classapi.config.resourceUrl + "resourceApi/api_downloadResource?resourcecode=" + res.resourcecode + "&" + params;
            res.downloadnum += 1;
        },
        delClick: function(res) {
            var that = this;
            layer.confirm('确定要删除该资源吗？', {
                skin: 'layui-layer-lan',
                btn: ['确定', '取消'] //按钮
            }, function() {
                var index = layer.load(0, {
                    time: classapi.timeout
                });
                classapi.post.resourceApi_api_deleteResource({
                    resourceid: res.resourceid
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
    }
});