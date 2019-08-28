$(function () {
    //试题库下拉框
    $("body").delegate(".item_bank", "mouseenter", function () {
        $(this).find(".item_bank_option").stop().slideDown();
    })
    $("body").delegate(".item_bank", "mouseleave", function () {
        $(this).find(".item_bank_option").stop().slideUp();
    })
});
