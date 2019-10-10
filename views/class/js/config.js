var classapi = classapi || {};
classapi.timeout = 15 * 1000;
classapi.config = {
    "baseurl": "https://zujuanapitest.xhkjedu.com/",
    "baseImageUrl": " https://filetest.xhkjedu.com/",
    "showImageUrl": "  https://filetest.xhkjedu.com/static/",
    "resourceUrl": " https://zytest.xhkjedu.com/",
    "wordUploadUrl": "https://wordupload.xhkjedu.com/",
    "resourceWeb": "https://wordupload.xhkjedu.com/resource/",
    "wsurl": "wss://classwstest.xhkjedu.com/ws",
    "zujuan": "https://zujuantest.xhkjedu.com/",
    "exam_teching": "https://examtest.xhkjedu.com/",
    "teaching_resource": " https://zytest.xhkjedu.com/"
        // "baseurl": "https://zujuanapi.xhkjedu.com/",
        // "baseImageUrl": " https://file.xhkjedu.com/",
        // "showImageUrl": "  https://file.xhkjedu.com/static/",
        // "resourceUrl": " https://zy.xhkjedu.com/",
        // "wordUploadUrl": "https://wordupload.xhkjedu.com/",
        // "resourceWeb": "https://wordupload.xhkjedu.com/resource/",
        // "wsurl": "wss://classws.xhkjedu.com/ws",
        // "zujuan": "https://zujuan.xhkjedu.com/",
        // "exam_teching": "https://exam.xhkjedu.com/",
        // "teaching_resource": " https://zy.xhkjedu.com/"
};

classapi.domain = null;
classapi.cookiekeyname = "xhkjedu";

classapi.getAllUrl = function(url, id) {
    if (url) {
        var beginWithHttp = url.indexOf("http");
        if (beginWithHttp == 0) {
            return url;
        } else {
            return im.config.fileShowBaseurl + url;
        }
    } else {
        return "";
    }
};

classapi.validata = function(data) {
    if (data) {
        if (data.code == 0) {
            return true;
        } else if (data.code == 2) {
            layer.msg("用户已失效，请重新登录！", { time: 1000 }, function() {
                window.location.href = "login.html";
            });
        } else if (data.code == 1) {
            layer.closeAll();
            layer.msg(data.msg, { time: 1000 });
        } else {
            layer.closeAll();
            layer.msg(data.msg);
        }
    } else {
        layer.closeAll();
        window.alert("获取数据失败");
    }

}

classapi.url = {
    "userapi_login": classapi.config.baseurl + "userapi/login",
    "teacherclass_prepare_work_buzhilist": classapi.config.baseurl + "teacherclass/prepare_work_buzhilist",
    "teacherclass_prepare_work_buzhinum": classapi.config.baseurl + "teacherclass/prepare_work_buzhinum",
    "teacherclass_prepare_work_lately": classapi.config.baseurl + "teacherclass/prepare_work_lately",
    "paperapi_paperquestions": classapi.config.baseurl + "paperapi/paperquestions",
    "paperapi_quesitonuser": classapi.config.baseurl + "paperapi/quesitonuser",
    "homework_teacher_singletime": classapi.config.baseurl + "teacher_analyze/homework_teacher_singletime",
    "homework_teacher_singletypetext": classapi.config.baseurl + "teacher_analyze/homework_teacher_singletypetext",
    "homework_teacher_stageknowledge": classapi.config.baseurl + "teacher_analyze/homework_teacher_stageknowledge",
    "homework_teacher_stageerrorcause": classapi.config.baseurl + "teacher_analyze/homework_teacher_stageerrorcause",
    "teacherclass_paper_commented_commitstudent": classapi.config.baseurl + "teacherclass/paper_commented_commitstudent",
    "questionapi_quesitontypenum": classapi.config.baseurl + "questionapi/quesitontypenum",
    "teacherclass_paper_check_students": classapi.config.baseurl + "teacherclass/paper_check_students",
    "teacherclass_paper_check_testids": classapi.config.baseurl + "teacherclass/paper_check_testids",
    "teacherclass_paper_check_studentanswer": classapi.config.baseurl + "teacherclass/paper_check_studentanswer",
    "teacherclass_paper_check_checkquesiton": classapi.config.baseurl + "teacherclass/paper_check_checkquesiton",
    "paperapi_finishcheckquestion": classapi.config.baseurl + "paperapi/finishcheckquestion",
    "teacherclass_inclass_paper_work": classapi.config.baseurl + "teacherclass/inclass_paper_work",
    "teacherclass_inclass_paper_worknum": classapi.config.baseurl + "teacherclass/inclass_paper_worknum",
    "questionapi_questions": classapi.config.baseurl + "questionapi/questions",
    "teacherclass_quesitons_list_num": classapi.config.baseurl + "teacherclass/quesitons_list_num",
    "resourceApi_api_countCourseware": classapi.config.resourceUrl + "resourceApi/api_countCourseware",
    "resourceApi_api_listCourseware": classapi.config.resourceUrl + "resourceApi/api_listCourseware",
    "resourceApi_api_resourceDetail": classapi.config.resourceUrl + "resourceApi/api_resourceDetail",
    "resourceApi_api_resourceCollection": classapi.config.resourceUrl + "resourceApi/api_resourceCollection",
    "teacherclass_quesitons_basket_save": classapi.config.baseurl + "teacherclass/quesitons_basket_save",
    "teacherclass_quesitons_basket_savebatch": classapi.config.baseurl + "teacherclass/quesitons_basket_savebatch",
    "teacherclass_quesitons_basket_list": classapi.config.baseurl + "teacherclass/quesitons_basket_list",
    "teacherclass_prepare_ckzl_xueancount": classapi.config.baseurl + "teacherclass/prepare_ckzl_xueancount",
    "teacherclass_prepare_ckzl_xuean": classapi.config.baseurl + "teacherclass/prepare_ckzl_xuean",
    paperQuestion_saveCollectQuestion: classapi.config.baseurl + "paperQuestion/saveCollectQuestion",
    paperQuestion_deleteCollectQuestion: classapi.config.baseurl + "paperQuestion/deleteCollectQuestion",
    resourceApi_api_listCollectAndUploadCourseware: classapi.config.resourceUrl + "resourceApi/api_listCollectAndUploadCourseware",
    resourceApi_api_cancelCollection: classapi.config.resourceUrl + "resourceApi/api_cancelCollection",
    resourceApi_api_listMyUploadResource: classapi.config.resourceUrl + "resourceApi/api_listMyUploadResource",
    teacherclass_quesitons_basket_deletetype: classapi.config.baseurl + "teacherclass/quesitons_basket_deletetype",
    teacherclass_quesitons_list_questions: classapi.config.baseurl + "teacherclass/quesitons_list_questions",
    teacherclass_quesitons_basket_deletetest: classapi.config.baseurl + "teacherclass/quesitons_basket_deletetest",
    teacherclass_quesitons_paper_savejson: classapi.config.baseurl + "teacherclass/quesitons_paper_savejson",
    teacherclass_quesitons_paper_quesitons: classapi.config.baseurl + "teacherclass/quesitons_paper_quesitons",
    teacherclass_paper_collect: classapi.config.baseurl + "teacherclass/paper_collect",
    teacherclass_paper_canclecollect: classapi.config.baseurl + "teacherclass/paper_canclecollect",
    baseapi_gradeversiondirs: classapi.config.baseurl + "baseapi/gradeversiondirs",
    teacherclass_main_director_predirector: classapi.config.baseurl + "teacherclass/main_director_predirector",
    teacherclass_main_director_nextdirector: classapi.config.baseurl + "teacherclass/main_director_nextdirector",
    teacherclass_main_director_savedirector: classapi.config.baseurl + "teacherclass/main_director_savedirector",
    teacherclass_prepare_taojuan_lately: classapi.config.baseurl + "teacherclass/prepare_taojuan_lately",
    teacherclass_quesitons_paper_properties: classapi.config.baseurl + "teacherclass/quesitons_paper_properties",
    group_groupteacher: classapi.config.baseurl + "group/groupteacher",
    resourceApi_api_getCoursewareByDirector: classapi.config.resourceUrl + "resourceApi/api_getCoursewareByDirector",
    resourceApi_api_saveCourseware: classapi.config.resourceUrl + "resourceApi/api_saveCourseware",
    teacherclass_quesitons_paper_savezhineng: classapi.config.baseurl + "teacherclass/quesitons_paper_savezhineng",
    teacherclass_quesitons_paper_deletequesiton: classapi.config.baseurl + "teacherclass/quesitons_paper_deletequesiton",
    teacherclass_afterclass_paper_lately: classapi.config.baseurl + "teacherclass/afterclass_paper_lately",
    teacherclass_quesitons_paper_changequestion: classapi.config.baseurl + "teacherclass/quesitons_paper_changequestion",
    questionapi_changequesiton: classapi.config.baseurl + "questionapi/changequesiton",
    paperQuestion_paperAnalysisAjax: classapi.config.baseurl + "paperQuestion/paperAnalysisAjax",
    teacherclass_inclass_paper_list: classapi.config.baseurl + "teacherclass/inclass_paper_list",
    teacherclass_inclass_paper_group: classapi.config.baseurl + "teacherclass/inclass_paper_group",
    teacherclass_quesitons_paper_tostudent: classapi.config.baseurl + "teacherclass/quesitons_paper_tostudent",
    teacherclass_afterclass_paper_listnum: classapi.config.baseurl + "teacherclass/afterclass_paper_listnum",
    teacherclass_afterclass_paper_list: classapi.config.baseurl + "teacherclass/afterclass_paper_list",
    teacherclass_index_validate_user: classapi.config.baseurl + "teacherclass/index_validate_user",
    resourceApi_api_deleteResource: classapi.config.resourceUrl + "resourceApi/api_deleteResource",
    teacherclass_paper_question_errorcasenum: classapi.config.baseurl + "teacherclass/paper_question_errorcasenum",
    homework_teacher_singleerrorcause: classapi.config.baseurl + "teacher_analyze/homework_teacher_singleerrorcause",
    teacherclass_questions_taojuan_tosave: classapi.config.baseurl + "teacherclass/questions_taojuan_tosave",
    teacherclass_papers_xuean_detail: classapi.config.baseurl + "teacherclass/papers_xuean_detail",
    teacherclass_paper_question_studentaccuary: classapi.config.baseurl + "teacherclass/paper_question_studentaccuary",
    teacherclass_papers_taojuan_list: classapi.config.baseurl + "teacherclass/papers_taojuan_list",
    teacherclass_papers_taojuan_count: classapi.config.baseurl + "teacherclass/papers_taojuan_count",
    resourceApi_api_downloadResource: classapi.config.resourceUrl + "resourceApi/api_downloadResource",
    teacherclass_paper_commented_questionuser: classapi.config.baseurl + "teacherclass/paper_commented_questionuser",
    classroom_list_rooming: classapi.config.baseurl + "classroom/list_rooming",
    classroom_room_save: classapi.config.baseurl + "classroom/room_save",
    classroom_room_teacherhistory: classapi.config.baseurl + "classroom/room_teacherhistory",
    crresource_resource_list: classapi.config.baseurl + "crresource/resource_list",
    classroom_room_teacherhistorycount: classapi.config.baseurl + "classroom/room_teacherhistorycount",
    classroom_room_papers: classapi.config.baseurl + "classroom/room_papers",
    classroom_room_end: classapi.config.baseurl + "classroom/room_end",
    crresource_room_resourcesimg: classapi.config.baseurl + "crresource/room_resourcesimg",
    classroomuser_user_onlined: classapi.config.baseurl + "classroomuser/user_onlined",
    crresource_room_updateresource: classapi.config.baseurl + "crresource/room_updateresource",
    classroomuser_user_onlineds: classapi.config.baseurl + "classroomuser/user_onlineds",
    classroomuser_user_unonlineds: classapi.config.baseurl + "classroomuser/user_unonlineds",
    cranswer_student_listanswer: classapi.config.baseurl + "cranswer/student_listanswer",
    cranswer_teacher_saveask: classapi.config.baseurl + "cranswer/teacher_saveask",
    classroom_room_groups: classapi.config.baseurl + "classroom/room_groups",
    classroom_room_publicjob: classapi.config.baseurl + "classroom/room_publicjob",
    cranswer_teacher_endask: classapi.config.baseurl + "cranswer/teacher_endask",
    paperapi_paperallquestion: classapi.config.baseurl + "paperapi/paperallquestion",
    crresource_resource_listunderstand: classapi.config.baseurl + "crresource/resource_listunderstand",
    crpaper_question_students_xuanze: classapi.config.baseurl + "crpaper/question_students_xuanze",
    crpaper_question_students_zhuguan: classapi.config.baseurl + "crpaper/question_students_zhuguan",
    crresource_resource_understand_num: classapi.config.baseurl + "crresource/resource_understand_num",
    crpaper_paper_students: classapi.config.baseurl + "crpaper/paper_students",
    crpaper_papers_student: classapi.config.baseurl + " crpaper/papers_student",
    cranswer_answer_answering: classapi.config.baseurl + "cranswer/answer_answering",
    cranswer_answer_saveteacherstudent: classapi.config.baseurl + "cranswer/answer_saveteacherstudent",
    crresource_teacher_understand_student: classapi.config.baseurl + "crresource/teacher_understand_student",
    cranswer_teacher_single_studentsactive: classapi.config.baseurl + "cranswer/teacher_single_studentsactive",
    cranswer_teacher_stage_studentsactive: classapi.config.baseurl + "cranswer/teacher_stage_studentsactive",
    crpaper_papers_teacher: classapi.config.baseurl + "crpaper/papers_teacher",
    crresource_studen_understand_single: classapi.config.baseurl + "crresource/studen_understand_single",
    teacherclass_paper_delete: classapi.config.baseurl + "teacherclass/paper_delete",
    classroomuser_user_all_onlineds: classapi.config.baseurl + "classroomuser/user_all_onlineds"
};

classapi.post = {};

function setTokenParas(pars) {
    var device = zj.getcookie("device", classapi.domain);
    var token = zj.getcookie(classapi.cookiekeyname, classapi.domain);
    if (token && device) {
        var _device = device.split("_")[2];
        if (_device) {
            pars["token"] = token;
            pars["ssouserid"] = _device;
        }
    }
    pars["device"] = "webclient";
}

//获取已布置作业列表
classapi.post.userapi_login = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.userapi_login, pars, callback, "json");
};

//获取已布置作业列表
classapi.post.teacherclass_prepare_work_lately = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_prepare_work_lately, pars, callback, "json");
};

//获取已布置作业列表
classapi.post.teacherclass_prepare_work_buzhilist = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_prepare_work_buzhilist, pars, callback, "json");
};
//获取已布置作业列表总页数
classapi.post.teacherclass_prepare_work_buzhinum = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_prepare_work_buzhinum, pars, callback, "json");
};


//3.61 作业下试题以及单题正确率
classapi.post.paperapi_paperquestions = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.paperapi_paperquestions, pars, callback, "json");
};

//3.62 班级学生对单个试题作答情况（做错学生列表）
classapi.post.paperapi_quesitonuser = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.paperapi_quesitonuser, pars, callback, "json");
};
//7.20 单次作业统计--题目完成用时
classapi.post.homework_teacher_singletime = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.homework_teacher_singletime, pars, callback, "json");
}

//7.18 单次作业统计--题型正确率
classapi.post.homework_teacher_singletypetext = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.homework_teacher_singletypetext, pars, callback, "json");
}

//7.22阶段作业知识点分析
classapi.post.homework_teacher_stageknowledge = function(pars, callback) {
        setTokenParas(pars);
        $.post(classapi.url.homework_teacher_stageknowledge, pars, callback, "json");
    }
    //7.21阶段作业错误原因分析
classapi.post.homework_teacher_stageerrorcause = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.homework_teacher_stageerrorcause, pars, callback, "json");
}

//4.12 教师任教班级
classapi.post.group_groupteacher = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.group_groupteacher, pars, callback, "json");
}

//14.9 讲评报告--已提交学生单个题作答情况
classapi.post.teacherclass_paper_commented_commitstudent = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_paper_commented_commitstudent, pars, callback, "json");
};

//3.60 根据条件获取题型下试题数量
classapi.post.questionapi_quesitontypenum = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.questionapi_quesitontypenum, pars, callback, "json");
};

//14.4 批改作业--获取作业学生
classapi.post.teacherclass_paper_check_students = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_paper_check_students, pars, callback, "json");
};

//14.5 批改作业--试题题号
classapi.post.teacherclass_paper_check_testids = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_paper_check_testids, pars, callback, "json");
};

//14.6 批改作业--指定学生单次作业作答内容
classapi.post.teacherclass_paper_check_studentanswer = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_paper_check_studentanswer, pars, callback, "json");
};
//3.24批改作业--批改单个学生作业
classapi.post.teacherclass_paper_check_checkquesiton = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_paper_check_checkquesiton, pars, callback, "json");
};

//3.25批改作业--完成单个学生批改作业
classapi.post.paperapi_finishcheckquestion = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.paperapi_finishcheckquestion, pars, callback, "json");
};

//14.29授课-学情展示-已布置作业列表
classapi.post.teacherclass_inclass_paper_work = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_inclass_paper_work, pars, callback, "json");
};

//14.28 授课-学情展示-已布置作业页数
classapi.post.teacherclass_inclass_paper_worknum = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_inclass_paper_worknum, pars, callback, "json");
};

//3.58 获取题目列表
classapi.post.questionapi_questions = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.questionapi_questions, pars, callback, "json");
};

//14.27 试题库--符合条件的试题页数
classapi.post.teacherclass_quesitons_list_num = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_quesitons_list_num, pars, callback, "json");
};

//备课--查看资源--課件页数
classapi.post.resourceApi_api_countCourseware = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.resourceApi_api_countCourseware, pars, callback, "json");
};

//备课--查看资源--课件列表
classapi.post.resourceApi_api_listCourseware = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.resourceApi_api_listCourseware, pars, callback, "json");
};

//备课--查看资源--课件详情
classapi.post.resourceApi_api_resourceDetail = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.resourceApi_api_resourceDetail, pars, callback, "json");
};
//备课--查看资源--收藏课件
classapi.post.resourceApi_api_resourceCollection = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.resourceApi_api_resourceCollection, pars, callback, "json");
};
//备课--查看资源--学案列表
classapi.post.teacherclass_prepare_ckzl_xuean = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_prepare_ckzl_xuean, pars, callback, "json");
};

//备课--查看资源--学案页数
classapi.post.teacherclass_prepare_ckzl_xueancount = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_prepare_ckzl_xueancount, pars, callback, "json");
};

//14.11 试题库--添加试题到试题栏
classapi.post.teacherclass_quesitons_basket_save = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_quesitons_basket_save, pars, callback, "json");
};

//14.12 试题库--批量添加试题到试题栏
classapi.post.teacherclass_quesitons_basket_savebatch = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_quesitons_basket_savebatch, pars, callback, "json");
};

//14.10 试题库--试题栏
classapi.post.teacherclass_quesitons_basket_list = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_quesitons_basket_list, pars, callback, "json");
};

//3.35 收藏试题
classapi.post.paperQuestion_saveCollectQuestion = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.paperQuestion_saveCollectQuestion, pars, callback, "json");
};

//3.36 取消收藏试题
classapi.post.paperQuestion_deleteCollectQuestion = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.paperQuestion_deleteCollectQuestion, pars, callback, "json");
};


//2.6已收藏、已上传课件列表
classapi.post.resourceApi_api_listCollectAndUploadCourseware = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.resourceApi_api_listCollectAndUploadCourseware, pars, callback, "json");
};

//2.12取消收藏
classapi.post.resourceApi_api_cancelCollection = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.resourceApi_api_cancelCollection, pars, callback, "json");
};


//2.13根据章节获取我的已上传的资源列表
classapi.post.resourceApi_api_listMyUploadResource = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.resourceApi_api_listMyUploadResource, pars, callback, "json");
};

//14.13 试题库-删除试题栏题型
classapi.post.teacherclass_quesitons_basket_deletetype = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_quesitons_basket_deletetype, pars, callback, "json");
};

//14.35 试题库--获取符合条件的试题信息
classapi.post.teacherclass_quesitons_list_questions = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_quesitons_list_questions, pars, callback, "json");
};


//14.37 试题库--试题栏删除单个试题
classapi.post.teacherclass_quesitons_basket_deletetest = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_quesitons_basket_deletetest, pars, callback, "json");
};


//14.30 试题库--保存试题（手动组题）
classapi.post.teacherclass_quesitons_paper_savejson = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_quesitons_paper_savejson, pars, callback, "json");
};

//14.39 试题库--根据试卷id作业中试题
classapi.post.teacherclass_quesitons_paper_quesitons = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_quesitons_paper_quesitons, pars, callback, "json");
};

//14.41 试卷--收藏试卷
classapi.post.teacherclass_paper_collect = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_paper_collect, pars, callback, "json");
};

//14.42 试卷--取消收藏试卷
classapi.post.teacherclass_paper_canclecollect = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_paper_canclecollect, pars, callback, "json");
};
//3.4 主界面--章节集合
classapi.post.baseapi_gradeversiondirs = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.baseapi_gradeversiondirs, pars, callback, "json");
};
//14.22 主界面--获取当前章节的上一章节
classapi.post.teacherclass_main_director_predirector = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_main_director_predirector, pars, callback, "json");
};
//14.23 主界面--获取当前章节的下一章节
classapi.post.teacherclass_main_director_nextdirector = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_main_director_nextdirector, pars, callback, "json");
};

//14.43主界面--保存章节
classapi.post.teacherclass_main_director_savedirector = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_main_director_savedirector, pars, callback, "json");
};

//14.3 备课--章节下最新一套套卷
classapi.post.teacherclass_prepare_taojuan_lately = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_prepare_taojuan_lately, pars, callback, "json");
}

//14.31 试题库--设置作业属性
classapi.post.teacherclass_quesitons_paper_properties = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_quesitons_paper_properties, pars, callback, "json");
};


//4.12 获取用户任教班级
classapi.post.group_groupteacher = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.group_groupteacher, pars, callback, "json");
};

//主界面--推送的单个课件
classapi.post.resourceApi_api_getCoursewareByDirector = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.resourceApi_api_getCoursewareByDirector, pars, callback, "json");
};

//保存上传课件
classapi.post.resourceApi_api_saveCourseware = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.resourceApi_api_saveCourseware, pars, callback, "json");
};

//14.33 试题库--智能组题
classapi.post.teacherclass_quesitons_paper_savezhineng = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_quesitons_paper_savezhineng, pars, callback, "json");
};


//14.40 试题库--删除试卷中试题
classapi.post.teacherclass_quesitons_paper_deletequesiton = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_quesitons_paper_deletequesiton, pars, callback, "json");
};

//14.24课后作业--最近几条   afterclass_paper_lately
classapi.post.teacherclass_afterclass_paper_lately = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_afterclass_paper_lately, pars, callback, "json");
};

classapi.post.teacherclass_afterclass_paper_listnum = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_afterclass_paper_listnum, pars, callback, "json");
};

classapi.post.teacherclass_afterclass_paper_list = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_afterclass_paper_list, pars, callback, "json");
};


//14.34 试题库--智能组题换题界面
classapi.post.teacherclass_quesitons_paper_changequestion = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_quesitons_paper_changequestion, pars, callback, "json");
};


//3.53 确认换题
classapi.post.questionapi_changequesiton = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.questionapi_changequesiton, pars, callback, "json");
};

//14.试卷分析
classapi.post.paperQuestion_paperAnalysisAjax = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.paperQuestion_paperAnalysisAjax, pars, callback, "json");
};
//14.15 授课--当堂训练作业列表
classapi.post.teacherclass_inclass_paper_list = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_inclass_paper_list, pars, callback, "json");
};


//14.16 授课--当前作业布置给班级
classapi.post.teacherclass_inclass_paper_group = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_inclass_paper_group, pars, callback, "json");
};


//14.32 试题库--布置作业（设置完属性后）
classapi.post.teacherclass_quesitons_paper_tostudent = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_quesitons_paper_tostudent, pars, callback, "json");
};

//14.45 index界面验证
classapi.post.teacherclass_index_validate_user = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_index_validate_user, pars, callback, "json");
};

//2.16根据资源ID删除资源
classapi.post.resourceApi_api_deleteResource = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.resourceApi_api_deleteResource, pars, callback, "json");
};

//14.47讲评报告中--学生参加单题错误原因统计的数量
classapi.post.teacherclass_paper_question_errorcasenum = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_paper_question_errorcasenum, pars, callback, "json");
};
//7.19教师单次-题目错误原因分析
classapi.post.homework_teacher_singleerrorcause = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.homework_teacher_singleerrorcause, pars, callback, "json");
};

//14.46 套卷--保存套卷信息
classapi.post.teacherclass_questions_taojuan_tosave = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_questions_taojuan_tosave, pars, callback, "json");
};

//14.51学案--详细信息
classapi.post.teacherclass_papers_xuean_detail = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_papers_xuean_detail, pars, callback, "json");
};


//14.48 作业-讲评报告-单题以及单题正确率
classapi.post.teacherclass_paper_question_studentaccuary = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_paper_question_studentaccuary, pars, callback, "json");
};

// 14.50 资料库--套卷列表
classapi.post.teacherclass_papers_taojuan_list = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_papers_taojuan_list, pars, callback, "json");
};


// 14.49 资料库--套卷分页页数
classapi.post.teacherclass_papers_taojuan_count = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_papers_taojuan_count, pars, callback, "json");
};
//下載课件
classapi.post.resourceApi_api_downloadResource = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.resourceApi_api_downloadResource, pars, callback, "json");
};
//14.52 作业讲评--单题班级作答情况  替換paperapi_quesitonuser
classapi.post.teacherclass_paper_commented_questionuser = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_paper_commented_questionuser, pars, callback, "json");
};
//14.55 当堂训练--删除未布置作业
classapi.post.teacherclass_paper_delete = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.teacherclass_paper_delete, pars, callback, "json");
};
//3.19 获取试卷下的全部试题（仅有试题）
classapi.post.paperapi_paperallquestion = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.paperapi_paperallquestion, pars, callback, "json");
};
//15.1 上下线--用户上下线信息
classapi.post.classroomuser_user_onlined = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.classroomuser_user_onlined, pars, callback, "json");
};
//15.2进入互动课堂--获取指定教师、资源正在进行中的互动课堂信息
classapi.post.classroom_list_rooming = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.classroom_list_rooming, pars, callback, "json");
};
//15.3 开始互动课堂
classapi.post.classroom_room_save = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.classroom_room_save, pars, callback, "json");
};
//15.4 结束互动课堂
classapi.post.classroom_room_end = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.classroom_room_end, pars, callback, "json");
};
//15.7 互动课堂在线学生名单
classapi.post.classroomuser_user_onlineds = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.classroomuser_user_onlineds, pars, callback, "json");
};
//15.7 互动课堂在线学生名单
classapi.post.classroomuser_user_onlineds = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.classroomuser_user_onlineds, pars, callback, "json");
};
//15.8 互动课堂离线学生名单
classapi.post.classroomuser_user_unonlineds = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.classroomuser_user_unonlineds, pars, callback, "json");
};
//15.9 保存互动课堂翻页信息
classapi.post.crresource_room_updateresource = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.crresource_room_updateresource, pars, callback, "json");
};
//15.11 获取互动课堂中学生对资源图片理解情况
classapi.post.crresource_resource_listunderstand = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.crresource_resource_listunderstand, pars, callback, "json");
};
//15.12 获取教师选好的课堂作业信息
classapi.post.classroom_room_papers = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.classroom_room_papers, pars, callback, "json");
};
//15.13获取课堂关联的资源信息以及正在进行讲解的资源图片 15.5和15.6
classapi.post.crresource_room_resourcesimg = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.crresource_room_resourcesimg, pars, callback, "json");
};
//15.14 布置作业
classapi.post.classroom_room_publicjob = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.classroom_room_publicjob, pars, callback, "json");
};
//15.15 教师发起提问
classapi.post.cranswer_teacher_saveask = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.cranswer_teacher_saveask, pars, callback, "json");
};
//15.17 获取学生抢答排名
classapi.post.cranswer_student_listanswer = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.cranswer_student_listanswer, pars, callback, "json");
};
//15.18 教师结束发起的抢答
classapi.post.cranswer_teacher_endask = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.cranswer_teacher_endask, pars, callback, "json");
};
//15.19 教师互动课堂历史数量信息
classapi.post.classroom_room_teacherhistorycount = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.classroom_room_teacherhistorycount, pars, callback, "json");
};
//15.21 学生互动课堂历史信息
classapi.post.classroom_room_teacherhistory = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.classroom_room_teacherhistory, pars, callback, "json");
};
//15.22 获取资源中所有图片
classapi.post.crresource_resource_list = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.crresource_resource_list, pars, callback, "json");
};
//15.23 教师任教班级以及课堂状态
classapi.post.classroom_room_groups = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.classroom_room_groups, pars, callback, "json");
};
//15.25 单个试题所有学生作业统计--选择题
classapi.post.crpaper_question_students_xuanze = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.crpaper_question_students_xuanze, pars, callback, "json");
};
//15.26 单个试题所有学生作业统计--主观题
classapi.post.crpaper_question_students_zhuguan = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.crpaper_question_students_zhuguan, pars, callback, "json");
};
//15.27 获取学生对资源图片理解情况统计图
classapi.post.crresource_resource_understand_num = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.crresource_resource_understand_num, pars, callback, "json");
};
//15.28 获取班级学生做题提交情况
classapi.post.crpaper_paper_students = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.crpaper_paper_students, pars, callback, "json");
};
//15.29 获取结束的互动课堂关联的作业信息
classapi.post.crpaper_papers_teacher = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.crpaper_papers_teacher, pars, callback, "json");
};
//15.30 获取课堂布置给学生的作业信息
classapi.post.crpaper_papers_student = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.crpaper_papers_student, pars, callback, "json");
};
//15.31 获取课堂最近一次正在进行的抢答
classapi.post.cranswer_answer_answering = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.cranswer_answer_answering, pars, callback, "json");
};
//15.32 保存教师点名学生回答问题
classapi.post.cranswer_answer_saveteacherstudent = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.cranswer_answer_saveteacherstudent, pars, callback, "json");
};
//15.33 教师单次课堂统计-获取学生标识理解、不理解资源图片
classapi.post.crresource_teacher_understand_student = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.crresource_teacher_understand_student, pars, callback, "json");
};
//15.34 教师单次课堂统计--学生活跃度排名
classapi.post.cranswer_teacher_single_studentsactive = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.cranswer_teacher_single_studentsactive, pars, callback, "json");
};
//15.35 教师阶段课堂统计--学生活跃度统计
classapi.post.cranswer_teacher_stage_studentsactive = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.cranswer_teacher_single_studentsactive, pars, callback, "json");
};
//15.36 学生单次课堂统计-资源图片-获取单个学生互动课堂标记理解、不理解资源信息
classapi.post.crresource_studen_understand_single = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.crresource_studen_understand_single, pars, callback, "json");
};
//15.39 互动课堂班级所有学生并标识在线学生
classapi.post.classroomuser_user_all_onlineds = function(pars, callback) {
    setTokenParas(pars);
    $.post(classapi.url.classroomuser_user_all_onlineds, pars, callback, "json");
};