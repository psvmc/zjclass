$(function () {
    $(".topic").height($(".students_writing_keguan").height() - $(".topic_bottom").outerHeight());
    $(".students_writing_outer>img").click(function () {
        $(".mask_layer").css("display", "none");
        $('.pop-up_box').css("display", "none");
        historyarr.pop();
    })
});

new Vue({
    el: ".students_writing_outer",
    data: {
        user: window.user,
        ques: window.ques
    },
    computed: {
        select_dochtml: function () {
            var docHtml = "";
            var selectques = this.ques;
            if (selectques.docHtml && selectques.docHtml.docHtml) {
                docHtml = selectques.docHtml.docHtml;
                var ctype = selectques.ctype;
                if (ctype == 1 || ctype == 2) {
                    if (selectques.docHtml.selections) {
                        var questionnum = ["A.", "B.", "C.", "D."];
                        var selections = selectques.docHtml.selections;
                        for (var i = 0; i < selections.length; i++) {
                            //docHtml = docHtml + selections[i];
                            if (selections[0].indexOf("A.") == -1) {
                                selections[i] = "<p>" + questionnum[i] + selections[i] + "</p>";
                                docHtml = docHtml + selections[i];
                            } else {
                                docHtml = docHtml + selections[i]
                            }
                        }
                    }
                }
                return docHtml;
            }
        },
        right_or_wrong: function () {
            var corrected = this.user.corrected;
            if (corrected == 1) {
                return "正确";
            } else {
                return "错误";
            }
        }
    }
});
