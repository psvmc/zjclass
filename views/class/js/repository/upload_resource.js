$(function () {
    var j_size = parseInt($("body").css("fontSize"));
    $(".upload_resource").height($("#content").height() - j_size);
    $(".upload_resource_main").height($(".upload_resource").height() - 3.5 * j_size);
    //选择资源类型
    /*$(".select_resourcetype").delegate("h3", "click", function (e) {
        if (e && e.stopPropagation) {
            e.stopPropagation(); //因此它支持W3C的stopPropagation()方法
        } else {
            window.event.cancelBubble = true; //否则，我们需要使用IE的方式来取消事件冒泡
        }
        $(this).siblings().slideDown();
    })*/
    /*$(".select_resourcetype").delegate("li", "click", function (e) {
        if (e && e.stopPropagation) {
            e.stopPropagation(); //因此它支持W3C的stopPropagation()方法
        } else {
            window.event.cancelBubble = true; //否则，我们需要使用IE的方式来取消事件冒泡
        }
        $(this).parent().slideUp();
        $(".select_resourcetype h3").html($(this).text() + "<img src=\"img/repository/drop_dowm.png\"/>");
    })*/
    /*$("body").click(function () {
        $(".select_resourcetype ul").slideUp();
    })*/

    $("#fileUpload").change(function () {
        if ($("#fileUpload").val() !== "" && $("#fileUpload").val() !== null) {
            $(".upload_resource_main button").addClass("upload_right");
        }
        $("#textfield").text($("#fileUpload").val());
    });

})


function uploadfile() {
    var uploadurl = classapi.config.wordUploadUrl;
    var loginuser = JSON.parse(zj.getcookie("loginuser"));

    var fileUpload = $("input[name='fileUpload']").get(0).files;
    var fsize = fileUpload[0].size;
    var fname = fileUpload[0].name;
    var point = fname.lastIndexOf(".");
    var ftype = fname.substr(point + 1); //上传的文件类型
    if (fsize > 20 * 1024 * 1024) {
        layer.msg('资源大小超过20M');
    } else if (!isInArray3(ftype)) {
        layer.msg('资源格式不正确');
    } else {
        var formDates = new FormData();
        formDates.append("files", fileUpload[0]); //文件
        formDates.append("fileSource", "resource");
        formDates.append("domain", uploadurl); //资源上传请求地址
        layer.load(0, {
            time: classapi.timeout
        });
        $.ajax({
            url: uploadurl + "upload/uploadFiles.do", // 规定把请求发送到那个URL
            secureuri: false,
            fileElementId: "files",
            type: "post",
            dataType: "json",
            data: formDates,
            cache: false,
            contentType: false, //不可缺
            processData: false,
            success: function (data) {
                if (data.code == 0) {
                    var rfiles = data.obj;
                    saveresource(fileUpload[0].name, loginuser.directorid, rfiles[0].fileUrl, rfiles[0].filesize);
                } else {
                    layer.closeAll();
                    layer.msg('上传失败');
                }
            },
            error: function () {
                layer.closeAll();
                layer.msg('上传失败!');
            }
        });
    }

}

//保存资源信息
function saveresource(resourcename, directorid, resourceurl, resourcesize) {
    var _this = this;
    var loginuser=JSON.parse(zj.getcookie("loginuser"))
    classapi.post.resourceApi_api_saveCourseware({
        token:loginuser.token,
        versionid:loginuser.versionid,
        ssouserid:loginuser.ssouserid,
        device:"webclient",
        resourcename: resourcename,
        directorid: directorid,
        resourceurl: resourceurl,
        resourcesize: resourcesize
    }, function (result) {
        layer.closeAll();
        if (classapi.validata(result)) {
            var obj = result.obj;
            if (result.code == 0) {
                layer.msg('上传成功');
                ajaxRequest("./pages/repository/upload_resource_list.html", $('#content'));
            } else {
                layer.msg('上传失败');
            }
        }
    });
}

function isInArray3(value) {
    var arr = ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'pdf', 'zip', 'rar', 'class'];
    if (arr.indexOf && typeof(arr.indexOf) == 'function') {
        var index = arr.indexOf(value);
        if (index >= 0) {
            return true;
        }
    }
    return false;
}