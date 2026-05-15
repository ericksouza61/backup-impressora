var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var flag_restart = 0;
var flag_login = 0;  //判断是否提示提交成功的宏
function EncodeBase64(s) {
    var r = ""; var p = "";
    var i;
    var base64chars = _keyStr.split("");
    var base64inv = {};
    var c = s.length % 3;
    for (var i = 0; i < base64chars.length; i++) { base64inv[base64chars[i]] = i; }
    if (c > 0) { for (; c < 3; c++) { p += '='; s += "\0"; } }
    for (c = 0; c < s.length; c += 3) {
        var n = (s.charCodeAt(c) << 16) + (s.charCodeAt(c + 1) << 8) + s.charCodeAt(c + 2);
        n = [(n >>> 18) & 63, (n >>> 12) & 63, (n >>> 6) & 63, n & 63];
        r += base64chars[n[0]] + base64chars[n[1]] + base64chars[n[2]] + base64chars[n[3]];
    }
    return r.substring(0, r.length - p.length) + p;
}
function utf16to8(str) {
    var out, i, len, c;

    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    return out;
}
//private method for UTF-8 decoding
function utf8to16(utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;
    while (i < utftext.length) {
        c = utftext.charCodeAt(i);
        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        } else if ((c > 191) && (c < 224)) {
            c1 = utftext.charCodeAt(i + 1);
            string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
            i += 2;
        } else {
            c1 = utftext.charCodeAt(i + 1);
            c2 = utftext.charCodeAt(i + 2);
            string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
            i += 3;
        }
    }
    return string;
}
// public method for decoding
function DecodeBase64(input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
        enc1 = _keyStr.indexOf(input.charAt(i++));
        enc2 = _keyStr.indexOf(input.charAt(i++));
        enc3 = _keyStr.indexOf(input.charAt(i++));
        enc4 = _keyStr.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        output = output + String.fromCharCode(chr1);
        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }
    }
    output = utf8to16(output);
    return output;
}

function Base64() {

    // private property
    //_keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // public method for encoding
    this.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }

    // public method for decoding
    this.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    }

    // private method for UTF-8 encoding
    _utf8_encode = function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    }

    // private method for UTF-8 decoding
    _utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while ( i < utftext.length ) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}
//add by dengxingsheng: special symbol
function ReplaceToHtml(input) {
    var output = '';

    for (var i = 0; i < input.length; i++) {
        var ch = input.charAt(i);
        switch (ch) {
        case '<': output += '&lt;'; break;
        case '>': output += '&gt;'; break;
        default: output += ch; break;
        }
    }

    return output;
}
function CheckBrowser() {
    var title, content, ret = true;
    var ua = window.navigator.userAgent.toLowerCase();

    SN.DATA.BrowserDesc = 0;
    //SN.DATA.IsMobileDevice = (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i).test(navigator.userAgent);
    title = '<center><b><font size="3">Your browser not support to run our application,following information may help:</font></b></center>';
    if ($ == undefined) {
        isSafari = (ua.indexOf('safari') != -1);
        if (isSafari) {
            content = "<center>" + "Your safari version must be 4.0 or later . " + "</center>";
        } else {
            content = "<center>" + "JQuery not running ." + "</center>";
        }
        ret = false;
    } else {
        var isIE = (ua.indexOf('msie') > -1);
        var version = ua.split(";")[1];
        var v = /\d+/.exec(version);
        if (isIE && v < 8 && !confirm(SN.INFO.ErrIEVersionLow)) {
            content = "<center>" + "Your ie version must be 8.0 or later . " + "</center>";
            ret = false;
        }
        SN.DATA.BrowserDesc = v;
    }
    if (!ret) {
        document.clear();
        document.write(title + content);
    }
    return ret;
}
(function ($) {
    $.fn.ellipsis = function (enableUpdating) {
        var s = document.documentElement.style;
        /*if (!('textOverflow' in s || 'OTextOverflow' in s)) */{
            return this.each(function () {
                var el = $(this);
                if (el.css("overflow") == "hidden") {
                    var originalText = el.html();
                    var w = el.width();

                    var t = $(this.cloneNode(true)).hide().css({
                        'position': 'absolute',
                        'width': 'auto',
                        'overflow': 'visible',
                        'max-width': 'inherit'
                    });
                    el.after(t);

                    var text = originalText;
                    var overflowed = false;
                    while (text.length > 0 && t.width() > el.width()) {
                        text = text.substr(0, text.length - 1);
                        t.html(text + "…");
                        overflowed = true;
                    }
                    el.html(t.html());
                    if(overflowed == true){
                        el.attr("title", originalText.replace('\n', '').replace('\r', ''));
                        /*
                         *浮动div显示超出范围的内容
                         */
                         /*
                        var div = null;
                        el.mouseover(function (e) {
                            if (!e) e = window.event;
                            var tipID= "page_tip";
                            var tipDiv = null;
                            if((tipDiv=$("#" + tipID)).length == 0){
                                div = CreatTipDiv(e, tipID, el[0], true);
                                document.body.appendChild(div);
                            }
                            tipDiv=$("#" + tipID);
                            tipDiv.html(originalText);
                        });
                        el.mouseout(function (e) {
                            var tipDiv = null;
                            if((tipDiv=$("#" + tipID)).length == 0){
                                return;
                            }
                            tipDiv.css("top", "9999px");
                            tipDiv.css("left", "9999px");
                        });
                        */
                    }
                    t.remove();

                    if (enableUpdating == true) {
                        var oldW = el.width();
                        setInterval(function () {
                            if (el.width() != oldW) {
                                oldW = el.width();
                                el.html(originalText);
                                el.ellipsis();
                            }
                        }, 200);
                    }
                }
            });
        } //else return this;
    };
})(jQuery);

$(document).ready(
function () {
    if (CheckBrowser() == false)
        return;

    document.title = SN.DATA.omProductName.value + (isNeedAppendMinus() ? "-Series" : " Series");
});
document.onkeydown = function (e) {
    if (!e) e = window.event;
    var keynum, keychar;
    if (window.event) {// IE
        keynum = e.keyCode
    } else if (e.which) {// Netscape/Firefox/Opera
        keynum = e.which
    }

    keychar = String.fromCharCode(keynum)
    if (keynum == 13) {
        if (document.activeElement) {
            if (document.activeElement.name == SN.DATA.omAdminUser.name
                || document.activeElement.name == SN.DATA.omAdminPass.name) {
                $("#button_login").click();
                return false;
            }else if (document.activeElement.name == SN.DATA.om8021XUserName.name
                || document.activeElement.name == SN.DATA.om8021XUserPassword.name
                || document.activeElement.name == SN.DATA.om8021XUserPassword2.name) {
                $("#button_apply").click();
                return false;
            }
        }
    }
};
function AjaxParseJson(json) {
    return eval("(" + json + ")");
}
function GetJson(json) {
    if ("" == json)
        return undefined;
    return json;
}
function SetLoginCookie() {
    var user = $("[name=" + SN.DATA.omAdminUser.name + "]");
    var pswd = $("[name=" + SN.DATA.omAdminPass.name + "]");

    if (user.length > 0 && pswd.length > 0) {
        var logMsg = EncodeBase64(user[0].value + ":" + pswd[0].value);
        SN.Cookie.Set("autor", logMsg);
        SN.Cookie.Set("loginname", user[0].value);
    }
}
function CheckOutLoginCookie(sessionID) {
    var user = $("[name=" + SN.DATA.omAdminUser.name + "]");
    var pswd = $("[name=" + SN.DATA.omAdminPass.name + "]");
    if (user.length >= 0 && pswd.length >= 0 && sessionID.length >= 0) {
        var logMsg = EncodeBase64(user[0].value + ":" + pswd[0].value);
        if(logMsg == sessionID)
        {
            return 1;
        }
    }
    return 0;
}

function CheckPasswordStrength(password)
{
    // 密码由数字、字母、特殊字符三项中的二项组成.
    var level = 0;

    if(/[0-9]/.test(password))
    {
        level++;
    }

    if(/[a-zA-Z]/.test(password))
    {
        level++;
    }

    if(/[^0-9a-zA-Z]/.test(password))
    {
        level++;
    }

    return level;
}

//form提交，数据传给purl,purl默认为../SetProperties.cgi
SN.DATA.CurrentAjax = null;
function postdata(dat, purl, fn, nowait, fn4complete) {
    //console.log('dat: ' + dat + ', url: ' + purl);
    //console.log(SN.DATA.CurrentAjax);
    if (true != nowait)
    {
        if ("/OnlineUpgradeFW" === purl)
            ShowOrHideWaitting(true, 1);
        else
            ShowOrHideWaitting(true, 0);
    }
    if ("/tlscertmake" === purl) /*需长时间显示圆圈半透明等待界面*/
        ShowOrHideWaitting(true, 1);

    SN.DATA.CurrentAjax = $.ajax({
        type: "POST",
        url: (purl == undefined || purl == "/noauthor") ? "../SetProperties.cgi" : purl,
        //async: false,
        data: dat,
        //timeout: 10000,
        beforeSend: function(xhr) {
            if (purl != "/noauthor" && purl != "/login" && purl != "/wifiScanStatusRefresh" && purl != "/certScanStatusRefresh")
                xhr.setRequestHeader("author", SN.Cookie.Get("autor", ""));
        },
        complete: function() {
            if (true != nowait && fn != undefined)
            {
                if("/OnlineUpgradeFW" === purl)
                {
                    if(checkupgradeVer_res == true)
                    {
                        checkupgradeVer_res = false;
                    }
                    else
                    {
                        ShowOrHideWaitting(false);
                    }
                }
                else
                {
                    ShowOrHideWaitting(false);
                }
            }

            if (undefined != fn4complete)
                fn4complete();
            if (SN.DATA.CurrentPageID == "MDNS") {
                if (CheckIsLogined() && MDNS_USER_MODIFY_DELETE_FLAG == 1) {
                    MDNS_USER_MODIFY_DELETE_FLAG = 0;
                    SN.Cookie.Set("autor", "");
                    SN.Cookie.Clear("autor");
                    SN.Cookie.Set("loginname", "");
                    SN.Cookie.Clear("loginname");
                    alert(SN.INFO.LoginExpired);
                    SN.DATA.ToolbarLogin.innerHTML = SN.INFO.PageLogin;
                    SN.DATA.ToolbarLogin.onmouseup();
                }
            }
        },
        success: (fn != undefined) ? fn :
            function (msg) {
                var msgJson = null;

                if (true != nowait)
                    ShowOrHideWaitting(false);
                if (undefined == msg) {
                    alert(SN.INFO.NoReturnMessage);//没有返回数据
                    return;
                }

                msgJson = AjaxParseJson(msg);
                //console.log(msgJson);
                if ("/login" == purl) {
                    if (0 == msgJson.Result && CheckOutLoginCookie(msgJson.SessionID) == 1) {
                        SetLoginCookie();
                        //页面长时间不操作自动退出登录
                        CheckLoginTime();
                        //GotoUrl("index.html", false);
                        SN.DATA.ToolbarStart.onmouseup();
                        SN.DATA.ToolbarLogin.innerHTML = SN.INFO.PageLogout;

                        function postpowercount() {
                            flag_restart = 0;
                            var Restart = SN.DATA.omPowerOnRestart;
                            var Count = SN.DATA.omPowerOnCount;
                            Restart.value = Count.value;
                            console.log(SN.DATA.omPowerOnRestart, 'SN.DATA.omPowerOnRestart')
                            console.log(SN.DATA.omPowerOnCount, 'SN.DATA.omPowerOnCount')
                            var buf = EncodeBase64(Restart.value);
                            var data = "omPowerOnRestart=" + buf;
                            postdata(data, undefined);
                        }

                        setTimeout(postpowercount, 100);
                    } else {
                        var name = SN.DATA.omAdminPass.name;
                        SN.FUNC.ShowErrorInfo(name, SN.INFO.ErrLoginFailed);
                    }
                } else if (purl == "/changepassword") {
                    if (msgJson.Result == 0) {
                        SN.Cookie.Set("autor", "");
                        SN.Cookie.Clear("autor");
                        alert(SN.INFO.UserPasswordModify);
                        SN.DATA.ToolbarLogin.innerHTML = SN.INFO.PageLogin;
                        SN.DATA.ToolbarLogin.onmouseup();
                    } else {
                        var name = SN.DATA.omAdminPass.name;
                        SN.FUNC.ShowErrorInfo(name, SN.INFO.ErrLoginFailed);
                        alert(SN.INFO.ModifyFailed);//修改失败
                    }
                } else if ("/resetall" == purl) {
                    if (msgJson.Result == HTTP_RESERT_NETWORK_OK) {
                        SN.Cookie.Set("autor", "");
                        SN.Cookie.Clear("autor");
                        alert(SN.INFO.ResetAllSuccessed);
                        SN.DATA.ToolbarLogin.innerHTML = SN.INFO.PageLogin;
                    } else {
                        var name = SN.DATA.omAdminPass.name;
                        SN.FUNC.ShowErrorInfo(name, SN.INFO.ErrLoginFailed);
                    }
                } else if ("/changepanelpassword" == purl) {
                    if (msgJson.Result == 0) {
                        alert(SN.INFO.PasswordModify);
                    } else {
                    //var name = SN.DATA.omPanelPass.name;
                    //SN.FUNC.ShowErrorInfo(name, SN.INFO.ErrPasswordFailed);
                        alert(SN.INFO.ModifyFailed);//修改失败
                    }
                } else if ("/reboot" == purl) {
                    if (msgJson.Result == HTTP_REBOOT_OK) {
                        alert(SN.INFO.RebootOK);
                    } else {
                        alert(SN.INFO.RebootFail);
                    }
                } else {
                    if (msgJson.Result == 0) {
                        //ipv4 changed
                        if (flag_login == 0) {
                            if (IsIpv4Changed()) {
                                alert(SN.INFO.ChangeIpv4Successed);
                                var ipv4Inputs = $("[name=" + SN.DATA.omIPv4Address.name + "]");
                                document.location.href = "http://" + ipv4Inputs[0].value;
                            } else if ('WPS' == SN.DATA.CurrentPageID
                                && SN.DATA.wifiWpsSleepTimeEnd < 0) {//WPS 连接认证
                                $("[name=wifiWpsSecMode]").attr('disabled', true);
                                SN.DATA.wifiWpsSleepTimeEnd = 0; //Wps开始认证
                                SN.DATA.WpsDate = new Date();
                                //console.log(SN.DATA.WpsDate);
                                WpsSleepTimer();
                                alert(SN.INFO.ModifySuccessed);
                            } else {
                                alert(SN.INFO.ModifySuccessed);
                                RefreshCurrentPage();
                            }
                        }
                    } else if (msgJson.Result == 401) {
                        SN.Cookie.Set("autor", "");
                        SN.Cookie.Clear("autor");
                        alert(SN.INFO.LoginInvalid);
                        SN.DATA.ToolbarLogin.innerHTML = SN.INFO.PageLogin;
                        SN.DATA.ToolbarLogin.onmouseup();
                    } else if (msgJson.Result == HTTP_SET_IPV4_INUSED) {
                        alert(SN.INFO.ChangeIpv4Inused);
                        RefreshCurrentPage();
                    } else if (msgJson.Result == HTTP_SET_SLEEPTIME_FAIL) {
                        var info = '';
                        if (SN.DATA.CurrentPageID == "SYSTEM") {
                            info = SN.DATA.omSleepTime.info;
                        }
                        alert(StringFormat(SN.INFO.SettingFailed, info));
                        RefreshCurrentPage();
                    } else if (msgJson.Result == HTTP_SET_HOSTNAME_INUSED) {
                        alert(SN.INFO.ChangeHostnameInused);
                        RefreshCurrentPage();
                    } else if (msgJson.Result == HTTP_SET_OID_FAIL) {
                        alert(StringFormat(SN.INFO.ErrSetInProcessJob, "Wi-Fi"));
                        RefreshCurrentPage();
                    } else if (msgJson.Result == IPP_MANAGER_IS_BUSY) {
                        alert(SN.INFO.PrinterIsBusyAlert);
                        RefreshCurrentPage();
                    } else if (msgJson.Result == IPP_MANAGER_SET_FAIL) {
                        alert(SN.INFO.OidSetFailAlert);
                        RefreshCurrentPage();
                    } else if (msgJson.Result == HTTP_NETPORT_NO_SAME_DEFAULT) {
                        alert(SN.INFO.NetPortNoSameDefault);
                        RefreshCurrentPage();
                    } else if (msgJson.Result == HTTP_NETPORT_ONLY_EDIT_ENABLED) {
                        alert(SN.INFO.NetPortOnlyEditEnabled);
                        RefreshCurrentPage();
                    } else if (msgJson.Result == HTTP_NETPORT_NO_DEL_DEFAULT) {
                        alert(SN.INFO.NetPortNoDelDefault);
                        RefreshCurrentPage();
                    } else if (msgJson.Result == HTTP_NETPORT_WEBFORCEENABLE) {
                        alert(SN.INFO.NetPortWebForceEnabled);
                        RefreshCurrentPage();
                    }
                }
                return;
            }
    });
}
//判断进入设置界面是否需要登陆验证
function CheckIsNeedLogin(){
    var flag_needlogin = 0;  //判断进入设置界面是否需要登陆验证
    SN.FUNC.CreateDOM(SN.DATA.omWebLoginEnabled);
    flag_needlogin = SN.DATA.omWebLoginEnabled.value;
    return flag_needlogin;
}
//刷新当前页
function RefreshCurrentPage() {
    $("#" + SN.DATA.CurrentPageID).click();
}
//检查是否登陆
function IsAdmin(){
    if (SN.Cookie.Get("autor", "") == "") {
        return false;
    } else {
        return true;
    }
}
function CheckIsLogined() {
    if (!IsAdmin()) {
        alert(SN.INFO.NotLogin);
        SN.DATA.ToolbarLogin.onmouseup();
        return false;
    } else {
        return true;
    }
}
//检查IP是否更改
function IsIpv4Changed() {
    var ipv4Inputs = $("[name=" + SN.DATA.omIPv4Address.name + "]:enabled");
    if (ipv4Inputs.length > 0 && ipv4Inputs[0].value &&
        ipv4Inputs[0].value != SN.DATA.omIPv4Address.value) {
        return true;
    }
    else {
        return false;
    }
}
function IsWirelessIpAddrChanged() {
    if (undefined == SN.DATA.wifiStaIpAddr) {
        return false;
    }

    var ipv4Inputs = $("[name=" + SN.DATA.wifiStaIpAddr.name + "]:enabled");
    if (ipv4Inputs.length > 0 && ipv4Inputs[0].value &&
        ipv4Inputs[0].value != SN.DATA.wifiStaIpAddr.value) {
        return true;
    }
    else {
        return false;
    }
}
function CheckIsRestart() {
    if (flag_restart == 0)
    {
        if (IsAdmin()) {
            var Restart = SN.DATA.omPowerOnRestart;
            var Count= SN.DATA.omPowerOnCount;
            //console.log(SN.DATA.omPowerOnRestart,'ooooooooo');
            if(Restart.value != Count.value)
            {
                SN.Cookie.Set("autor", "");
                SN.Cookie.Clear("autor");
                //GotoUrl("index.html", false);
                function restart(){
                    alert(SN.INFO.LoginExpired);
                    SN.DATA.ToolbarLogin.innerHTML = SN.INFO.PageLogin;
                    //console.log(SN.DATA.ToolbarLogin,'iiiiiiiiiiiiiiiiiiiii')
                    SN.DATA.ToolbarLogin.onmouseup();
                }
                setTimeout(restart,10);
                //Restart.value = Count.value;
                //SN.Cookie.Set("autor", "");
                //SN.DATA.ToolbarStart.innerHTML = SN.INFO.PageInformation;
                //SN.DATA.ToolbarStart.onmouseup();
                //function isexpired(){
                //    alert(SN.INFO.LoginExpired);
                //    SN.DATA.ToolbarLogin.innerHTML = SN.INFO.PageLogin;
                //        SN.DATA.ToolbarLogin.onmouseup();
                //}
                //    setTimeout(isexpired,500);
            }
        }
    }
}
var clear_flag = 0;
function ClearLoginTime(flag) {
    clear_flag = flag;
}
//页面长时间不操作自动退出登录
function CheckLoginTime() {
    var oldTime = new Date().getTime();
    var newTime = new Date().getTime();
    SN.DATA.WebUserLogoutTime = SN.DATA.omWebLoginTimeout.value * 1000;

    $(function(){
        /*鼠标移动事件*/
        $(document).mouseover(function(){
            oldTime = new Date().getTime();
        });
    });

    function OutTime(){
        if(SN.DATA.WebUserLogoutTime != SN.DATA.omWebLoginTimeout.value * 1000)
        {
            oldTime = new Date().getTime();
            SN.DATA.WebUserLogoutTime = SN.DATA.omWebLoginTimeout.value * 1000;
        }
        newTime = new Date().getTime();//鼠标移入重置停留的时间
        if(clear_flag) {
            oldTime = new Date().getTime();
        }
        if(SN.DATA.WebUserLogoutTime != 0 && (newTime - oldTime) > SN.DATA.WebUserLogoutTime){ //判断是否超时不操作
            if(IsAdmin()){
                clearInterval(timer);
                if ($("#id_main_dailog").html().length > 0)
                    $("#id_main_dailog").dialog("close");
                SN.Cookie.Set("autor", "");
                SN.Cookie.Clear("autor");
                var div = $("#id_content_src")[0];
                if (div) {
                    div.innerHTML = '';
                }
                SN.DATA.ToolbarStart.innerHTML = SN.INFO.PageInformation;
                SN.DATA.ToolbarStart.onmouseup();
                function isexpired(){
                    alert(SN.INFO.LoginExpired);
                    SN.DATA.ToolbarLogin.innerHTML = SN.INFO.PageLogin;
                    SN.DATA.ToolbarLogin.onmouseup();
                }
                setTimeout(isexpired,100);
                clearTimeout(SCREEN_REFRESH_TIMEOUT_HANDLER);
            }
        }
    }
    /*定时器 判断每2秒是否长时间未进行页面操作*/
    var timer = window.setInterval(OutTime,2000);
}
//检查日期设置是否更改
function IsDatesettingChange(){
    var printertimes = $("[name=" + SN.DATA.omDate.name + "]");
    if(printertimes.length > 0 && printertimes[0].value &&
        printertimes[0].value != SN.DATA.omDate.value){
        return true;
    }else {
        return false;
    }
}

//检查时间hms设置是否更改
function IsTimehmssettingChange(){
    var printertimes = $("[name=" + SN.DATA.omTime.name + "]");
    if(printertimes.length > 0 && printertimes[0].value &&
        printertimes[0].value != SN.DATA.omTime.value){
        return true;
    }else {
        return false;
    }
}
function ButtonReady() {
    $("#button_apply").click(
    function () {
        if (!CheckIsLogined())
            return ;

        if (SN.DATA.wifiWpsSleepTimeEnd >= 0 && "WPS" == SN.DATA.CurrentPageID)
            return ;

        if (SN.FUNC.CheckForm("form_main")) {
            if (IsIpv4Changed() && !confirm(SN.INFO.IsChangeIpv4))
                return;

            if (IsWirelessIpAddrChanged() && !confirm(SN.INFO.IsChangeIpv4))
                return;

            SN.FUNC.SubmitData("form_main");
        } else {
            alert(SN.INFO.InputError);
        }
    });
    $("#button_refresh").click(
    function () {
        if (SN.DATA.wifiWpsSleepTimeEnd >= 0
            && 'WPS' == SN.DATA.CurrentPageID) {
            SN.DATA.wifiWpsSleepTimeEnd = -2;
            postdata(SN.DATA.wifiWpsSecMode.name + "=" + EncodeBase64("255"), "/noauthor",
            function() {
                alert(SN.INFO.CancelWPSConnect);
            });
        }
        RefreshCurrentPage();
    });
    $("#button_changepswd").click(
    function () {
        if (SN.FUNC.CheckForm("form_main")) {
            var usr = SN.DATA.omAdminUser.value;
            var usrnew = $("[name=omAdminUser]").val();
            var pswold = $("[name=omAdminPass]").val();
            var pswnew = $("[name=omAdminPass1]").val();
            var pswok = $("[name=omAdminPass2]").val();
            if (pswnew != undefined && pswok != undefined) {
                if (pswnew.length < 0) {
                    SN.FUNC.ShowErrorInfo("omAdminPass1", SN.INFO.ErrFieldRequired);
                    alert(SN.INFO.InputError);
                } else if (pswok.length < 0) {
                    SN.FUNC.ShowErrorInfo("omAdminPass2", SN.INFO.ErrFieldRequired);
                    alert(SN.INFO.InputError);
                } else {
                    var data = EncodeBase64(usr + ":" + pswold) + "?";
                    data += "omAdminUser=" + EncodeBase64(usrnew) + "&";
                    data += "omAdminPass=" + EncodeBase64(pswnew);
                    postdata(data, "/changepassword");
                }
            }
        } else {
            alert(SN.INFO.InputError);
        }
    });
    $("#button_panelpswd").click(
        function () {
            if (SN.FUNC.CheckForm("form_main")) {
                var pswold = $("[name=omPanelPass]").val();
                var pswnew = $("[name=omPanelPass1]").val();
                var pswok = $("[name=omPanelPass2]").val();
                if (pswnew != undefined && pswok != undefined) {
                    if (pswnew.length < 0) {
                        SN.FUNC.ShowErrorInfo("omPanelPass1", SN.INFO.ErrFieldRequired);
                        alert(SN.INFO.InputError);
                    } else if (pswok.length < 0) {
                        SN.FUNC.ShowErrorInfo("omPanelPass2", SN.INFO.ErrFieldRequired);
                        alert(SN.INFO.InputError);
                    } else {
                        //var data = EncodeBase64(pswold) + "?";
                        //data += "omPanelPass=" + EncodeBase64(pswnew);
                        var data = "omPanelPass=" + EncodeBase64(pswnew);
                        postdata(data, "/changepanelpassword");
                    }
                }
            } else {
                alert(SN.INFO.InputError);
            }
        });
    $("#button_login").click(
    function () {
        if (SN.FUNC.CheckForm("form_main")) {
            var usr = $("[name=omAdminUser]").val();
            var psw = $("[name=omAdminPass]").val();
            var encodeData = EncodeBase64(usr + ":" + psw);
            postdata(encodeData, "/login");
            flag_restart = 1;
        } else {
            alert(SN.INFO.InputError);
        }
    });
    $("#button_resetall").click(
    function () {
        if (SN.FUNC.CheckForm("form_main")){
            if (confirm(SN.INFO.IsResetAll)) {
                var usr = $("[name=omAdminUser]").val();
                var psw = $("[name=omAdminPass]").val();
                if (usr != undefined && psw != undefined ) {
                    var data = EncodeBase64(usr + ":" + psw) + "?";
                    data += SN.DATA.omNetworkReset.name + "=" + EncodeBase64("1");
                    postdata(data, "/resetall");
                }
            }
        } else {
            alert(SN.INFO.InputError);
        }
    });
    $("#button_resetpcl").click(
    function () {
        if (!CheckIsLogined())
            return ;

        if (confirm(SN.INFO.IsRestore)) {
            var data = SN.DATA.omNetworkReset.name + "=" + EncodeBase64("2");
            var defval = CurrentDefaultUservmi(SN.DATA.omUserpapersize.value);

            data += '&omUservmi=' + EncodeBase64('' + defval);
            //data += '&omUserTopMargin=' + EncodeBase64('2400');
            postdata(data, undefined, RefreshCurrentPage);
        }
    });
    $("#button_resetprint").click(
    function () {
        if (!CheckIsLogined())
            return ;

        if (confirm(SN.INFO.IsRestore)) {
            var data = SN.DATA.omNetworkReset.name + "=" + EncodeBase64("3");
            postdata(data, undefined, RefreshCurrentPage);
        }
    });
    $("#button_resetsmtp").click(
    function () {
        if (!CheckIsLogined())
            return ;

        if (confirm(SN.INFO.IsRestore)) {
            var data = SN.DATA.omNetworkReset.name + "=" + EncodeBase64("4");
            postdata(data, undefined, RefreshCurrentPage);
        }
    });
    $("#button_emailtest").click(
    function () {
        if (!CheckIsLogined())
            return ;

        if (SN.FUNC.CheckForm("form_main")) {
            LoadEmailTestDialog();
        } else {
            alert(SN.INFO.InputError);
        }
    });
    $("#button_ldaptest").click(
    function () {
        var ret = true;

        if (!CheckIsLogined())
            return ;
        var user = $("[name=omLdapServerUser]").val();
        var pswd = $("[name=omLdapServerPswd]").val();
        if(user.length < 1)
       {
            SN.FUNC.ShowErrorInfo("omLdapServerUser", SN.INFO.ErrFieldRequired);
            ret = false;
        }
        if(pswd.length < 1)
        {
            SN.FUNC.ShowErrorInfo("omLdapServerPswd", SN.INFO.ErrFieldRequired);
            ret = false;
        }
        if(ret == false)
        {
            alert(SN.INFO.InputError);
            return ;
        }
        if (SN.FUNC.CheckForm("form_main")) {
            LoadLdapTestDialog(SN.DATA.omLdapTest.name, 'LDAP');
        } else {
            alert(SN.INFO.InputError);
        }
    });
    $("#button_resetldap").click(
    function () {
        if (!CheckIsLogined())
            return ;

        if (confirm(SN.INFO.IsRestore)) {
            var data = SN.DATA.omNetworkReset.name + "=" + EncodeBase64("5");
            postdata(data, undefined, RefreshCurrentPage);
        }
    });
    $("#button_winlogintest").click(
    function () {
        var ret = true;

        if (!CheckIsLogined())
            return ;
        var user = $("[name=omWindowsLoginUser]").val();
        var pswd = $("[name=omWindowsLoginPswd]").val();
        if(user.length < 1)
       {
            SN.FUNC.ShowErrorInfo("omWindowsLoginUser", SN.INFO.ErrFieldRequired);
            ret = false;
        }
        if(pswd.length < 1)
        {
            SN.FUNC.ShowErrorInfo("omWindowsLoginPswd", SN.INFO.ErrFieldRequired);
            ret = false;
        }
        if(ret == false)
        {
            alert(SN.INFO.InputError);
            return ;
        }
        if (SN.FUNC.CheckForm("form_main")) {
            LoadLdapTestDialog('omWindowsLoginTest', 'WINDOWS');
        } else {
            alert(SN.INFO.InputError);
        }
    });
    $("#button_resetwinlogin").click(
    function () {
        if (!CheckIsLogined())
            return ;

        if (confirm(SN.INFO.IsRestore)) {
            var data = SN.DATA.omNetworkReset.name + "=" + EncodeBase64("6");
            postdata(data, undefined, RefreshCurrentPage);
        }
    });
    $("[name=button_certificateconfigure]").click(
    function () {
        //if (!CheckIsLogined())
        //    return ;

        document.getElementById("CERTMANAGEMENT").click();
    });
    $("#button_netcontacttest").click(
    function () {
        var ret = true;

        if (!CheckIsLogined())
            return ;
        var test = $("[name=omNetContactSearchTest]").val();
        if(test.length < 1)
        {
            SN.FUNC.ShowErrorInfo("omNetContactSearchTest", SN.INFO.ErrFieldRequired);
            return ;
        }
        if (SN.FUNC.CheckForm("form_main")) {
            LoadLdapTestDialog("omNetContactTest", 'NETCONTACT');
        } else {
            alert(SN.INFO.InputError);
        }
    });

    $("#button_resetnetcontact").click(
    function () {
        if (!CheckIsLogined())
            return ;

        if (confirm(SN.INFO.IsRestore)) {
            var data = SN.DATA.omNetworkReset.name + "=" + EncodeBase64("7");
            postdata(data, undefined, RefreshCurrentPage);
        }
    });
    $("[name=button_reboot]").click(
    function () {
        if (!CheckIsLogined())
            return ;

        var data = 'omNetworkReboot=' + EncodeBase64("1");
        postdata(data, "/reboot");
    });
    $("#button_Disconnect").click(
    function () {
        clearTimeout(SCREEN_REFRESH_TIMEOUT_HANDLER);
        var div = $("#id_content_src")[0];
        if (div) {
            div.innerHTML = '<p>' + SN.INFO.PageRemoteControlDisconnect + '</p>';
        }
        postdata('{"type":"disconnect"}', "/TouchScreen");
    });
    //button效果
    $(":button").hover(
    function () {
        $(this).addClass('button-forced');
    },
    function () {
        $(this).removeClass('button-forced');
    });
}
function SetSelectValue(options, value) {
    if (undefined == options || options.length <= 0
        || undefined == value)
        return ;

    for (var i = 0; i < options.length; i++) {
        if (value == options[i].value) {
            options[i].selected = true;
        }
    }
}
function IsfontheightChangeAble(fontnum) {
    if ((fontnum <= 29 && fontnum >= 23) || (fontnum <= 56 && fontnum >= 53)
        || (fontnum <= 90 && fontnum >= 87)){
        return false;
    }
    else {
        return true;
    }
}
//获取当前字体对应默认符号集
function CurrentDefaultUsersymbolset(fontnum) {
    var defval = SN.DATA.PclFontSymbol[0][1];
    for (var i=1; i<SN.DATA.PclFontSymbol.length; i++) {
        if (SN.DATA.PclFontSymbol[i][0] == fontnum) {
            defval = SN.DATA.PclFontSymbol[i][1];
            break;
        }
    }
    return defval;
}
//获取当前纸张尺寸对应的默认表格长度
function CurrentDefaultUservmi(papersize, isMax) {
    var defval = 0;

    for (var i=0; i<SN.DATA.Userpapersize.length; i++) {
        if (SN.DATA.Userpapersize[i][1] == papersize) {
            defval = SN.DATA.Userpapersize[i][2];
            break;
        }
    }
    return defval;
}
//获取当前纸张尺寸对应的纸张来源umask
function CurrentInputtrayUmask(papersize) {
    var defval = 0;
    for (var i=0; i<SN.DATA.Userpapersize.length; i++) {
        if (SN.DATA.Userpapersize[i][1] == papersize) {
            defval = SN.DATA.Userpapersize[i][3];
            break;
        }
    }
    return defval;
}
function GetIfNotAllowDuplex() {
    var val = $("[name=omUserpapersize]").val();
    var notAllowDuplex = (val != 0x02) && (val != 0x04) //Letter //Legal
        && (val != 0x01) && (val != 0x16) && (val != 0x17); //A4 //Folio //Oficio //16K
    val = $("[name=omUserpapertype]").val();
    notAllowDuplex = notAllowDuplex || (val != 0);
    return notAllowDuplex;
}
function GetIfMustBeManualFeed() {
    var val = $("[name=omUserpapersize]").val();
    var mustBeManualFeed = (val == 0x09) || (val == 0x06) //No.10 Env //Monarch Env
        || (val == 0x07) || (val == 0x08) || (val == 0x19) //DL Env //C5 Env //C6 Env
        || (val == 0x1A) || (val == 0x0C); //ZL //Japanese Postcard
    val = $("[name=omUserpapertype]").val();
    mustBeManualFeed = mustBeManualFeed || (val != 0);
    return mustBeManualFeed;
}
function GetIfMustBeInputtray() {
    var val = $("[name=omUserpapersize]").val();
    var mustBeInputtray = (val == 0x09) || (val == 0x06) //No.10 Env //Monarch Env
        || (val == 0x07) || (val == 0x08) || (val == 0x19) //DL Env //C5 Env //C6 Env
        || (val == 0x1A) || (val == 0x0C) || (val == 0x1D) //ZL //Japanese Postcard //Postcard
        || (val == 0x1E) || (val == 0x1F) || (val == 0x20) //Yougata2 //Nagagata3 //Younaga3
        || (val == 0x21); //Yougata4
    val = $("[name=omUserpapertype]").val();
    mustBeInputtray = mustBeInputtray || (val == 2 || val == 4 || val == 6 || val == 9);
    return mustBeInputtray;
}
function onUserinputtray(){
    var omtmp = $("[name=omUserpapersize]");

    if (omtmp && omtmp.length > 0) {
        var valtmp = omtmp.val();
        var umask = -1;
        var val = $("[name=omUserinputtray]").val();

        omtmp.parent().html(SN.FUNC.CreateSelect(SN.DATA.omUserpapersize, val));
        omtmp = $("[name=omUserpapersize]");
        umask = CurrentInputtrayUmask(valtmp);
        if (val != 0 && val != 1 && umask != 0 && (umask == 7 || val != 2))
            SetSelectValue(omtmp[0].options, 0x01);
        else
            SetSelectValue(omtmp[0].options, valtmp);
    }

    omtmp = $("[name=omUserpapertype]");
    if (omtmp && omtmp.length > 0) {
        valtmp = omtmp.val();
        SetSelectValue(omtmp[0].options, valtmp);
    }
}
//IPS互斥关系
function IPSMutualExclusion(){
    var omtmp = $("[name=omUsermanualfeed]");
    var mustbe = false;

    if (omtmp && omtmp.length > 0) {
        mustbe = GetIfMustBeManualFeed();
        omtmp[0].disabled = mustbe;
        if (mustbe) {
            SetSelectValue(omtmp[0], 1);
        }
    }

    omtmp = $("[name=omUserinputtray]");
    if (omtmp && omtmp.length > 0) {
        mustbe = GetIfMustBeInputtray();
        omtmp[0].disabled = mustbe;
        if (mustbe) {
            SetSelectValue(omtmp[0], 1);
        }
        else
        {
            var autotype = $("[name=omUserpapertype]").val();
            var autosize = $("[name=omUserpapersize]").val();
            console.log(autotype);
            //纸张类型为胶片纸，只可选择自动进纸盒
            if(autotype == 3)
            {
                omtmp[0].disabled = 1;
                SetSelectValue(omtmp[0], 2);
            }
            //纸张尺寸为B6,32K,BIG32K且纸张类型为再生纸时只可选择自动进纸盒
            else if(((autosize == 0x1C) || (autosize == 0x10) || (autosize == 0x11))&&(autotype == 10))
            {
                omtmp[0].disabled = 1;
                SetSelectValue(omtmp[0], 2);
            }
            //纸张尺寸为B6,32K,BIG32K时只可选择多功能进纸盒，自动进纸盒
            else if((autosize == 0x1C) || (autosize == 0x10) || (autosize == 0x11))
            {
                SetSelectValue(omtmp[0], 1);
                omtmp[0].options[1].disabled = false;
                omtmp[0].options[3].disabled = true;
                omtmp[0].options[4].disabled = true;
            }
            //纸张类型为再生纸，只可选择自动进纸盒和选配纸盒
            else if(autotype == 10)
            {
                SetSelectValue(omtmp[0], 2);
                omtmp[0].options[1].disabled = true;
                omtmp[0].options[3].disabled = false;
                omtmp[0].options[4].disabled = false;
            }
            else
            {
                omtmp[0].options[1].disabled = false;
                omtmp[0].options[0].disabled = false;
                omtmp[0].options[3].disabled = false;
                omtmp[0].options[4].disabled = false;
            }
        }
    }

    omtmp = $("[name=omUserbind]");
    if (omtmp && omtmp.length > 0) {
        mustbe = GetIfNotAllowDuplex();
        omtmp[0].disabled = mustbe;
        if (mustbe) {
            SetSelectValue(omtmp[0], 2);
        }
    }
}
//获取当前文件类型支持单扫/合并
function CurrentNup(FileType) {
    var defval = 0;
    for (var i=0; i<SN.DATA.omscanFileFormat.length; i++) {
        if (SN.DATA.omscanFileFormat[i][1] == FileType) {
            defval = SN.DATA.omscanFileFormat[i][2];
            break;
        }
    }
    return defval;
}
function onScanNupAndSaveType(){
    var omtmp = $("[name=omscanFileFormat]");

    if (omtmp && omtmp.length > 0) {
        var valtmp = omtmp.val();
        var nup = -1;
        var val = $("[name=omscanNup]").val();

        omtmp.parent().html(SN.FUNC.CreateSelect(SN.DATA.omscanFileFormat, val));
        omtmp = $("[name=omscanFileFormat]");
        nup = CurrentNup(valtmp);
        if (((val == 1) && (valtmp == 0 || valtmp == 2)) || ((val == 0) && (valtmp == 1)))
            SetSelectValue(omtmp[0].options, 3);
        else
            SetSelectValue(omtmp[0].options, valtmp);
    }

}
function onUserfontnum() {
    var omUserfontheight = $("[name=omUserfontheight]");
    var omUserfontpitch = $("[name=omUserfontpitch]");
    var omUserfontnum = $("[name=omUserfontnum]");
    if (!IsfontheightChangeAble(omUserfontnum.val())) {
        omUserfontheight.val("12");
        SN.FUNC.ShowErrorInfo('omUserfontheight', '', true);
        omUserfontheight.attr("disabled", "disabled");
        omUserfontpitch.removeAttr("disabled");
    } else {
        omUserfontpitch.val("10");
        SN.FUNC.ShowErrorInfo('omUserfontpitch', '', true);
        omUserfontheight.removeAttr("disabled");
        omUserfontpitch.attr("disabled", "disabled");
    }
}
function OnReady() {
    var omtmp = null;

    //初始化下拉框
    omtmp = $("[name=omUserDHCP]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omUserDHCP.value;
        SetSelectValue(omtmp[0].options, val);
    }

    omtmp = $("[name=omIPv4DNSDHCP]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omIPv4DNSDHCP.value;
        SetSelectValue(omtmp[0].options, val);
    }

    omtmp = $("[name=omSMTPSecurity]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omSMTPSecurity.value;
        SetSelectValue(omtmp[0].options, val);
    }

    omtmp = $("[name=omSMTPServerAuth]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omSMTPServerAuth.value;
        SetSelectValue(omtmp[0].options, val);
    }
    omtmp = $("[name=om8021XAuth]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.om8021XAuth.value;
        SetSelectValue(omtmp[0].options, val);
        omtmp.change();

    }
    /*omtmp = $("[name=wifiUapDHCPEnabled]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.wifiUapDHCPEnabled.value;
        SetSelectValue(omtmp[0].options, val);
    }*/

    omtmp = $("[name=wifiWpsSecMode]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.wifiWpsSecMode.value;
        SetSelectValue(omtmp[0].options, val);
    }

    /*WPA2-Enterprise下拉框值初始化*/
    omtmp = $("[name=wifiEapMethod]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.wifiEapMethod.value;
        SetSelectValue(omtmp[0].options, val);
    }

    omtmp = $("[name=wifiEapType]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.wifiEapType.value;
        SetSelectValue(omtmp[0].options, val);
    }

    omtmp = $("[name=wifiEapSerAuth]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.wifiEapSerAuth.value;
        SetSelectValue(omtmp[0].options, val);
    }

    omtmp = $("[name=wifiEapCliAuth]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.wifiEapCliAuth.value;
        SetSelectValue(omtmp[0].options, val);
    }

    omtmp = $("[name=wifiEapButton]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.wifiEapButton.value;
        SetSelectValue(omtmp[0].options, val);
    }
    /*WPA2-ENTERPRISE END*/

    omtmp = $("[name=omJobPSErrReportEnable]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omJobPSErrReportEnable.value;
        SetSelectValue(omtmp[0].options, val);
    }
    /*
    omtmp = $("[name=omPSDataFormat]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omPSDataFormat.value;
        SetSelectValue(omtmp[0].options, val);
    }
    */
    omtmp = $("[name=omUserTopMargin]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omUserTopMargin.value;
        SetSelectValue(omtmp[0].options, val);
    }

    omtmp = $("[name=omUserBottomMargin]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omUserBottomMargin.value;
        SetSelectValue(omtmp[0].options, val);
    }

    omtmp = $("[name=omSleepTime]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omSleepTime.value;
        SetSelectValue(omtmp[0].options, val);
    }

    //##jimmy##
    omtmp = $("[name=omUTC]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omUTC.value;
        SetSelectValue(omtmp[0].options, val);
    }
    omtmp = $("[name=omscanResolution]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omscanResolution.value;
        SetSelectValue(omtmp[0].options, val);
    }

    omtmp = $("[name=omscanColor]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omscanColor.value;
        SetSelectValue(omtmp[0].options, val);
    }

    omtmp = $("[name=omscanFileFormat]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omscanFileFormat.value;
        SetSelectValue(omtmp[0].options, val);
    }

    omtmp = $("[name=omscanArea]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omscanArea.value;
        SetSelectValue(omtmp[0].options, val);
    }
    omtmp = $("[name=omUserfontnum]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omUserfontnum.value;
        SetSelectValue(omtmp[0].options, val);
        omtmp.change();
    }

    omtmp = $("[name=omUsersymbolset]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omUsersymbolset.value;
        SetSelectValue(omtmp[0].options, val);
    }

    omtmp = $("[name=omUserpapersize]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omUserpapersize.value;
        SetSelectValue(omtmp[0].options, val);
    }

    omtmp = $("[name=omUserpapertype]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omUserpapertype.value;
        SetSelectValue(omtmp[0].options, val);
    }

    omtmp = $("[name=omUsermanualfeed]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omUsermanualfeed.value;
        SetSelectValue(omtmp[0].options, val);
    }

    omtmp = $("[name=omUserduplex]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omUserduplex.value;
        SetSelectValue(omtmp[0].options, val);
    }

    omtmp = $("[name=omUserinputtray]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omUserinputtray.value;
        SetSelectValue(omtmp[0].options, val);
        omtmp.change();
    }
    IPSMutualExclusion();//IPS互斥关系

    omtmp = $("[name=omUserorientation]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omUserorientation.value;
        SetSelectValue(omtmp[0].options, val);
    }

    omtmp = $("[name=omUserdensity]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omUserdensity.value;
        SetSelectValue(omtmp[0].options, val);
    }

    omtmp = $("[name=omUserresolution]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omUserresolution.value;
        SetSelectValue(omtmp[0].options, val);
    }

    omtmp = $("[name=omUserbind]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omUserbind.value;
        if (SN.DATA.omUserduplex.value == 0) {
            val = 2;
        }
        SetSelectValue(omtmp[0].options, val);
    }

    omtmp = $("[name=omUserWideA4]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omUserWideA4.value;
        SetSelectValue(omtmp[0].options, val);
    }

    omtmp = $("#id_lang_select");
    if (omtmp && omtmp.length > 0) {
        var lang = SN.Cookie.Get('lang', SN.DATA.DefaultLang);
        SetSelectValue(omtmp[0].options, lang);
    }

    omtmp = $("[name=omLdapSecurity]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omLdapSecurity.value;
        SetSelectValue(omtmp[0].options, val);
    }
    omtmp = $("[name=omWindowsAuthMode]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omWindowsAuthMode.value;
        SetSelectValue(omtmp[0].options, val);
    }
    omtmp = $("[name=omWindowsSecurity]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omWindowsSecurity.value;
        SetSelectValue(omtmp[0].options, val);
    }
    omtmp = $("[name=omWindowsDefaultDomain]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omWindowsDefaultDomain.value;
        if(omtmp[0].options.length == 0)
        {
            $("[name=omWindowsDefaultDomain]").attr('disabled', true);
        } else {
            $("[name=omWindowsDefaultDomain]").attr('disabled', false);
            SetSelectValue(omtmp[0].options, val);
        }
    }

    omtmp = $("[name=omWindowsDomain]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omWindowsDomain.value;
        if(omtmp[0].options.length == 0)
        {
            $("[name=omWindowsDomain]").attr('disabled', true);
        } else {
            $("[name=omWindowsDomain]").attr('disabled', false);
            SetSelectValue(omtmp[0].options, val);
        }
    }

    omtmp = $("[name=omNetUserGroupsType]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omNetUserGroupsType.value;
        SetSelectValue(omtmp[0].options, val);
    }
    omtmp = $("[name=omLdapHaveCertificate]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omLdapHaveCertificate.value;
        SetSelectValue(omtmp[0].options, val);
    }
    omtmp = $("[name=om8021XNeedCert]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.om8021XNeedCert.value;
        SetSelectValue(omtmp[0].options, val);
    }


    omtmp = $("[name=omNetContactSecurity]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omNetContactSecurity.value;
        SetSelectValue(omtmp[0].options, val);
    }

    //CertManagement
    omtmp = $("[name=omCertGenrsaKeyLen]");
    if(omtmp && omtmp.length > 0){
        var val = SN.DATA.omCertGenrsaKeyLen;
        SetSelectValue(omtmp[0].options, val);
    }

    omtmp = $("[name=omCertShaKeyLen]");
    if(omtmp && omtmp.length > 0){
        var val = SN.DATA.omCertShaKeyLen;
        SetSelectValue(omtmp[0].options, val);
    }

    omtmp = $("[name=omNetContactAuthMode]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omNetContactAuthMode.value;
        SetSelectValue(omtmp[0].options, val);
    }
    omtmp = $("[name=omMultippsTraypsize]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omMultippsTraypsize.value;
        SetSelectValue(omtmp[0].options, val);
    }
    omtmp = $("[name=omMultippsTrayptype]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omMultippsTrayptype.value;
        SetSelectValue(omtmp[0].options, val);
    }
    omtmp = $("[name=omAutoInpTraypsize]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omAutoInpTraypsize.value;
        SetSelectValue(omtmp[0].options, val);
    }
    omtmp = $("[name=omAutoInpTrayptype]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omAutoInpTrayptype.value;
        SetSelectValue(omtmp[0].options, val);
    }
    omtmp = $("[name=omOptionalTray1psize]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omOptionalTray1psize.value;
        SetSelectValue(omtmp[0].options, val);
    }
    omtmp = $("[name=omOptionalTray1ptype]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omOptionalTray1ptype.value;
        SetSelectValue(omtmp[0].options, val);
    }
    omtmp = $("[name=omOptiona2Tray1psize]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omOptiona2Tray1psize.value;
        SetSelectValue(omtmp[0].options, val);
    }
    omtmp = $("[name=omOptiona2Tray1ptype]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omOptiona2Tray1ptype.value;
        SetSelectValue(omtmp[0].options, val);
    }
    omtmp = $("[name=omscanNup]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omscanNup.value;
        SetSelectValue(omtmp[0].options, val);
        omtmp.change();
    }
    omtmp = $("[name=omscanNetImgQuality]");
    if (omtmp && omtmp.length > 0) {
        let val = SN.DATA.omscanNetImgQuality.value;
        SetSelectValue(omtmp[0].options, val);
        omtmp.change();
    }
    omtmp = $("[name=omA4ToA5Mode]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omA4ToA5Mode.value;
        SetSelectValue(omtmp[0].options, val);
    }
    omtmp = $("[name=omSkipBlankEnabled]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omSkipBlankEnabled.value;
        SetSelectValue(omtmp[0].options, val);
    }
    omtmp = $("[name=omTownerLowSetting]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omTownerLowSetting.value;
        SetSelectValue(omtmp[0].options, val);
    }
    
    //新增ipsec相关
    omtmp = $("[name=omIkeCipherSuite]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omIkeCipherSuite.value;
        SetSelectValue(omtmp[0].options, val);
    }
    
    omtmp = $("[name=omEspEncrypt]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omEspEncrypt.value;
        SetSelectValue(omtmp[0].options, val);
    }

    omtmp = $("[name=omEspAuthentication]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omEspAuthentication.value;
        SetSelectValue(omtmp[0].options, val);
    }

    omtmp = $("[name=omIKESASurvival]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omIKESASurvival.value;
        SetSelectValue(omtmp[0].options, val);
    }
    
    omtmp = $("[name=omIpsecSASurvival]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omIpsecSASurvival.value;
        SetSelectValue(omtmp[0].options, val);
    }
    omtmp = $("[name=omWebLoginTimeout]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omWebLoginTimeout.value;
        SetSelectValue(omtmp[0].options, val);
    }
    omtmp = $("[name=omPrintTaryMediaPrompt]");
    if (omtmp && omtmp.length > 0) {
        var val = SN.DATA.omPrintTaryMediaPrompt.value;
        SetSelectValue(omtmp[0].options, val);
    }

    //输入框焦点和正常状态下颜色变换
    $(":text, :password").focus(function () {
        $(this).addClass('input-focused');
        this.select();
    });
    $(":text, :password").blur(function () {
        $(this).removeClass('input-focused');
        SN.FUNC.CheckInput(this);
    });

    //密码显示方式切换
    $("[name^=showpsw_]").bind("mousedown", function() {
        var name = (this.name).substring('showpsw_'.length, this.name.length);
        var hidden = $("[name=" + name + "]:hidden");
        var val = $("[name=" + name + "]:visible").hide().val();

        hidden.val(val).show();
    })/*.bind("mouseup mouseout", function() {
        var name = (this.name).substring('showpsw_'.length, this.name.length);
        $("[name=" + name + "][type=text]").hide();
        $("[name=" + name + "][type=password]").show();
    })*/;

    //SNMP认证信息明文/密文显示切换
    $("[name^=snmpv3_display]").bind("mousedown", function() {
        // snmp v3 user.
        var name = SN.DATA.omSnmpV3user.name;
        var hidden = $("[name=" + name + "]:hidden");
        var val = $("[name=" + name + "]:visible").hide().val();
        hidden.val(val).show();

        // snmp v3 pass.
        var name = SN.DATA.omSnmpV3auth.name;
        var hidden = $("[name=" + name + "]:hidden");
        var val = $("[name=" + name + "]:visible").hide().val();
        hidden.val(val).show();

        // snmp v3 priv.
        var name = SN.DATA.omSnmpV3priv.name;
        var hidden = $("[name=" + name + "]:hidden");
        var val = $("[name=" + name + "]:visible").hide().val();
        hidden.val(val).show();
    });

    //屏蔽文本选择
    $("a").bind("selectstart", function() {
        return false;
    }).dblclick(function () {
        return false;
    });

    //屏蔽密码复制剪切
    $("input:password").bind("copy cut", function() { return false; });// paste

    //checking nav statu
    if (window.name == "settingwin")
        parent.CheckNavgStatu(window.name);
}

function StringFormat(formatString, args) {
    var result = formatString;
    if (arguments.length > 0) {
        if (arguments.length == 2 && typeof (args) == "object") {
            len = args.length;
            for (var i = 0; i < len; i++) {
                if (args[i] != undefined) {
                    var reg = new RegExp('\\{' + i + '\\}', "gm");
                    result = result.replace(reg, args[i]);
                }
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("\\{" + i + "\\}", "gm");
                    result = result.replace(reg, arguments[i + 1]);
                }
            }
        }
    }
    return result;
}
function GetStringLengthFromUtf8(s) {
    if (!s || typeof (s) != "string") {
        return -1;
    }
    var totalLength = 0;
    var i;
    var charCode;
    for (i = 0; i < s.length; i++) {
        charCode = s.charCodeAt(i);
        if (charCode <= 0x007f) {
            totalLength += 1;
        } else if ((0x0080 <= charCode) && (charCode <= 0x07ff)) {
            totalLength += 2;
        } else if ((0x0800 <= charCode) && (charCode <= 0xffff)) {
            totalLength += 3;
        } else if ((0x10000 <= charCode) && (charCode <= 0x1FFFFF)) {
            totalLength += 4;
        } else if ((0x200000 <= charCode) && (charCode <= 0x3FFFFFF)) {
            totalLength += 5;
        } else if ((0x4000000 <= charCode) && (charCode <= 0x7FFFFFFF)) {
            totalLength += 6;
        }
        else {
            return -2;
        }
    }
    return totalLength;
}
//根据阅读习惯改变当前css
function ChangeCss(css) {
    if (!SN.DATA.RightReadMode) return css;
    else if('float-left' == css) return 'float-right';
    else if ('float-right' == css) return 'float-left';
    else if('text-align-left' == css) return 'text-align-right';
    else if('text-align-right' == css) return 'text-align-left';
    else if('bgdpos-left' == css) return 'bgdpos-right';
    else if('bgdpos-right' == css) return 'bgdpos-left';
    else if('margin-l-usual' == css) return 'margin-r-usual';
    else if('margin-r-usual' == css) return 'margin-l-usual';
    else if('margin-left-4' == css) return 'margin-right-4';
    else if('margin-right-4' == css) return 'margin-left-4';
    else if('arrow-right' == css) return 'arrow-left';
    else if('arrow-left' == css) return 'arrow-right';
    else return css;
}
//根据语言切换css样式，使之适应阅读习惯
SN.DATA.DefaultLang = 'zh';
SN.DATA.RightReadMode = false;
SN.FUNC.LoadDataFile = function (url) {
    var AJAX;
    if (window.XMLHttpRequest) {
        AJAX = new XMLHttpRequest();
    } else {
        AJAX = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (AJAX) {
        AJAX.open("GET", url, false);
        AJAX.setRequestHeader("Content-Type", "text/html;charset=UTF-8");
        AJAX.send();
        if (AJAX.readyState == 4)
            return AJAX.responseText;
        return false;
    } else {
        return false;
    }
};
SN.FUNC.LoadLanguageData = function (lang) {
    var url = "../Data/" + lang + "_lang.dat";
    var data = '';

    data = SN.FUNC.LoadDataFile(url);
    if ('' == data || '<html><body>No such URL here</body></html>' == data) {
        return ;
    } else if (data != false) {
        eval(data);
    }
};
SN.FUNC.ChangeReadModeCss = function() {
    var lang = '';
    if (navigator.systemLanguage != undefined)
        SN.DATA.DefaultLang = navigator.systemLanguage;
    else if (navigator.language != undefined)
        SN.DATA.DefaultLang = navigator.language;
    else if (navigator.browserLanguage != undefined)
        SN.DATA.DefaultLang = navigator.browserLanguage;

    if(SN.DATA.DefaultLang == "zh-tw" || SN.DATA.DefaultLang == "zh-TW")
        SN.DATA.DefaultLang = "tw";
    else if(SN.DATA.DefaultLang == "no" || SN.DATA.DefaultLang == "nn"
            || SN.DATA.DefaultLang == "nb")
        SN.DATA.DefaultLang = "no";
    else
        SN.DATA.DefaultLang = SN.DATA.DefaultLang.split('-')[0];
    lang = SN.Cookie.Get("lang", SN.DATA.DefaultLang);

    for(var i=0; i < SN.DATA.LanguageList.length; i++) {
        if (lang == SN.DATA.LanguageList[i][1]) {
            break;
        } else if (i == SN.DATA.LanguageList.length - 1) {
            lang = 'en';
        }
    }

    if ('ar' == lang || 'he' == lang) {
        SN.DATA.RightReadMode = true;
        document.dir = "rtl";
    } else {
        SN.DATA.RightReadMode = false;
        if(undefined == lang || '' == lang)
            lang == 'en';
    }

    //切换相关css
    $('#id_index_tree').addClass(ChangeCss('float-left'));
    $('.index-content-src').addClass(ChangeCss('float-left'));
    $('.content-tips').addClass(ChangeCss('float-left'));
    $('.idx-logo-img').addClass(ChangeCss('bgdpos-left'));
    $('.top-url').addClass(ChangeCss('bgdpos-left'));
    $('.title').addClass(ChangeCss('bgdpos-left'));
    $('.index-copyright').addClass(ChangeCss('text-align-right'));

    SN.FUNC.LoadOmDB();
    SN.FUNC.LoadWifiOmDB();
    GetStatusModule();

    SN.FUNC.LoadLanguageData(lang);
};
//创建语言选择下拉框
SN.FUNC.LanguageSelect = function(list) {
    var select = document.createElement("select");
    if(CheckProductID(11))
        var list = SN.DATA.LanguageList_21;
    else
        var list = SN.DATA.LanguageList;
    var content = '';

    for (var i = 0; i < list.length; i++) {
        var op = document.createElement("option");
        if (list[i].length && list[i].length >= 2) {
            op.value = list[i][1];
            op.innerHTML = list[i][0];
        } else {
            op.innerHTML = list[i];
            op.value = list[i];
        }
        select.appendChild(op);
    }

    content = '<select id="id_lang_select">' + select.innerHTML + '</select>';

    return content;
};
//显示或隐藏错误信息
SN.FUNC.ShowErrorInfo = function(name, errHtml, hide)
{
    var sp = $("#" + name + "_err")[0];
    errHtml = ReplaceHtmlEntities(errHtml);
    if (undefined == hide || null == hide)
        hide = false;

    if (sp && hide) {
        sp.innerHTML = "";
        //$(sp).css("visibility", "hidden");
    } else if(sp) {
        sp.innerHTML = errHtml;
        //$(sp).css("visibility", "visible");
    }
}
//检查设置值的长度是否符合
//target: 被检测对象
//id: 被检测对象id
SN.FUNC.CheckOmValueLen = function(target, id)
{
    var value = target.value;
    var result = true;
    var len = null;
    var errHtml = '';
    var maxlen = target.attributes["maxLength"];

    len = maxlen ? parseInt(maxlen.value, 10) : -1;
    if (len && value.length > len) {
        errHtml = StringFormat(SN.INFO.ErrMaxLength, len);
        result = false;
    } else {
        len = 0;
        switch(id) {
            case SN.ID.omSMTPUserPassword:
            //取消管理员密码的最小密码位数限制
            //case SN.ID.omAdminPass:
            //case SN.ID.omAdminPass1:
            //case SN.ID.omAdminPass2:
            case SN.ID.omAirprintPassword:
                len = 6;    //最小长度6
                break;
            case SN.ID.omCertificateKey:
                len = 4;    //最小长度4
                break;
            case SN.ID.wifiStaWPAPassword:
            case SN.ID.wifiUapWPAPassword:
            case SN.ID.wifiWfdPassword:
            case SN.ID.omSnmpV3auth:
            case SN.ID.omSnmpV3priv:
                len = 8;    //最小长度8
                break;
            case SN.ID.wifiWepCurKeyValue:
                len = 1;    //最小长度1
                break;
            case SN.ID.omCertCountry:
                len = 2;
                break;
            case SN.ID.omNetContactSearchTest:
                len = 3;
                break;
            default:
                break;
        }

        if(len > 0) {
            if (len && value.length < len) {
                errHtml = StringFormat(SN.INFO.ErrMinLength, len);
                result = false;
            } else if (id == SN.ID.wifiWepCurKeyValue) {
                if (value.length != 5 && value.length != 10
                    && value.length != 13 && value.length != 26) {
                    errHtml = SN.INFO.ErrWepPasswordLen;
                    result = false;
                }
            }
            else if((id == SN.ID.omSnmpV3auth || id == SN.ID.omSnmpV3priv)
                && (PasswordChangeFlag == 1)) 
            {
                if(CheckPasswordStrength(target.value) == 1){
                    errHtml = SN.INFO.ErrLowStrength;
                    result = false;
                }
            }
        }
    }
    SN.FUNC.ShowErrorInfo(target.name, errHtml, result);

    return result;
}
//检查输入框的值
//patten: 检查准则(正则表达式)
//err: 如出错，要显示的错误信息
//exclude: 是否为反向匹配(匹配到了，报错)标志
SN.FUNC.CheckOmValue = function(target, patten, err, exclude) {
    var value = target.value;
    var result = true;

    if (undefined == exclude || null == exclude)
        exclude = false;

    result = patten.test(value);
    if (exclude) {
        result = !result;
    }
    SN.FUNC.ShowErrorInfo(target.name, err, result);

    return result;
};
//检查DomainName
SN.FUNC.CheckDomainName = function(target) {
    var value = target.value;
    var errHtml = '';
    var result = true;
    var hArray = value.split(".");

    //Each label must be between 1 and 63 characters long
    for (var i = 0; i < hArray.length; i++) {
        if (hArray[i].length < 1) {// || hArray[i].length > 63)//最大长度为63

            errHtml = SN.INFO.ErrDomainNameLength;
            result = false;
            break;
        }

        var patten = /^[-]|[-]$/;
        result = patten.test(hArray[i]);
        if (result) {
            errHtml = SN.INFO.ErrStartorenLetter;
            result = false;
            break;
        }

        //hostname's labels may contain only the ASCII letter , digits, and the hyphen
        patten = /[^a-zA-Z0-9\-]+/;
        result = patten.test(hArray[i]);
        if (result) {
            errHtml = SN.INFO.ErrDomainNameLetters;
            result = false;
            break;
        }
        result = !result;
    }
    SN.FUNC.ShowErrorInfo(target.name, errHtml, result);

    return result;
};
//检查是否为IPv4地址格式
SN.DATA.CKIPPart = [
[256, 256, 256, 256],   //ipv4 address
[256, 256, 256, 256],   //subnet mask
[256, 256, 256, 256],   //gate way
[0, 0, 0, 0]            //check pass flag
];
SN.FUNC.CheckIpv4Format = function(idx, ipaddr) {
    var pattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    var result = true;

    if (idx < 0 || idx >= SN.DATA.CKIPPart.length - 1) {
        return result;
    }
    result = pattern.test(ipaddr);//a.b.c.d
    if (result) {
        SN.DATA.CKIPPart[idx][0] = parseInt(RegExp.$1, 10);
        SN.DATA.CKIPPart[idx][1] = parseInt(RegExp.$2, 10);
        SN.DATA.CKIPPart[idx][2] = parseInt(RegExp.$3, 10);
        SN.DATA.CKIPPart[idx][3] = parseInt(RegExp.$4, 10);
        if (SN.DATA.CKIPPart[idx][0] > 255 || SN.DATA.CKIPPart[idx][1] > 255
            || SN.DATA.CKIPPart[idx][2] > 255 || SN.DATA.CKIPPart[idx][3] > 255) {
            result = false;
        }
    }
    SN.DATA.CKIPPart[3][idx] = result ? 1 : -1;
    return result;
}
SN.FUNC.CheckIpv4Mask = function(isWifi) {
    var result = true, ipaddr, subnet;
    if (SN.DATA.CKIPPart[3][0] < 0 || SN.DATA.CKIPPart[3][1] < 0) {
        return result;
    }
    if (isWifi) {
        ipaddr = $("[name=wifiStaIpAddr]")[0];
        SN.FUNC.CheckIpv4Format(0, ipaddr.value);
        subnet = $("[name=wifiIPv4SubnetMask]")[0];
        SN.FUNC.CheckIpv4Format(1, subnet.value);
    } else {
        ipaddr = $("[name=omIPv4Address]")[0];
        SN.FUNC.CheckIpv4Format(0, ipaddr.value);
        subnet = $("[name=omIPv4SubnetMask]")[0];
        SN.FUNC.CheckIpv4Format(1, subnet.value);
    }
    if (0 == SN.DATA.CKIPPart[3][0])
        SN.FUNC.CheckIpv4Format(0, ipaddr.value);
    if (0 == SN.DATA.CKIPPart[3][1])
        SN.FUNC.CheckIpv4Format(1, subnet.value);
    if (SN.DATA.CKIPPart[3][0] && SN.DATA.CKIPPart[3][1]) {
        var allmask = true, allzero = true, mask, tmp;
        for (var i = 0; i < SN.DATA.CKIPPart[1].length; i++) {
            mask = ((~SN.DATA.CKIPPart[1][i]) & 255);
            tmp = SN.DATA.CKIPPart[0][i] & mask;
            allzero = (allzero && 0 == tmp) ? true : false;
            allmask = (allmask && mask == tmp) ? true : false;
        }
        result = !(allzero || allmask);
    }
    if(ipaddr.value.length == 0)
        SN.FUNC.ShowErrorInfo(ipaddr.name, SN.INFO.ErrFieldRequired);
    else
        SN.FUNC.ShowErrorInfo(ipaddr.name, SN.INFO.ErrIPv4Address, result);

    return result;
}
//检查是否为有效IP地址
SN.FUNC.CheckIpv4Address = function(target, id) {
    var value = target.value;
    var result = true;
    var errHtml = '';

    result = SN.FUNC.CheckIpv4Format(0, value);
    if (!result) {
        errHtml = SN.INFO.ErrIPv4Format;
    } else {
        if ('127.0.0.1' == value || '0.0.0.0' == value
             || '255.255.255.255' == value || SN.DATA.CKIPPart[0][3] == 0) {
            errHtml = SN.INFO.ErrIPv4Address;
            result = false;
        } else {
            //IP地址第一位不允许大于223，不可以为0
            var pattern = /^(0|22[4-9]|23[0-9]|24[0-9]|25[0-5])/;
            result = pattern.test(value);
            if (result) {
                errHtml = SN.INFO.ErrIPv4Address;
            }
            result = !result;
        }
        SN.DATA.CKIPPart[3][0] = result ? 1 : -1;
    }
    SN.FUNC.ShowErrorInfo(target.name, errHtml, result);
    if (result && (  id == SN.ID.wifiStaIpAddr
                  || id == SN.ID.omIPv4Address  )) {
        result = SN.FUNC.CheckIpv4Mask(id == SN.ID.wifiStaIpAddr);
    }
    return result;
};
//检查所有符合ASCII码表的字符
SN.FUNC.CheckSharedKey = function(target)
{
    var value = target.value;
    var result = true;
    var errHtml = '';
    
    if(value.includes(' ') || value.includes('"'))
    {
        errHtml = SN.INFO.ErrInputPSK;
        result = false;
        SN.FUNC.ShowErrorInfo(target.name,errHtml,result);

        return result;
    }
    else
    {
        for (let i = 0; i < value.length; i++)
        {
            const charCode = value.charCodeAt(i);
            if ( (charCode < 0) || (charCode > 127))
            {
                errHtml = SN.INFO.ErrInputPSK;
                result = false;
                break;
            }
        }
    }
    
    SN.FUNC.ShowErrorInfo(target.name,errHtml,result);

    return result;
};

//检查是否为有效子网掩码
SN.FUNC.CheckIpv4SubnetMask = function(target, isWifi) {
    var result = true;
    var errHtml = '';

    result = SN.FUNC.CheckIpv4Format(1, target.value);
    if (!result) {
        errHtml = SN.INFO.ErrIPv4Format;
    } else if ((0 == SN.DATA.CKIPPart[1][0])) {
        errHtml = SN.INFO.ErrIPv4SubnetFormat;
        result = false;
    } else if (SN.DATA.CKIPPart[1][3] >= 254) {//最后一个ip段位不允许大于254
        errHtml = SN.INFO.ErrIPv4SubnetLastOctFormat;
        result = false;
    } else {
        var expectZero = false;
        var pattern = /^(255|254|252|248|240|224|192|128|0)$/;
        for (var i = 0; i < SN.DATA.CKIPPart[1].length; i++) {
            if ((SN.DATA.CKIPPart[1][i] != 0) && expectZero) {
                errHtml = SN.INFO.ErrIPv4SubnetFormat;
                result = false;
                break;
            }
            expectZero = (expectZero || SN.DATA.CKIPPart[1][i] != 255) ? true : false;
            result = pattern.test(SN.DATA.CKIPPart[1][i].toString());
            if (!result) {
                errHtml = SN.INFO.ErrIPv4SubnetFormat;
                result = false;
                break;
            }
        }
    }
    SN.DATA.CKIPPart[3][1] = result ? 1 : -1;
    SN.FUNC.ShowErrorInfo(target.name, errHtml, result);
    if (result) {
        SN.FUNC.CheckIpv4Mask(isWifi);
    }
    return result;
};
//检查是否为有效的网关
SN.FUNC.CheckIpv4Gateway = function(target, isWifi) {
    var result = true;
    var errHtml = '';

    result = SN.FUNC.CheckIpv4Format(2, target.value);
    if (!result) {
        errHtml = SN.INFO.ErrIPv4Format;
    } else {
        var ipaddr, subnet;

        if (isWifi) {
            ipaddr = $("[name=wifiStaIpAddr]").val().split(".");
            subnet = $("[name=wifiIPv4SubnetMask]").val().split(".");
        } else {
            ipaddr = $("[name=omIPv4Address]").val().split(".");
            subnet = $("[name=omIPv4SubnetMask]").val().split(".");
        }

        if (ipaddr.length == 4 && subnet.length == 4) {
            var gateway = target.value.split(".");
            var allmask = true, allzero = true;
            for (var i = 0; i < 4; i++) {
                var gatewaytmp = parseInt(gateway[i], 10);
                var subnettmp = parseInt(subnet[i], 10);
                var tmp = (parseInt(ipaddr[i], 10) & subnettmp);
                if (tmp != (subnettmp & gatewaytmp)) {
                    errHtml = SN.INFO.ErrUselessGateWay;
                    result = false;
                    break;
                } else {
                    subnettmp = (~subnettmp) & 255;
                    tmp = subnettmp & gatewaytmp;
                    allzero = (allzero && 0 == tmp) ? true : false;
                    allmask = (allmask && subnettmp == tmp) ? true : false;
                }
            }

            if (result && (allmask || allzero)) {
                errHtml = SN.INFO.ErrUselessGateWay;
                result = false;
            }
        } else {
            errHtml = SN.INFO.ErrUselessGateWay;
            result = false;
        }
    }
    SN.FUNC.ShowErrorInfo(target.name, errHtml, result);

    return result;
};

SN.FUNC.CheckMacFormat = function(mac) {
    var pattern = /[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}/;
    var result = true;
    result = pattern.test(mac);
    return result;
}

//检查是否为有效MAC地址
SN.FUNC.CheckMacAddress = function(target) {
    var value = target.value;
    var result = true;
    var errHtml = '';

    if (value) {
        value = value.toString().replace(/-/g, ":");
    }

    result = SN.FUNC.CheckMacFormat(value);
    if(!result)
    {
        errHtml = SN.INFO.ErrMacFormat;
    }
    else
    {
        if ('00:00:00:00:00:00' == value || 'FF:FF:FF:FF:FF:FF' == value.toUpperCase()) {
            errHtml = SN.INFO.ErrMacAddress;
            result = false;
        }

        var list = SN.DATA.omWhiteListContent;
        for (var i = 0; i < list.length; i++) {
            var jsonObj;
            jsonObj = GetJson(list[i]); //获取json对象
            if (undefined == jsonObj) {
                break;
            }
            else if(jsonObj["MAC"].toUpperCase() == value.toUpperCase() && OPT_ROW_NO != i)
            {
                errHtml = SN.INFO.ErrSameMacAddress;
                result = false;
                break;
            }
        }
    }
    SN.FUNC.ShowErrorInfo(target.name, errHtml, result);
    return result;
};

//检查是否为有效字符串
SN.FUNC.CheckAllowChar = function(target) {
    var value = target.value;
    var errHtml = '';
    var result = true;
    var pattern = /[^( -~)]/;

    result = pattern.test(target.value);
    if (!result) {
        pattern = /[<>\\\"]+/;
        result = pattern.test(target.value);
    }

    if (result) {
        errHtml = StringFormat(SN.INFO.ErrNotAllowAsciiList, "<, >, \\, \"");
    }
    result = !result;
    SN.FUNC.ShowErrorInfo(target.name, errHtml, result);

    return result;
};
//检查是否为有效字符串
SN.FUNC.CheckAllowChar_SMB = function(target) {
    var value = target.value;
    var errHtml = '';
    var result = true;
    var pattern = /[^( -~)]/;

    result = pattern.test(target.value);

    if (result) {
        errHtml = StringFormat(SN.INFO.ErrNotAllowAsciiList1, "");
    }
    result = !result;
    SN.FUNC.ShowErrorInfo(target.name, errHtml, result);

    return result;
};

//检查是否为有效字符串
SN.FUNC.CheckAllowChar_ldap = function(target) {
    var value = target.value;
    var errHtml = '';
    var result = true;
    var pattern = /[^( -~)]/;

    result = pattern.test(target.value);
    if (!result) {
        pattern = /[<>\\\"\s]+/;
        result = pattern.test(target.value);
    }

    if (result) {
        errHtml = StringFormat(SN.INFO.ErrLdapNotAllowList, "");
    }
    result = !result;
    SN.FUNC.ShowErrorInfo(target.name, errHtml, result);

    return result;
};

//检查当前webpage语言
//language：判断语言是否一致
function CheckLanguage(language) {
    var lang = SN.Cookie.Get("lang", SN.DATA.DefaultLang);

    if (undefined != language) {
        return (language == lang);
    }
    return (  ('ru' == lang) || ('es' == lang) || ('de' == lang)
           || ('fr' == lang) || ('it' == lang)  );
}
//检查是否为有效数字
//isFloat: 是否为浮点数
SN.FUNC.CheckNumber = function (target, min, max, isFloat) {
    var value = target.value;
    var errHtml = '';
    var result = true;
    var patten = null;
    var valTmp = null;
    var flag = CheckLanguage();

    if (isFloat) {
        if (flag) {
            patten = /^(-|)([0-9]+[,]?)?[0-9]+$/;
        } else {
            patten = /^(-|)([0-9]+[.]?)?[0-9]+$/;
        }
        result = patten.test(value);
        if (result) {
            var saveval = 'abc';
            saveval += value;
            saveval = saveval.replace(/abc/g, "");
            if (flag) {
                valTmp = value.replace(/,/g, ".");
                value = parseFloat(valTmp, 16);
                //valTmp = value.toString();
                //valTmp = valTmp.replace(/(\.)/g, ",");
            } else {
                valTmp = parseFloat(value, 16);
                value = valTmp;
            }
            target.value = saveval;
        } else {
            errHtml = SN.INFO.ErrNumberNaN;
        }
    } else {
        patten = /^(-|)[0-9]+$/;
        result = patten.test(value);
        if (result) {
            valTmp = parseInt(value, 10);
            value = valTmp;
            target.value = valTmp;
        } else {
            errHtml = SN.INFO.ErrNumberInteger;
        }
    }

    if (result) {
        if (min != undefined && value < min) {
            errHtml = StringFormat(SN.INFO.ErrNumberLessThen, (!flag) ? min : min.toString().replace(/(\.)/g, ","));
            result = false;
        } else if (max != undefined && value > max) {
            errHtml = StringFormat(SN.INFO.ErrNumberBiggerThen, (!flag) ? max : max.toString().replace(/(\.)/g, ","));
            result = false;
        }
    }
    SN.FUNC.ShowErrorInfo(target.name, errHtml, result);

    return result;
}
//检查Email地址
SN.FUNC.CheckEmailAddress = function(target, id) {
    var value = target.value;
    var errHtml = '';
    var result = true;
    var pattern = /[^(A-Za-z0-9@\._\-)]/;

    result = pattern.test(value);
    result = !result;
    if (result) {
        result = !(    (value.indexOf("..") >= 0) || (value.indexOf(".-") >= 0) || (value.indexOf("._") >= 0)
                    || (value.indexOf("--") >= 0) || (value.indexOf("-.") >= 0) || (value.indexOf("-_") >= 0)
                    || (value.indexOf("__") >= 0) || (value.indexOf("_.") >= 0) || (value.indexOf("_-") >= 0)   );
        if (result) {
            var hArray = value.split("@");
            if(1 == hArray.length) {
                if (id == SN.ID.omSMTPUserName) {
                    patten = /^([A-Za-z0-9][\._\-]?)*[A-Za-z0-9]$/;
                    result = patten.test(value);
                } else {
                    result = false;
                }
            } else if (2 == hArray.length) {
                patten = /^([A-Za-z0-9][\._\-]?)*[A-Za-z0-9]@[A-Za-z0-9]([\._\-]?[A-Za-z0-9])*\.[A-Za-z]{2,5}$/;
                result = patten.test(value);
            } else {
                result = false;
            }
        }

        if (!result) {
            errHtml = SN.INFO.ErrEmailAddress;
        }
    } else {
        errHtml = SN.INFO.ErrDomainNameLetters + ", @, _";
    }

    SN.FUNC.ShowErrorInfo(target.name, errHtml, result);

    return result;
};
//检查时间YYYYMMDDhhmmss
SN.FUNC.CheckYmdtTime = function (ymdt) {
    var year = parseInt(ymdt.substring(0, 4), 10);
    var month = parseInt(ymdt.substring(4, 6), 10);
    var day = parseInt(ymdt.substring(6, 8), 10);
    var hour = parseInt(ymdt.substring(8, 10), 10);
    var minute = parseInt(ymdt.substring(10, 12), 10);
    var second = parseInt(ymdt.substring(12, 14), 10);
    var leap = ((year%4) == 0 && (year%400 == 0 || year%100 != 0));
    var fullyear = [31, (true == leap) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var ret = false;

    ret = (year >= 1970 && month > 0 && month <= 12 && day > 0 && day <= fullyear[month - 1]
        && hour >= 0 && hour < 24 && minute >= 0 && minute < 60 && second >= 0 && second < 60);
    if (ret) {
        SN.DATA.TimeData = new Date();
        SN.DATA.TimeData.setFullYear(year, month - 1, day);
        SN.DATA.TimeData.setHours(hour);
        SN.DATA.TimeData.setMinutes(minute);
        SN.DATA.TimeData.setSeconds(second);

        SN.DATA.CertNumDays = (leap && month > 0 && month < 3) ? 366 : 365;
        for (var i= year + 1; i < year + 5; i++) {
            leap = ((i%4) == 0 && (i%400 == 0 || i%100 != 0));
            SN.DATA.CertNumDays += (leap ? 366 : 365);
        }
    }

    return ret;
}
//检查日期
SN.FUNC.CheckDateymd = function (ymdt,id) {
    var year;
    var month;
    var day;
    var ret = false;
    switch(id)
    {
        //设置日期（YYYY-MM-DD）
        case SN.ID.omDate:
            year = parseInt(ymdt.substring(0, 4), 10);
            month = parseInt(ymdt.substring(5, 7), 10);
            day = parseInt(ymdt.substring(8, 10), 10);
            break;

        default:
            break;
    }

    leap = ((year%4) == 0 && (year%400 == 0 || year%100 != 0));
    fullyear = [31, (true == leap) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    ret = (year >= 1970 && month > 0 && month <= 12 && day > 0 && day <= fullyear[month - 1]);
    if (ret) {
        SN.DATA.TimeData = new Date();
        SN.DATA.TimeData.setFullYear(year, month - 1, day);

        SN.DATA.CertNumDays = (leap && month > 0 && month < 3) ? 366 : 365;
        for (var i= year + 1; i < year + 5; i++) {
            leap = ((i%4) == 0 && (i%400 == 0 || i%100 != 0));
            SN.DATA.CertNumDays += (leap ? 366 : 365);
        }
    }

    return ret;
}

//##########检查时间
SN.FUNC.CheckTimehms = function (ymdt,id) {
    var hour;
    var minute;
    var second;
    var ret = false;

    switch(id)
    {
        case SN.ID.omTime:
            hour = parseInt(ymdt.substring(0, 2), 8);
            minute = parseInt(ymdt.substring(3, 5), 8);
            second = parseInt(ymdt.substring(6, 8), 8);
            break;
    }

    ret = (hour >= 0 && hour < 24 && minute >= 0 && minute < 60 && second >= 0 && second < 60);

    if (ret) {
        SN.DATA.TimeData = new Date();
        SN.DATA.TimeData.setHours(hour);
        SN.DATA.TimeData.setMinutes(minute);
        SN.DATA.TimeData.setSeconds(second);

    }

    return ret;
}

//检查路径格式
SN.FUNC.CheckFilePath = function(target, id) {
    var value = target.value;
    var errHtml = '';
    var result = true;
    //var pattern = /[^( -~)]/;

    if (id == SN.ID.omFtpServerPath){
        if(target.value.charAt(0) != '/') {
            errHtml = SN.INFO.ErrFtpStartSymbol;
            result = false;
        }else {
            var pattern = /[\\:*?\"<>\|]+/;
            result = !pattern.test(value);
            if(!result) {
                errHtml = StringFormat(SN.INFO.ErrFtpAddrLetters, ":, *, ?, \", <, >, |");
            }
        }
    } else if(id == SN.ID.omSmbServerPath) {
        if(target.value.charAt(0) != '/' && target.value.charAt(0) != '\\') {
            errHtml = SN.INFO.ErrSmbStartSymbol;
            result = false;
        }else{
            var pattern = /[:*?\"<>\|]+/;
            result = !pattern.test(value);
            if(!result) {
                errHtml = StringFormat(SN.INFO.ErrSmbAddrLetters, ":, *, ?, \", <, >, |");
            }
        }
    }
    if (result) {
        if (value.indexOf("//") > 0){
            errHtml = SN.INFO.ErrUselessPath;
            result = false;
        }
    }
    SN.FUNC.ShowErrorInfo(target.name, errHtml, result);

    return result;
}
//检测设置的属性是否有已存在冲突
SN.FUNC.CheckExist = function (list, opt, target, info, idx) {
    var ret = false, errHtml = '';
    var val = target.value;

    for (var i = 0; i < list.length; i++) {
        var jsonObj;
        jsonObj = GetJson(list[i]); //获取json对象
        if (undefined == jsonObj || undefined == jsonObj[opt]) {
            continue;
        }
        if(idx == i) {
            continue;
        }

        if (opt == "speed" && val.length < 3) {
            val = ((1 == val.length) ? "00" : "0") + val;
        }
        if(val.length == jsonObj[opt].length && val.toLowerCase() === jsonObj[opt].toLowerCase()) {
            errHtml = StringFormat(SN.DATA.ErrOmValExist, info ? info : "", jsonObj[opt]);
            ret = true;
            break;
        }
    }

    SN.FUNC.ShowErrorInfo(target.name, errHtml, !ret);
    return ret;
}

//检查输入值长度
SN.FUNC.CheckZhlength = function (target, id) {
    var i = 0, j = 0;
    var errHtml = '';
    var s = target.value;
    var maxlen = 0;
    var ret = true;

    switch(id)
    {
        case SN.ID.wifiStaSSID:
            maxlen = 32;
            break;
        case SN.ID.omNetUserGroupsID:
            maxlen = 185;
            break;
        case SN.ID.omNetUserGroupsName:
            maxlen = 63;
            break;
        case SN.ID.omLdapSearchroot:
        case SN.ID.omNetContactSearchroot:
        case SN.ID.omNetContactUser:
        case SN.ID.omSmbServerPath:
        case SN.ID.omFtpServerPath:
            maxlen = 255;
            break;
        case SN.ID.omEmailUser:
            maxlen = 40;
            break;
        case SN.ID.omSmbServerName:
        case SN.ID.omFtpServerName:
            maxlen = 135;
            break;
        case SN.ID.omSMTPSubject:
        case SN.ID.omScanToEmailSubject:
            maxlen = 78;
            break;
        case SN.ID.omScanToEmailBody:
            maxlen = 511;
            break;
        case SN.ID.omScanArgName:
        case SN.ID.omScanArgFileNamePrefix:
            maxlen = 31;
            break;
    }
    var strlen = GetStringLengthFromUtf8(s);
    if(strlen > maxlen)
    {
        errHtml = StringFormat(SN.INFO.ErrMaxLengthSize, maxlen);
        ret = false;
    }
    if (ret && id == SN.ID.wifiStaSSID) {
        if (SN.DATA.wifiStaSSID.value == target.value) {
            ret = true;
        }else if (target.value == SN.DATA.wifiSsidPrefix.value
                               + SN.DATA.wifiUapSSID.value) {
            errHtml = SN.INFO.PageSsidConflict;
            ret = false;
        }
    }
    SN.FUNC.ShowErrorInfo(target.name, errHtml, ret);
    return ret
}
//检查子网掩码通用接口
SN.FUNC.isValidSubnetMask = function (target) 
{
    var mask = target.value;
    const parts = mask.split('.');
    
    if (parts.length !== 4) {
        return false;
    }

    if(mask === "0.0.0.0") {
        return false;
    }

    let seenNon255 = false;

    for (let part of parts) 
    {
        const num = parseInt(part, 10);
        
        if (isNaN(num) || num < 0 || num > 255)
        {
            return false;
        }
        
        if (!seenNon255 && num !== 255) 
        {
            seenNon255 = true;
        } 
        else if (seenNon255 && num !== 0)
        {
            return false;
        }
        
        if ([255, 254, 252, 248, 240, 224, 192, 128, 0].indexOf(num) === -1) {
            return false;
        }
    }

    return true;
}

//检查输入值
SN.FUNC.CheckInput = function(target) {
    if (  undefined == target || null == target
       || undefined == target.attributes
       || undefined == target.attributes["check"]  )
        return true;

    var ret = true;
    var tmp = null;
    var id = parseInt(target.attributes["check"].value, 10);

    //检查为空，返回处理(为空则报错)
    if (0 == target.value.length) {
        switch(id) {
            //必填字段
            case SN.ID.omHostName:
            case SN.ID.omAdminUser:
            //case SN.ID.omAdminPass:
            case SN.ID.wifiStaSSID:
            case SN.ID.wifiUapSSID:
            case SN.ID.wifiWfdUapSSID:
            case SN.ID.wifiStaWPAPassword:
            case SN.ID.wifiWepCurKeyValue:
            case SN.ID.wifiUapWPAPassword:
            case SN.ID.wifiWfdPassword:
            case SN.ID.omBonjourName:
            case SN.ID.omSMTPServerAddress:
            case SN.ID.omSMTPAddress:
            case SN.ID.omSMTPPort:
            case SN.ID.omSMTPEmailAddr:
            case SN.ID.omSMTPUserName:
            case SN.ID.omSMTPUserPassword:
            case SN.ID.omSnmpComv1:
            case SN.ID.omSnmpComv2c:
            case SN.ID.omSnmpComv3:
            case SN.ID.omSnmpV3user:
            case SN.ID.omSnmpV3auth:
            case SN.ID.omSnmpV3priv:
            case SN.ID.omAirprintName:
            case SN.ID.omAirprintPassword:
            case SN.ID.omEmailUser:
            case SN.ID.omGroupName:
            case SN.ID.omPhoneSpeed:
            case SN.ID.omPhoneUser:
            case SN.ID.omPhoneNumber:
            case SN.ID.omEmailAddress:
            case SN.ID.omSMTPClientAddress1:
            case SN.ID.omSMTPClientAddress2:
            case SN.ID.omSMTPClientAddress3:
            case SN.ID.omSMTPClientAddress4:
            case SN.ID.omUsercopies:
            case SN.ID.omUserfontpitch:
            case SN.ID.omUserfontheight:
            case SN.ID.omUservmi:
            case SN.ID.omUserLeftMargin:
            case SN.ID.omUserRightMargin:
            case SN.ID.omUserOffsetX:
            case SN.ID.omUserOffsetY:
            case SN.ID.omIPv4SubnetMask:
            case SN.ID.wifiIPv4SubnetMask:
            //case SN.ID.omIPv4GatewayAddress://本地局域网中， 网关可不填写
            //case SN.ID.wifiIPv4GatewayAddress:
            case SN.ID.omCertCommonName:
            case SN.ID.omCertOrganization:
            case SN.ID.omCertOrgUnit:
            case SN.ID.omCertCity:
            case SN.ID.omCertState:
            case SN.ID.omCertCountry:
            case SN.ID.omCertCurrentDate:
            case SN.ID.omCertNumDaysValid:
            case SN.ID.omJobTimeOut:
            case SN.ID.omIPv4Address:
            case SN.ID.wifiStaIpAddr:
            case SN.ID.omSmbServerAddr:
            case SN.ID.omSmbServerPath:
            case SN.ID.omSmbServerName:
            case SN.ID.omSmbServerUser:
            //case SN.ID.omSmbServerPswd:
            // case SN.ID.omSmbServerPort:

            case SN.ID.omFtpServerAddr:
            case SN.ID.omFtpServerPath:
            case SN.ID.omFtpServerName:
            case SN.ID.omFtpServerUser:
            //case SN.ID.omFtpServerPswd: 可以不输入密码
            case SN.ID.omFtpServerPort:
            case SN.ID.omProxyServer:
            case SN.ID.omProxyPort:
            case SN.ID.omProxyName:
            case SN.ID.omProxyPassword:
            case SN.ID.omLdapServerAddr:
            case SN.ID.omLdapServerPort:
            case SN.ID.omLdapAuthDeviceUser:
            case SN.ID.omLdapSearchroot:
            case SN.ID.omLdapMatchName:
            case SN.ID.omLdapRetrieveEmail:
            case SN.ID.omLdapRetrieveUser:
            case SN.ID.omLdapRetrieveGroup:
            case SN.ID.omWindowsMatchName:
            case SN.ID.omWindowsRetrieveEmail:
            case SN.ID.omWindowsRetrieveUser:
            case SN.ID.omWindowsRetrieveGroup:
            case SN.ID.omPanelTimeOut:
            case SN.ID.omNetUserGroupsID:
            case SN.ID.omNetUserGroupsName:
            case SN.ID.omSNTPAddress:
            case SN.ID.omSNTPPort:
            case SN.ID.omNetContactUser:
            case SN.ID.omNetContactSearchroot:
            case SN.ID.omNetContactLdapAddr:
            case SN.ID.omNetContactPort:
            case SN.ID.omNetContactDomain:
            case SN.ID.omNetContactRecipientName:
            case SN.ID.omNetContactFullName:
            case SN.ID.omNetContactPswd:
            case SN.ID.omNetContactRecipientEmail:
            case SN.ID.omNetContactMaxEmailNum:
            case SN.ID.omNetContactTimeOut:
            case SN.ID.wifiEapUsername:
            case SN.ID.CertHash:
            case SN.ID.omScanArgName:
            case SN.ID.omNetPortName:
            case SN.ID.omNetPortNo:
            case SN.ID.wifiEapUsername:
            //case SN.ID.omWhiteListIP:	网络白名单不强制输入IP地址
            case SN.ID.omWhiteListMAC:
            case SN.ID.omIpsecIPv4:
            case SN.ID.omIpsecSharedKey:
            case SN.ID.omIPFilterListIP:
            case SN.ID.omIPFilterListMASK:

               ret = false;
               break;
            case SN.ID.om8021XUserName:  //客户需求802.1X可以不输入用户名密码
            case SN.ID.om8021XUserPassword:
               ret = true;
               break;
            case SN.ID.om8021XUserPassword2:
               if(!$("[name = om8021XWiredStatus]").prop("checked"))
                   break;
                var om8021XPassword = $("[name=om8021XUserPassword]").val();
                if(om8021XPassword != SN.DATA.om8021XUserPassword.value && om8021XPassword.length > 0)
                    ret = false;
                else
                    ret = true;
                break;
            case SN.ID.wifiEapPassword:
                if($("[name = wifiEapMethod]").value == 2)
                    ret = true;
                else
                    ret = false;
                break;
            default:
                break;
        }
        SN.FUNC.ShowErrorInfo(target.name, SN.INFO.ErrFieldRequired, ret);

        return ret;
    }

    switch(id) {
        //SN.TYPE.InputText
        case SN.ID.omDomainName:
            ret = SN.FUNC.CheckOmValueLen(target, id);
            if (ret) {
                ret = SN.FUNC.CheckDomainName(target);
            }
            break;
        case SN.ID.omSMTPPort:
        // case SN.ID.omSmbServerPort:
        case SN.ID.omFtpServerPort:
        case SN.ID.omSNTPPort:
        case SN.ID.omProxyPort:
        case SN.ID.omLdapServerPort:
        case SN.ID.omNetContactPort:
        case SN.ID.omNetPortNo:
            ret = SN.FUNC.CheckOmValueLen(target, id);
            if(ret) {
                //var patten = /^[1-9]\d{0,3}$|^[1-5]\d{4}$|^6[0-4]\d{3}$|^65[0-4]\d{2}$|^655[0-2]\d{1}$|6553[0-5]$/;
                //ret = SN.FUNC.CheckOmValue(target, patten, SN.INFO.ErrPort, false);
                var patten = /^(-|)[0-9]+$/;
                ret = patten.test(target.value);
                if (ret) {
                    var valTmp = parseInt(target.value, 10);
                    target.value = valTmp;
                    if (valTmp < 1 || valTmp > 65535)
                        ret = false;
                }
                SN.FUNC.ShowErrorInfo(target.name, SN.INFO.ErrPort, ret);
            }
            break;
        case SN.ID.omHostName:
        case SN.ID.omSnmpComv1:
        case SN.ID.omSnmpComv2c:
        case SN.ID.omSnmpComv3:
            ret = SN.FUNC.CheckOmValueLen(target, id);
            if (ret) {
                var patten = null;

                if (id == SN.ID.omHostName) {
                    patten = /^[0-9]+$/;
                    ret = SN.FUNC.CheckOmValue(target, patten, SN.INFO.ErrAllowNumber, true);
                    if (ret) {
                        patten = /^[-]|[-]$/;
                        ret = SN.FUNC.CheckOmValue(target, patten, SN.INFO.ErrStartorenLetter, true);
                    }
                }

                if(ret) {
                    patten = /[^a-zA-Z0-9\-]+/;
                    ret = SN.FUNC.CheckOmValue(target, patten, SN.INFO.ErrUsualText, true);
                }
            }
            break;
        case SN.ID.omSnmpV3user:
            ret = SN.FUNC.CheckOmValueLen(target,id);
            if (ret) {
                patten = /[^a-zA-Z0-9\-\_]+/;
                ret = SN.FUNC.CheckOmValue(target,patten,SN.INFO.ErrUsualText,true);
            }
            break;
        case SN.ID.wifiWfdUapSSID:
            ret = SN.FUNC.CheckOmValueLen(target, id);
            if (ret) {
                var patten = null;

                //支持输入空格，不能使用\s*，会出现可以输入星号(*)
                patten = /[^a-zA-Z0-9\-\s]+/;
                ret = SN.FUNC.CheckOmValue(target, patten, SN.INFO.ErrWiFiWfdUapSSID, true);
            }
            break;
        case SN.ID.wifiStaSSID:
             if(SN.Cookie.Get("lang", SN.DATA.DefaultLang) == "zh"){
                 ret = SN.FUNC.CheckZhlength(target,id);
              }else{
                ret = SN.FUNC.CheckOmValueLen(target, id);
            }
            break;
        case SN.ID.omLdapSearchroot:
        case SN.ID.omNetUserGroupsID:
        case SN.ID.omNetUserGroupsName:
        case SN.ID.omSMTPSubject:
        case SN.ID.omSmbServerName:
        case SN.ID.omFtpServerName:
        case SN.ID.omNetContactUser:
        case SN.ID.omNetContactSearchroot:
        case SN.ID.omScanArgName:
            ret = SN.FUNC.CheckZhlength(target,id);
            break;
        case SN.ID.omEmailUser:
            ret = SN.FUNC.CheckZhlength(target,id);
            if (ret) {
                pattern = /[<>\\\"]+/;
                ret = pattern.test(target.value);
                if (ret)
                    SN.FUNC.ShowErrorInfo(target.name, StringFormat(SN.INFO.ErrNotAllowList, "<, >, \\, \""));
                ret = !ret;
            }
            break;
        case SN.ID.omSmbServerPath:
        case SN.ID.omFtpServerPath:
            ret = SN.FUNC.CheckZhlength(target,id);
            if (ret) {
                ret = SN.FUNC.CheckFilePath(target, id);
            }
            break;
        case SN.ID.omCertCountry:
        case SN.ID.wifiUapSSID:
        case SN.ID.omNetPortName:
            ret = SN.FUNC.CheckOmValueLen(target, id);
            if (ret) {
                var patten = /[^a-zA-Z0-9]+/;
                ret = SN.FUNC.CheckOmValue(target, patten, SN.INFO.ErrLetterNumber, true);
            }
            break;
        case SN.ID.omSmbServerAddr:
        case SN.ID.omFtpServerAddr:
        case SN.ID.omSNTPAddress:
        case SN.ID.omSMTPAddress:
        case SN.ID.omLdapServerAddr:
        case SN.ID.omNetContactLdapAddr:
            ret = SN.FUNC.CheckOmValueLen(target, id);
            if (ret) {
                //var patten = /^(\d{1,})\.(\d{1,})\.(\d{1,})\.(\d{1,})$/;
                var patten = /^(\d{1,})(\.(\d{1,})){0,}$/;
                if (patten.test(target.value)) {
                    ret = SN.FUNC.CheckIpv4Address(target);
                } else {
                    ret = SN.FUNC.CheckDomainName(target);
                }
            }
            break;
        case SN.ID.omCertCommonName:
        case SN.ID.omCertOrganization:
        case SN.ID.omCertOrgUnit:
        case SN.ID.omCertCity:
        case SN.ID.omCertState:
        case SN.ID.omAdminUser:
        case SN.ID.omBonjourName:
        case SN.ID.om8021XUserName:
        case SN.ID.om8021XServerID:
        case SN.ID.om8021XAnonymousID:
        case SN.ID.omPhoneUser:
        case SN.ID.omGroupName:
        case SN.ID.omAirprintName:
        case SN.ID.omPropertyNumber:
        case SN.ID.omSmbServerName:
        case SN.ID.omSmbServerUser:
        case SN.ID.omFtpServerName:
        case SN.ID.omFtpServerUser:
        case SN.ID.omProxyName:
        case SN.ID.omProxyPassword:
        case SN.ID.omLdapServerUser:
        case SN.ID.omWindowsLoginUser:
        case SN.ID.omWindowsDomain1:
        case SN.ID.omWindowsDomain2:
        case SN.ID.omWindowsDomain3:
        case SN.ID.omWindowsDomain4:
        case SN.ID.omWindowsDomain5:
        case SN.ID.omWindowsDomain6:
        case SN.ID.omWindowsDomain7:
        case SN.ID.omWindowsDomain8:
        case SN.ID.omWindowsDomain9:
        case SN.ID.omWindowsDomain10:
        case SN.ID.omNetContactDomain:
        case SN.ID.omCertManagementUser:
        case SN.ID.omCertManagementIssuer:
        case SN.ID.omCertManagementPeriod:
        case SN.ID.omCertManagementType:
        case SN.ID.omCertManagementUse:
            //不允许在此字段中使用:AscII字符以外的符号及{0}
            ret = SN.FUNC.CheckOmValueLen(target, id);
            if (ret) {
                if (id == SN.ID.omBonjourName) {
                    var patten = /^[ ]+$/;
                    ret = patten.test(target.value);
                    if (ret) {
                        SN.FUNC.ShowErrorInfo(target.name, SN.INFO.ErrFieldRequired);
                        ret = false;
                        break;
                    }
                }
                ret = SN.FUNC.CheckAllowChar(target);
            }
            break;
        case SN.ID.omLdapAuthDeviceUser:
        case SN.ID.omLdapMatchName:
        case SN.ID.omLdapRetrieveUser:
        case SN.ID.omLdapRetrieveGroup:
        case SN.ID.omWindowsMatchName:
        case SN.ID.omWindowsRetrieveUser:
        case SN.ID.omWindowsRetrieveGroup:
        case SN.ID.omNetContactRecipientName:
        case SN.ID.omNetContactFullName:
        case SN.ID.omNetContactRecipientEmail:
            //不允许在此字段中使用:AscII字符以外的符号及<>/"空格
            ret = SN.FUNC.CheckOmValueLen(target, id);
            if (ret) {
                ret = SN.FUNC.CheckAllowChar_ldap(target);
            }
            break;
        case SN.ID.omCertCurrentDate:
            ret = SN.FUNC.CheckOmValueLen(target, id);
            if (ret) {
                pattern = /[^0-9]+/;
                ret = SN.FUNC.CheckOmValue(target, pattern, SN.INFO.ExampleCertData, true);
                tmp = target.value;
                ret = ret && (tmp.length == 'YYYYMMDDhhmmss'.length);
                if (ret) {
                    ret = SN.FUNC.CheckYmdtTime(tmp);
                }
                SN.FUNC.ShowErrorInfo(target.name, SN.INFO.ExampleCertData, ret);
            }
            break;
        case SN.ID.omCertNumDaysValid:
            if (undefined == SN.DATA.CertNumDays) {
                SN.DATA.CertNumDays = 1826;
            }
            ret = SN.FUNC.CheckNumber(target, SN.DATA.CertNumDays, 99999, false);
            break;
        case SN.ID.omConsumerPosition:
        case SN.ID.omContactInfo:
            tmp = parseInt(target.attributes["maxLength"].value, 10);
            SN.FUNC.ShowErrorInfo(target.name, "", true);
            if (GetStringLengthFromUtf8(target.value) <= tmp) {
                pattern = /[<>\\\"]+/;
                ret = pattern.test(target.value);
                if (ret)
                    SN.FUNC.ShowErrorInfo(target.name, StringFormat(SN.INFO.ErrNotAllowList, "<, >, \\, \""));
                ret = !ret;
            } else {
                tmp = StringFormat(SN.INFO.ErrMaxLength, tmp);
                SN.FUNC.ShowErrorInfo(target.name, tmp);
                ret = false;
            }
            break;
        case SN.ID.omJobTimeOut:
            ret = SN.FUNC.CheckNumber(target, 30, 300, false);
            break;
        case SN.ID.omUsercopies:
            ret = SN.FUNC.CheckNumber(target, 1, 999, false);
            break;
        case SN.ID.omPhoneSpeed:
            tmp = target.value;
            ret = SN.FUNC.CheckNumber(target, 1, 200, false);
            SN.FUNC.ShowErrorInfo(target.name, SN.INFO.ErrPhoneSpeed, ret);
            if (ret && tmp.length < 3) {
                target.value = ((1 == tmp.length) ? "00" : "0") + tmp;
            }
            target.value = ((!ret || tmp.length >= 3) ? "" :
                            ((1 == tmp.length) ? "00" : "0")) + tmp;
            break;
        case SN.ID.omPhoneNumber:
            ret = SN.FUNC.CheckOmValueLen(target, id);
            if (ret) {
                pattern = /^[0-9*#+\-]+$/;
                ret = SN.FUNC.CheckOmValue(target, pattern, SN.INFO.ErrPhoneNumber);
            }
            break;
        case SN.ID.omSMTPServerAddress:
        case SN.ID.omSMTPUserName:
        case SN.ID.omSMTPEmailAddr:
        case SN.ID.omSMTPClientAddress1:
        case SN.ID.omSMTPClientAddress2:
        case SN.ID.omSMTPClientAddress3:
        case SN.ID.omSMTPClientAddress4:
        case SN.ID.omEmailAddress:
            ret = SN.FUNC.CheckOmValueLen(target, id);
            if (ret) {
                ret = SN.FUNC.CheckEmailAddress(target, id);
            }
            break;
        case SN.ID.omPrinterLatitude:
            ret = SN.FUNC.CheckOmValueLen(target, id);
            if (ret) {
                ret = SN.FUNC.CheckNumber(target, -90, 90, true);
            }
            break;
        case SN.ID.omPrinterLongitude:
            ret = SN.FUNC.CheckOmValueLen(target, id);
            if (ret) {
                ret = SN.FUNC.CheckNumber(target, -180, 180, true);
            }
            break;

        //SN.TYPE.InputPassword
        //case SN.ID.omSMTPUserPassword:
        case SN.ID.omAdminPass:
        case SN.ID.omAdminPass1:
        case SN.ID.omAdminPass2:
        case SN.ID.omAirprintPassword:
        //case SN.ID.omSmbServerPswd:
        case SN.ID.omFtpServerPswd:
        case SN.ID.omSnmpV3auth:
        case SN.ID.omSnmpV3priv:
        case SN.ID.omLdapServerPswd:
        case SN.ID.omWindowsLoginPswd:
        case SN.ID.omPanelPass:
        case SN.ID.omPanelPass1:
        case SN.ID.omPanelPass2:
        case SN.ID.omNetContactPswd:
            ret = SN.FUNC.CheckOmValueLen(target, id);
            if (ret) {
                ret = SN.FUNC.CheckAllowChar(target);
                if (ret && id == SN.ID.omAdminPass2) {
                    var omAdminPass1 = $("[name=omAdminPass1]")[0];
                    if (target.value != omAdminPass1.value) {
                        SN.FUNC.ShowErrorInfo(target.name, SN.INFO.ErrPasswordDifferent);
                        ret = false;
                    } else {
                        SN.FUNC.ShowErrorInfo(target.name, "", true);
                    }
                }
                if (ret && id == SN.ID.omPanelPass2) {
                    var omPanelPass1 = $("[name=omPanelPass1]")[0];
                    if (target.value != omPanelPass1.value) {
                        SN.FUNC.ShowErrorInfo(target.name, SN.INFO.ErrPasswordDifferent);
                        ret = false;
                    } else {
                        SN.FUNC.ShowErrorInfo(target.name, "", true);
                    }
                }
            }
            break;
        case SN.ID.om8021XUserPassword:
        case SN.ID.om8021XUserPassword2:    // 当802.1X设置页的密码与确认密码有改动时检查输入框的值
            var om8021XPassword = $("[name=om8021XUserPassword]").val();
            var om8021XPassword2 = $("[name=om8021XUserPassword2]").val();
            if(om8021XPassword != SN.DATA.om8021XUserPassword.value || om8021XPassword2) {
                ret = SN.FUNC.CheckAllowChar(target);
                if(ret && om8021XPassword2) {
                    if (om8021XPassword2 != om8021XPassword) {
                        SN.FUNC.ShowErrorInfo("om8021XUserPassword2", SN.INFO.ErrPasswordDifferent);
                        ret = false;
                    } else {
                        SN.FUNC.ShowErrorInfo(target.name, "", true);
                    }
                } else if(ret && !om8021XPassword2){
                    ret = false;
                    SN.FUNC.ShowErrorInfo("om8021XUserPassword2", SN.INFO.ErrFieldRequired);
                }
            }
            break;
        case SN.ID.omPanelPass:
        case SN.ID.omPanelPass1:
        case SN.ID.omPanelPass2:
            ret = SN.FUNC.CheckOmValueLen(target, id);
            if (ret) {
                ret = SN.FUNC.CheckAllowChar_SMB(target);
                if (ret && id == SN.ID.omPanelPass2) {
                    var omPanelPass1 = $("[name=omPanelPass1]")[0];
                    if (target.value != omPanelPass1.value) {
                        SN.FUNC.ShowErrorInfo(target.name, SN.INFO.ErrPasswordDifferent);
                        ret = false;
                    } else {
                        SN.FUNC.ShowErrorInfo(target.name, "", true);
                    }
                }
            }
            break;
        case SN.ID.omSmbServerPswd:
        case SN.ID.omSMTPUserPassword:
            ret = SN.FUNC.CheckOmValueLen(target, id);
            if (ret) {
                ret = SN.FUNC.CheckAllowChar_SMB(target);
            }
            break;
        case SN.ID.omCertificateKey:
            ret = SN.FUNC.CheckOmValueLen(target, id);
            if (ret) {
                ret = SN.FUNC.CheckAllowChar(target);
            }
            $("#id_sslcertkey").val(target.value);
            // var prikeyflag = 0;
            // if(true == $("[name=omCertManagementPriKeyFlag]").prop('checked'))
            //     prikeyflag = 1;
            // else
            //     prikeyflag = 0;
            // $("#id_prikeyflag").val(prikeyflag);
            tmp = $("#input_certificate").val();
            if (tmp && tmp.length > 0) {
                var idx = tmp.lastIndexOf(".");
                var type = (idx >= 0) ? tmp.substr(idx) : "";
                if (type != "" && type != ".p12"
                    && type != ".pem" && type != ".pfx") {
                    $("#select_prompt").css("color", "red");
                    $("#button_certificate").attr("disabled", true);
                } else {
                    $("#button_certificate").attr("disabled", !ret);
                }
            } else {
                $("#button_certificate").attr("disabled", !ret);
            }
            break;
        case SN.ID.wifiUapWPAPassword:
        case SN.ID.wifiStaWPAPassword:
        case SN.ID.wifiWepCurKeyValue:
        case SN.ID.wifiWfdPassword:
            ret = SN.FUNC.CheckOmValueLen(target, id);
            if (ret) {
                //ret = SN.FUNC.CheckAllowChar(target);
                var errHtml = '';
                var pattern = /[^( -~)]/;

                ret = pattern.test(target.value);
                ret = !ret;
                if (!ret) {
                    //errHtml = StringFormat(SN.INFO.ErrNotAllowAsciiList, "");
                    errHtml = SN.INFO.ErrNotAllowAsciiList1;
                }

                if(id == SN.ID.wifiStaWPAPassword && target.value.length == 64) {
                    patten = /[^(0-9A-Fa-f)]/;
                    ret = !patten.test(target.value);
                    errHtml = SN.INFO.ErrHexNumber;
                }
                SN.FUNC.ShowErrorInfo(target.name, errHtml, ret);
            }
            break;

        //SN.TYPE.InputIpaddr
        case SN.ID.omIPv4SubnetMask:
            ret = SN.FUNC.CheckIpv4SubnetMask(target, false);
            break;
        case SN.ID.wifiIPv4SubnetMask:
            ret = SN.FUNC.CheckIpv4SubnetMask(target, true);
            break;
        case SN.ID.omIPv4GatewayAddress:
            ret = SN.FUNC.CheckIpv4Gateway(target, false);
            break;
        case SN.ID.wifiIPv4GatewayAddress:
            ret = SN.FUNC.CheckIpv4Gateway(target, true);
            break;
        case SN.ID.omIPv4Address:
        case SN.ID.omIPv4MainDNS:
        case SN.ID.omIPv4OtherDNS:
        case SN.ID.wifiStaIpAddr:
        case SN.ID.omProxyServer:
            ret = SN.FUNC.CheckIpv4Address(target, id);
            break;

        //SN.TYPE.InputShort
        case SN.ID.omUserfontpitch:
            ret = SN.FUNC.CheckNumber(target, 0.44, 99.99, true);
            break;
        case SN.ID.omUserfontheight:
            ret = SN.FUNC.CheckNumber(target, 4.0, 999.75, true);
            break;
        case SN.ID.omUservmi:
            tmp = CurrentDefaultUservmi(SN.DATA.omUserpapersize.value, true);
            ret = SN.FUNC.CheckNumber(target, 5, tmp, false);
            break;
        case SN.ID.omUserLeftMargin:
            ret = SN.FUNC.CheckNumber(target, 0, 145, false);
            if(ret) {
                var omUserRightMargin = $("[name=omUserRightMargin]")[0];
                ret = SN.FUNC.CheckNumber(omUserRightMargin, 10, 155, false);
                if (ret) {
                    var value = omUserRightMargin.value;
                    SN.FUNC.ShowErrorInfo(target.name, "", true);
                    if (parseInt(value, 10) < parseInt(target.value, 10)) {
                        SN.FUNC.ShowErrorInfo(target.name, SN.INFO.ErrLeftMarginLessThenRight);
                        ret = false;
                    }
                    else if (parseInt(value, 10) < parseInt(target.value, 10)+10) {
                        SN.FUNC.ShowErrorInfo(target.name, SN.INFO.ErrRightMarginMustLargerLeft);
                        ret = false;
                    }
                }
            }
            break;
        case SN.ID.omUserRightMargin:
            ret = SN.FUNC.CheckNumber(target, 10, 155, false);
            if(ret) {
                var omUserLeftMargin = $("[name=omUserLeftMargin]")[0];
                ret = SN.FUNC.CheckNumber(omUserLeftMargin, 0, 145, false);
                if (ret) {
                    var value = omUserLeftMargin.value;
                    SN.FUNC.ShowErrorInfo(target.name, "", true);
                    if (parseInt(target.value, 10) < parseInt(value, 10)) {
                        SN.FUNC.ShowErrorInfo(target.name, SN.INFO.ErrRightMarginBigThenLeft);
                        ret = false;
                    }
                    else if (parseInt(target.value, 10) < parseInt(value, 10)+10) {
                        SN.FUNC.ShowErrorInfo(target.name, SN.INFO.ErrRightMarginMustLargerLeft);
                        ret = false;
                    }
                }
            }
            break;
        case SN.ID.omUserOffsetX:
        case SN.ID.omUserOffsetY:
            ret = SN.FUNC.CheckNumber(target, -500, 500, false);
            break;
        case SN.ID.omPanelTimeOut:
            ret = SN.FUNC.CheckNumber(target, 5, 3600, false);
        break;
        case SN.ID.omDate:
            ret = SN.FUNC.CheckOmValueLen(target, id);
            if (ret) {

                pattern = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
                ret = SN.FUNC.CheckOmValue(target, pattern, SN.INFO.ExampleDateSetting, false);
                tmp = target.value;
                ret = ret && (tmp.length == 'YYYY-MM-DD'.length);
                if (ret) {
                    ret = SN.FUNC.CheckDateymd(tmp,id);
                }
                SN.FUNC.ShowErrorInfo(target.name, SN.INFO.ExampleDateSetting, ret);
            }
            break;
        case SN.ID.omTime:
            ret = SN.FUNC.CheckOmValueLen(target, id);
            if (ret) {

                pattern = /^([0-1][0-9]|(2[0-3])):([0-5][0-9]):([0-5][0-9])$/;
                ret = SN.FUNC.CheckOmValue(target, pattern, SN.INFO.ExampleTimehmsSetting, false);
                tmp = target.value;
                ret = ret && (tmp.length == 'hh:mm:ss'.length);
                if (ret) {
                    ret = SN.FUNC.CheckTimehms(tmp,id);
                }
                SN.FUNC.ShowErrorInfo(target.name, SN.INFO.ExampleTimehmsSetting, ret);
            }
            break;
        //新增网络白名单功能
        case SN.ID.omWhiteListIP:
            ret = SN.FUNC.CheckIpv4Address(target, id);
            break;
        case SN.ID.omWhiteListMAC:
            ret = SN.FUNC.CheckMacAddress(target);
            break;
        case SN.ID.omNetContactMaxEmailNum:
            ret = SN.FUNC.CheckNumber(target, 1, 100, false);
            break;
        case SN.ID.omNetContactTimeOut:
            ret = SN.FUNC.CheckNumber(target, 5, 300, false);
            break;
        case SN.ID.omNetContactSearchTest:
            ret = SN.FUNC.CheckOmValueLen(target, id);
            break;
        case SN.ID.omScanArgFileNamePrefix:
            ret = SN.FUNC.CheckZhlength(target,id);
            if (ret) {
                pattern = /[\\:*?\"<>\|/]+/;
                ret = !pattern.test(target.value);
                if (!ret) {
                    errHtml = StringFormat(SN.INFO.ErrScanFNamePrefixLetters, ":, *, ?, \", <, >, |, /");
                    SN.FUNC.ShowErrorInfo(target.name, errHtml, ret);
                }
            }
            break;
        //新增IPSec功能
        case SN.ID.omIpsecIPv4:
            ret = SN.FUNC.CheckIpv4Address(target, id);
            break;
        //预留，预共享秘钥
        case SN.ID.omIpsecSharedKey:
            ret = SN.FUNC.CheckSharedKey(target);
            break;
       //新增IPFilter功能
        case SN.ID.omIPFilterListIP:
            ret = SN.FUNC.CheckIpv4Address(target, id);
            break;
        case SN.ID.omIPFilterListMASK:
            ret = SN.FUNC.isValidSubnetMask(target);
            SN.FUNC.ShowErrorInfo(target.name, SN.INFO.ErrMaskAddress, ret);
            break;

        default:
            break;
    }

    return ret;
}

//检验输入有效性
SN.FUNC.CheckForm = function(formID)
{
    var checkform = $("#" + formID + " :enabled[check]:visible");
    var errCount = 0;

    for (var i = 0; i < checkform.length; i++) {
        if (!SN.FUNC.CheckInput(checkform[i]))
            errCount++;
    }

    return (0 == errCount);
};
//extravar：额外参数
//func：提交后回调处理函数
SN.FUNC.SubmitData = function (formID, extravar, func) {
    var omSettings = null;
    var tmpf = $();
    var isChange = false;
    var extra = '';
    var data = '';

    if (checkWifiSetting(SN.DATA.CurrentPageID)) {
        var EAPcheck = $("[name=wifiStaModeChoose]");
        if ( undefined != EAPcheck && EAPcheck.length > 1 && EAPcheck[1].checked ) {
            omSettings = $("#" + formID + " :enabled[name^=wifi]");
        } else {
            omSettings = $("#" + formID + " :enabled[name^=wifi]:visible");
        }

    } else if ("PRINT" == SN.DATA.CurrentPageID
        || "FTP" == SN.DATA.CurrentPageID
        || "SMB" == SN.DATA.CurrentPageID) {
        omSettings = $("#" + formID + " [name^=om]:visible");
    } else {
        omSettings = $("#" + formID + " :enabled[name^=om]:visible");
    }

    for (var i = 0; i < omSettings.length; i++) {
        var om = omSettings[i];
        var value = SN.DATA[om.name].value;
        var defval = '';

        //checkbox 修改
        if (om.type == "checkbox") {
            omSettings[i].value = om.checked ? 1 : 0;
        }

        //检查是否有修改机制
        if (SN.DATA.wifiWpsSecMode && om.name == SN.DATA.wifiWpsSecMode.name) {
            SN.DATA.wifiWpsSleepTimeEnd = -1; //Wps开始认证
        } else if (SN.DATA.wifiStaEnabled && om.name == SN.DATA.wifiStaEnabled.name) {
            if ((!om.checked) || (om.value == value && om.value == 0)
                || (om.value == value && om.value == 1 && SN.DATA.wifiStaStatus.value != 0)) {
                //console.log("Ignore: " + om.name + ", value: " + om.value);
                continue;
            }
        } else if ((SN.DATA.wifiUapEnabled && om.name == SN.DATA.wifiUapEnabled.name)
                 || (SN.DATA.wifiWfdSupported && om.name == SN.DATA.wifiWfdSupported.name)) {
            if (!om.checked || om.value == value) {
                continue;
            }
        } else if (SN.DATA.omUserbind.name == om.name) {
            if (2 == om.value) {
                extra += '&omUserduplex=' + EncodeBase64('0');
                extra += '&omUserbind=' + EncodeBase64('' + SN.DATA.omUserbind.value);
            } else {
                extra += '&omUserduplex=' + EncodeBase64('1');
            }
        }else if (1 == SN.DATA.wifiEnumerated.value && SN.DATA.wifiStaFreq.name == om.name){
            if ((!om.checked) || (om.value == value)){
                continue;
            }
            // freq change
            //if ((om.value == 1) && (value == 0 || value == 2)){
                //alert("freq do not warning.");
            //}else{

                //alert("freq need to warning.!!!");
                var result = confirm(SN.DATA.wifiFreqWarningTips);
                if (!result){
                    continue; // select canel do not to handler
                }
            //}
        }else if (value == om.value) {
            continue;
        }

        //IPS互斥处理
        if (SN.DATA.omUserpapersize.name == om.name) {
            defval = CurrentDefaultUservmi(om.value);
            extra = '&omUservmi=' + EncodeBase64('' + defval);
            extra += '&omUserTopMargin=' + EncodeBase64('2400');
        } else if (SN.DATA.omUserfontnum.name == om.name) {
            defval = CurrentDefaultUsersymbolset(om.value);
            extra = '&omUsersymbolset=' + EncodeBase64('' + defval);
        }

        tmpf.push(omSettings[i]);
        isChange = true;
    }
    omSettings = tmpf;
    data = omSettings.fieldSerialize(false);
    //console.log('<' + data + '>');

    // Disable GCP if special bonjour name in use
    if ($("[name=omBonjourName]").length > 0 && $("[name=omBonjourName]").val() == "New - Bonjour Service Name") {
        data += "&" + "omGCPEnable=MA==";
    }

    //测试邮箱处理
    if (extravar && '' != extravar) {
        isChange = true;
        extra += ((data.length > 0) ? '&' : '') + extravar;
    }

    if (isChange) {
        if (data.indexOf("omHttpsManager") == 0 && (window.location.protocol == "http:")) {
            postdata(data + extra, undefined, func, false, function () {
                alert(SN.INFO.AfterSubmitRefreshPage);
                window.location.protocol = 'https:';
            });
        } else {
            postdata(data + extra, undefined, func);
        }
    } else {
        //alert(SN.INFO.ModifySuccessed);
        RefreshCurrentPage();
    }
};
//将OM值翻译成对应状态
SN.FUNC.OMValueTransfom = function(om) {
    var content = '';
    var tranLen = 0;
    switch (om.id) {
        case SN.ID.omPrinterStatus:
            if (CheckProductID(3) || CheckProductID(4) || CheckProductID(7) || CheckProductID(2)){
                tranLen = SN.DATA.SystemStatusTran.length;
                for (var i=0; i < tranLen; i++) {
                    //console.log(i + ': ' + SN.DATA.SystemStatusTran[i][0]);
                    if (SN.DATA.SystemStatusTran[i][1] == SN.DATA.omErrorFlag.value) {
                        content = SN.DATA.SystemStatusTran[i][0];
                        break;
                    } else if (i == tranLen - 1) {
                        content = SN.DATA.SystemStatusTran[0][0] + SN.DATA.omErrorFlag.value;
                    }
                }
                break;
            }
            tranLen = SN.DATA.PrinterStatuTran.length;
            for (var i=0; i < tranLen; i++) {
                if (SN.DATA.PrinterStatuTran[i][1] == om.value) {
                    content = SN.DATA.PrinterStatuTran[i][0];
                    break;
                } else if (i == tranLen - 1) {
                    var len = SN.DATA.PrinterStatuErrTran.length;
                    for (var j=0; j < len; j++) {
                        if (SN.DATA.PrinterStatuErrTran[j][1] == om.value) {
                            //content = SN.DATA.PrinterStatuTran[5][0] + '-';
                            content = SN.DATA.PrinterStatuErrTran[j][0];
                            break;
                        } else if (j == len - 1) {
                            content = SN.DATA.PrinterStatuErrTran[len - 1][0] + om.value;
                        }

                    }
                }
            }
            break;
        case SN.ID.omTonerRemain:
            content = '<div id="tr_progressbar" style="height: 20px; width: 210px;"></div>';
            content += '<div style="height: 20px; line-height: 20px;">' + om.value + '%</div>';
            break;
        case SN.ID.omCartridgeStatus:
            tranLen = SN.DATA.ParseCartridgeStatuTran.length;
            if (om.value < 0 || om.value >= tranLen-1)
                content = SN.DATA.ParseCartridgeStatuTran[tranLen-1] + om.value;
            else
                content = SN.DATA.ParseCartridgeStatuTran[om.value];
            break;
        case SN.ID.omDrumStatus:
            tranLen = SN.DATA.DrumStatusTran.length;
            if (om.value < 0 || om.value >= tranLen-1)
                content = SN.DATA.DrumStatusTran[tranLen-1] + om.value;
            else
                content = SN.DATA.DrumStatusTran[om.value];
            break;
            break;
        case SN.ID.wifiStaCommMode:
            tranLen = SN.DATA.wifiStaCommModeTran.length;
            if (om.value > 0 && om.value < tranLen)
                content = SN.DATA.wifiStaCommModeTran[om.value];
            else
                content = SN.DATA.wifiStaCommModeTran[0];
            break;
        case SN.ID.wifiStaSecMode:
        case SN.ID.wifiUapSecMode:
            content = SN.DATA.wifiSecModeTran[om.value];
            break;
        case SN.ID.wifiStaPMF:
            content = SN.DATA.wifiStaPMFTran[om.value];
        break;
        case SN.ID.wifiWfdSecMode:
            content = SN.DATA.wifiWfdSecMode[om.value];
        break;
        case SN.ID.wifiStaStatus:
            if (!om.value)
                content = SN.DATA.wifiStaStatusTran[0];
            else
                content = SN.DATA.wifiStaStatusTran[om.value];
            break;
        case SN.ID.wifiStaStatusReason:
            content = SN.DATA.wifiStaStatusReasonTran[om.value];
            break;
        case SN.ID.wifiUapDHCPEnabled:
            content = SN.DATA.OpenCloseList[0][0];
            break;
        case SN.ID.omNetUserGroupsID:
        case SN.ID.omNetUserGroupsName:
        case SN.ID.omLdapSearchroot:
        case SN.ID.wifiStaSSID:
            {
                content = /[<>\\\"]+/;
                if (content.test(om.value))
                    content = ReplaceToHtml(om.value);
                else
                    content = om.value;
            }
            break;
        case SN.ID.TonerRemain:
            content = '<div id="tonerremain_progressbar" style="height: 20px; width: 210px;"></div>';
            content += '<div style="height: 20px; line-height: 20px;">' + om.value + '%</div>';
            break;
        case SN.ID.drumRemain:
            content = '<div id="drumremain_progressbar" style="height: 20px; width: 210px;"></div>';
            content += '<div style="height: 20px; line-height: 20px;">' + om.value + '%</div>';
            break;
        case SN.ID.omSNTPStatus:
            content = SN.DATA.SntpStatus[om.value];
            break;
        case SN.ID.omFirmVersion:
            let deflang = SN.Cookie.Get("lang", SN.DATA.DefaultLang);
            if(deflang == "ar" || deflang == "he" ) {
                 content = '<div class="text_right_show" dir="ltr">' + om.value + '</div>';

            } else {
                content = om.value;
            }
            break;
        default:
            content = om.value;
            break;
    }

    return content;
};

//创建一个DOM
//static: 是否只显示其值，不需要创建对应类型的OM
//flag: 标志check框是否显示提示信息
//      或者password是否需要秘密文切换
//      或者input是否显示单位信息
SN.FUNC.CreateDOM = function(om, static, flag)
{
    var content = SN.INFO.ErrUndefined;

    if (undefined == om || om == null) {
        return content;
    }

    var type = om.type;
    if (static) {
        type = SN.TYPE.StaticValue;
    }
    var css_float = ChangeCss('float-left');

    //特殊处理，在此处添加
    //2022/3/2  将AP热点名称后缀改为SN，为APP识别，改为不可修改
    switch(om.id) {
        case SN.ID.wifiUapSSID:
           // content = '<lable>' + SN.DATA.wifiSsidPrefix.value;

            content = '<lable>' + SN.DATA.wifiSsidPrefix.value + ' ' + om.value;
            //content += '<input check="' + om.id + '" name="' + om.name + '" type="text" value="' + om.value + '" class="inputtext"/>';
            content += '</lable>';
            //content += '<div id="' + om.name + '_err" style="color: red; font-size: 12px; padding:2px;"></div>';
            return content;

        case SN.ID.wifiWfdUapSSID:
            //content = '<lable>' + SN.DATA.wifiWfdSsidPrefix.value;
            content = '<lable>' +  SN.DATA.wifiWfdSsidPrefix.value + ' ' + om.value;
            //content += '<input check="' + om.id + '" name="' + om.name + '" type="text" value="' + om.value + '" class="inputtext" style="width:90px"/>';
            content += '</lable>';
            //content += '<div id="' + om.name + '_err" style="color: red; font-size: 12px; padding:2px;"></div>';
            return content;
        case SN.ID.wifiEapServerID:
            var value = om.value;
            var name = SN.DATA.wifiEapServerIdOp.name;
            var value_op = SN.DATA.wifiEapServerIdOp.value;
            content = '<input check="' + om.id + '" name="' + om.name + '" type="text" value="' + value + '" class="inputtext"/>';
            content += '<div class="wifi-step-right ' + css_float + '"><lable><input type="checkbox" name="'+ name + '"';
            content += (( value_op == '1') ? ' checked="checked">' : ">");
            content += SN.DATA.wifiEapServerIdOp.info;
            content += '</div>';
            content += '<div id="' + om.name + '_err" style="color: red; font-size: 12px; padding:2px;"></div>';
            return content;
        case SN.ID.omCertificateKey:
            var value = om.value;
            var name = SN.DATA.omCertManagementPriKeyFlag.name;
            var value_op = SN.DATA.omCertManagementPriKeyFlag.value;
            content = '<input check="' + om.id + '" name="' + om.name + '" type="text" value="' + value + '" class="inputtext"/>';
            content += '<div id="' + om.name + '_err" style="color: red; font-size: 12px; padding:2px;"></div>';
            content += '<div class="right-prikey-show ' + css_float + '"><lable><input type="checkbox" name="'+ name + '" value="" ';
            content += (( value_op == '1') ? ' checked="checked">' : ">");
            content += SN.DATA.omCertManagementPriKeyFlag.info;
            content += '</div>';
            return content;
        default:
            break;
    }

    switch(type) {
        case SN.TYPE.StaticValue:
            content = SN.FUNC.OMValueTransfom(om);
            break;
        case SN.TYPE.InputText:
        case SN.TYPE.InputIpaddr:
            flag = (om.id >= SN.ID.omSMTPClientAddress1 && om.id <= SN.ID.omSMTPClientAddress4);
            if (flag) {
                var margin4 = ChangeCss('margin-left-4');
                content = '<lable><input check="' + om.id + '" name="' + om.name + '" type="text" value="' + om.value + '" class="inputtext"/>';
                content += '<a class="snweb-addition ' + margin4 + '" id="' + om.name + '"><span style="visibility:hidden;">Add</span></a></lable>';
                content += '<div id="' + om.name + '_err" style="color: red; font-size: 12px; padding:2px; width: 450px;"></div>';
            } else {
                var value = (om.id == SN.ID.wifiStaSSID) ? "" : om.value;
                value = value.replace(/\"/g,"&quot;"); //将"替换成html编码
                content = '<input check="' + om.id + '" name="' + om.name + '" type="text" value="' + value + '" class="inputtext"/>';
                content += '<div id="' + om.name + '_err" style="color: red; font-size: 12px; padding:2px;"></div>';
            }
            break;
        case SN.TYPE.InputPassword:
            {
                var value = (om.id == SN.ID.wifiStaWPAPassword || om.id == SN.ID.wifiWepCurKeyValue) ? "" : om.value;
                value = value.replace(/\"/g,"&quot;"); //将"替换成html编码
                flag = (undefined == flag) ? false : flag;
                content = '<input id="' + om.name + "_password"+ '"check="' + om.id + '" name="' + om.name + '" type="password" value="' + value + '" class="inputtext"/>';
                content += flag ? '<input id="' + om.name + "_text"+ '"check="' + om.id + '" name="' + om.name + '" type="text" value="' + value + '" class="inputtext"/>' : '';
                if(om.id != SN.ID.omSnmpV3user && om.id != SN.ID.omSnmpV3auth && om.id != SN.ID.omSnmpV3priv)
                {
                    content += flag ? ('<img class="snweb-show-password ' + ChangeCss('margin-r-usual') + '" name="showpsw_' + om.name + '"/>') : '';
                }
                content += '<div id="' + om.name + '_err" style="color: red; font-size: 12px; padding:2px;"></div>';
            }
            break;
        case SN.TYPE.Selection:
            content = SN.FUNC.CreateSelect(om);
            break;
        case SN.TYPE.InputCheckbox:
            flag = (undefined == flag) ? false : flag;
            content = '<label><input type="checkbox" name="' + om.name + '" value="1"';
            content += ((om.value == '1') ? ' checked="checked">' : ">");
            content += ((flag != false) ? '<span id="info_' + om.name + '">' + om.info + '</span>' : "") + "</label>";
            break;
        case SN.TYPE.InputShort:
            flag = (undefined == flag || flag < 0 || flag > SN.DATA.PclInputSuffixList.length) ? 0 : flag;
            content = '<input check="' + om.id + '" name="' + om.name + '" type="text" value="' + om.value + '" class="inputtext-short"/>';
            content += '<span id="info_' + om.name + flag + '">' + SN.DATA.PclInputSuffixList[flag] + '</span>';
            content += '<div id="' + om.name + '_err" style="color: red; font-size: 12px; padding:2px;"></div>';
            break;
        case SN.TYPE.InputRadio:
            content = '';
            if (om.id == SN.ID.omCertificateSubmit) {
                flag = SN.DATA.CertificateSubmit;
            } else if (om.id == SN.ID.wifiWfdSupported) {
                flag = SN.DATA.WfdSupported;
            } else if (om.id == SN.ID.wifiStaFreq) {
                flag = SN.DATA.wifiFreqList;
            } else if (om.id == SN.ID.omIPFilterListRule){
                flag = SN.DATA.IPFilterListRule;
            } else if (om.id == SN.ID.wifiStaModeChoose){
                flag =  SN.DATA.wifiStaModeChooseList;
            } else {
                flag = SN.DATA.OpenCloseList;
            }
            for (var i = 0; i < flag.length; i++) {
                content += '<lable><input type="radio" name="'+ om.name +'" value="' + flag[i][1];
                content += '"><span id="info_' + om.name + i + '">' + flag[i][0] + '</span></lable>';
            }
            break;
        case SN.TYPE.InputTextArea:
                var value = ReplaceHtmlEntities(om.value);
                content = '<textarea check="' + om.id + '" name="' + om.name + '" class="inputtextarea" onkeydown="enter();"/>'+ value +'</textarea>';
                content += '<script type="text/javascript">function enter(id) {if (window.event.keyCode == 13) { var rawData = $(\'#\' + id).val();  $(\'#\' + id).val(rawData + \'\n\'); }}</script>';
                content += '<div id="' + om.name + '_err" style="color: red; font-size: 12px; padding:2px;"></div>';
            break;
        default:
            break;
    }

    return content;
};
//插入一个属性div
SN.FUNC.InsertOmDiv = function (om, static, flag) {
    var className = static ? "step1" : "step2";
    var divHtml = '<div class="' + className + '">';
    var css_float = ChangeCss('float-left');

    if (undefined == om) {
        divHtml += SN.INFO.ErrUndefined + '</div>';
        return divHtml;
    }

    divHtml += '<div class="leftshow ' + css_float + '" id="info_' + om.name + '">';
    divHtml += om.info;
    divHtml += '</div>';
    if (  om.id == SN.ID.omPrinterStatus || om.id == SN.ID.omCartridgeStatus
       || om.id == SN.ID.omDrumStatus || SN.ID.omSNTPStatus ) {
        divHtml += '<div class="rightshow ' + css_float + '" id="' + om.name + '_v">';
    } else {
        divHtml += '<div class="rightshow ' + css_float + '">';
    }
    divHtml += SN.FUNC.CreateDOM(om, static, flag);
    if(om.id == SN.ID.aveCoverage)
    {
        divHtml += '%';
    }
    divHtml += '</div></div>';

    return divHtml;
};

//插入不同纸型计数div
SN.FUNC.InsertPaperCntDiv = function (om, static, flag) {
    var className = static ? "step1" : "step2";
    var divHtml = '<div class="' + className + '">';
    var css_float = ChangeCss('float-left');

    if (undefined == om) {
        divHtml += SN.INFO.ErrUndefined + '</div>';
        return divHtml;
    }

    divHtml += '<div class="leftshow ' + css_float + ' ' + '" id="info_' + om.name + '">';
    divHtml += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    divHtml += om.info;
    divHtml += '</div>';
    divHtml += '<div class="' + css_float + '">';
    divHtml += SN.FUNC.CreateDOM(om, static, flag);
    divHtml += '</div></div>';

    return divHtml;
};

//插入wifi属性div
SN.FUNC.InsertWifiOmDiv = function(om, static, flag) {
    var divHtml = "";
    var css_float = ChangeCss('float-left');
    var class_right = "wifi-step-right " + css_float;
    var content = SN.INFO.wifiEapServerIdOp;

    if (SN.TYPE.InputPassword == om.type || SN.ID.wifiWpsModePin == om.id
        || SN.ID.wifiEapType == om.id || SN.ID.wifiEapAnonymousID == om.id) {
        divHtml += '<div id="' + om.name + '" class="wifi-step-div">';
    } else {
        divHtml += '<div class="wifi-step-div">';
    }
    if (  (static != true && SN.ID.wifiStaSSID  == om.id)
       || (static && SN.ID.wifiStaSecMode  == om.id)  ) {
        divHtml += '<div class="wifi-step-left ' + css_float + '">';
    } else {
        divHtml += '<div class="wifi-step-left ' + css_float + '" id="info_' + om.name + '">';
    }


    divHtml += om.info;
    divHtml += '</div>';

    if (  SN.ID.wifiStaCommMode == om.id || SN.ID.wifiWpsModePin == om.id
       || SN.ID.wifiWpsSleepTime == om.id || SN.DATA.wifiStaStatus == om.id  ) {
        divHtml += '<div id="' + om.name + '_v" class="' + class_right + '">';
    } else {
        divHtml += '<div class="' + class_right + '">';
    }
    divHtml += SN.FUNC.CreateDOM(om, static, flag);
    divHtml += '</div></div>';

    return divHtml;
}
//插入Email属性div
SN.FUNC.InsertEmailOmDiv = function(om_enable, om_addr) {
    var contentHtml = '';
    var margin = ChangeCss('margin-l-usual');
    var margin4 = ChangeCss('margin-left-4');
    var float_css = ChangeCss('float-left');

    if (om_addr != undefined) {
        contentHtml += '<div class="step-email ' + margin + '">';
        contentHtml += '<div class="' + float_css + '">';
        contentHtml += SN.FUNC.CreateDOM(om_enable, false, true);
        contentHtml += '</div><div class="' + float_css + ' ' + margin4 + '">';
        contentHtml += SN.FUNC.CreateDOM(om_addr);
        contentHtml += '</div><div style="clear: both;"></div></div>';
    } else {
        contentHtml += '<div class="step-email-error ' + margin + '">';
        contentHtml += SN.FUNC.CreateDOM(om_enable, false, true);
        contentHtml += '</div>';
    }

    return contentHtml;
}

//插入其他属性div，区别于上面的
SN.FUNC.InsertOtherOmDiv = function (om, static, flag) {
    var divHtml = "";
    var css_float = ChangeCss('float-left');

    divHtml += '<div class="other-step-div">';
    divHtml += '<div class="other-step-left ' + css_float + '" id="info_' + om.name + '">';
    divHtml += om.info;
    divHtml += '</div>';
    divHtml += '<div class="other-step-right ' + css_float + '">';
    divHtml += SN.FUNC.CreateDOM(om, static, flag);
    divHtml += '</div></div>';

    return divHtml;
};
//创建一个Select: val：特殊操作参数
SN.FUNC.CreateSelect = function (om, val) {
    var list = null;
    var onchange = null;
    var content = SN.INFO.ErrUndefined;

    switch(om.id) {
        case SN.ID.omUserDHCP:
        case SN.ID.omIPv4DNSDHCP:
            list = SN.DATA.UserDHCPList;
            break;
        case SN.ID.omSMTPSecurity:
            list = SN.DATA.SMTPSecurityList;
            break;
        case SN.ID.omSMTPServerAuth:
            list = SN.DATA.omSMTPServerAuthSelect;
            break;
        case SN.ID.om8021XAuth:
            list = SN.DATA.om8021XAuthSelect;
            break;
        case SN.ID.om8021XAuthInner:
            list = SN.DATA.om8021XAuthInnerSelect;
            break;
        case SN.ID.omSleepTime:
            list = SN.DATA.SleepTimeList;
            break;
        case SN.ID.omUserfontnum:
            list = SN.DATA.PclUserFontNum;
            onchange = "onUserfontnum()";
            break;
        case SN.ID.omUsersymbolset:
            list = SN.DATA.PclUserSymbolset;
            break;
        case SN.ID.omUserTopMargin:
        case SN.ID.omUserBottomMargin:
            list = SN.DATA.PclVMarginList;
            break;
        case SN.ID.omUserpapersize:
            list = SN.DATA.Userpapersize;
            onchange = "IPSMutualExclusion()";
            break;
        case SN.ID.omUserpapertype:
            list = SN.DATA.Userpapertype;
            onchange = "IPSMutualExclusion()";
            break;
        case SN.ID.omUserresolution:
            list = SN.DATA.Userresoultion;
            break;
        case SN.ID.omUserbind:
            list = SN.DATA.Userstapleposition;
            break;
        case SN.ID.omUserinputtray:
            list = SN.DATA.UserInputtray;
            onchange = "onUserinputtray()";
            break;
        case SN.ID.omUserWideA4:
        case SN.ID.omUsermanualfeed:
        case SN.ID.omUserduplex:
        case SN.ID.omJobPSErrReportEnable:
        case SN.ID.wifiUapDHCPEnabled:
        case SN.ID.omSkipBlankEnabled:
        case SN.ID.omPrintTaryMediaPrompt:
            list = SN.DATA.OpenCloseList;
            break;
        case SN.ID.omUserorientation:
            list = SN.DATA.Userorientation;
            break;
        case SN.ID.omUserdensity:
            list = SN.DATA.Userdensity;
            break;
        case SN.ID.wifiStaSecMode:
            list = SN.DATA.wifiStaSecModeSelect;
            break;
        /*add some elements for wpa2 enterprise below        */
        case SN.ID.wifiEapMethod:
            list = SN.DATA.wifiEapMethodList;
            break;
        case SN.ID.wifiEapType:
            list = SN.DATA.wifiEapTypeList;
            break;
        case SN.ID.wifiEapSerAuth:
            list = SN.DATA.wifiEapSerAuthList;
            break;
        case SN.ID.wifiEapCliAuth:
            list = SN.DATA.wifiEapCliAuthList;
            break;
        case SN.ID.wifiEapButton:
            list = SN.DATA.wifiEapButtonList;
            break;
        // case SN.ID.wifiEapFastPacOp:
        //     list = SN.DATA.wifiEapFastPacOpList;
        //     break;
        /*add some elements for wpa2 enterprise below    end */
        case SN.ID.wifiStaPMF:
            list = SN.DATA.wifiStaPMFSelect;
            break;
        case SN.ID.wifiWpsSecMode:
            list = SN.DATA.wifiWpsSecModeSelect;
            break;
        case SN.ID.omSmbServerAddr:
            list = [
                [SN.DATA.omSmbServerName.info, "name"],
                [SN.DATA.omSmbServerAddr.info, "addr"]
            ];
            break;
        case SN.ID.omFtpServerAddr:
            list = [
                [SN.DATA.omFtpServerName.info, "name"],
                [SN.DATA.omFtpServerAddr.info, "addr"]
            ];
            break;
        case SN.ID.omEmailUser:
            list = [
                [SN.DATA.omEmailUser.info, "user"],
                [SN.DATA.omEmailAddress.info, "email"]
            ];
            break;
        case SN.ID.omPhoneUser:
            list = [
                [SN.DATA.omPhoneSpeed.info, "speed"],
                [SN.DATA.omPhoneUser.info, "user"],
                [SN.DATA.omPhoneNumber.info, "number"]
            ];
            break;
        case SN.ID.omNetUserGroupsID:
            list = [
                [SN.DATA.omNetUserGroupsID.info, "id"],
                [SN.DATA.omNetUserGroupsName.info, "name"]
            ];
            break;
        case SN.ID.omScanArgResolution:
        case SN.ID.omscanResolution:
            list = SN.DATA.ResolutionList;
            break;
        case SN.ID.omScanArgColor:
        case SN.ID.omscanColor:
            list = SN.DATA.ScanColorList;
            break;
        case SN.ID.omScanArgFileFormat:
        case SN.ID.omscanFileFormat:
            list = SN.DATA.SaveTypeList;
            break;
        case SN.ID.omScanArgArea:
        case SN.ID.omscanArea:
            list = SN.DATA.ScanRangeList;
            break;
        case SN.ID.omLdapSecurity:
            list = SN.DATA.omLdapSecuritySelect;
            break;
        case SN.ID.omWindowsAuthMode:
            list = SN.DATA.omWindowsAuthModeSelect;
            break;
        case SN.ID.omWindowsSecurity:
            list = SN.DATA.omWindowsSecuritySelect;
            break;
        case SN.ID.omWindowsDefaultDomain:
            list = [
                [SN.DATA.omWindowsDomain1.value, 1],
                [SN.DATA.omWindowsDomain2.value, 2],
                [SN.DATA.omWindowsDomain3.value, 3],
                [SN.DATA.omWindowsDomain4.value, 4],
                [SN.DATA.omWindowsDomain5.value, 5],
                [SN.DATA.omWindowsDomain6.value, 6],
                [SN.DATA.omWindowsDomain7.value, 7],
                [SN.DATA.omWindowsDomain8.value, 8],
                [SN.DATA.omWindowsDomain9.value, 9],
                [SN.DATA.omWindowsDomain10.value, 10],
            ];
            break;
        case SN.ID.omWindowsDomain:
            list = [
                [SN.DATA.omWindowsDomain1.value, 1],
                [SN.DATA.omWindowsDomain2.value, 2],
                [SN.DATA.omWindowsDomain3.value, 3],
                [SN.DATA.omWindowsDomain4.value, 4],
                [SN.DATA.omWindowsDomain5.value, 5],
                [SN.DATA.omWindowsDomain6.value, 6],
                [SN.DATA.omWindowsDomain7.value, 7],
                [SN.DATA.omWindowsDomain8.value, 8],
                [SN.DATA.omWindowsDomain9.value, 9],
                [SN.DATA.omWindowsDomain10.value, 10],
            ];
            break;
        case SN.ID.omNetUserGroupsType:
            list = SN.DATA.omNetUserGroupsTypeSelect;
        break;
        case SN.ID.omUTC:
            list = SN.DATA.UTCList;
            break;
        case SN.ID.om8021XNeedCert:
        case SN.ID.omLdapHaveCertificate:
        case SN.ID.omWindowsHaveCertificate:
            list = SN.DATA.omLdapHaveCertificateSelect;
            break;
        case SN.ID.omNetContactSecurity:
            list = SN.DATA.omLdapSecuritySelect;
            break;
        case SN.ID.omNetContactAuthMode:
            list = SN.DATA.omNetContactAuthModeSelect;
            break;
        case SN.ID.omFtpServerSecurity:
            list = SN.DATA.FTPSecurityList;
            break;

        case SN.ID.omScanArgTo:
            list = SN.DATA.ScanToList;
            break;
        case SN.ID.omMultippsTraypsize:
            list = SN.DATA.MultippsTraypapersize;
            break;
        case SN.ID.omMultippsTrayptype:
            list = SN.DATA.MultippsTraypapertype;
            break;
        case SN.ID.omAutoInpTraypsize:
            list = SN.DATA.AutoInppapersize;
            break;
        case SN.ID.omAutoInpTrayptype:
            list = SN.DATA.AutoInppapertype;
            break;
        case SN.ID.omOptionalTray1psize:
            list = SN.DATA.OptionalTray1papersize;
            break;
        case SN.ID.omOptionalTray1ptype:
            list = SN.DATA.OptionalTray1papertype;
            break;
        case SN.ID.omOptiona2Tray1psize:
            list = SN.DATA.OptionalTray1papersize;
            break;
        case SN.ID.omOptiona2Tray1ptype:
            list = SN.DATA.OptionalTray1papertype;
            break;
        case SN.ID.omScanArgDuplex:
            list = SN.DATA.ScanArgDuplexList;
            break;
        //CertManagement
        case SN.ID.omCertGenrsaKeyLen:
            list = SN.DATA.omCertGenrsaKeyLenSelect;
            break;
        case SN.ID.omCertShaKeyLen:
            list = SN.DATA.omCertShaKeyLenSelect;
            break;
        case SN.ID.omA4ToA5Mode:
            list = SN.DATA.omA4ToA5ModeList;
            break;
        case SN.ID.omscanNup:
            list = SN.DATA.ScanNupList;
            onchange = "onScanNupAndSaveType()";
            break;
        case SN.ID.omscanNetImgQuality:
            list = SN.DATA.ScanNetImgQualityList;
            break;
        case SN.ID.omNetPortProtocol:
            list = SN.DATA.NetPortProtocolList;
            break;
        case SN.ID.omNetPortEnabled:
            list = SN.DATA.NetPortEnabledList;
            break;
        case SN.ID.omTownerLowSetting:
            list = SN.DATA.omTownerLowSettingList;
            break;
	//新增ipsec相关
        case SN.ID.omIkeCipherSuite:
            list = SN.DATA.IkeCipherSuite;
            break;
        case SN.ID.omEspEncrypt:
            list = SN.DATA.EspEncrypt;
            break;
        //
        case SN.ID.omEspAuthentication:
            list = SN.DATA.EspAuthentication;
            break;        
        case SN.ID.omIKESASurvival:
            list = SN.DATA.IKESASurvival;
            break;
        case SN.ID.omIpsecSASurvival:
            list = SN.DATA.IpsecSASurvival;
            break;
        case SN.ID.omWebLoginTimeout:
            list = SN.DATA.WebLoginTimeoutSelect;
            break;
        default:
            break;
    }

    if (null == list) {
        return content;
    }

    var select = document.createElement("select");

    for (var i = 0; i < list.length; i++) {
        var op = document.createElement("option");
        if (list[i].length && list[i].length >= 2) {
            if (om.id == SN.ID.omUserpapersize && val != undefined) {
                if ( 0 == val || 1 == val || (2 == val && list[i][3] != 7)
                   || ((3 == val || 4 == val) && (0 == list[i][3]
                   || 0x12 == list[i][1] || 0x13 == list[i][1]) ) ) { //解bug#36070 added by zhangyunhui 20200605
                    op.value = list[i][1];
                    op.innerHTML = list[i][0];
                } else {
                    continue;
                }
            }
            else if(om.id == SN.ID.omscanFileFormat && val != undefined) {
                if((val == 0 && list[i][2] == 0) || (val == 1 && list[i][2] == 2) || list[i][2] == 1) {
                    op.value = list[i][1];
                    op.innerHTML = list[i][0];
                } else {
                    continue;
                }
            }
            /*//选配纸盒自动识别纸盒个数
            else if (om.id == SN.ID.omUserinputtray && SN.DATA.omInputtraynumber.value >= 0
                && SN.DATA.omInputtraynumber.value <= 4) {
                if (list[i][1] <= SN.DATA.omInputtraynumber.value) {
                    op.value = list[i][1];
                    op.innerHTML = list[i][0];
                } else {
                    continue;
                }
            }*/
            else if((om.id == SN.ID.omWindowsDefaultDomain || om.id == SN.ID.omWindowsDomain) && (list[i][0].length < 1)) {
                continue;
            }else if((om.id == SN.ID.omscanResolution) && ( SN.DATA.omscanAutoDouble.value == 4) && (i == 3)) {
                continue;
            }
            else {
                op.value = list[i][1];
                op.innerHTML = list[i][0];
            }
        } else {
            op.innerHTML = list[i];
            op.value = list[i];
        }

        select.appendChild(op);
    }
    if(om.id == SN.ID.omscanNetImgQuality)
        content = '<select name="' + om.name + '" id="' + om.name + '_v" style="max-width: 400px">' + select.innerHTML + '</select>';
    else if (null == onchange)
        content = '<select name="' + om.name + '" id="' + om.name + '_v">' + select.innerHTML + '</select>';
    else
        content = '<select name="' + om.name + '" onchange="' + onchange + '" id="' + om.name + '_v">' + select.innerHTML + '</select>';

    return content;
}
//创建一个botton
SN.FUNC.CreateButton = function (id, info)
{
    var button = "";

    button = '<input type="button" id="' + id  + '" class="snweb-button" value="' + info + '"/ >';

    return button;
};
//从服务端Load数据或网页
SN.FUNC.Loadfile = function (url, successfn, errorfn) {
    //    var AJAX;
    //    if (window.XMLHttpRequest) {
    //        AJAX = new XMLHttpRequest();
    //    } else {
    //        AJAX = new ActiveXObject("Microsoft.XMLHTTP");
    //    }
    //    if (AJAX) {
    //        AJAX.open("GET", url, false);
    //        AJAX.setRequestHeader("Content-Type", "text/html;charset=UTF-8");
    //        try {
    //            AJAX.send();
    //        } catch (e) {
    //            alert(1111);
    //        }
    //        if (/*AJAX.status == 200 & */AJAX.readyState == 4)
    //            return AJAX.responseText;
    //        return false;
    //    } else {
    //        return false;
    //    }
    var isTimeOut = false;
    var content = $.ajax({
            url: url,
            async: successfn ? true : false,
            success: successfn,
            timeout: 10000,
            error: function () {
                if (errorfn)
                    errorfn();
                if (successfn)
                    successfn('');
                content.abort();
                //return SN.FUNC.Loadfile(url, successfn);
            }
        });
    return content.responseText;
}
SN.FUNC.LoadOmDB = function (parms) {
    var url = "/shtml/omDB.shtml?" + (parms != undefined ? parms : '');
    var sr = SN.FUNC.Loadfile(url);
    if (sr)
    {  eval(sr);
        //console.log(SN.DATA.omPowerOnCount,'SN.DATA.omPowerOnCount');
        CheckIsRestart();
    }
    else{
        return false;
    }
};
SN.FUNC.LoadWifiOmDB = function (parms) {
    if (SN.DATA.wifiEnumerated.value != 1)
        return ;

    var url = "/shtml/omWifiDB.shtml?" + (parms != undefined ? parms : '');
    var sr = SN.FUNC.Loadfile(url);
    if (sr)
        eval(sr);
    else
        return false;
};
SN.FUNC.LoadWifiScanDB = function (parms) {
    if (undefined == parms || '' == parms)
        return ;

    var url = "/shtml/omWifiScanDB.shtml?" + parms;
    var sr = SN.FUNC.Loadfile(url);
    if (sr)
        eval(sr);
    else
        return false;
};
//wps认证定时器
SN.DATA.wifiWpsSleepTimeEnd = -1;
SN.DATA.wifiWpsPin = -1;
function WpsSleepTimer() {
    var time = SN.DATA.wifiWpsSleepTime.value;
    var msecond = 0, date = null;

    if ((time > 0 && SN.DATA.wifiWpsSleepTimeEnd == 0) || (SN.DATA.wifiWpsSleepTimeEnd == 2)) {
        SN.DATA.WebUserLogoutTime = 130*1000;
        var sp = $("#wifiWpsPromptInfo_v");
        if(SN.DATA.wifiWpsSleepTimeEnd != 2)
        {
            if (SN.DATA.wifiWpsPin != -1 ) {//pin
                sp.html(SN.INFO.PageWpsPinWaitting);
                if(0 == SN.DATA.wifiWpsPin) {
                    SN.FUNC.LoadWifiOmDB("WPS");
                    SN.DATA.wifiWpsSleepTime.value = time;
                    if (SN.DATA.wifiWpsModePin.value.length > 0)
                        SN.DATA.wifiWpsPin = 1;
                }

                if (1 == SN.DATA.wifiWpsPin) {
                    sp.html(StringFormat(SN.INFO.PageWpsPinValue, SN.DATA.wifiWpsModePin.value));
                    $("#wifiWpsModePin_v").html(SN.DATA.wifiWpsModePin.value);
                }
            } else {  //wps
                sp.html(SN.INFO.PageWpsPbcWaitting);
            }
        }

        if (time < 110) {
            postdata(SN.DATA.wifiStaStatus.name + "=" + EncodeBase64("0"), "/noauthor",
            function(msg){
                if (undefined != msg && msg.length > 0) {
                    var msgJson = AjaxParseJson(msg);
                    if(msgJson.Result == HTTP_WPS_CONNECTION_FAIL) {
                        SN.DATA.wifiWpsSleepTimeEnd = -1;
                    } else if(msgJson.Result == HTTP_WPS_CONNECTION_OK || msgJson.Result == HTTP_STA_CONNECTION) {
                            SN.DATA.wifiWpsSleepTimeEnd = 2;
                            $("#wifiWpsPromptInfo_v").html(SN.INFO.PageWpsStaConnect);
                            $("#wifiWpsPromptTime_v").html('');
                    }else if(msgJson.Result == HTTP_STA_CONNECTION_OK
                          && SN.DATA.wifiWpsSleepTimeEnd >= 0) {
                            SN.DATA.wifiWpsSleepTimeEnd = 1;
                        SN.DATA.wifiStaSSID.value = msgJson.Ssid;
                    }
                }
            }, true);
        }
        if(SN.DATA.wifiWpsSleepTimeEnd != 2)
        {
            date = new Date();
            msecond = date.getTime() - SN.DATA.WpsDate.getTime();
            time = 118 - parseInt((msecond + 500)/1000, 10);
            //console.log(msecond + '--' + time);
            time = (time < 0) ? 0 : time;
            SN.DATA.wifiWpsSleepTime.value = time;
            $("#wifiWpsPromptTime_v").html(StringFormat(SN.INFO.PageWpsTimeCount, time));
            $("#wifiWpsSleepTime_v").html(time);
        }
        if (!IsAdmin()) {
            SN.DATA.wifiWpsSleepTimeEnd = -1;
            SN.DATA.wifiWpsPin = -1;
            return;
        }
        setTimeout("WpsSleepTimer();", (time > 0) ? 2000 : 10);
    }
    else {
        $("#wifiWpsPromptInfo_v").html('');
        $("#wifiWpsPromptTime_v").html('');
        if (SN.DATA.wifiWpsSleepTimeEnd == 1) {
            alert(SN.INFO.WPSConnectSuccessed + '<' + SN.DATA.wifiStaSSID.value + '>');
        } else if(SN.DATA.wifiWpsSleepTimeEnd == 0) {
            alert(SN.INFO.WPSConnectTimeout);
        } else if (SN.DATA.wifiWpsSleepTimeEnd == -1 ){
            alert(SN.INFO.WPSConnectFailed);
        }

        //$("[name=wifiWpsSecMode]").attr('disabled', false);
        //$("#wifiWpsSleepTime_v").html("120");
        SN.DATA.wifiWpsSleepTime.value = 120;
        SN.DATA.wifiWpsSleepTimeEnd = -1;
        SN.DATA.wifiWpsPin = -1;
        if (SN.DATA.CurrentPageID == "WPS") {
            RefreshCurrentPage();
        }
    }
}
//测试相关
SN.DATA.SendTestStatus = -1;
SN.DATA.ProgressMainHandle = null;
SN.DATA.omNetContactinfoList = null;

//显示网络联系人搜索结果弹窗
function OpenSearchNetEmailDailog() {
    var div = $("#id_main_dailog");
    var list = null;
    var noaddrinfo = "";

    if (div) {
            list = SN.DATA.omNetContactinfoList;
            noaddrinfo = SN.INFO.NoMailAddress;

        if (list.length <= 0)
        {
            alert(noaddrinfo);
            return ;
        }
        for (var i = 0; i < list.length; i++) {
            if (list[i] != "" && undefined != list[i]) {
                break;
            } else if (i == list.length - 1) {
                alert(noaddrinfo);
                return ;
            }
        }

        div.html('<div id="id_netmail_table"></div>');
        div.dialog({
            open: function(){
                var head = [ [SN.INFO.PageTableNo, SN.INFO.NetEmailUser,
                              SN.INFO.NetEmailAddr],
                             ["", "user", "email"] ];
                LoadContorlTable(SN.TYPE.TableNetEmlAbs, "netmail", head);
            },
            close: function(){
                $("#id_main_dailog_parent").html('<div id="id_main_dailog"></div>');
                $(this).remove();
            },
            title: SN.INFO.ButtonTest,
            autoOpen: false, modal: true, disabled: false, resizable: false, width: "720"
        });
        div.dialog("open");
    }
}
function GetTestStepName(stepid) {
    switch (stepid) {
        case 1:
        case 2:
            return SN.INFO.PageEmailConnect;
        case 3:
            return SN.INFO.PageEmailLogin;
        case 4:
            return SN.INFO.PageEmailSend;
        case 5:
            return SN.INFO.PageEmailClose;
        case 6:
            return SN.INFO.PageLdapParamError;
        case 7:
            return SN.INFO.PageLdapGetInfoFailed;
        default:
            break;
    }
}
SN.FUNC.TestStep = function (val) {
    var isok = false;
    var step = -1;
    switch (val) {
        case 0x11:
        case 0x00:
        case 0xFF: isok = true; step = 2; break;
        case 0x10: isok = false; step = 1; break;
        case 0x21: isok = true; step = 3; break;
        case 0x20: isok = false; step = 2; break;
        case 0x31: isok = true; step = 4; break;
        case 0x30: isok = false; step = 3; break;
        case 0x41: isok = true; step = 5; break;
        case 0x40: isok = false; step = 4; break;
        case 0x51: isok = true; step = 5; break;
        case 0x50: isok = false; step = 5; break;
        case 0x60: isok = false; step = 6; break; //设置参数错误
        case 0x70: isok = false; step = 7; break; //成功验证用户名密码，未获取到用户信息
        default:
            break;
    }
    //console.log(SN.DATA.SendTestStatus + "->" + step);
    if (SN.DATA.SendTestStatus != step) {
        SN.DATA.TimeData = new Date();
        SN.DATA.SendTestStatus = step;
    }
    this.step = step;
    this.isok = isok;
};

function CloseProgressTimer() {
    if (SN.DATA.ProgressMainHandle) {
        clearTimeout(SN.DATA.ProgressMainHandle);
    }

    $("#id_main_dailog_parent").html('<div id="id_main_dailog"></div>');
    $(this).remove();
}
var test_fname = '';
//LDAP登录测试相关
function SendTestLdapCommand(param, fname) {
    var content = '';

    $("#test_ldap_cancle")[0].value = SN.INFO.PageTestCancel;
    $("#test_ldap_statu")[0].innerHTML = SN.INFO.PageEmailConnect;
    $("#test_ldap_message")[0].innerHTML = SN.INFO.PageTestting;
    SN.DATA.TimeData = new Date();

    content = param + "=" + EncodeBase64("0xff");
    SN.FUNC.SubmitData("form_main", content,
    function (msg) {
        if (undefined == msg || '' == msg) {
            $("#id_main_dailog").dialog("close");
            alert(SN.INFO.NoReturnMessage);
            return;
        }
        var msgJson = AjaxParseJson(msg);
        if (msgJson.Result == 0) {
            $("#test_ldap_progressbar").progressbar("option", "value", 0);
            GetTestStatuLdap();
            SetProgressLdap(0);
        }
    });
}
function GetTestStatuLdap() {
    var iscompleted, step, time, d, prostep;
    var ret = -1;
    SN.TestLdapStatu.Get();
    iscompleted = SN.TestLdapStatu.IsCompleted();
    step = SN.TestLdapStatu.Step();
    d = new Date();
    time = parseInt((d.getTime() - SN.DATA.TimeData.getTime())/1000, 10);
    if (iscompleted || time > 60) {
        $("#test_ldap_progressbar").progressbar("option", "value", 100);
        $("#test_ldap_statu")[0].innerHTML = SN.INFO.PageTestOver;
        if (iscompleted) {
            if (step.isok) {
                $("#test_ldap_message")[0].innerHTML = SN.INFO.PageTestSuccessed;
                ret = 1;
            } else if(!step.isok && step.step == 7) {
                $("#test_ldap_message")[0].innerHTML = GetTestStepName(step.step);
            }else {
                $("#test_ldap_message")[0].innerHTML = GetTestStepName(step.step) + " " + SN.INFO.PageTestFailed;
            }
            $("#test_ldap_cancle")[0].value = SN.INFO.PageTestOk;
        } else {
            $("#test_ldap_message")[0].innerHTML = GetTestStepName(step.step) + " " + SN.INFO.PageTestTimeout;
            $("#test_ldap_cancle")[0].value = SN.INFO.PageTestOk;
        }
        SN.DATA.SendTestStatus = -1;
        if(test_fname == "NETCONTACT" && ret == 1)
        {
            $("#id_main_dailog").dialog("close");
            OpenSearchNetEmailDailog();
        }
    }
    else {
        $("#test_ldap_statu")[0].innerHTML = GetTestStepName(step.step);
        $("#test_ldap_message")[0].innerHTML = SN.INFO.PageTestting;
        prostep = (step.step-1)*20 + parseInt(time*10/15, 10);
        //console.log(step.step + " : " + time + " -> " + prostep);
        SetProgressLdap(prostep);
        SN.DATA.ProgressMainHandle = setTimeout("GetTestStatuLdap();", 1000);
    }
}

function SetProgressLdap(v) {
    if (SN.TestLdapStatu.IsCompleted()) {
        return;
    }
    v = (v < 0) ? 0 : ((v > 100) ? 100 : v);
    $("#test_ldap_progressbar").progressbar("option", "value", v);
}

SN.TestLdapStatu = {
    value: 0xFF,
    Get: function (fname) {
        this.value = 0xff;
        SN.FUNC.LoadOmDB(test_fname);
        if ( ('LDAP' == test_fname) && (SN.DATA.omLdapTest.value != '0xff') ) {
            var msgJson = AjaxParseJson(SN.DATA.omLdapTest.value);
            if (msgJson.testing == true)
                this.value = msgJson.result;
        }
        if ( ('WINDOWS' == test_fname) && (SN.DATA.omWindowsLoginTest.value != '0xff') ) {
            var msgJson = AjaxParseJson(SN.DATA.omWindowsLoginTest.value);
            if (msgJson.testing == true)
                this.value = msgJson.result;
        }
        if ( ('NETCONTACT' == test_fname) && (SN.DATA.omNetContactTest.value != '0xff') ) {
            var msgJson = AjaxParseJson(SN.DATA.omNetContactTest.value);
            if (msgJson.testing == true)
            {
                this.value = msgJson.result;
                if (msgJson.result == 0x41)
                    SN.DATA.omNetContactinfoList = eval( msgJson.emailinfo);
            }
        }
    },
    Step: function () {
        return new SN.FUNC.TestStep(this.value);
    },
    IsCompleted: function () {
        var step = this.Step();
        if (!step.isok || (step.isok && step.step == 5)) {
            return true;
        } else {
            return false;
        }
    },
    IsErr: function () {
        var step = this.Step();
        return !step.isok;
    }
};
//邮箱测试相关
function SendTestEmailCommand() {
    var content = '';

    $("#test_email_cancle")[0].value = SN.INFO.PageTestCancel;
    $("#test_email_message")[0].innerHTML = "";
    SN.DATA.TimeData = new Date();

    content = SN.DATA.omSMTPTest.name + "=" + EncodeBase64("0xff");
    SN.FUNC.SubmitData("form_main", content,
    function (msg) {
        if (undefined == msg || '' == msg) {
            $("#id_main_dailog").dialog("close");
            alert(SN.INFO.NoReturnMessage);
            return;
        }
        var msgJson = AjaxParseJson(msg);
        if (msgJson.Result == 0) {
            $("#test_email_progressbar").progressbar("option", "value", 0);
            GetTestStatu();
            SetProgress(0);
        }
    });
}
function GetTestStatu() {
    var iscompleted, step, time, d, prostep;
    SN.TestEmailStatu.Get();
    iscompleted = SN.TestEmailStatu.IsCompleted();
    step = SN.TestEmailStatu.Step();
    d = new Date();
    time = parseInt((d.getTime() - SN.DATA.TimeData.getTime())/1000, 10);
    if (iscompleted || time > 30) {
        $("#test_email_progressbar").progressbar("option", "value", 100);
        $("#test_email_statu")[0].innerHTML = SN.INFO.PageTestOver;
        if (iscompleted) {
            if (step.isok) {
                $("#test_email_message")[0].innerHTML = SN.INFO.PageTestSuccessed;
            } else {
                $("#test_email_message")[0].innerHTML = GetTestStepName(step.step) + " " + SN.INFO.PageTestFailed;
            }
            $("#test_email_cancle")[0].value = SN.INFO.PageTestOk;
        } else {
            $("#test_email_message")[0].innerHTML = GetTestStepName(step.step) + " " + SN.INFO.PageTestTimeout;
            $("#test_email_cancle")[0].value = SN.INFO.PageTestOk;
        }
        SN.DATA.SendTestStatus = -1;
    }
    else {
        $("#test_email_statu")[0].innerHTML = GetTestStepName(step.step);
        $("#test_email_message")[0].innerHTML = SN.INFO.PageTestting;
        prostep = (step.step-1)*20 + parseInt(time*10/15, 10);
        //console.log(step.step + " : " + time + " -> " + prostep);
        SetProgress(prostep);
        SN.DATA.ProgressMainHandle = setTimeout("GetTestStatu();", 1000);
    }
}

function SetProgress(v) {
    if (SN.TestEmailStatu.IsCompleted()) {
        return;
    }
    v = (v < 0) ? 0 : ((v > 100) ? 100 : v);
    $("#test_email_progressbar").progressbar("option", "value", v);
}

SN.TestEmailStatu = {
    value: 0xFF,
    Get: function () {
        this.value = 0xff;
        SN.FUNC.LoadOmDB("SMTP");
        if (SN.DATA.omSMTPTest.value != '0xff') {
            var msgJson = AjaxParseJson(SN.DATA.omSMTPTest.value);
            if (msgJson.testing == true)
                this.value = msgJson.result;
        }
    },
    Step: function () {
        return new SN.FUNC.TestStep(this.value);
    },
    IsCompleted: function () {
        var step = this.Step();
        if (!step.isok || (step.isok && step.step == 5)) {
            return true;
        } else {
            return false;
        }
    },
    IsErr: function () {
        var step = this.Step();
        return !step.isok;
    }
};

function LoadSnmpV1V2cEnableDialog() {
     var SnmpV1V2cDlgs = $("#id_main_dailog");
    if (SnmpV1V2cDlgs.length > 0) {
        var contentHtml = '<div">'+SN.INFO.SnmpV1V2OnAlert+'</div></br>';
        contentHtml += '</br><div style="text-align: center; width: 440;">';
        contentHtml += '<div style="float:left; width: 220;"><input type="button" id="snmpv1v2c_cancle" value="' + SN.INFO.SnmpV1V2ButtonCancle + '"/></div>';
        contentHtml += '<div style="float:left; width: 220;"><input type="button" id="snmpv1v2c_confirm" value="' + SN.INFO.SnmpV1V2ButtonConfirm + '"/></div>';
        contentHtml += '</div>';
        SnmpV1V2cDlgs.html(contentHtml);

        SnmpV1V2cDlgs.dialog({
            title: SN.INFO.SnmpV1V2OnAlertTitle,
            autoOpen: true,
            modal: true,
            disabled: false,
            resizable: false,
            closeOnEscape:false,
            open:function(event,ui){
                                    $(".ui-dialog-titlebar-close").hide();
                                    $(".ui-dialog-title").css({
                                        'word-break':'normal',
                                        'width':'auto',
                                        'overflow':'hidden',
                                        'display':'block',
                                        'white-space':'pre-wrap',
                                        'word-wrap':'break-word'
                                        });
                                    },
            close:function(event,ui){
                                    $(".ui-dialog-titlebar-close").show();
                                    },
            width: "480"
        });

        if ($("#snmpv1v2c_cancle").button) {
            $("#snmpv1v2c_cancle").button();
        }
        if ($("#snmpv1v2c_confirm").button) {
            $("#snmpv1v2c_confirm").button();
        }

        $("#snmpv1v2c_cancle").click(function () {
            $("[name=omEnableSnmpv1v2]").prop("checked", false);
            $("[name=omSnmpComv1]").attr("disabled", true);
            $("[name=omSnmpComv2c]").attr("disabled", true);
            $("#id_main_dailog").dialog("close");
        });
        $("#snmpv1v2c_confirm").click(function () {
            $("[name=omEnableSnmpv1v2]").prop("checked", true);
            $("[name=omSnmpComv1]").attr("disabled", false);
            $("[name=omSnmpComv2c]").attr("disabled", false);
            $("#id_main_dailog").dialog("close");
        });


        $("#id_main_dailog").dialog("open");//弹出窗口
    }
}

function LoadSnmpV1V2cDisableDialog() {
    var SnmpV1V2cDlgs = $("#id_main_dailog");
    if (SnmpV1V2cDlgs.length > 0) {
        var contentHtml = '<div">'+SN.INFO.SnmpV1V2OffAlert_1+'</div></br>';
        contentHtml += '<div">'+SN.INFO.SnmpV1V2OffAlert_2+'</div></br>';
        contentHtml += '<div">'+SN.INFO.SnmpV1V2OffAlert_3+'</div></br>';
        contentHtml += '</br><div style="text-align: center; width: 440;"">';
        contentHtml += '<div style="float:left; width: 220;"><input type="button" id="snmpv1v2c_cancle" value="' + SN.INFO.SnmpV1V2ButtonCancle + '"/></div>';
        contentHtml += '<div style="float:left; width: 220;"><input type="button" id="snmpv1v2c_confirm" value="' + SN.INFO.SnmpV1V2ButtonConfirm + '"/></div>';
        contentHtml += '</div>'
        SnmpV1V2cDlgs.html(contentHtml);

        SnmpV1V2cDlgs.dialog({
            title: SN.INFO.SnmpV1V2OffAlertTitle,
            autoOpen: true,
            modal: true,
            disabled: false,
            resizable: false,
            closeOnEscape:false,
            open:function(event,ui){
                                    $(".ui-dialog-titlebar-close").hide();
                                    $(".ui-dialog-title").css({
                                        'word-break':'normal',
                                        'width':'auto',
                                        'overflow':'hidden',
                                        'display':'block',
                                        'white-space':'pre-wrap',
                                        'word-wrap':'break-word'
                                        });
                                    },
            close:function(event,ui){
                                    $(".ui-dialog-titlebar-close").show();
                                    },
            width: "480"
        });

        if ($("#snmpv1v2c_cancle").button) {
            $("#snmpv1v2c_cancle").button();
        }

        if ($("#snmpv1v2c_confirm").button) {
            $("#snmpv1v2c_confirm").button();
        }

        $("#snmpv1v2c_cancle").click(function () {
            $("[name=omEnableSnmpv1v2]").prop("checked", true);
            $("[name=omSnmpComv1]").attr("disabled", false);
            $("[name=omSnmpComv2c]").attr("disabled", false);
            $("#id_main_dailog").dialog("close");
        });
        $("#snmpv1v2c_confirm").click(function () {
            $("[name=omEnableSnmpv1v2]").prop("checked", false);
            $("[name=omSnmpComv1]").attr("disabled", true);
            $("[name=omSnmpComv2c]").attr("disabled", true);
            $("#id_main_dailog").dialog("close");
        });

        $("#id_main_dailog").dialog("open");//弹出窗口
    }
}
//判断输入内容是否有非ASCII码字符
function Asciiflag(om1, om2) {
    var pattern = /[^( -~)]/;
    var ascii_flag = 0;
    if(om1 && pattern.test(om1.value)) {
        ascii_flag |= (1<<0);
    }
    if(om2 && pattern.test(om2.value)) {
        ascii_flag |= (1<<1);
    }
     return ascii_flag;
}

function LoadEmailTestDialog() {
    var testDlgs = $("#id_main_dailog");
    if (testDlgs.length > 0) {
        var text_align = SN.DATA.RightReadMode ? 'left' : 'right';
        var contentHtml = '<div id="test_email_progressbar" style="height: 20px;"></div>';
        contentHtml += '<div id="test_email_statu"></div>';
        contentHtml += '<div id="test_email_message"></div>';
        contentHtml += '</br><div style="text-align: ' + text_align + ';">';
        contentHtml += '<input type="button" id="test_email_cancle" value="' + SN.INFO.PageTestCancel + '"/></div>';
        testDlgs.html(contentHtml);

        testDlgs.dialog({
            open: SendTestEmailCommand,
            close: CloseProgressTimer,
            title: SN.INFO.ButtonEmailTest, autoOpen: false, modal: true, disabled: false, resizable: false, width: "360"
        });

        if ($("#test_email_cancle").button) {
            $("#test_email_cancle").button();
        }
        $("#test_email_progressbar").progressbar({ value: 0 });
        $("#test_email_cancle").attr("value", SN.INFO.PageTestCancel);
        $("#test_email_cancle").click(function () {
            $("#id_main_dailog").dialog("close");
        });

        $("#id_main_dailog").dialog("open");//弹出窗口
    }
}
function LoadLdapTestDialog(param, fname) {
    test_fname = fname;
    var testDlgs = $("#id_main_dailog");
    if (testDlgs.length > 0) {
        var text_align = SN.DATA.RightReadMode ? 'left' : 'right';
        var contentHtml = '<div id="test_ldap_progressbar" style="height: 20px;"></div>';
        contentHtml += '<div id="test_ldap_statu"></div>';
        contentHtml += '<div id="test_ldap_message"></div>';
        contentHtml += '</br><div style="text-align: ' + text_align + ';">';
        contentHtml += '<input type="button" id="test_ldap_cancle" value="' + SN.INFO.PageTestCancel + '"/></div>';
        testDlgs.html(contentHtml);

        testDlgs.dialog({
            //open: SendTestLdapCommand,
            close: CloseProgressTimer,
            title: SN.INFO.ButtonTest, autoOpen: false, modal: true, disabled: false, resizable: false, width: "360"
        });

        if ($("#test_ldap_cancle").button) {
            $("#test_ldap_cancle").button();
        }
        $("#test_ldap_progressbar").progressbar({ value: 0 });
        $("#test_ldap_cancle").attr("value", SN.INFO.PageTestCancel);
        $("#test_ldap_cancle").click(function () {
            $("#id_main_dailog").dialog("close");
        });

        $("#id_main_dailog").dialog("open");//弹出窗口
        SendTestLdapCommand(param);
    }
}

function LoadSmbinfoDialog(submitom, opt, json, idx) {
    var opfunc =  function(){
        var contentHtml = '';
        var flag = (undefined != json);

        contentHtml = SN.FUNC.InsertOtherOmDiv(SN.DATA.omSmbServerName);
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omSmbServerAddr);
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omSmbServerPath);
        // contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omSmbServerPort);
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omSmbNoAuthFlag);
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omSmbServerUser);
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omSmbServerPswd, false, true);
        $("#id_main_dailog").html(contentHtml);

        //input长度限制
        $("[name=omSmbServerName]").attr("maxLength", "135").val(flag ? json.name : "");
        $("[name=omSmbServerAddr]").attr("maxLength", "32").val(flag ? json.addr : "");
        $("[name=omSmbServerPath]").attr("maxLength", "255").val(flag ? json.path : "/");
        // $("[name=omSmbServerPort]").attr("maxLength", "5").val(flag ? json.port : "139");
        $("[name=omSmbServerUser]").attr("maxLength", "128").val(flag ? json.user : "anonymous");
        $("[name=omSmbServerPswd]").attr("maxLength", "32").val(flag ? json.pswd : "smb_server_password");
        $("[name=omSmbNoAuthFlag]").attr("checked", flag ? parseInt(json.anony, 10) == 1 : true);

        //密码显示方式为密文
        $("[name=omSmbServerPswd][type=text]").hide();
        $("[name=omSmbServerPswd]").click('')
        ClearPasswordValue("omSmbServerPswd");
        $("[name=omSmbNoAuthFlag]").change(
        function () {
            if (this.checked){
                $('[name=omSmbServerUser]').val("anonymous");
                $('[name=omSmbServerPswd]').val("smb_server_password");
                PasswordChangeFlag = 1;
            }
            $('[name=omSmbServerUser]').attr("disabled", this.checked);
            $('[name=omSmbServerPswd]').attr("disabled", this.checked);
        });
        $("[name=omSmbNoAuthFlag]").change();
    };
    var clfunc = function(){
        $("#id_main_dailog_parent").html('<div id="id_main_dailog"></div>');
        $(this).remove();
    };
    var title = (OPT_NEW == opt) ? SN.INFO.ButtonNew : SN.INFO.ButtonModify;
    var buttons = [{
        text: SN.INFO.ButtonApply,
        click: function() {
            var len = 1; //提交字段个数
            var data = "";
            var oms = $("#id_main_dailog [name^=omSmbServer]:visible");

            if (SN.FUNC.CheckExist(SN.DATA.omSmbinfoList, "name",
                    $("[name=omSmbServerName]")[0], SN.DATA.omSmbServerName.info, idx)) {
                return ;
            }
            for (var i = 0; i < oms.length; i++) {
                if (!SN.FUNC.CheckInput(oms[i])) {
                    len = 0;
                    break;
                } else {
                    data += "<omval#" + len + ">" + oms[i].value + "<" + len + ">";
                    if (3 == len) {
                        var val = $("[name=omSmbNoAuthFlag]")[0].checked ? 1 : 0;
                        len++;
                        data += "<omval#" + len + ">" + val + "<" + len + ">";
                    }
                    len++;
                }
            }
            data += "<omval#" + len + ">" + Asciiflag($("[name=omSmbServerName]")[0], $("[name=omSmbServerPath]")[0]) + "<" + len + ">";
            len++;
            data += "<omval#" + len + ">" + PasswordChangeFlag + "<" + len + ">";
            len++;

            if (len == oms.length + 4) {
                var values = "<omval#0>" + len + "<0>" + data;
                data = submitom + '=';
                var base = new Base64();
                data += base.encode(values);
                postdata(data, undefined, RefreshCurrentPage);
                $(this).dialog("close");
            }
        }
    }];
    LoadMainDialog(opfunc, clfunc, title, buttons, "550");
}

function LoadFtpinfoDialog(submitom, opt, json, idx) {
    var opfunc =  function(){
        var contentHtml = '';
        var flag = (undefined != json);

        contentHtml = SN.FUNC.InsertOtherOmDiv(SN.DATA.omFtpServerName);
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omFtpServerAddr);
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omFtpServerPath);
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omFtpServerPort);
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omFtpServerSecurity);
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omFtpNoAuthFlag);
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omFtpServerUser);
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omFtpServerPswd, false, true);
        $("#id_main_dailog").html(contentHtml);

        //input长度限制
        $("[name=omFtpServerName]").attr("maxLength", "135").val(flag ? json.name : "");
        $("[name=omFtpServerAddr]").attr("maxLength", "32").val(flag ? json.addr : "");
        $("[name=omFtpServerPath]").attr("maxLength", "255").val(flag ? json.path : "/");
        $("[name=omFtpServerPort]").attr("maxLength", "5").val(flag ? json.port : "21");
        $("[name=omFtpServerUser]").attr("maxLength", "97").val(flag ? json.user : "anonymous");
        $("[name=omFtpServerPswd]").attr("maxLength", "30").val(flag ? json.pswd : "ftp_server_password");
        $("[name=omFtpNoAuthFlag]").attr("checked", flag ? parseInt(json.anony, 10) == 1 : true);

        //密码显示方式为密文
        $("[name=omFtpServerPswd][type=text]").hide();
        ClearPasswordValue("omFtpServerPswd");
        $("[name=omFtpServerSecurity]").val(flag ? json.type : 0);

        $("[name=omFtpNoAuthFlag]").change(
        function () {
            if (this.checked){
                $('[name=omFtpServerUser]').val("anonymous");
                $('[name=omFtpServerPswd]').val("ftp_server_password");
                PasswordChangeFlag = 1;
            }
            $('[name=omFtpServerUser]').attr("disabled", this.checked);
            $('[name=omFtpServerPswd]').attr("disabled", this.checked);
        });
        $("[name=omFtpNoAuthFlag]").change();
    };
    var clfunc = function(){
        $("#id_main_dailog_parent").html('<div id="id_main_dailog"></div>');
        $(this).remove();
    };
    var title = (OPT_NEW == opt) ? SN.INFO.ButtonNew : SN.INFO.ButtonModify;
    var buttons = [{
        text: SN.INFO.ButtonApply,
        click: function() {
            var len = 1; //提交字段个数
            var data = "";
            var oms = $("#id_main_dailog [name^=omFtpServer]:visible");
            if (SN.FUNC.CheckExist(SN.DATA.omFtpinfoList, "name",
                    $("[name=omFtpServerName]")[0], SN.DATA.omFtpServerName.info, idx)) {
                return ;
            }
            for (var i = 0; i < oms.length; i++) {
                if (!SN.FUNC.CheckInput(oms[i])) {
                    len = 0;
                    break;
                } else {
                    data += "<omval#" + len + ">" + oms[i].value + "<" + len + ">";
                    if (5 == len) {
                        var val = $("[name=omFtpNoAuthFlag]")[0].checked ? 1 : 0;
                        len++;
                        data += "<omval#" + len + ">" + val + "<" + len + ">";
                    }
                    len++;
                }
            }

            data += "<omval#" + len + ">" + Asciiflag($("[name=omFtpServerName]")[0], $("[name=omFtpServerPath]")[0]) + "<" + len + ">";
            len++;
            data += "<omval#" + len + ">" + PasswordChangeFlag + "<" + len + ">";
            len++;

            if (len == oms.length + 4) {
                var values = "<omval#0>" + len + "<0>" + data;
                data = submitom + '=';
                var base = new Base64();
                data += base.encode(values);
                postdata(data, undefined, RefreshCurrentPage);
                $(this).dialog("close");
            }
        }
    }];
    LoadMainDialog(opfunc, clfunc, title, buttons, "550");
}
function MailCheckboxs(om, checklist){
    var divHtml = "";
    var css_float = ChangeCss('float-left');
    var content = '';
    var list = SN.DATA.omMailgroupList;

    divHtml += '<div class="other-step-div">';
    divHtml += '<div class="other-step-left ' + css_float + '" id="info_' + om.name + '">';
    divHtml += om.info;
    divHtml += '</div>';
    divHtml += '<div class="other-step-right ' + css_float + '">';
    for (var i = 0; i < list.length; i++) {
        var jsonObj = GetJson(list[i]); //获取json对象
        if (undefined != jsonObj) {
            content += '<div class="' + css_float + '">';
            content += '<input type="checkbox" name="gcheck_' + jsonObj.idx + '" value="1"';
            content += ((checklist[jsonObj.idx] == 1) ? ' checked="checked">' : ">");
            content += '<span>' + jsonObj.name + '</span>' + "</div>";
        }
    }

    if (content == "") {
        content = SN.INFO.NoMailgroup;
    }
    divHtml += content + '</div></div>';

    return divHtml;
}

function LoadMailinfoDialog(submitom, opt, json, idx) {
    var opfunc = null;
    var clickfunc = null;
    var title = null;
    var list = null;
    var buttons = null;
    var contentHtml = '';
    var flag = (undefined != json);
    var clfunc = function(){
        $("#id_main_dailog_parent").html('<div id="id_main_dailog"></div>');
        $(this).remove();
    };

    contentHtml = SN.FUNC.InsertOtherOmDiv(SN.DATA.omEmailUser);
    contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omEmailAddress);
    switch (opt) {
        case OPT_MODIFY:
        {
            var tmp = json.group.split("#");
            title = SN.INFO.ButtonModify;
            list = [0,0,0,0,0,0,0,0,0,0];
            for (var i = 0; i < tmp.length; i++) {
                if (tmp[i] != "") {
                    var ind = parseInt(tmp[i], 10);
                    list[ind] = 1;
                }
            }
            contentHtml += MailCheckboxs(SN.DATA.omGroupName, list);
            break;
        }
        case OPT_NEW:
        {
            title = SN.INFO.ButtonNew;
            list = [0,0,0,0,0,0,0,0,0,0];
            contentHtml += MailCheckboxs(SN.DATA.omGroupName, list);
            break;
        }
        case OPT_ADD:
        {
            title = SN.INFO.ButtonAdd;
            list = [0,0,0,0,0,0,0,0,0,0];
            contentHtml = MailCheckboxs(SN.DATA.omGroupName, list);
            clickfunc = function() {
                var checks = $("[name^=gcheck_]:checked");
                if (checks.length != 1) {
                    return ;
                }

                var tmp1 = checks[0].name;
                var tmp2 = tmp1.substring('gcheck_'.length, tmp1.length);
                var base = new Base64();
                tmp1 = base.encode("<add>" + tmp2);
                tmp2 = submitom.split("=");
                submitom = "";
                for(var i = 0; i < tmp2.length; i++) {
                    if (tmp2[i].length > 0)
                        submitom += tmp2[i] + "=" + tmp1;
                }
                postdata(submitom, undefined, RefreshCurrentPage);
                $(this).dialog("close");
            }
            break;
        }
        default:
            break;
    }

    clickfunc = (clickfunc != null) ? clickfunc : function(){
        var len = 1; //提交字段个数
        var checks = $("[name^=gcheck_]:checked");
        var data = "<omval#1>"; //提交邮件组
        if (SN.FUNC.CheckExist(SN.DATA.omMailinfoList, "user",
                $("[name=omEmailUser]")[0], SN.DATA.omEmailUser.info, idx)) {
            return ;
        }
        for(var i = 0; i < checks.length; i++) {
            var name = checks[i].name;
            var ind = parseInt(name.substring('gcheck_'.length, name.length), 10);

            data += ind;
            if (i < checks.length - 1)
                data += '#';
        }
        data += "<1>";
        len++;

        //提交邮件名称及地址
        var oms = $("#id_main_dailog [name^=omEmail]");
        for (var i = 0; i < oms.length; i++) {
            if (!SN.FUNC.CheckInput(oms[i])) {
                len = 0;
                break;
            } else {
                data += "<omval#" + len + ">" + oms[i].value + "<" + len + ">";
                len++;
            }
        }

        data += "<omval#" + len + ">" + Asciiflag($("[name=omEmailUser]")[0]) + "<" + len + ">";
        len++;
        if (len == oms.length + 3) {
            var values = "<omval#0>" + len + '<0>' + data;
            data = submitom + '=';
            var base = new Base64();
            data += base.encode(values);
            postdata(data, undefined, RefreshCurrentPage);
            $(this).dialog("close");
        }
    };

    buttons = [{
        text: SN.INFO.ButtonApply,
        click: clickfunc
    }];

    opfunc = function(){
        $("#id_main_dailog").html(contentHtml);
        $("[name=omEmailUser]").attr("maxLength", "40").val(flag ? json.user : "");
        $("[name=omEmailAddress]").attr("maxLength", "60").val(flag ? json.email : "");

        if (OPT_ADD == opt){
            $("[name^=gcheck_]").change(function () {
                var check = this.checked;
                $("[name^=gcheck_]").attr("disabled", this.checked);
                $(this).attr("disabled", false);
            });
        }
    };

    LoadMainDialog(opfunc, clfunc, title, buttons, "550");
}
function GroupCheckboxs(json, type){
    var divHtml = "";
    var css_float = ChangeCss('float-left');
    var content = '';
    var list = null;
    var oms = null;
    var tmp;

    divHtml = '<div class="other-step-div"><div>';
    divHtml += '<input type="checkbox" name="all_gcheck">';
    divHtml += '<b><span id="info_mailaddr">';
    switch (type) {
        case 0:
            list = SN.DATA.omMailinfoList;
            divHtml += SN.DATA.omEmailUser.info + "(" + SN.DATA.omEmailAddress.info + ")";
            oms = ["group", "user", "email"];
            for (var i = 0; i < list.length; i++) {
                var jsonObj = GetJson(list[i]); //获取json对象
                if (undefined != jsonObj) {
                    content += '<div class="text-overflow ' + css_float + '" style="width: 480px;">';
                    content += '<input type="checkbox" name="gcheck_' + jsonObj.idx + '" value="1"';
                    content += (undefined == json || '' != json && jsonObj[oms[0]].indexOf(json.idx + '') < 0)
                               ? "" : ' checked="checked"';
                    content += '><span>' + jsonObj[oms[1]] + '(' + jsonObj[oms[2]] + ')' + '</span>' + "</div>";
                }
            }
            if (content == "") {
                content = SN.INFO.NoMailAddress;
            }
            break;
        case 1:
            list = SN.DATA.omPhoneinfoList;
            divHtml += SN.DATA.omPhoneUser.info + "(" + SN.DATA.omPhoneNumber.info + ")";
            oms = ["group", "user", "number", "speed"];
            if (undefined == json) {
                tmp = "";
                for (var i = 0; i < 20; i++)
                   tmp += "0000000000";
            } else {
                tmp = json[oms[0]];
            }
            for (var i = 0; i < list.length; i++) {
                var jsonObj = GetJson(list[i]); //获取json对象
                if (undefined != jsonObj) {
                    content += '<div class="text-overflow ' + css_float + '" style="width: 480px;">';
                    content += '<input type="checkbox" name="gcheck_' + jsonObj.idx + '" value="1"';
                    content += (('0' == tmp[jsonObj.idx - 1]) ? ">" : ' checked="checked">');
                    content += '<span>[' + jsonObj[oms[3]] + ']: ' + jsonObj[oms[1]] + '(' + jsonObj[oms[2]] + ')' + '</span>' + "</div>";
                }
            }
            if (content == "") {
                content = SN.INFO.NoPhoneInfo;
            }
            break;
        default:
            return ;
    }
    divHtml += '</span></b></div>';
    divHtml += '<div class="border ' + css_float + '" style="width: 500px; height: 150px; overflow: auto;">';
    divHtml += content + "</div></div>";

    return divHtml;
}

function LoadMailgroupDialog(submitom, opt, json, idx) {
    var opfunc = function(){
        var contentHtml = '';
        var flag = (undefined != json);

        contentHtml = SN.FUNC.InsertOtherOmDiv(SN.DATA.omGroupName);
        if (OPT_NEW != opt) {
            contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omGroupNumber);
        }
        contentHtml += GroupCheckboxs(json, 0);

        $("#id_main_dailog").html(contentHtml);

        $("[name=all_gcheck]").change(function() {
            $("[name^=gcheck_]").prop("checked", $(this).prop("checked"));
        });
        $("[name^=gcheck_]").change(function() {
            var all = $("[name^=gcheck_]").length;
            var select = $("[name^=gcheck_]:checked").length;
            $("[name=all_gcheck]").prop("checked", (select == all));
        });

        //input长度限制
        $("[name=omGroupName]").attr("maxLength", "15").val(flag ? json.name : "");
        $("[name=omGroupNumber]").attr("disabled", true).val(flag ? json.no : "");
    };
    var clfunc = function(){
        $("#id_main_dailog_parent").html('<div id="id_main_dailog"></div>');
        $(this).remove();
    };
    var title = (OPT_NEW == opt) ? SN.INFO.ButtonNew : SN.INFO.ButtonModify;
    var buttons = [{
        text: SN.INFO.ButtonApply,
        click: function(){
            var checks = $("[name^=gcheck_]:checked");
            if (SN.FUNC.CheckExist(SN.DATA.omMailgroupList, "name",
                    $("[name=omGroupName]")[0], SN.DATA.omGroupName.info, idx)) {
                return ;
            }
            data = "<omval#0>3<0><omval#1>"; //提交字段个数及邮件组
            for(var i = 0; i < checks.length; i++) {
                var name = checks[i].name;
                data += parseInt(name.substring('gcheck_'.length, name.length), 10);
                data += ((i < checks.length - 1) ? '#' : '');
            }
            data += "<1>";

            checks = $("[name=omGroupName]");
            if (1 == checks.length && SN.FUNC.CheckInput(checks[0])) {
                var values = submitom + '=';
                data += "<omval#2>" + checks[0].value + "<2>";
                values += EncodeBase64(data);
                postdata(values, undefined, RefreshCurrentPage);
                $(this).dialog("close");
            }
        }
    }];
    LoadMainDialog(opfunc, clfunc, title, buttons, "550");
}
function LoadPhoneinfoDialog(submitom, opt, json, idx) {
    var opfunc = null;
    var clickfunc = null;
    var title = null;
    var buttons = null;
    var contentHtml = '';
    var flag = (undefined != json);
    var clfunc = function(){
        $("#id_main_dailog_parent").html('<div id="id_main_dailog"></div>');
        $(this).remove();
    };

    contentHtml = SN.FUNC.InsertOtherOmDiv(SN.DATA.omPhoneSpeed);
    contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omPhoneUser);
    contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omPhoneNumber);

    switch (opt) {
        case OPT_MODIFY: title = SN.INFO.ButtonModify; break;
        case OPT_NEW: title = SN.INFO.ButtonNew; break;
        case OPT_ADD: title = SN.INFO.ButtonAdd; break;
        default: title = SN.INFO.ErrUndefined; break;
    }

    clickfunc = (clickfunc != null) ? clickfunc : function(){
        var len = 1; //提交字段个数
        var data = '';
        var oms = $("#id_main_dailog [name^=omPhone]");//提交邮件名称及地址
        if (SN.FUNC.CheckExist(SN.DATA.omPhoneinfoList, "speed",
                $("[name=omPhoneSpeed]")[0], SN.DATA.omPhoneSpeed.info, idx)) {
            return ;
        }
        for (var i = 0; i < oms.length; i++) {
            if (!SN.FUNC.CheckInput(oms[i])) {
                len = 0;
                break;
            } else {
                data += "<omval#" + len + ">";
                data += (1 == len) ? parseInt(oms[i].value, 10) : oms[i].value;
                data += "<" + len + ">";
                len++;
            }
        }

        if (len == oms.length + 1) {
            var values = "<omval#0>" + len + '<0>' + data;
            data = submitom + '=';
            data += EncodeBase64(values);
            postdata(data, undefined, RefreshCurrentPage);
            $(this).dialog("close");
        }
    };

    buttons = [{
        text: SN.INFO.ButtonApply,
        click: clickfunc
    }];

    opfunc = function(){
        $("#id_main_dailog").html(contentHtml);
        $("[name=omPhoneSpeed]").attr("maxLength", "3").val(flag ? json.speed : "").attr(
                                 "disabled", (OPT_MODIFY == opt) ? true : false);
        $("[name=omPhoneUser]").attr("maxLength", "32").val(flag ? json.user : "");
        $("[name=omPhoneNumber]").attr("maxLength", "32").val(flag ? json.number : "");
    };

    LoadMainDialog(opfunc, clfunc, title, buttons, "550");
}
function LoadPhonegroupDialog(submitom, opt, json, idx) {
    var opfunc = function(){
        var contentHtml = '';
        var flag = (undefined != json);

        contentHtml = SN.FUNC.InsertOtherOmDiv(SN.DATA.omGroupName);
        if (OPT_NEW != opt) {
            contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omGroupNumber);
        }
        contentHtml += GroupCheckboxs(json, 1);
        $("#id_main_dailog").html(contentHtml);

        $("[name=all_gcheck]").change(function() {
            var check = $(this).prop("checked");
            if (check) {
                var all = $("[name^=gcheck_]");
                var select = $("[name^=gcheck_]:checked").length;
                for (var i = 0; i < all.length; i++) {
                    if (!$(all[i]).prop("checked")) {
                        select++;
                        if (select < 100) {
                            $(all[i]).prop("checked", true);
                        } else {
                            select--;
                            alert(SN.INFO.ErrPhonegroupOver);
                            break;
                        }
                    }
                }
                $(this).prop("checked", (select == all.length));
            } else {
                $("[name^=gcheck_]").prop("checked", check);
            }
        });
        $("[name^=gcheck_]").change(function() {
            var check = $(this).prop("checked");
            var all = $("[name^=gcheck_]").length;
            var select = $("[name^=gcheck_]:checked").length;
            if (check && select >= 100) {
                alert(SN.INFO.ErrPhonegroupOver);
                $(this).prop("checked", false);
                select--;
            }
            $("[name=all_gcheck]").prop("checked", (select == all));
        });

        //input长度限制
        $("[name=omGroupName]").attr("maxLength", "32").val(flag ? json.name : "");
        $("[name=omGroupNumber]").attr("disabled", true).val(flag ? json.no : "");
    };
    var clfunc = function(){
        $("#id_main_dailog_parent").html('<div id="id_main_dailog"></div>');
        $(this).remove();
    };
    var title = (OPT_NEW == opt) ? SN.INFO.ButtonNew : SN.INFO.ButtonModify;
    var buttons = [{
        text: SN.INFO.ButtonApply,
        click: function () {
            var checks = $("[name^=gcheck_]:checked");
            if (SN.FUNC.CheckExist(SN.DATA.omPhonegroupList, "name",
                    $("[name=omGroupName]")[0], SN.DATA.omGroupName.info, idx)) {
                return;
            }
            data = "<omval#0>3<0><omval#1>"; //提交字段个数及邮件组
            // bug12546
            if (checks.length == 0) {
                data += "0";
            }
            for (var i = 0; i < checks.length; i++) {
                var name = checks[i].name;
                data += parseInt(name.substring('gcheck_'.length, name.length), 10);
                data += ((i < checks.length - 1) ? '#' : '');
            }
            data += "<1>";

            checks = $("[name=omGroupName]");
            if (1 == checks.length && SN.FUNC.CheckInput(checks[0])) {
                var values = submitom + '=';
                data += "<omval#2>" + checks[0].value + "<2>";
                values += EncodeBase64(data);
                postdata(values, undefined, RefreshCurrentPage);
                $(this).dialog("close");
            }
        }
    }];
    LoadMainDialog(opfunc, clfunc, title, buttons, "550");
}
function LoadAirprintDialog(submitom, opt, json) {
    var opfunc =  function(){
        var contentHtml = '';
        var flag = (undefined != json);

        MDNS_USER_MODIFY_DELETE_FLAG = 0;
        if(opt == OPT_MODIFY)
        {
            if(CheckIsLogined())
            {
                //var userStr = EncodeBase64(json.user + ":" + json.pswd);;
                var authorStr = SN.Cookie.Get("loginname", "");
                if(json.user == authorStr)
                {
                    MDNS_USER_MODIFY_DELETE_FLAG = 1;
                }
            }
        }
        contentHtml = SN.FUNC.InsertOtherOmDiv(SN.DATA.omAirprintName);
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omAirprintPassword, false, true);
        $("#id_main_dailog").html(contentHtml);
        $("[name=omAirprintPassword][type=text]").hide();
        ClearPasswordValue("omAirprintPassword");
        //input长度限制
        $("[name=omAirprintName]").attr("maxLength", "63").val(flag ? json.user : "");
        $("[name=omAirprintPassword]").attr("maxLength", "20").val(flag ? json.pswd : "");
    };
    var clfunc = function(){
        $("#id_main_dailog_parent").html('<div id="id_main_dailog"></div>');
        $(this).remove();
    };
    var title = (OPT_NEW == opt) ? SN.INFO.ButtonAdd : SN.INFO.ButtonModify;
    var buttons = [{
        text: SN.INFO.ButtonApply,
        click: function() {
            var user = $("[name=omAirprintName]")[0];
            var pwsd_text = $("[name=omAirprintPassword][type=text]")[0];
            var pwsd = $("[name=omAirprintPassword][type=password]")[0];
            if (SN.FUNC.CheckInput(user) && (SN.FUNC.CheckInput(pwsd) || SN.FUNC.CheckInput(pwsd_text))) {
                var data = submitom + '=';
                var value = '{"user":"' + user.value + '","pswd":"' + (pwsd.value.length >= pwsd_text.value.length?pwsd.value:pwsd_text.value) + '"}';
                var list = SN.DATA.omAirprintUserList;

                for (var i = 0; i < list.length; i++) {
                    if (list[i] == value) {
                        $(this).dialog("close");
                        return ;
                    }
                }

                data += EncodeBase64(value);
                postdata(data, undefined, RefreshCurrentPage);
                $(this).dialog("close");
            }
        }
    }];
    LoadMainDialog(opfunc, clfunc, title, buttons, "550");
}
function LoadAddrbookDialog(submitom, opt, json) {
    var opfunc = function(){
        var contentHtml = '';
        var flag = (undefined != json);

        contentHtml = SN.FUNC.InsertOtherOmDiv(SN.DATA.omEmailUser);
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omEmailAddress);
        $("#id_main_dailog").html(contentHtml);

        //input长度限制
        $("[name=omEmailUser]").attr("maxLength", "40").val(flag ? json.user : "");
        $("[name=omEmailAddress]").attr("maxLength", "63").val(flag ? json.email : "");
    };
    var clfunc = function(){
        $("#id_main_dailog_parent").html('<div id="id_main_dailog"></div>');
        $(this).remove();
    };
    var title = (OPT_NEW == opt) ? SN.INFO.ButtonAdd : SN.INFO.ButtonModify;
    var buttons = [{
        text: SN.INFO.ButtonApply,
        click: function(){
            var user = $("[name=omEmailUser]")[0];
            var email = $("[name=omEmailAddress]")[0];
            if (SN.FUNC.CheckInput(user) && SN.FUNC.CheckInput(email)) {
                var data = submitom + '=';
                var value = '{"user":"' + user.value + '","email":"' + email.value + '"}';
                var list = SN.DATA.omAddressContent;

                for (var i = 0; i < list.length; i++) {
                    if (list[i] == value) {
                        $(this).dialog("close");
                        return ;
                    }
                }
                var base = new Base64();
                data += base.encode(value);
                postdata(data, undefined, RefreshCurrentPage);
                $(this).dialog("close");
            }
        }
    }];
    LoadMainDialog(opfunc, clfunc, title, buttons, "550");
}
function LoadCertManAssistantDialog()
{
    var opfunc = function(){
        var contentHtml = '';
        contentHtml += '<dl>';
        contentHtml += '<dt><span class="assist-step-title">' + SN.INFO.assistTitleConsole + '</span></dt>';
        contentHtml += '<div class="cm-step-up"></div>';
        contentHtml += '<dd class="assist-step-text">' + SN.INFO.assistDetialCertList0 + '</dd>';
        contentHtml += '<dd class="assist-step-text">' + SN.INFO.assistDetialCertList1 + '</dd>';
        contentHtml += '<dd class="assist-step-text">' + SN.INFO.assistDetialCertMan2 + '</dd>';

        contentHtml += '<dt><span class="assist-step-title">' + SN.INFO.ButtonExport + '</span></dt>';
        contentHtml += '<div class="cm-step-up"></div>';
        contentHtml += '<dd class="assist-step-text">' + SN.INFO.assistExport0 + '</dd>';
        contentHtml += '<dd class="assist-step-text">' + SN.INFO.assistExport1 + '</dd>';
        contentHtml += '<dd class="assist-step-text">' + SN.INFO.assistExport2 + '</dd>';

        contentHtml += '<dt><span class="assist-step-title">' + SN.INFO.ButtonRemove + '</span></dt>';
        contentHtml += '<div class="cm-step-up"></div>';
        contentHtml += '<dd class="assist-step-text">' + SN.INFO.assistRemove0 + '</dd>';
        contentHtml += '<dd class="assist-step-text">' + SN.INFO.assistRemove1 + '</dd>';
        contentHtml += '<dd class="assist-step-text">' + SN.INFO.assistRemove2 + '</dd>';
        contentHtml += '<dd class="assist-step-text">' + SN.INFO.assistRemove3 + '</dd>';

        contentHtml += '<dt><span class="assist-step-title">' + SN.INFO.ButtonView + '</span></dt>';
        contentHtml += '<div class="cm-step-up"></div>';
        contentHtml += '<dd class="assist-step-text">' + SN.INFO.assistView0 + '</dd>';
        contentHtml += '<dd class="assist-step-text">' + SN.INFO.assistView1 + '</dd>';
        contentHtml += '<dd class="assist-step-text">' + SN.INFO.assistView2 + '</dd>';
        contentHtml += '<dd class="assist-step-text">' + SN.INFO.assistView3 + '</dd>';

        contentHtml += '<dt><span class="assist-step-title">' + SN.INFO.ButtonEditUsage + '</span></dt>';
        contentHtml += '<div class="cm-step-up"></div>';
        contentHtml += '<dd class="assist-step-text">' + SN.INFO.assistEditUsage0 + '</dd>';
        contentHtml += '<dd class="assist-step-text">' + SN.INFO.assistEditUsage1 + '</dd>';

        contentHtml += '<dt><span class="assist-step-title">' + SN.INFO.PageInstallCACert + '</span></dt>';
        contentHtml += '<div class="cm-step-up"></div>';
        contentHtml += '<dd class="assist-step-text">' + SN.INFO.assistDetialCertCA0 + '</dd>';
        contentHtml += '<dd class="assist-step-text">' + SN.INFO.assistDetialCertCA1 + '</dd>';
        contentHtml += '<dd class="assist-step-text">' + SN.INFO.assistDetialCertCA2 + '</dd>';
        contentHtml += '<dd class="assist-step-text">' + SN.INFO.assistDetialCertCA3 + '</dd>';
        contentHtml += '<dd class="assist-step-text">' + SN.INFO.assistDetialCertCA4 + '</dd>';
        contentHtml += '<dd class="assist-step-text">' + SN.INFO.assistDetialCertCA5 + '</dd>';
        contentHtml += '<dd class="assist-step-text">' + SN.INFO.assistDetialCertCA6 + '</dd>';
        contentHtml += '<dd class="assist-step-text">' + SN.INFO.assistDetialCertCA7 + '</dd>';
        contentHtml += '<dd class="assist-step-text">' + SN.INFO.assistDetialCertCA8 + '</dd>';

        contentHtml += '<dt><span class="assist-step-title">' + SN.INFO.PageInstallPrivateCert + '</span></dt>';
        contentHtml += '<div class="cm-step-up"></div>';
        contentHtml += '<dd class="assist-step-text">' + SN.INFO.assistDetialCertPri0 + '</dd>';
        contentHtml += '<dd class="assist-step-text">' + SN.INFO.assistDetialCertPri1 + '</dd>';
        contentHtml += '<dd class="assist-step-text">' + SN.INFO.assistDetialCertPri2 + '</dd>';
        contentHtml += '<dd class="assist-step-text">' + SN.INFO.assistDetialCertPri3 + '</dd>';
        contentHtml += '<dd class="assist-step-text">' + SN.INFO.assistDetialCertPri4 + '</dd>';
        contentHtml += '<dd class="assist-step-text">' + SN.INFO.assistDetialCertPri5 + '</dd>';

        contentHtml += '<dt><span class="assist-step-title">' + SN.INFO.SetCertificateSSL + '</span></dt>';
        contentHtml += '<div class="cm-step-up"></div>';
        contentHtml += '<dd class="assist-step-text">' + SN.INFO.assistDetialCertMake0 + '</dd>';
        contentHtml += '<dd class="assist-step-text">' + SN.INFO.assistDetialCertMake1 + '</dd>';
        contentHtml += '<dd class="assist-step-text">' + SN.INFO.assistDetialCertMake2 + '</dd>';

        contentHtml += '</dl>';

        $("#id_main_dailog").html(contentHtml);

    };
    var clfunc = function(){
        $("#id_main_dailog_parent").html('<div id="id_main_dailog"></div>');
        $(this).remove();
    };

    $('#id_main_dailog').addClass('certscroll');
    var title = SN.INFO.ButtonAssistant;
    var buttons = [{
        text: SN.INFO.ButtonBackCertMan,
        click: function(){
        //返回：退出对话框
        $(this).dialog("close");
        return;
        }
    }];
    LoadMainDialog(opfunc, clfunc, title, buttons, "900");
}

function LoadCertManagementDialog( json) {

    var opfunc = function(){
        var contentHtml = '';


        contentHtml += '<p><span id="cert_man_Version" style="font-weight:bold;">' + SN.INFO.CertManVersion + ': </span><pre class="formatted-text">' + json.Version + '</pre></p>';
        contentHtml += '<p><span id="cert_man_SN" style="font-weight:bold;">' + SN.INFO.CertManSerial + ': </span><pre class="formatted-text">' + json.Serial + '</pre></p>';
        contentHtml += '<p><span id="cert_man_SignAlgo" style="font-weight:bold;">' + SN.INFO.CertManSignAlgo + ': <br> </span><pre class="formatted-text">' + json.SignAlgo + '</pre></p>';
        contentHtml += '<p><span id="cert_man_Issuer" style="font-weight:bold;">' + SN.INFO.CertManIssuer + ':<br> </span><pre class="formatted-text">' + json.Issuer + '</pre></p>';
        contentHtml += '<p><span id="cert_man_Validity" style="font-weight:bold;">' + SN.INFO.CertManValidity + ': <br> </span><pre class="formatted-text">' + json.Validity + '</pre></p>';
        contentHtml += '<p><span id="cert_man_Subject" style="font-weight:bold;">' + SN.INFO.CertManSubject + ': </span><pre class="formatted-text">' + json.Subject + '</pre></p>';
        contentHtml += '<p><span id="cert_man_PubKeyAlgo" style="font-weight:bold;">' + SN.INFO.CertManSubjectPubKey + ': <br> </span><pre class="formatted-text">' + json.PubKeyAlgo + '</pre></p>';
        contentHtml += '<p><span id="cert_man_PubKey" style="font-weight:bold;">' + SN.INFO.CertManPubKey + ': <br> </span><pre class="formatted-text">' + DecodeBase64(json.PubKey) + '</pre></p>';
        contentHtml += '<p><span id="cert_man_Extensions" style="font-weight:bold;">' + SN.INFO.CertManExtensions + ': <br> </span><pre class="formatted-text">' + '</pre></p>';
        contentHtml += '<p><span id="cert_man_ku" style="font-weight:bold;">' + SN.INFO.CertKU + ': <br> </span><pre class="formatted-text">' + DecodeBase64(json.keyUsage) + '</pre></p>';
        contentHtml += '<p><span id="cert_man_xku" style="font-weight:bold;">' + SN.INFO.CertXKU + ': <br> </span><pre class="formatted-text">' + DecodeBase64(json.extendKeyUsage) + '</pre></p>';
        contentHtml += '<p><span id="cert_man_constraints" style="font-weight:bold;">' + SN.INFO.CertManConstrains + ': <br> </span><pre class="formatted-text">' + json.constraints + '</pre></p>';
        contentHtml += '<p><span id="cert_man_subjkeyid" style="font-weight:bold;">' + SN.INFO.CertManSubjectKeyId + ': <br> </span><pre class="formatted-text">' + json.subjectKeyId + '</pre></p>';
        contentHtml += '<p><span id="cert_man_authorKeyId" style="font-weight:bold;">' + SN.INFO.CertManAuthorKeyId + ': <br> </span><pre class="formatted-text">' + json.authorKeyId + '</pre></p>';
        contentHtml += '<p><span id="cert_man_authorAccess" style="font-weight:bold;">' + SN.INFO.CertManAutherAccess + ': <br> </span><pre class="formatted-text">' + DecodeBase64(json.authorAccess) + '</pre></p>';
        contentHtml += '<p><span id="cert_man_subjAlterName" style="font-weight:bold;">' + SN.INFO.CertSubjectAlternativename + ': <br> </span><pre class="formatted-text">' + DecodeBase64(json.subjectAlterName) + '</pre></p>';
        contentHtml += '<p><span id="cert_man_SignAlgoDetail" style="font-weight:bold;">' + SN.INFO.CertManSignAlgoDetail + ': <br> </span><pre class="formatted-text">' + DecodeBase64(json.SignAlgoDetail) + '</pre></p>';
        contentHtml += '<p><span id="cert_man_figureAlgo" style="font-weight:bold;">' + SN.INFO.CertFingerAlgo + ': <br> </span><pre class="formatted-text">' + json.figureAlgo + '</pre></p>';
        contentHtml += '<p><span id="cert_man_figure" style="font-weight:bold;">' + SN.INFO.CertFingerPrint + ': <br> </span><pre class="formatted-text">' + DecodeBase64(json.figure) + '</pre></p>';

        if(json.PriKeyFlag == 0)
        {
            contentHtml += '<p><span id="cert_man_prikey" style="font-weight:bold;">' + SN.INFO.CertManPriKey + ': </span>' + SN.INFO.CertManPriKeyUnpermit + '</p>';//显示私钥到处标记：不可导出
        }
        else if(json.PriKeyFlag == 1)
        {
            contentHtml += '<p><span id="cert_man_prikey" style="font-weight:bold;">' + SN.INFO.CertManPriKey + ': </span><class="formatted-text">' + SN.INFO.CertManPriKeyPermit + '</p>';//显示私钥到处标记：可导出
        }
        //else CA：不显示该字段



        $("#id_main_dailog").html(contentHtml);

    };
    var clfunc = function(){
        $("#id_main_dailog_parent").html('<div id="id_main_dailog"></div>');
        $(this).remove();
    };

    $('#id_main_dailog').addClass('certscroll');
    var title = SN.INFO.PageCertManagementView;
    var buttons = [{
        text: SN.INFO.ButtonBackCertMan,
        click: function(){
            //返回：退出对话框
            $(this).dialog("close");
            return;
        }
    }];
    LoadMainDialog(opfunc, clfunc, title, buttons, "900");
}

function LoadCertManagementFuncEditDialog(submitom){
    var info = hashval;//获取主页选择证书文件
    var checkinfo = checkhash;
    var opfunc =  function(){
    };
    var clfunc = function(){
        $("#id_main_dailog_parent").html('<div id="id_main_dailog"></div>');
        $(this).remove();
    };
    var title = SN.INFO.PageCertManagementEdit;
    var buttons = [{
        text: SN.INFO.ButtonCommitCertMan,
        click: function() {
            var len = 1; //提交字段个数
            var data = "";
            var oms = $("#id_main_dailog [name^=omCertManagement]:visible");
            //data += "<omval#" + len + ">" + info + "<" + len + ">";
            var flag = 0;
            for (var i = 0; i < oms.length; i++) {
                if (!SN.FUNC.CheckInput(oms[i])) {
                    len = 0;
                    break;
                } else {
                    if ( (0 === i) && (1 != SN.DATA.wifiEnumerated.value) ) {
                        data += "<omval#1>0<1>";
                        ++len;
                    }
                    var name = $("[name=" + oms[i].name + "]");
                    var val = name[0].checked ? 1 : 0;
                    data += "<omval#" + len + ">" + val + "<" + len + ">";
                    if((len === 3) && (val === 1))
                    {
                        flag = 1;
                    }
                    len++;
                }
            }
            data += "<omval#" + len + ">" + info + "<" + len + ">";//依次是count wireless(1) wired(2) ipps(3) smtp(4) hash value(5)
            len++;

            if ( ( (len == oms.length + 2) && (1 == SN.DATA.wifiEnumerated.value) ) || ( (len == oms.length + 3) && (1 != SN.DATA.wifiEnumerated.value) ) ) {
                var values = "<omval#0>" + len + "<0>" + data;//个数
                data = submitom + '=';
                var base = new Base64();
                data += base.encode(values);
                postdata(data, "/editCertMan", function(retvalue){
                    if(retvalue == undefined || retvalue == ''){
                        alert(SN.INFO.NoReturnMessage);
                        return;
                    }
                    var msgJson = AjaxParseJson(retvalue);
                    if('editFunc' == msgJson.Operation){
                        if(msgJson.Result == HTTP_CERT_MAN_EDIT_SUCCESS){
                            alert(SN.INFO.ErrCMEditSuccess);//
                            if((info != checkinfo) && (window.location.protocol === 'https:') && (flag === 1))//需校验选中的哈希值CHECKINFO有没有携带HTTPS，此时提交的哈希还没有更新
                            {
                                window.location.reload();
                            }
                            else
                            {
                                RefreshCurrentPage();//刷新页面
                            }
                            return ;
                        }
                        if(HTTP_CERT_MAN_EDIT_8021X_WIRELESS == msgJson.Result)
                        {
                            alert(SN.INFO.ErrCMEditFallFlatWireless);
                            return ;
                        }
                        else if(HTTP_CERT_MAN_EDIT_8021X_WIRED == msgJson.Result)
                        {
                            alert(SN.INFO.ErrCMEditFallFlatWired);
                            return ;
                        }
                        else if(HTTP_CERT_MAN_EDIT_LDAP == msgJson.Result)
                        {
                            alert(SN.INFO.ErrCMEditFallFlatLDAP);
                            return ;
                        }
                        else if(HTTP_CERT_MAN_EDIT_KERBEROS == msgJson.Result)
                        {
                            alert(SN.INFO.ErrCMEditFallFlatKerberos);
                            return ;
                        }
                        else if(HTTP_CERT_MAN_EDIT_IPPS_HTTPS == msgJson.Result)
                        {
                            alert(SN.INFO.ErrCMEditFallFlatIPPSHTTPS);
                            return ;
                        }
                        else if(HTTP_CERT_MAN_EDIT_IPSEC == msgJson.Result)
                        {
                            alert(SN.INFO.ErrCMEditFallFlatIPSEC);
                            return ;
                        }
                        else if(HTTP_CERT_MAN_EDIT_SMTP == msgJson.Result)
                        {
                            alert(SN.INFO.ErrCMEditFallFlatSMTP);
                            return ;
                        }
                        else if(HTTP_CERT_MAN_UNKNOWN_FIND == msgJson.Result)
                        {
                            alert(SN.INFO.ErrCMUnknownFind);
                            return ;
                        }
                        else if(HTTP_CERT_MAN_UNKNOWN_SYS == msgJson.Result)
                        {
                            alert(SN.INFO.ErrCMUnknownSys);
                            return ;
                        }
                        else if(HTTP_CERT_MAN_EDIT_LOCK == msgJson.Result)
                        {
                            alert(SN.INFO.ErrCMEd)
                            return ;
                        }

                    }



                }
                );
                $(this).dialog("close");
            }
        }
    }];
    var contentHtml = '';
    contentHtml += '<div id="edit_func_dialog" style="height: auto; font-weight: bold;">';
    contentHtml += SN.INFO.ErrCMEditDialog + '</div>';
    if (1 == SN.DATA.wifiEnumerated.value) {
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omCertManagementWireless);
    }
    contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omCertManagementWired);

    contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omCertManagementIPPSHTTPS);

    contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omCertManagementSMTP);
    //contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omCertManagementLDAP);
    //contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omCertManagementKerberos);
    //contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omCertManagementIPSEC);
    $("#id_main_dailog").html(contentHtml);
    LoadMainDialog(opfunc, clfunc, title, buttons, "900");
}


function LoadMainDialog(opfunc, clfunc, titl, btn, w) {
    var testDlgs = $("#id_main_dailog");
    var contentHtml = '';

    if (testDlgs.length <= 0) {
        return ;
    }

    testDlgs.dialog({
        title: titl,
        buttons: btn,
        open: opfunc,
        close: clfunc,
        autoOpen: false,
        modal: true,
        disabled: false,
        resizable: false,
        width: w
    });
    testDlgs.dialog("open");

    //输入框焦点和正常状态下颜色变换
    $("#id_main_dailog :text, :password").focus(function () {
        $(this).addClass('input-focused');
        this.select();
    });
    $("#id_main_dailog :text, :password").blur(function () {
        $(this).removeClass('input-focused');
        SN.FUNC.CheckInput(this);
    });

    //密码显示方式切换
    $("[name^=showpsw_]").bind("mousedown", function() {
        var name = (this.name).substring('showpsw_'.length, this.name.length);
        var hidden = $("[name=" + name + "]:hidden");
        var val = $("[name=" + name + "]:visible").hide().val();

        hidden.val(val).show();
    })/*.bind("mouseup mouseout", function() {
        var name = (this.name).substring('showpsw_'.length, this.name.length);
        $("[name=" + name + "][type=text]").hide();
        $("[name=" + name + "][type=password]").show();
    })*/;
}

function LoadWhiteListDialog(submitom, opt, json, first) {
    var opfunc = function(){
        var contentHtml = '';
        var flag = (undefined != json);

        contentHtml = SN.FUNC.InsertOtherOmDiv(SN.DATA.omWhiteListIP);
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omWhiteListMAC);
        if(first == 1)
        {
            contentHtml += '<div class="leftshow_font ' + ChangeCss('float-left') + '">';
            contentHtml += SN.INFO.WhiteListNoPolicyWarnings;
            contentHtml += '</div>';
        }
        $("#id_main_dailog").html(contentHtml);

        //input长度限制
        $("[name=omWhiteListIP]").attr("maxLength", "15").val(flag ? json.IPV4 : "");
        $("[name=omWhiteListMAC]").attr("maxLength", "17").val(flag ? json.MAC : "");
    };
    var clfunc = function(){
        OPT_ROW_NO = 0;
        $("#id_main_dailog_parent").html('<div id="id_main_dailog"></div>');
        $(this).remove();
    };

    var title = (OPT_NEW == opt) ? SN.INFO.ButtonNew : SN.INFO.ButtonModify;

    var buttons = [{
        text: SN.INFO.ButtonApply,
        click: function(){
            var IP = $("[name=omWhiteListIP]")[0];
            var MAC = $("[name=omWhiteListMAC]")[0];
            if (SN.FUNC.CheckInput(IP) && SN.FUNC.CheckInput(MAC)) {
                var data = submitom + '=';
                var value = '{"IPV4":"' + IP.value.toUpperCase() + '","MAC":"' + MAC.value.toUpperCase().replace(/-/g, ":") + '"}';
                var list = SN.DATA.omWhiteListContent;

                for (var i = 0; i < list.length; i++) {
                    if (list[i] == value) {
                        $(this).dialog("close");
                        return ;
                    }
                }

                data += EncodeBase64(value);
                postdata(data, undefined, RefreshCurrentPage);
                $(this).dialog("close");
            }
        }
    }];
    LoadMainDialog(opfunc, clfunc, title, buttons, "600");
}

function LoadNetuserDialog(submitom, opt, json, idx) {
    var opfunc =  function(){
        var flag = (undefined != json);
        //input长度限制
        $("[name=omNetUserGroupsID]").attr("maxLength", "185").val(flag ? json.id : "");
        $("[name=omNetUserGroupsName]").attr("maxLength", "63").val(flag ? json.name : "");
        $("[name=omNetUserGroupsType]").val(flag ? json.type : 1);
        $("[name=omNetUserPermissionSystemSet]").attr("checked", flag ? parseInt(json.settingsIcon, 10) == 1 : false);
        $("[name=omNetUserPermissionCopy]").attr("checked", flag ? parseInt(json.copy, 10) == 1 : true);
        $("[name=omNetUserPermissionScan]").attr("checked", flag ? parseInt(json.scan, 10) == 1 : true);
        $("[name=omNetUserPermissionFax]").attr("checked", flag ? parseInt(json.fax, 10) == 1 : true);
        $("[name=omNetUserPermissionPswdPrint]").attr("checked", flag ? parseInt(json.PasswdPrint, 10) == 1 : true);
        $("[name=omNetUserPermissionUDiskPrint]").attr("checked", flag ? parseInt(json.UDiskPrint, 10) == 1 : true);
    };
    var clfunc = function(){
        $("#id_main_dailog_parent").html('<div id="id_main_dailog"></div>');
        $(this).remove();
    };
    var title = (OPT_NEW == opt) ? SN.INFO.ButtonNew : SN.INFO.ButtonModify;
    var buttons = [{
        text: SN.INFO.ButtonApply,
        click: function() {
            var len = 1; //提交字段个数
            var data = "";
            var oms = $("#id_main_dailog [name^=omNetUser]:visible");
            if (SN.FUNC.CheckExist(SN.DATA.omNetUserGroupList, "id",
                    $("[name=omNetUserGroupsID]")[0], SN.DATA.omNetUserGroupsID.info, idx)) {
                return ;
            }
            for (var i = 0; i < oms.length; i++) {
                if (!SN.FUNC.CheckInput(oms[i])) {
                    len = 0;
                    break;
                } else {
                    if (len <= 3) {
                        data += "<omval#" + len + ">" + oms[i].value + "<" + len + ">";
                    }else if(!CheckProductID(4) && len==7){  // 非4in1机型没有传真功能，传真权限默认为0
                        var val = 0;
                        data += "<omval#" + len + ">" + val + "<" + len + ">";
                        i--;
                    }else {
                        var name = $("[name=" + oms[i].name + "]");
                        var val = name[0].checked ? 1 : 0;
                        data += "<omval#" + len + ">" + val + "<" + len + ">";
                    }
                    len++;
                }
            }

            if ((len == oms.length + 1) || (!CheckProductID(4) && len == oms.length + 2)) {
                var values = "<omval#0>" + len + "<0>" + data;
                data = submitom + '=';
                var base = new Base64();
                data += base.encode(values);
                postdata(data, undefined, RefreshCurrentPage);
                $(this).dialog("close");
            }
        }
    }];
    var contentHtml = '';
    contentHtml = SN.FUNC.InsertOtherOmDiv(SN.DATA.omNetUserGroupsID);
    contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omNetUserGroupsName);
    contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omNetUserGroupsType);
    contentHtml += '<div id="windows_login_test" style="height: 30px; font-weight: bold;">';
    contentHtml += SN.INFO.PageFunctionAvailable + '</div>';
    contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omNetUserPermissionSystemSet);
    contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omNetUserPermissionCopy);
    contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omNetUserPermissionScan);
    if(CheckProductID(4)) {
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omNetUserPermissionFax);
    }
    contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omNetUserPermissionPswdPrint);
    contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omNetUserPermissionUDiskPrint);
    $("#id_main_dailog").html(contentHtml);

    LoadMainDialog(opfunc, clfunc, title, buttons, "550");
    if (!CheckProductID(4)) { // 只有4in1有传真
        $("[name=omNetUserPermissionFax][type=checked]").hide();
    }
}

function LoadScanQuickSetDialog(submitom, opt, json, idx) {
    var opfunc =  function(){
        var flag = (undefined != json);

        //input长度限制
        $("[name=omScanArgName]").attr("maxLength", "31").val(flag ? json.name : "");
        $("[name=omScanArgTo]").val(flag ? json.to : 2);
        $("[name=omScanArgColor]").val(flag ? json.color : 1);
        $("[name=omScanArgDuplex]").val(flag ? json.double : 0);
        $("[name=omScanArgResolution]").val(flag ? json.reso : 2);
        $("[name=omScanArgArea]").val(flag ? json.area : 4);
        $("[name=omScanArgFileFormat]").val(flag ? json.format : 3);
        $("[name=omScanArgNup]").prop("checked", flag ? parseInt(json.nup, 10) == 1 : true);
        $("[name=omScanArgFileNamePrefix]").attr("maxLength", "31").val(flag ? json.fname : "");
    //EMAIL
        $("[name=omEmailUser]").attr("maxLength", "40").val(flag ? json.euser : "");
        $("[name=omEmailAddress]").attr("maxLength", "63").val(flag ? json.eaddr : "");
    //FTP
        $("[name=omFtpServerAddr]").attr("maxLength", "32").val(flag ? json.faddr : "");
        $("[name=omFtpServerPath]").attr("maxLength", "255").val(flag&&json.fpath ? json.fpath : "/");
        $("[name=omFtpServerPort]").attr("maxLength", "5").val(flag&&json.fport ? json.fport : "21");
        $("[name=omFtpServerUser]").attr("maxLength", "97").val(flag ? json.fuser : "");
        $("[name=omFtpServerPswd]").attr("maxLength", "30").val(flag ? json.fpswd : "");
        $("[name=omFtpNoAuthFlag]").attr("checked", (flag&&json.fanony) ? parseInt(json.fanony, 10) == 1 : true);
        $("[name=omFtpServerSecurity]").val(flag&&json.ftype ? json.ftype : 0);
    //SMB
        $("[name=omSmbServerAddr]").attr("maxLength", "32").val(flag ? json.saddr : "");
        $("[name=omSmbServerPath]").attr("maxLength", "255").val((flag&&json.spath) ? json.spath : "/");
        // $("[name=omSmbServerPort]").attr("maxLength", "5").val((flag&&json.sport) ? json.sport : "139");
        $("[name=omSmbServerUser]").attr("maxLength", "128").val(flag ? json.suser : "anonymous");
        $("[name=omSmbServerPswd]").attr("maxLength", "32").val(flag ? json.spswd : "smb_server_password");
        $("[name=omSmbNoAuthFlag]").attr("checked", (flag&&json.sanony) ? parseInt(json.sanony, 10) == 1 : true);

        $("[name=omScanArgTo]").change();
        $("[name=omScanArgFileFormat]").change();
        $("[name=omFtpNoAuthFlag]").change();
        $("[name=omSmbNoAuthFlag]").change();
        $("[name=omScanArgDuplex]").change();
    };
    var clfunc = function(){
        $("#id_main_dailog_parent").html('<div id="id_main_dailog"></div>');
        $(this).remove();
    };
    var title = (OPT_NEW == opt) ? SN.INFO.ButtonNew : SN.INFO.ButtonModify;
    var buttons = [{
        text: SN.INFO.ButtonApply,
        click: function() {
            var len = 1; //提交字段个数
            var data = "";
            var oms = $("#id_main_dailog [name^=omScan]:visible");
            var omssmb = $("#id_main_dailog [name^=omSmbServer]:visible");
            var omsemail = $("#id_main_dailog [name^=omEmail]:visible");
            var omsftp = $("#id_main_dailog [name^=omFtpServer]:visible");
            var maxlen = 0;
            if (SN.FUNC.CheckExist(SN.DATA.omScanQuickSetList, "name",
                    $("[name=omScanArgName]")[0], SN.DATA.omScanArgName.info, idx)) {
                return ;
            }

            for (var i = 0; i < oms.length; i++) {
                if (!SN.FUNC.CheckInput(oms[i])) {
                    len = 0;
                    break;
                } else {
                    if ( len != 8) {
                        data += "<omval#" + len + ">" + oms[i].value + "<" + len + ">";
                    } else if ( len == 8){
                        var val = $("[name=omScanArgNup]")[0].checked ? 1 : 0;
                        data += "<omval#" + len + ">" + val + "<" + len + ">";
                    }
                    len++;
                }
            }

            switch(oms[1].value) {
                case '2':
                    for (var i = 0; i < omsemail.length; i++) {
                        if (!SN.FUNC.CheckInput(omsemail[i])) {
                            len = 0;
                            break;
                        } else {
                            data += "<omval#" + len + ">" + omsemail[i].value + "<" + len + ">";
                            len++;
                        }
                    }
                    maxlen = oms.length + omsemail.length + 1;
                    break;
                case '5':
                    for (var i = 0; i < omssmb.length; i++) {
                        if (!SN.FUNC.CheckInput(omssmb[i])) {
                            len += 0;
                            break;
                        } else {
                            data += "<omval#" + len + ">" + omssmb[i].value + "<" + len + ">";
                            if (11 == len) {
                                var val = $("[name=omSmbNoAuthFlag]")[0].checked ? 1 : 0;
                                len++;
                                data += "<omval#" + len + ">" + val + "<" + len + ">";
                            }
                            len++;
                        }
                    }
                    data += "<omval#" + len + ">" + PasswordChangeFlag + "<" + len + ">";
                    len++;

                if (len == oms.length + omssmb.length + 3) {
                    var values = "<omval#0>" + len + "<0>" + data;
                    data = submitom + '=';
                    var base = new Base64();
                    data += base.encode(values);
                    postdata(data, undefined, RefreshCurrentPage);
                    $(this).dialog("close");
                }
                break;
                case '1':
                    for (var i = 0; i < omsftp.length; i++) {
                        if (!SN.FUNC.CheckInput(omsftp[i])) {
                            len += 0;
                            break;
                        } else {
                            data += "<omval#" + len + ">" + omsftp[i].value + "<" + len + ">";
                            if (13 == len) {
                                var val = $("[name=omFtpNoAuthFlag]")[0].checked ? 1 : 0;
                                len++;
                                data += "<omval#" + len + ">" + val + "<" + len + ">";
                            }
                            len++;
                        }
                    }
                    maxlen = oms.length + omsftp.length + 2;
                    break;
                case '4':
                default:
                    maxlen = oms.length + 1;
                    break;
            }
            if (len == maxlen) {
                var values = "<omval#0>" + len + "<0>" + data;
                data = submitom + '=';
                var base = new Base64();
                data += base.encode(values);
                postdata(data, undefined, RefreshCurrentPage);
                $(this).dialog("close");
            }
        }
    }];

        var contentHtml = '';
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omScanArgName);
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omScanArgTo);
        contentHtml +=  '<div id="ScanToEmail_div">';
            contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omEmailUser);
            contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omEmailAddress);
        contentHtml += '</div>';
        contentHtml +=  '<div id="ScanToFtp_div">';
            contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omFtpServerAddr);
            contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omFtpServerPath);
            contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omFtpServerPort);
            contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omFtpServerSecurity);
            contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omFtpNoAuthFlag);
            contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omFtpServerUser);
            contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omFtpServerPswd, false, true);
        contentHtml += '</div>';
        contentHtml +=  '<div id="ScanToSmb_div">';
            contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omSmbServerAddr);
            contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omSmbServerPath);
            // contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omSmbServerPort);
            contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omSmbNoAuthFlag);
            contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omSmbServerUser);
            contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omSmbServerPswd, false, true);
        contentHtml += '</div>';
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omScanArgColor);
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omScanArgDuplex);
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omScanArgResolution);
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omScanArgArea);
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omScanArgFileFormat);
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omScanArgNup);
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omScanArgFileNamePrefix);
        $("#id_main_dailog").html(contentHtml);
        //密码显示方式为密文
        $("[name=omSmbServerPswd][type=text]").hide();
        $("[name=omFtpServerPswd][type=text]").hide();
        ClearPasswordValue("omSmbServerPswd");
        ClearPasswordValue("omFtpServerPswd");
        var omtmp = $("[name=omScanArgTo]");
        if (omtmp && omtmp.length > 0) {
            var val = SN.DATA.omScanArgTo.value;
            SetSelectValue(omtmp[0].options, val);
            omtmp.change();
        }

        $("[name=omScanArgTo]").change(
        function () {
            var value = $(this).val();
            var email = $("#ScanToEmail_div");
            var smd = $("#ScanToSmb_div");
            var ftp = $("#ScanToFtp_div");

            if(email.css("display") != "none") {
                email.hide();
            }
            if(smd.css("display") != "none") {
                smd.hide();
            }
            if(ftp.css("display") != "none") {
                ftp.hide();
            }
            switch(value) {
                case '2':
                    if(email.css("display") == "none") {
                        email.show();
                    }
                    break;
                case '5':
                    if(smd.css("display") == "none") {
                        smd.show();
                    }
                    break;
                case '1':
                    if(ftp.css("display") == "none") {
                        ftp.show();
                    }
                    break;
                case "4":
                default:
                    break;
            }
        });
        $("[name=omScanArgTo]").val();
        $("[name=omScanArgTo]").change();

        $("[name=omScanArgFileFormat]").change(
        function () {
            var value = $(this).val();
            if (0 == value || 2 == value) {
                $("[name=omScanArgNup]").prop("checked",  false);
                $('[name=omScanArgNup]').attr("disabled", true);
            }
            else if (1 == value ) {
                $("[name=omScanArgNup]").prop("checked",  true);
                $('[name=omScanArgNup]').attr("disabled", true);
            }else {
                $('[name=omScanArgNup]').attr("disabled", false);
            }
        });
        $("[name=omScanArgFileFormat]").val();
        $("[name=omScanArgFileFormat]").change();

        $("[name=omSmbNoAuthFlag]").change(
        function () {
            if (this.checked){
                $('[name=omSmbServerUser]').val("anonymous");
                $('[name=omSmbServerPswd]').val("smb_server_password");
                PasswordChangeFlag = 1;
            }
            $('[name=omSmbServerUser]').attr("disabled", this.checked);
            $('[name=omSmbServerPswd]').attr("disabled", this.checked);
        });
        $("[name=omSmbNoAuthFlag]").change();

        $("[name=omFtpNoAuthFlag]").change(
        function () {
            if (this.checked){
                $('[name=omFtpServerUser]').val("anonymous");
                $('[name=omFtpServerPswd]').val("you@email.com");
            }
            $('[name=omFtpServerUser]').attr("disabled", this.checked);
            $('[name=omFtpServerPswd]').attr("disabled", this.checked);
        });
        $("[name=omFtpNoAuthFlag]").change();

        $("[name=omScanArgDuplex]").change(
        function () {
            var value = $(this).val();
            var omtmp = $("[name=omScanArgResolution]");
            if (4 == value) {
                if($("[name=omScanArgResolution]").val() == 3)
                    SetSelectValue(omtmp[0].options, 2);
                omtmp[0].options[3].disabled = true;
            }
            else if (0 == value ) {
                omtmp[0].options[3].disabled = false;
            }
        });
        $("[name=omScanArgDuplex]").val();
        $("[name=omScanArgDuplex]").change();
    LoadMainDialog(opfunc, clfunc, title, buttons, "550");
}

function LoadNetPortManDialog(submitom, opt, json) {
    var opfunc = function () {
        var contentHtml = '';
        var flag = (undefined != json);

        contentHtml = SN.FUNC.InsertOtherOmDiv(SN.DATA.omNetPortName);
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omNetPortProtocol);
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omNetPortNo);
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omNetPortEnabled);
        $("#id_main_dailog").html(contentHtml);

        //input长度限制
        $("[name=omNetPortName]").attr("maxLength", "16").val(flag ? json.name : "");
        $("[name=omNetPortNo]").attr("maxLength", "5").val(flag ? json.port : "");

        $("[name=omNetPortProtocol]").val(flag ? json.protocol : 1);
        $("[name=omNetPortEnabled]").val(flag ? json.enabled : 2);
    };
    var clfunc = function () {
        $("#id_main_dailog_parent").html('<div id="id_main_dailog"></div>');
        $(this).remove();
    };
    var title = (OPT_NEW == opt) ? SN.INFO.ButtonNetPortNew : SN.INFO.ButtonModify;
    var buttons = [{
        text: SN.INFO.ButtonApply,
        click: function () {
            var name = $("[name=omNetPortName]")[0];
            var protocol = $("[name=omNetPortProtocol]")[0];
            var port = $("[name=omNetPortNo]")[0];
            var enabled = $("[name=omNetPortEnabled]")[0];

            if (SN.FUNC.CheckInput(name) && SN.FUNC.CheckInput(port)) {
                var data = submitom + '=';
                var value = '{"name":"' + name.value + '","protocol":"' + protocol.value + '","port":"' + port.value + '","enabled":"' + enabled.value + '"}';
                var list = SN.DATA.omNetPortContent;
                for (var i = 0; i < list.length; i++) {
                    var json = GetJson(list[i]); //获取json对象
                    if (undefined != json) {
                        if (json.protocol == protocol.value && json.port == port.value) {
                            if (OPT_NEW == opt) {
                                var name = SN.DATA.omNetPortNo.name;
                                SN.FUNC.ShowErrorInfo(name, SN.INFO.ErrNetPortExist);
                                return;
                            } else if (json.name == name.value && json.enabled == enabled.value && submitom.endsWith("."+i)) {
                                $(this).dialog("close");
                                return;
                            }
                        }
                    }
                }

                data += EncodeBase64(value);
                postdata(data, undefined);
                $(this).dialog("close");
            }
        }
    }];
    LoadMainDialog(opfunc, clfunc, title, buttons, "550");
}
function LoadIpsecListDialog(submitom, opt, json, first) {
    var opfunc = function(){
        var contentHtml = '';
        var flag = (undefined != json);

        contentHtml = SN.FUNC.InsertOtherOmDiv(SN.DATA.omIpsecIPv4);
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omIpsecSharedKey);
        $("#id_main_dailog").html(contentHtml);
        
        //input长度限制
        $("[name=omIpsecIPv4]").attr("maxLength", "15").val(flag ? json.IPV4 : "");
        $("[name=omIpsecSharedKey]").attr("maxLength", "17").val(flag ? json.SHAREKEY : "");
    };
    var clfunc = function(){
        OPT_ROW_NO = 0;
        $("#id_main_dailog_parent").html('<div id="id_main_dailog"></div>');
        $(this).remove();
    };
    
    var title = (OPT_NEW == opt) ? SN.INFO.ButtonNew : SN.INFO.ButtonModify;
    if("编辑" === title)
        var editPreIPv4 = json["IPV4"];
	
    var buttons = [{
        text: SN.INFO.ButtonApply,
        click: function(){
            var IP = $("[name=omIpsecIPv4]")[0];
            var SHAREKEY = $("[name=omIpsecSharedKey]")[0];
            if (SN.FUNC.CheckInput(IP) && SN.FUNC.CheckInput(SHAREKEY)) {
                var data = submitom + '=';
                var value = {"IPV4":IP.value.toUpperCase(),"SHAREKEY":SHAREKEY.value};
                value = JSON.stringify(value);
                
                var IpsecObj = JSON.parse(value);
                var list = SN.DATA.omIpsecListContent;
                
                for (var i = 0; i < list.length; i++)
                {
                    var listJsonObj = GetJson(list[i]);
                    if(undefined == listJsonObj)
                    {
                        break;
                    }
                    if("新增" === title)
                    {
                        if(listJsonObj["IPV4"] === IpsecObj.IPV4)
                        {
                            alert("输入IP地址已有策略");
                            $(this).dialog("close");
                            return ;
                        }
                    }
                    else ("编辑" === title)
                    {
                        if(editPreIPv4 === IpsecObj.IPV4 )
                        {
                            if(listJsonObj["SHAREKEY"] === IpsecObj.SHAREKEY)
                            {
                                alert("输入IP地址已有策略");
                                $(this).dialog("close");
                                return ;
                            }
                            else
                            {
                                break;
                            }
                        }
                        else
                        {
                            if(listJsonObj["IPV4"] === IpsecObj.IPV4)
                            {
                                alert("输入IP地址已有策略");
                                $(this).dialog("close");
                                return ;
                            }
                        }
                    }
                }
                
                data += EncodeBase64(value);
                postdata(data, undefined, RefreshCurrentPage);
                $(this).dialog("close");
            }
        }
    }];
    LoadMainDialog(opfunc, clfunc, title, buttons, "600");
}
function LoadIPFilterListDialog(submitom, opt, json, first) {
    var opfunc = function(){
        var contentHtml = '';
        var flag = (undefined != json);

        contentHtml = SN.FUNC.InsertOtherOmDiv(SN.DATA.omIPFilterListIP);
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omIPFilterListMASK);
        if(first == 1)
        {
            contentHtml += '<div class="leftshow_font ' + ChangeCss('float-left') + '">';
            contentHtml += SN.INFO.IPFilterListNoPolicyWarnings;
            contentHtml += '</div>';
        }
        $("#id_main_dailog").html(contentHtml);

        //input长度限制
        $("[name=omIPFilterListIP]").attr("maxLength", "16").val(flag ? json.IPV4 : "");
        $("[name=omIPFilterListMASK]").attr("maxLength", "16").val(flag ? json.MASK : "");
    };
    var clfunc = function(){
        OPT_ROW_NO = 0;
        $("#id_main_dailog_parent").html('<div id="id_main_dailog"></div>');
        $(this).remove();
    };

    var title = (OPT_NEW == opt) ? SN.INFO.ButtonNew : SN.INFO.ButtonModify;

    var buttons = [{
        text: SN.INFO.ButtonApply,
        click: function(){
            var IP = $("[name=omIPFilterListIP]")[0];
            var MASK = $("[name=omIPFilterListMASK]")[0];
            if (SN.FUNC.CheckInput(IP) && SN.FUNC.CheckInput(MASK)) {
                var data = submitom + '=';
                var value = '{"IPV4":"' + IP.value.toUpperCase() + '","MASK":"' + MASK.value.toUpperCase() + '"}';
                var list = SN.DATA.omIPFilterListContent;

                for (var i = 0; i < list.length; i++) {
                    if (list[i] == value) {
                        $(this).dialog("close");
                        return ;
                    }
                }

                data += EncodeBase64(value);
                postdata(data, undefined, RefreshCurrentPage);
                $(this).dialog("close");
            }
        }
    }];
    LoadMainDialog(opfunc, clfunc, title, buttons, "600");
}
// download specified file, add by lijunxiong.
function download(url)
{
	var $a = document.createElement('a');
	$a.setAttribute("href", url);
	$a.setAttribute("download", "");

	var evobj = document.createEvent('MouseEvents');
	evobj.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, true, false, 0, null);
	$a.dispatchEvent(evobj);
}

// download specified file, add by lijunxiong.
function download(url)
{
    var $a = document.createElement('a');
    $a.setAttribute("href", url);
    $a.setAttribute("download", "");

    var evobj = document.createEvent('MouseEvents');
    evobj.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, true, false, 0, null);
    $a.dispatchEvent(evobj);
}




