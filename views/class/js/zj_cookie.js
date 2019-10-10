var zj = zj || {};

zj.addcookie = function(key, value) {
    if (document.cookie || document.cookie == "") {
        zj.delcookie(key);
        if (classapi.domain) {
            $.cookie(key, value, { expires: 7, path: '/', domain: classapi.domain, secure: false });
        } else {
            $.cookie(key, value, { expires: 7, path: '/', secure: false });
        }
    } else {
        window.localStorage.setItem(key, value);
    }
};

zj.delcookie = function(key) {
    if (document.cookie || document.cookie == "") {
        if (classapi.domain) {
            $.cookie(key, null, { expires: -1, path: '/', domain: classapi.domain, secure: false });
        } else {
            $.cookie(key, null, { expires: -1, path: '/', secure: false });
        }
    } else {
        window.localStorage.removeItem(key)
    }
};

zj.getcookie = function(key) {
    if (document.cookie) {
        return $.cookie(key);
    } else {
        return window.localStorage.getItem(key);
    }
};