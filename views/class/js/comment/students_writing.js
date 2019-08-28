$(function () {
    $(".topic").height($(".students_writing_keguan").height() - $(".topic_bottom").outerHeight());
})
new Vue({
    el: ".students_writing_outer",
    data: {
        user: window.user,
        showImageUrl: classapi.config.showImageUrl
    },
    mounted() {
        this.loaddata();
    },
    computed: {
        right_or_wrong: function () {
            var corrected = this.user.corrected;
            if (corrected == 1) {
                return "正确";
            } else {
                return "错误";
            }
        }
    },
    methods: {
        loaddata: function () {

        },
        userans_html: function (useranser) {
            var answers = useranser.answers || [];
            var answerstext = useranser.answerstext || [];
            var criticizes = useranser.criticizes || [];
            var html_array = [];
            if (answers) {
                for (var i = 0; i < answers.length; i++) {
                    var _answers = answers[i] || [];
                    var _answerstext = answerstext[i] || [];
                    var _criticizes = criticizes[i] || [];

                    if (_answers) {
                        for (var j = 0; j < _answers.length; j++) {
                            var zanswers = _answers[j] || "";
                            var zanswerstext = _answerstext[j] || "";
                            var zcriticizes = _criticizes[j] || "";

                            if (zanswers == "") {
                                html_array.push(zanswerstext);
                            } else {
                                if (zcriticizes != "") {
                                    html_array.push("<img src='" + this.showImageUrl + zcriticizes + "' />");
                                } else {
                                    html_array.push("<img src='" + this.showImageUrl + zanswers + "' />");
                                }
                            }
                        }
                    }

                }
            }
            return html_array.join("");
        },
        close_pop: function () {
            $(".mask_layer").css("display", "none");
            $('.pop-up_box').css("display", "none");
            historyarr.pop();
        }
    }
});