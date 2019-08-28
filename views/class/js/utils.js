Vue.component('zj-page', {
    props: ["showpage", "currpage", "pages"],
    computed: {
        showPageArr: function () {
            var halfshow = parseInt(this.showpage / 2);
            var tempbegin = this.currpage - halfshow + 1;
            var tempend = this.currpage + halfshow;
            if (tempbegin < 1) {
                tempend = tempend - tempbegin + 1;
                tempbegin = 1;
                if (tempend > this.pages) {
                    tempend = this.pages;
                }
            } else if (tempend > this.pages) {
                tempbegin = this.pages - this.showpage + 1;
                tempend = this.pages;
                if (tempbegin < 1) {
                    tempbegin = 1;
                }
            }

            var arr = [];
            for (var i = tempbegin; i <= tempend; i++) {
                arr.push(i);
            }
            return arr;
        }
    },

    methods: {
        num_click: function (num) {
            this.$emit('gotopage', num, this.currpage);
        },
        last_click: function () {
            if (this.currpage > 1) {
                this.$emit('gotopage', this.currpage - 1, this.currpage);
            }
        },
        next_click: function () {
            if (this.currpage < this.pages) {
                this.$emit('gotopage', this.currpage + 1, this.currpage);
            }
        },
        begin_click: function () {
            this.$emit('gotopage', 1, this.currpage);
        },
        end_click: function () {
            this.$emit('gotopage', this.pages, this.currpage);
        }
    },
    template: `
    <div class="paging">
        <span class="first_page" v-bind:class="{ unclickable: currpage == 1 }" v-on:click="begin_click()">首页</span>
        <span class="prev_page" v-bind:class="{ unclickable: currpage == 1 }" v-on:click="last_click()">上一页</span>
        <span v-bind:class="{ pitch_on: item == currpage }" class="pagination" v-for="(item,index) in showPageArr" v-on:click="num_click(item)">{{ item }} </span>
        <span class="next_page" v-bind:class="{ unclickable: currpage == pages||pages == 0 }" v-on:click="next_click()">下一页</span>
        <span class="last_page" v-bind:class="{ unclickable: currpage == pages||pages == 0}" v-on:click="end_click()">末页</span>
    </div>
`
});


// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

var zj = zj || {};
zj.cache = {};
zj.cache_save = function (key, value) {
    if (localStorage) {
        localStorage[key] = JSON.stringify(value);
    } else {
        zj.cache[key] = value;
    }
};

zj.cache_get = function (key) {
    if (localStorage) {
        var value = localStorage[key];
        if (value) {
            return JSON.parse(value);
        } else {
            return null;
        }
    } else {
        return zj.cache[key];
    }
};

zj.cache_clear = function (key) {
    if (localStorage) {
        localStorage[key] = null;
    } else {
        zj.cache[key] = null;
    }
};