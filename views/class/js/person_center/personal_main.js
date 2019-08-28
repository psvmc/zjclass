$(function () {
    //关闭个人中心
    $(".personal_head>img").click(function () {
        $(".mask_layer").css("display", "none");
        $(".pop-up_box").css("display", "none");
    })
    //默认显示个人信息
    ajaxRequest("./pages/person_center/personal_information.html", $(".personal_main"));
    //切换页面
    $(".personal_head span").click(function () {
        ajaxRequest($(this).attr("moduleurl"), $(".personal_main"));
    })
})