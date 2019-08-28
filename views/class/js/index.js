(function ($) {
    //教学资源
    $(".teaching_ziyuan").click(function () {
        window.open(classapi.config.teaching_resource);
    })
    //智能组卷
    $(".wisdom_zujuan").click(function () {
        window.open(classapi.config.zujuan);
    })
    //智慧课堂
    $(".wisdom_teaching").click(function () {
        window.open("./guidance.html");
    })
    //考试测评
    $(".kaoshi_ceping").click(function () {
        window.open(classapi.config.exam_teching);
    })
    //个人中心
    $(".personal_center").click(function () {
        window.open("./personal_center.html");
    })
    $(".tools_main").mouseover(function () {
        $(this).find(".tools_list").stop().slideDown();
    })
    $(".tools_main").mouseleave(function () {
        $(this).find(".tools_list").stop().slideUp();
    })
    $.fn.extend({
        RollTitle: function (opt, callback) {
            if (!opt) var opt = {};
            var _this = this;
            _this.timer = null;
            _this.lineH = _this.find("li:first").height();
            _this.line = opt.line ? parseInt(opt.line, 15) : parseInt(_this.height() / _this.lineH, 10);
            _this.speed = opt.speed ? parseInt(opt.speed, 10) : 3000, //卷动速度，数值越大，速度越慢（毫秒
                _this.timespan = opt.timespan ? parseInt(opt.timespan, 13) : 5000; //滚动的时间间隔（毫秒
            if (_this.line == 0) this.line = 1;
            _this.upHeight = 0 - _this.line * _this.lineH;
            _this.scrollUp = function () {
                _this.animate({
                    marginTop: _this.upHeight
                }, _this.speed, function () {
                    for (i = 1; i <= _this.line; i++) {
                        _this.find("li:first").appendTo(_this);
                    }
                    _this.css({
                        marginTop: 0
                    });
                });
            }
            _this.hover(function () {
                clearInterval(_this.timer);
            }, function () {
                _this.timer = setInterval(function () {
                    _this.scrollUp();
                }, _this.timespan);
            }).mouseout();
        }
    })
    $("#RunTopic").RollTitle({
        line: 1,
        speed: 200,
        timespan: 1500
    });


    validateuser();

})(jQuery);


function downstudy() {
    var furl = "app/file/20181207/badaf27c8dd348c7aaf4058115b61a08.apk";
    var fname = "星火Study"
    location.href = classapi.config.baseImageUrl+"upload/downloadFile?fileUrl=" + furl + "&fileName=" + fname;
}

function validateuser() {
    var loginuser=JSON.parse(localStorage.getItem("loginuser"));
    classapi.post.teacherclass_index_validate_user({
        ssouserid:loginuser.ssouserid,
        token:loginuser.token
    }, function (result) {
        console.log(result);
        if (classapi.validata(result)) {
            zj.addcookie("loginuser", JSON.stringify(result.obj));
        } else {
            location.href = "./login.html";
        }
    });
} 


