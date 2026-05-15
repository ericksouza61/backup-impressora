//产品信息页面初始化
function InitInfoHtml() {
    var div = $("#form_main")[0];
    if (div) {
        var contentHtml = "";
        var tmpval = SN.DATA.omProductName.value;
        SN.DATA.omProductName.value += (isNeedAppendMinus() ? "-Series" : " Series");
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omProductName);
        SN.DATA.omProductName.value = tmpval;
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omSerialNumber);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omFirmVersion);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omConsumerPosition, true);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omContactInfo, true);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omPrinterStatus);
        /*if(!CheckProductID(9))
        {
            contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omTonerRemain);
        }*/
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omCartridgeStatus);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omDrumStatus);

        div.innerHTML = contentHtml;
        /*if(!CheckProductID(9))
        {
            $("#tr_progressbar").addClass(ChangeCss('float-left'));
            $("#tr_progressbar").progressbar({ value: parseInt(SN.DATA.omTonerRemain.value, 10) });
        }*/
    }
}
function InitScanInfoHtml() {
    var div = $("#form_main")[0];
    if (div) {
        var contentHtml = "";

        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.flatbedCopyNum);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.flatbedHostNum);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.ADFCopyNum);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.ADFHostNum);

        div.innerHTML = contentHtml;
    }
}

function InitDeviceInfoHtml() {
    var div = $("#form_main")[0];
    var css_float = ChangeCss('float-left');
    if (div) {
        var contentHtml = "";

        contentHtml += '<div class="' + css_float + '">' + '&nbsp;'+ SN.INFO.PageConsumables + '</div><br><br>';
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.CartridgeType);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.TonerRemain);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.printedPages);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.aveCoverage);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.expectedPrintNum);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.drumType);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.drumRemain);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.drumPrintedNum);

        div.innerHTML = contentHtml;

        $("#tonerremain_progressbar").addClass(ChangeCss('float-left'));
        $("#tonerremain_progressbar").progressbar({ value: parseInt(SN.DATA.TonerRemain.value, 10) });

        $("#drumremain_progressbar").addClass(ChangeCss('float-left'));
        $("#drumremain_progressbar").progressbar({ value: parseInt(SN.DATA.drumRemain.value, 10) });
    }
}

function InitCopyInfoHtml() {
    var div = $("#form_main")[0];
    var css_float = ChangeCss('float-left');
    if (div) {
        var contentHtml = "";

        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.copyTotalCnt);
        contentHtml += '<div class="' + css_float + '">' + '&nbsp;' + SN.INFO.PageCopyDiffPaper + '</div><br><br>';
        contentHtml += SN.FUNC.InsertPaperCntDiv(SN.DATA.copyCntA4);
        contentHtml += SN.FUNC.InsertPaperCntDiv(SN.DATA.copyCntA5);
        contentHtml += SN.FUNC.InsertPaperCntDiv(SN.DATA.copyCntA6);
        contentHtml += SN.FUNC.InsertPaperCntDiv(SN.DATA.copyCntLegal);
        contentHtml += SN.FUNC.InsertPaperCntDiv(SN.DATA.copyCntB5);
        contentHtml += SN.FUNC.InsertPaperCntDiv(SN.DATA.copyCntOther);

        div.innerHTML = contentHtml;
    }
}

function ShowSimpleTable(container_id, head, data_array) {
    let div = $('#'+container_id)[0];
    if (!div) return;
    let contentHtml = '<table id="simple_table_1" cellpadding="1" class="wifi-step-table">';

    contentHtml += '<tr class="wifi-table-tr">';
    for (let i = 0; i < head[0].length; i++) {
        contentHtml += '<td class="tableColumnHeader" id="thead_index' + i + '">' + head[0][i] + '</td>';
    }
    contentHtml += '</table>';
    div.innerHTML = contentHtml;

    if (data_array.length > 0) {
        let table1 = $('#simple_table_1')[0];
        let keys1 = head[1];
        for (let i = 0; i < data_array.length; ++i) {
            let jsonObj, tr, td;
            tr = table1.insertRow(-1);
            tr.index = i;
            jsonObj = data_array[i];
            keys1.forEach(function (k) {
                td = tr.insertCell(-1);
                td.align = "center";
                td.innerHTML = jsonObj[k];
            });
            $(tr).attr("class", "tablerowunSelected");
        }
    }
}

function InitErrorLogInfoHtml() {
    var head = [ [SN.INFO.PageTableNo, SN.INFO.omErrCode, SN.INFO.omErrDetail,
        SN.INFO.omErrTime, SN.INFO.omErrActualityCount],
        ["id", "err_code", "err_detail", "time", "acl_count"] ];
    ShowSimpleTable('form_main', head, []);
    postdata('', '/ErrorLog', function(data){
        if (undefined === data || '' == data) {
            alert(SN.INFO.NoReturnMessage);//没有返回数据
            return ;
        }

        let head = [ [SN.INFO.PageTableNo, SN.INFO.omErrCode, SN.INFO.omErrDetail,
            SN.INFO.omErrTime, SN.INFO.omErrActualityCount],
            ["id", "err_code", "err_detail", "time", "acl_count"] ];
        ShowSimpleTable('form_main', head, data);
    });

    $('#error_log_export').click(function () {
        download('export_error_log.csv');
    });
}

function InitPrintInfoHtml() {
    var div = $("#form_main")[0];
    var css_float = ChangeCss('float-left');
    if (div) {
        var contentHtml = "";

        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.printTotalCnt);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.printAutoDuplex);
        contentHtml += '<div class="' + css_float + '">' + '&nbsp;' + SN.INFO.PagePrintDiffPaper + '</div><br><br>';
        contentHtml += SN.FUNC.InsertPaperCntDiv(SN.DATA.printCntA5);
        contentHtml += SN.FUNC.InsertPaperCntDiv(SN.DATA.printCntA4);
        contentHtml += SN.FUNC.InsertPaperCntDiv(SN.DATA.printCntLegal);
        contentHtml += SN.FUNC.InsertPaperCntDiv(SN.DATA.printCntB5);
        contentHtml += SN.FUNC.InsertPaperCntDiv(SN.DATA.printCntB6);
        contentHtml += SN.FUNC.InsertPaperCntDiv(SN.DATA.printCntOther);

        div.innerHTML = contentHtml;
    }
}

function InitSystemHtml() {
    var div = $("#form_main")[0];
    if (div) {
        var contentHtml = "";
        var css_float = ChangeCss('float-left');
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omConsumerPosition);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omContactInfo);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omPropertyNumber);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omSleepTime);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omJobTimeOut);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omDate);//##jimmy##
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omTime);//##jimmy##
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omUTC);//##jimmy##
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omSNTPserversyn);//##jimmy##
        contentHtml += '<div class="' + "step2"  + '">';
        contentHtml += '<div class="rightshow ' + css_float + '"/>';
        contentHtml += '<input type="button" id="button_clicksntp" value="' + SN.INFO.ButtonSntpsyn + '"/>';//点击立即同步
        contentHtml += '</div>';
        contentHtml += '</div>';
        contentHtml += '<div class="' + "step2"  + '">';
        contentHtml += '<div class="leftshow ' + css_float + '" id="system_to_sntp" style="color: #666666;margin-bottom: -20px">' + SN.INFO.Pageskiptosntpips + '</div>';
        contentHtml += '<div class="rightshow ' + css_float + '"/>';
        contentHtml += '<input type="button" id="button_jumpsntp" value="' + SN.INFO.ButtonSntpsetting + '"/>';//跳转到系统时间
        contentHtml += '</div>';
        contentHtml += '</div>';

        div.innerHTML = contentHtml;

        //##jimmy##跳转到sntp
        $('#button_jumpsntp').click(
            function(){
                document.getElementById("SNTP").click();
            });

        //add sntp立即同步
        $('#button_clicksntp').click(
            function () {
            var data = "omSNTPclicksyn" + "=" + EncodeBase64("1");
            postdata(data, undefined, RefreshCurrentPage);
            });

        //勾选与sntp服务器同步，不能设置日期和时间
        var enable_sntp = SN.DATA.omSNTPserversyn.value;
        if(enable_sntp == 1)
        {
            $("[name=omDate]").attr("disabled", true);
            $("[name=omTime]").attr("disabled", true);
        }
        if(enable_sntp == 0)
        {
            $("#button_clicksntp").attr("disabled", true);
        }
        $("[name=omSNTPserversyn]").click(
            function ()
            {
                var checked = $("[name=omSNTPserversyn]").prop("checked");
                $("[name=omDate]").attr("disabled", checked);
                $("[name=omTime]").attr("disabled", checked);
                $("#button_clicksntp").attr("disabled", checked);
            }

        );

        //input长度限制
        $("[name=omContactInfo]").attr("maxLength", "31");
        $("[name=omPropertyNumber]").attr("maxLength", "31");
        $("[name=omConsumerPosition]").attr("maxLength", "63");
        $("[name=omJobTimeOut]").attr("maxLength", "3");
        $("[name=omDate]").attr("maxLength", "11");
        $("[name=omTime]").attr("maxLength", "9");
    }
}

function InitScanSetupHtml() {
    var div = $("#form_main")[0];
    var css_float = ChangeCss('float-left');
    if (div) {
        var contentHtml = "";
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omscanResolution);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omscanColor);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omscanFileFormat);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omscanArea);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omscanNup);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omscanNetImgQuality);

        contentHtml += '<div class="' + css_float + '">' + '&nbsp;'+ SN.INFO.PageScanToEmail + '</div><br><br>';
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omScanToEmailSubject);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omScanToEmailBody);

        div.innerHTML = contentHtml;

        $("[name^=omScanToEmailSubject]").attr("maxLength", "78");
        $("[name^=omScanToEmailBody]").attr("maxLength", "511");
    }
}

function InitPrintSetHtml() {
    var div = $("#form_main")[0];
    if (div) {
        var contentHtml = "";
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omSkipBlankEnabled);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omA4ToA5Mode);

        div.innerHTML = contentHtml;
    }
}

function InitScanToManagerHtml() {
    var div = $("#form_main")[0];
    if (div) {
        var contentHtml = "";
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omScanToPCEnabled);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omScanToEmailEnabled);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omScanToSmbEnabled);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omScanToFlashEnabled);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omScanToFtpEnabled);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omScanShortCutEnabled);

        div.innerHTML = contentHtml;
    
        if(1 == SN.DATA.omScanToSmbEnabled.value){
            $("#id_SMBINFO").show();
        }else{
            $("#id_SMBINFO").hide();
        }
        if(1 == SN.DATA.omScanToFtpEnabled.value){
            $("#id_FTPINFO").show();
        }else{
            $("#id_FTPINFO").hide();
        }
        if(1 == SN.DATA.omScanShortCutEnabled.value){
            $("#id_SCANQUICKSET").show();
        }else{
            $("#id_SCANQUICKSET").hide();
        }

        $("[name=omScanToPCEnabled]").click(function ()
        {
            var checked = $("[name=omScanToPCEnabled]").prop("checked");
            if(checked && (0 == SN.DATA.omUsbEnabled.value))
            {
                alert(SN.INFO.omScanToPcCheck);
            }
        });

        $("[name=omScanToFlashEnabled]").click(function ()
        {
            var checked = $("[name=omScanToFlashEnabled]").prop("checked");
            if(checked && (0 == SN.DATA.omUsbDriveEnabled.value))
            {
                alert(SN.INFO.omScanToFlashCheck);
            }
        });
    }
}


function AddEmailAddress(list, index) {
    var json = GetJson(list[index]); //获取json对象

    if (undefined != json) {
        $("[name=omSMTPEnableEmailAddr" + SN.DATA.AddIndex + "]").attr("checked", true);
        $("[name=omSMTPClientAddress" + SN.DATA.AddIndex + "]").attr("disabled", false);
        $("[name=omSMTPClientAddress" + SN.DATA.AddIndex + "]").attr("value", json.email);
    }
    $("#id_main_dailog").dialog("close");
}
function OpenAddEmailDailog() {
    var div = $("#id_main_dailog");
    var list = null;
    var noaddrinfo = "";

    if (div) {
        if (CheckProductID(3) || CheckProductID(4) || CheckProductID(7)) {
            SN.FUNC.LoadWifiScanDB("MAILINFO");
            list = SN.DATA.omMailinfoList;
            noaddrinfo = SN.INFO.NoMailAddress;
        } else {
            SN.FUNC.LoadWifiScanDB("ADDRBOOK");
            list = SN.DATA.omAddressContent;
            noaddrinfo = SN.INFO.NoAddrbookInfo;
        }
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

        div.html('<div id="id_addmail_table"></div>');
        div.dialog({
            open: function(){
                var head = [ [SN.INFO.PageTableNo, SN.DATA.omEmailUser.info,
                              SN.DATA.omEmailAddress.info],
                             ["", "user", "email"] ];
                LoadContorlTable(SN.TYPE.TableEmlAbs, "addmail", head);
            },
            close: function(){
                $("#id_main_dailog_parent").html('<div id="id_main_dailog"></div>');
                $(this).remove();
            },
            title: (CheckProductID(3) || CheckProductID(4) || CheckProductID(7)) ? SN.INFO.PageMailinfo : SN.INFO.PageAddrBook,
            autoOpen: false, modal: true, disabled: false, resizable: false, width: "720"
        });
        div.dialog("open");
    }
}
function InitEmailHtml() {
    var div = $("#form_main")[0];
    if (div) {
        var contentHtml = SN.FUNC.InsertOmDiv(SN.DATA.omSMTPSubject);
        contentHtml += '<div class="step-email-title"><b><span id="info_addr_title">';
        contentHtml += SN.INFO.PageEmialAddrTitle + '</span></b></div>';

        contentHtml += SN.FUNC.InsertEmailOmDiv(SN.DATA.omSMTPEnableEmailAddr1,
                                                SN.DATA.omSMTPClientAddress1);
        contentHtml += SN.FUNC.InsertEmailOmDiv(SN.DATA.omSMTPEnableEmailAddr2,
                                                SN.DATA.omSMTPClientAddress2);
        contentHtml += SN.FUNC.InsertEmailOmDiv(SN.DATA.omSMTPEnableEmailAddr3,
                                                SN.DATA.omSMTPClientAddress3);
        contentHtml += SN.FUNC.InsertEmailOmDiv(SN.DATA.omSMTPEnableEmailAddr4,
                                                SN.DATA.omSMTPClientAddress4);

        contentHtml += '<div class="step-email-title"><b><span id="info_notice_title">';
        contentHtml += SN.INFO.PageEmialNoticeTitle + '</span></b></div>';

        contentHtml += SN.FUNC.InsertEmailOmDiv(SN.DATA.omSMTPEmailPaperEmpty);
        contentHtml += SN.FUNC.InsertEmailOmDiv(SN.DATA.omSMTPEmailTonerLowWarning);
        contentHtml += SN.FUNC.InsertEmailOmDiv(SN.DATA.omSMTPEmailPaperJam);
        contentHtml += SN.FUNC.InsertEmailOmDiv(SN.DATA.omSMTPEmailCartridgeEnd);
        contentHtml += SN.FUNC.InsertEmailOmDiv(SN.DATA.omSMTPEmailPaperFew);

        div.innerHTML = contentHtml;

        $("[name^=omSMTPEnableEmailAddr]").change(
        function () {
            var checked = this.checked;
            var name = 'omSMTPClientAddress' + this.name.substring(this.name.length - 1);
            $('[name='+ name +']').attr("disabled", !checked);
            SN.FUNC.ShowErrorInfo(name, "", true);
        });
        $("[name^=omSMTPEnableEmailAddr]").change();

        SN.DATA.AddIndex = '';
        $(".snweb-addition").click(
        function() {
            SN.DATA.AddIndex = this.id.substring(this.id.length - 1);
            OpenAddEmailDailog();
        });

        //input长度限制
        $("[name^=omSMTPClientAddress]").attr("maxLength", "63");
        $("[name^=omSMTPSubject]").attr("maxLength", "78");
    }
}
function InitPsHtml() {
    var div = $("#form_main")[0];
    if (div) {
        var contentHtml = "";
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omJobPSErrReportEnable);

        div.innerHTML = contentHtml;
    }
}
function InitPclHtml() {
    var div = $("#form_main")[0];
    if (div) {
        var contentHtml = "";
        var flag = CheckLanguage();

        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omUserfontnum);
        SN.DATA.omUserfontpitch.value /= 100.0;
        SN.DATA.omUserfontheight.value /= 100.0;
        if (flag) {
            SN.DATA.omUserfontpitch.value = SN.DATA.omUserfontpitch.value.toString().replace(/(\.)/g, ",");
            SN.DATA.omUserfontheight.value = SN.DATA.omUserfontheight.value.toString().replace(/(\.)/g, ",");
        }
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omUserfontpitch, false, 0);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omUserfontheight, false, 1);
        if (flag) {
            SN.DATA.omUserfontpitch.value = SN.DATA.omUserfontpitch.value.toString().replace(/,/g, ".");
            SN.DATA.omUserfontheight.value = SN.DATA.omUserfontheight.value.toString().replace(/,/g, ".");
        }
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omUsersymbolset);
        SN.DATA.omUservmi.info += '(5~' + CurrentDefaultUservmi(SN.DATA.omUserpapersize.value, true) + ')';
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omUservmi, false, 2);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omUserTopMargin);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omUserBottomMargin);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omUserLeftMargin, false, 3);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omUserRightMargin, false, 3);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omUserWideA4);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omUserOffsetX, false, 1);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omUserOffsetY, false, 1);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omUserorientation);

        div.innerHTML = contentHtml;

        //input长度限制
        $("[name=omUserfontheight]").attr("maxLength", "6");
        $("[name=omUserfontpitch]").attr("maxLength", "5");
        $("[name=omUservmi]").attr("maxLength", "3");
        $("[name=omUserLeftMargin]").attr("maxLength", "3");
        $("[name=omUserRightMargin]").attr("maxLength", "3");
        $("[name=omUserOffsetX]").attr("maxLength", "4");
        $("[name=omUserOffsetY]").attr("maxLength", "4");
    }
}
function InitPrintHtml() {
    var div = $("#form_main")[0];
    if (div) {
        var contentHtml = "";
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omUserpapersize);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omUserpapertype);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omUserinputtray);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omUsercopies);
        //contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omUsermanualfeed);
        //contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omUserduplex);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omUserbind);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omUserdensity);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omUserresolution);

        div.innerHTML = contentHtml;

        //input长度限制
        $("[name=omUsercopies]").attr("maxLength", "3");
    }
}

function InitTraySetupHtml() {
    var div = $("#form_main")[0];
    if (div) {
        var contentHtml = "";
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omPrintTaryMediaPrompt);
        contentHtml += '<div class="' + "step2"  + '">';
        contentHtml += '<div class="leftshow float-left" id="usb_drive_step_tips" style="color: #666666;margin-bottom: -20px;width: auto">' + SN.INFO.PageTaryMediaPromptTip + '</div>';
        contentHtml += '</div>';

        contentHtml += '<div class="step-email-title"><b><span id="info_addr_title">';
        contentHtml += SN.INFO.MultipurposeTray + '</span></b></div>';
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omMultippsTraypsize);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omMultippsTrayptype);
        contentHtml += '<div class="step-email-title"><b><span id="info_addr_title">';
        contentHtml += SN.INFO.AutoInpTray + '</span></b></div>';
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omAutoInpTraypsize);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omAutoInpTrayptype);
        if(SN.DATA.omInputTrayNum.value >= 3) {
        contentHtml += '<div class="step-email-title"><b><span id="info_addr_title">';
        contentHtml += SN.INFO.OptionalTray1 + '</span></b></div>';
            contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omOptionalTray1psize);
            contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omOptionalTray1ptype);
        }
        if(SN.DATA.omInputTrayNum.value >= 4) {
            contentHtml += '<div class="step-email-title"><b><span id="info_addr_title">';
            contentHtml += SN.INFO.OptionalTray2 + '</span></b></div>';
           contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omOptiona2Tray1psize);
           contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omOptiona2Tray1ptype);
        }
        div.innerHTML = contentHtml;
    }
}
SN.DATA.omListEmpty = -1;
function InitSmbInfoHtml() {
    var head = null;
    var contentHtml = "";
    var div = $("#id_smbinfo_search")[0];

    SN.FUNC.LoadWifiScanDB("SMBINFO");
    head = [ [SN.INFO.PageTableNo, SN.DATA.omSmbServerName.info,
              SN.DATA.omSmbServerAddr.info],
             ["", "name", "addr"] ];
    if (div) {
        var om = null;

        om = new OM('', 'omSmbSearch', SN.TYPE.InputText, MODULE_EXTERN, 0);
        contentHtml += '<div>' + SN.FUNC.CreateDOM(om);
        om = new OM('', 'omSmbSearchOpt', SN.TYPE.Selection, MODULE_EXTERN, 30);
        contentHtml += SN.FUNC.CreateSelect(om);
        contentHtml += SN.FUNC.CreateButton(SN.TYPE.Search, SN.INFO.ButtonSearch) + '</div>';
        div.innerHTML = contentHtml;

        $("[name=omSmbSearch]").attr("maxLength", "15");
        $("#button_search").click(function() {
            var searchval = $("[name=omSmbSearch]").val();
            var searchopt = $("[name=omSmbSearchOpt]").val();
            LoadContorlTable(SN.TYPE.TableSmbSrv, "smbinfo", head, searchopt, searchval);
        });
    }

    LoadContorlTable(SN.TYPE.TableSmbSrv, "smbinfo", head);
}
function InitFtpInfoHtml() {
    var head = null;
    var contentHtml = "";
    var div = $("#id_ftpinfo_search")[0];

    SN.FUNC.LoadWifiScanDB("FTPINFO");
    head = [ [SN.INFO.PageTableNo, SN.DATA.omFtpServerName.info,
              SN.DATA.omFtpServerAddr.info],
             ["", "name", "addr"] ];
    if (div) {
        var om = null;

        om = new OM('', 'omFtpSearch', SN.TYPE.InputText, MODULE_EXTERN, 0);
        contentHtml += '<div>' + SN.FUNC.CreateDOM(om);
        om = new OM('', 'omFtpSearchOpt', SN.TYPE.Selection, MODULE_EXTERN, 17);
        contentHtml += SN.FUNC.CreateSelect(om);
        contentHtml += SN.FUNC.CreateButton(SN.TYPE.Search, SN.INFO.ButtonSearch) + '</div>';
        div.innerHTML = contentHtml;

        $("[name=omFtpSearch]").attr("maxLength", "15");
        $("#button_search").click(function() {
            var searchval = $("[name=omFtpSearch]").val();
            var searchopt = $("[name=omFtpSearchOpt]").val();
            LoadContorlTable(SN.TYPE.TableFtpSrv, "ftpinfo", head, searchopt, searchval);
        });
    }

    LoadContorlTable(SN.TYPE.TableFtpSrv, "ftpinfo", head);
}
function InitMailInfoHtml() {
    var head = null;
    var contentHtml = "";
    var div = $("#id_mailinfo_search")[0];

    SN.FUNC.LoadWifiScanDB("MAILINFO");
    SN.FUNC.LoadWifiScanDB("MAILGROUP");
    head = [ [SN.INFO.PageTableNo, SN.DATA.omEmailUser.info,
              SN.DATA.omEmailAddress.info],
              ["", "user", "email"] ];
    if (div) {
        var om = null;

        om = new OM('', 'omMailSearch', SN.TYPE.InputText, MODULE_EXTERN, 0);
        contentHtml += '<div>' + SN.FUNC.CreateDOM(om);
        om = new OM('', 'omMailSearchOpt', SN.TYPE.Selection, MODULE_EXTERN, 11);
        contentHtml += SN.FUNC.CreateSelect(om);
        contentHtml += SN.FUNC.CreateButton(SN.TYPE.Search, SN.INFO.ButtonSearch) + '</div>';
        div.innerHTML = contentHtml;

        $("[name=omMailSearch]").attr("maxLength", "15");
        $("#button_search").click(function() {
            var searchval = $("[name=omMailSearch]").val();
            var searchopt = $("[name=omMailSearchOpt]").val();
            LoadContorlTable(SN.TYPE.TableEmlSrv, "mailinfo", head, searchopt, searchval);
        });
    }
    LoadContorlTable(SN.TYPE.TableEmlSrv, "mailinfo", head);
}
function InitMailgroupHtml() {
    var head = null;

    SN.FUNC.LoadWifiScanDB("MAILGROUP");
    SN.FUNC.LoadWifiScanDB("MAILINFO");
    head = [ [SN.INFO.PageTableNo, SN.DATA.omGroupName.info,
              SN.DATA.omGroupNumber.info],
             ["", "name", "no"] ];
    LoadContorlTable(SN.TYPE.TableEmlGrp, "mailgrop", head);
}
function InitPhoneInfoHtml() {
    var head = null;
    var contentHtml = "";
    var div = $("#id_phoneinfo_search")[0];

    SN.FUNC.LoadWifiScanDB("PHONEINFO");
    head = [ [SN.INFO.PageTableNo, SN.DATA.omPhoneSpeed.info,
              SN.DATA.omPhoneUser.info, SN.DATA.omPhoneNumber.info],
             ["", "speed", "user", "number"] ];
    if (div) {
        var om = null;

        om = new OM('', 'omPhoneSearch', SN.TYPE.InputText, MODULE_EXTERN, 0);
        contentHtml += '<div>' + SN.FUNC.CreateDOM(om);
        om = new OM('', 'omPhoneSearchOpt', SN.TYPE.Selection, MODULE_EXTERN, 26);
        contentHtml += SN.FUNC.CreateSelect(om);
        contentHtml += SN.FUNC.CreateButton(SN.TYPE.Search, SN.INFO.ButtonSearch) + '</div>';
        div.innerHTML = contentHtml;

        $("[name=omPhoneSearch]").attr("maxLength", "31");
        $("#button_search").click(function() {
            var searchval = $("[name=omPhoneSearch]").val();
            var searchopt = $("[name=omPhoneSearchOpt]").val();
            LoadContorlTable(SN.TYPE.TablePhnBks, "phoneinfo", head, searchopt, searchval);
        });
    }
    LoadContorlTable(SN.TYPE.TablePhnBks, "phoneinfo", head);
}
function InitPhonegroupHtml() {
    var head = null;

    SN.FUNC.LoadWifiScanDB("PHONEINFO");
    SN.FUNC.LoadWifiScanDB("PHONEGROUP");
    head = [ [SN.INFO.PageTableNo, SN.DATA.omGroupName.info,
              SN.DATA.omGroupNumber.info],
             ["", "name", "no"] ];
    LoadContorlTable(SN.TYPE.TablePhnGrp, "phonegrop", head);
}
function InitAddrBookHtml() {
    var head = null;

    SN.FUNC.LoadWifiScanDB("ADDRBOOK");
    head = [ [SN.INFO.PageTableNo, SN.DATA.omEmailUser.info,
              SN.DATA.omEmailAddress.info],
             ["", "user", "email"] ];
    LoadContorlTable(SN.TYPE.TableAddBks, "addrbook", head);
}
function InitConsumablesHtml() {
    var div = $("#form_main")[0];
    if (div) {
        var contentHtml = "";
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omTownerLowSetting);

        div.innerHTML = contentHtml;

    }
}
//设置页面初始化
function InitIpv4Html() {
    var div = $("#form_main")[0];
    if (div) {
        var contentHtml = "";

        //ipv4
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omHostName);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omMACAddress);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omUserDHCP);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omIPv4Address);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omIPv4SubnetMask);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omIPv4GatewayAddress);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omDomainName);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omIPv4DNSDHCP);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omIPv4MainDNS);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omIPv4OtherDNS);

        //ipv6
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omIPv6LocalAddress);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omIPv6Address);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omIPv6GatewayAddress);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omIPv6MainDNS);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omIPv6OtherDNS);

        div.innerHTML = contentHtml;

        //UserDHCP Change
        $("[name=omUserDHCP]").change(
        function() {
            var pageOm = ["omIPv4Address", "omIPv4SubnetMask", "omIPv4GatewayAddress"];

            for (var i = 0; i < pageOm.length; i++) {
                $("[name=" + pageOm[i] + "]").attr("disabled", 1 == this.value);
            }
        });
        $("[name=omUserDHCP]").val(SN.DATA.omUserDHCP.value);
        $("[name=omUserDHCP]").change();

        $("[name=omIPv4DNSDHCP]").change(
        function() {
            var pageOm = ["omIPv4MainDNS", "omIPv4OtherDNS"];

            for (var i = 0; i < pageOm.length; i++) {
                $("[name=" + pageOm[i] + "]").attr("disabled", 1 == this.value);
            }
        });
        $("[name=omIPv4DNSDHCP]").val(SN.DATA.omIPv4DNSDHCP.value);
        $("[name=omIPv4DNSDHCP]").change();

        //input长度限制
        $("[name=omHostName]").attr("maxLength", "15");
        $("[name=omIPv4Address]").attr("maxLength", "15");
        $("[name=omIPv4SubnetMask]").attr("maxLength", "15");
        $("[name=omIPv4GatewayAddress]").attr("maxLength", "15");
        $("[name=omIPv4OtherDNS]").attr("maxLength", "15");
        $("[name=omIPv4MainDNS]").attr("maxLength", "15");
        $("[name=omDomainName]").attr("maxLength", "63");

        //清除CKIPPart flag
        SN.DATA.CKIPPart[3] = [0, 0, 0, 0];
    }
}
function InitIpv6Html() {
    var div = $("#form_main")[0];
    if (div) {
        var contentHtml = "";
        //contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omHostName, true);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omEnableIPv6);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omUseDHCPv6);
        //contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omIPv6LocalAddress);
        //contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omIPv6Address);
        //contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omIPv6GatewayAddress);
        //contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omIPv6MainDNS);
        //contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omIPv6OtherDNS);

        div.innerHTML = contentHtml;

        //IPv6Enable Change
        $("[name=omEnableIPv6]").change(
        function () {
            var checked = this.checked;
            $("[name=omUseDHCPv6]").attr("disabled", !checked);
        });
        $("[name=omEnableIPv6]").change();
    }
}
function InitRawlpdHtml() {
    var div = $("#form_main")[0];
    if (div) {
        var contentHtml = "";
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omEnable9100PRT);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omEnableLPRPRT);

        div.innerHTML = contentHtml;
    }
}
function InitSnmpHtml() {
    var div = $("#form_main")[0];
    if (div) {
        var contentHtml = '<div style="height: 30px; /">';
        var css_float = ChangeCss('float-left');

        //contentHtml += '<b><span id="info_snmp_surport">' + SN.INFO.PageSnmpInfo + '</span></b></div>';

        contentHtml += '<div class="step1">';
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omEnableSnmp);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omEnableSnmpv1v2);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omEnableSnmpv3);
        contentHtml += '<div class="leftshow ' + css_float + '" id="info_snmp_version">' + SN.INFO.PageSnmpVersion + '</div>';
        var enable_v1v2 = SN.DATA.omEnableSnmpv1v2.value;
        var enable_v3 = SN.DATA.omEnableSnmpv3.value;
        if( enable_v1v2 != 0 && enable_v3 != 0)
        {
            contentHtml += '<div class="rightshow ' + css_float + '">' + 'SNMP v1/v2c/v3' + '</div>';
        }
        else if(enable_v1v2 != 0 && enable_v3 == 0)
        {
            contentHtml += '<div class="rightshow ' + css_float + '">' + 'SNMP v1/v2c' + '</div>';
        }
        else if(!enable_v1v2 == 0 && enable_v3 != 0)
        {
            contentHtml += '<div class="rightshow ' + css_float + '">' + 'SNMP v3' + '</div>';
        }
        else
        {
            contentHtml += '<div class="rightshow ' + css_float + '">' + 'None' + '</div>';
        }
        contentHtml += '</div>';

        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omSnmpComv1, false, true);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omSnmpComv2c, false, true);
        //contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omSnmpComv3, false, true);
        contentHtml += '<div><b><span id="info_snmp_v3info">' + SN.INFO.PageSnmpv3Info + '</span></b></div>';
        contentHtml += '<div class="' + "step2"  + '">';
        contentHtml += '<div class="leftshow ' + css_float + '">';
        contentHtml += SN.INFO.PageSnmpv3Display;
        contentHtml += '</div>';
        contentHtml += '<div><img class="snweb-show-password ' + ChangeCss('margin-r-usual') + '" name="snmpv3_display"/></div>';
        contentHtml += '</div>';

        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omSnmpV3user, false, true);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omSnmpV3auth, false, true);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omSnmpV3priv, false, true);
        div.innerHTML = contentHtml;

        $("[name=omEnableSnmp]").change(
            function ()
            {
                var checked = $("[name=omEnableSnmp]").prop("checked");
                $("[name=omEnableSnmpv1v2]").attr("disabled", !checked);
                $("[name=omEnableSnmpv3]").attr("disabled", !checked);
            }
        );
        $("[name^=omEnableSnmp]").change();

        $("[name=omEnableSnmpv1v2]").click(
            function ()
            {
                var checked = $("[name=omEnableSnmpv1v2]").prop("checked");
                if(checked)
                {
                    LoadSnmpV1V2cEnableDialog();
                }
                else
                {
                    LoadSnmpV1V2cDisableDialog();
                }
            }

        );

        $("[name=omEnableSnmpv3]").click(
            function ()
            {
                var checked = $("[name=omEnableSnmpv3]").prop("checked");
                //$("[name=omSnmpComv3]").attr("disabled", !checked);
                $("[name=omSnmpV3user]").attr("disabled", !checked);
                $("[name=omSnmpV3auth]").attr("disabled", !checked);
                $("[name=omSnmpV3priv]").attr("disabled", !checked);
            }

        );

        $("[name=omSnmpComv1]").attr("disabled", (enable_v1v2 == 0));
        $("[name=omSnmpComv2c]").attr("disabled", (enable_v1v2 == 0));
        //$("[name=omSnmpComv3]").attr("disabled", (enable_v3 == 0));
        $("[name=omSnmpV3user]").attr("disabled", (enable_v3 == 0));
        $("[name=omSnmpV3auth]").attr("disabled", (enable_v3 == 0));
        $("[name=omSnmpV3priv]").attr("disabled", (enable_v3 == 0));


        //input长度限制
        $("[name=omSnmpComv1]").attr("maxLength", "31");
        $("[name=omSnmpComv2c]").attr("maxLength", "31");
        //$("[name=omSnmpComv3]").attr("maxLength", "31");
        $("[name=omSnmpV3user]").attr("maxLength", "31");
        $("[name=omSnmpV3auth]").attr("maxLength", "31");
        $("[name=omSnmpV3priv]").attr("maxLength", "31");

        $("[name=omSnmpV3user][type=text]").hide();
        $("[name=omSnmpV3auth][type=text]").hide();
        $("[name=omSnmpV3priv][type=text]").hide();
        ClearPasswordValue("omSnmpV3auth");
        ClearPasswordValue("omSnmpV3priv");

        let SnmpV3auth = document.getElementById("omSnmpV3auth_text");
        SnmpV3auth.addEventListener("focus", passwordfocus1);
        function passwordfocus1 (){
            if(SnmpV3auth.value == "*************************")
                SnmpV3auth.value = "";
        }
        let SnmpV3priv = document.getElementById("omSnmpV3priv_text");
        SnmpV3priv.addEventListener("focus", passwordfocus2);
        function passwordfocus2 (){
            if(SnmpV3priv.value == "*************************")
                SnmpV3priv.value = "";
        }
    }
}
function InitWsdHtml() {
    var div = $("#form_main")[0];
    if (div) {
        var contentHtml = "";
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omEnableWSD);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omWSDPort);

        div.innerHTML = contentHtml;

        //$("[name=omEnableWSD]").attr("disabled", true);
    }
}

//##Jimmy##
function InitSMBHtml() {
    var div = $("#form_main")[0];
    if (div) {
        var contentHtml = "";
        var css_float_left = ChangeCss('float-left');
        var css_float_right = ChangeCss('float-right');

        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omEnableSMBNTLMV1);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omEnableSMBAuto);
        contentHtml += '<div class="' + "step2"  + '">';
        contentHtml += '<div class="leftshow ' + css_float_left + '" id="smb_to_date" style="color: #666666;margin-bottom: -20px">' + SN.INFO.Pageskiptodatetips + '</div>';
        contentHtml += '<div class="rightshow ' + css_float_right + '"/>';
        contentHtml += '<input type="button" id="button_jump1" value="' + SN.INFO.ButtonDateandtime + '"/>';//跳转到系统时间
        contentHtml += '</div>';
        contentHtml += '</div>';

        div.innerHTML = contentHtml;

        //跳转到系统时间
        $('#button_jump1').click(
            function(){
                document.getElementById("SYSTEM").click();
            });

        //2.checkbox二选一
        $("[name=omEnableSMBNTLMV1]").click(
            function ()
            {
                var checked = $("[name=omEnableSMBNTLMV1]").prop("checked");
                if(checked == true)
                {
                    $("[name=omEnableSMBAuto]").attr('checked', false);
                }
                else
                {
                    $("[name=omEnableSMBAuto]").attr('checked', true);
                }
            }
        );

        $("[name=omEnableSMBAuto]").click(
            function ()
            {
                var checked = $("[name=omEnableSMBAuto]").prop("checked");
                if(checked == true)
                {
                    $("[name=omEnableSMBNTLMV1]").attr('checked', false);
                }
                else
                {
                    $("[name=omEnableSMBNTLMV1]").attr('checked', true);
                }
            }
        );
    }

}

//##Jimmy##
function InitSNTPHtml() {
    var div = $("#form_main")[0];
    if (div) {
        var contentHtml = "";
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omSNTPStatus);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omSNTPAddress);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omSNTPPort);

        div.innerHTML = contentHtml;
        //input长度限制
        $("[name=omSNTPAddress]").attr("maxLength", "22");
        $("[name=omSNTPPort]").attr("maxLength", "5");
    }
}
function InitWifiHtml() {
    var div = $("#form_main")[0];
    var css_float = ChangeCss('float-left');
    if (div) {
        var contentHtml = "";
        contentHtml += '<div class="wifi-step-up ' + css_float + '">';
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.wifiEnabled) + '</div>';
        contentHtml += '<div class="leftshow float-left" id="wifi_step_tips" style="color: #666666;margin-bottom: -20px">' + SN.INFO.PageWifiPortTip + '</div>';
        div.innerHTML = contentHtml;
        if (SN.DATA.wifiEnabled.value == 1) {
            if (SN.DATA.wifiStaEnabled.value == 1) {
                $("#id_WIFIIP").show();//显示无线IP配置页面
            } else {
                $("#id_WIFIIP").hide();//隐藏无线IP配置页面
            }
            $("#id_STA").show();//显示无线STA设置页面
            $("#id_WPS").show();//显示无线WPS设置页面
            $("#id_WFD").show();//显示无线WFD设置页面
        } else {
            $("#id_WIFIIP").hide();//隐藏无线IP配置页面
            $("#id_STA").hide();//隐藏无线STA设置页面
            $("#id_WPS").hide();//隐藏无线WPS设置页面
            $("#id_WFD").hide();//隐藏无线WFD设置页面
        }
    }
}

function InitNetPortManHtml() {
	SN.FUNC.LoadWifiScanDB("NETPORTMAN");

	var div = $("#form_main")[0];
	if (div) {
		var contentHtml = "";
		contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omWebForceEnabled);
		contentHtml += '<div class="' + "step2"  + '">';
		contentHtml += '<div class="leftfullshow float-left" id="net_port_step_tips" style="color: #666666;margin-bottom: -20px">' + SN.INFO.PageWebForceEnabledTip + '</div>';
		contentHtml += '</div>';
		contentHtml += '<div id="id_netportman_table" style="width: 720px; margin: 0px auto;"></div>';
		div.innerHTML = contentHtml;
	}

	var head = null;
	head = [ [SN.INFO.PageTableNo, SN.DATA.omNetPortName.info, SN.DATA.omNetPortProtocol.info,
			SN.DATA.omNetPortNo.info, SN.DATA.omNetPortEnabled.info],
			["", "name", "protocol", "port", "enabled"] ];
	LoadContorlTable(SN.TYPE.TableNetPortMan, "netportman", head);

	$("[name=omWebForceEnabled]").click(function ()
	{
		if (!CheckIsLogined()) {
			return;
		}

		var choose;
		var checked = $("[name=omWebForceEnabled]").prop("checked");
		if(checked)
		{
			choose = confirm(SN.INFO.NetPortSureWebForceEnabled);
			if(choose == true)
			{
				var data = SN.DATA.omWebForceEnabled.name + "=" + EncodeBase64("1");
				postdata(data, undefined, RefreshCurrentPage);
				$("[name=omWebForceEnabled]").prop("checked", true);
			}
			else
			{
				$("[name=omWebForceEnabled]").prop("checked", false);
			}
		}
		else
		{
			choose = confirm(SN.INFO.NetPortSureWebForceDisabled);
			if(choose == true)
			{
				var data = SN.DATA.omWebForceEnabled.name + "=" + EncodeBase64("0");
				postdata(data, undefined, RefreshCurrentPage);
				$("[name=omWebForceEnabled]").prop("checked", false);
			}
			else
			{
				$("[name=omWebForceEnabled]").prop("checked", true);
			}
		}
	});
}

//新增Ipsec界面相关
function InitIpsecHtml() {
	SN.FUNC.LoadWifiScanDB("IPSEC");

	var div = $("#form_main")[0];
    if (div) {
        var contentHtml = "";
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omIpsecEnable);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omIkeCipherSuite);
		//contentHtml += '<div id="id_whitelist_table" style="width: 720px; margin: 0px auto;"></div>'
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omEspEncrypt);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omEspAuthentication);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omIKESASurvival);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omIpsecSASurvival);
        contentHtml += '<div id="id_ipsec_table" style="width: 720px; margin: 0px auto;"></div>'
        div.innerHTML = contentHtml;
        console.log(SN.DATA.omIpsecEnable)
    }
    
    var head = null;
    head = [ [SN.INFO.PageTableNo,
			  SN.DATA.omIpsecIPv4.info, 
              SN.DATA.omIpsecSharedKey.info], 
             ["", "IPV4", "SHAREKEY"] ];
    LoadContorlTable(SN.TYPE.TableIpsecList, "ipsec", head);

}

function InitWhiteListHtml() {
    SN.FUNC.LoadWifiScanDB("WHITELIST");

    var div = $("#form_main")[0];
    if (div) {
        var contentHtml = "";
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omWhiteListEnable);
        contentHtml += '<div class="leftshow_full ' + ChangeCss('float-left') + '" style="color:#FF0000">';
        contentHtml += SN.INFO.WhiteListWarnings;
        contentHtml += '</div>';
        contentHtml += '<div id="id_whitelist_table" style="width: 720px; margin: 0px auto;"></div>'

        div.innerHTML = contentHtml;
    }

    var head = null;
    head = [ [SN.INFO.PageTableNo, SN.DATA.omWhiteListIP.info,
        SN.DATA.omWhiteListMAC.info],
        ["", "IPV4", "MAC"] ];
    LoadContorlTable(SN.TYPE.TableWhiteList, "whitelist", head);
}

function InitUsbHtml() {
    var div = $("#form_main")[0];
    if (div) {
        var contentHtml = "";
        if(CheckProductID(3) || CheckProductID(4)) {
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omUsbDriveEnabled);
        contentHtml += '<div class="' + "step2"  + '" style="height: 60px">';
        contentHtml += '<div class="leftshow float-left" id="usb_drive_step_tips" style="color: #666666;margin-bottom: -20px">' + SN.INFO.PageUsbDriveTip + '</div>';
        contentHtml += '</div>';
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omUsbEnabled,false);
        contentHtml += '<div class="leftshow float-left" id="usb_step_tips" style="color: #666666;margin-bottom: -20px">' + SN.INFO.PageUsbPortTip + '</div>';
        } else {
            contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omUsbEnabled,false);
            contentHtml += '<div class="leftshow float-left" id="usb_step_tips" style="color: #666666;margin-bottom: -20px">' + SN.INFO.PageUsbPortTip_sfp + '</div>';
        }
        div.innerHTML = contentHtml;

    }
}
function InitHttpsManagerHtml() {
    var div = $("#form_main")[0];
    if (div) {
        var contentHtml = "";
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omHttpsManager);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omIppManager);
        div.innerHTML = contentHtml;
        $("[name=omIppManager]").click(
            function () {
                alert(SN.INFO.EnableIppAlert);
            });
    }
}

function InitMemoryResetHtml() {
    var div = $("#form_main")[0];
    if (div) {
        var contentHtml = "";
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omMemoryResetEnabled);

        div.innerHTML = contentHtml;
    }
}

function InitIPFilterListHtml() {
    SN.FUNC.LoadWifiScanDB("IPFilterLIST");

    var div = $("#form_main")[0];
    if (div) {
        var contentHtml = "";
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omIPFilterListEnable);
        contentHtml += '<div class="step2">';
        contentHtml += SN.FUNC.CreateDOM(SN.DATA.omIPFilterListRule);
        contentHtml += '</div>';
        contentHtml += '<div class="leftshow_full ' + ChangeCss('float-left') + '" style="color:#FF0000">';
        contentHtml += SN.INFO.IPFilterListWarnings;
        contentHtml += '</div>';
        contentHtml += '<div id="id_ipfilterlist_table" style="width: 720px; margin: 0px auto;"></div>'
       
        div.innerHTML = contentHtml;
        if(0 == SN.DATA.omIPFilterListRule.value) {
            $("[name=omIPFilterListRule][value=0]")[0].checked = true;
        } else if(1 == SN.DATA.omIPFilterListRule.value){
            $("[name=omIPFilterListRule][value=1]")[0].checked = true;
        } else {
            $("[name=omIPFilterListRule][value=1]")[0].checked = true;
        }
       
    }


    var head = null;
    head = [ [SN.INFO.PageTableNo, SN.DATA.omIPFilterListIP.info,
        SN.DATA.omIPFilterListMASK.info],
        ["", "IPV4", "MASK"] ];
    LoadContorlTable(SN.TYPE.TableIPFilterList, "ipfilterlist", head);
}

//点击密码框，清空输入框的内容，并隐藏/显示用于明文切换的小眼睛图标
function ClearPasswordValue(name){
        showpswname = "[name=showpsw_" + name + "]";
        nametype = "[name=" + name + "][type=password]";
        PasswordChangeFlag = 0;

        $(showpswname).hide();
        if(!IsAdmin())
        {
            $(nametype).attr("disabled", true);
        } else {
            $(nametype).attr("disabled", false);
        }
        let paswd = document.getElementById(name + "_password");
        paswd.addEventListener("focus", passwordfocus);
        function passwordfocus (){
            if(paswd.value == "*************************" || paswd.value == "******")
                paswd.value = "";
                $(showpswname).show();
	    	PasswordChangeFlag = 1;
        }
}
function InitSmtpHtml() {
    var div = $("#form_main")[0];
    var css_float = ChangeCss('float-left');
    if (div) {
        var contentHtml = "";
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omSMTPAddress);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omSMTPPort);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omSMTPSecurity);
        //contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omSMTPEmailAddr);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omSMTPServerAuth);
        contentHtml +=  '<div id="omSMTPServerAuth_div">';
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omSMTPUserName);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omSMTPUserPassword, false, true);
        contentHtml += '</div>';
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omSMTPServerAddress);

        div.innerHTML = contentHtml;
        $("[name=omSMTPServerAuth]").change(
        function () {
            var value = $(this).val();
            var psname = $("#omSMTPServerAuth_div");
            if (1 == value) {
                if(psname.css("display") == "none")
                psname.show();
            }
            else if (0 == value) {
                if (psname.css("display") != "none")
                    psname.hide();
            }
        });
        $("[name=omSMTPServerAuth]").val(SN.DATA.omSMTPServerAuth.value);
        $("[name=omSMTPServerAuth]").change();

        //密码显示方式为密文
        $("[name=omSMTPUserPassword][type=text]").hide();
        ClearPasswordValue("omSMTPUserPassword");


        //input长度限制
        $("[name=omSMTPServerAddress]").attr("maxLength", "63");
        $("[name=omSMTPAddress]").attr("maxLength", "63");
        $("[name=omSMTPPort]").attr("maxLength", "5");
        //$("[name=omSMTPEmailAddr").attr("maxLength", "63");
        $("[name=omSMTPUserName]").attr("maxLength", "63");
        $("[name=omSMTPUserPassword]").attr("maxLength", "25");

    }
}
function InitLdapHtml() {
    var div = $("#form_main")[0];
    css_float = ChangeCss('float-left');
    if (div) {
        var contentHtml = "";

        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omLdapEnabled);
        contentHtml += '<div id="ldap_server_setting" style="min-height: 30px; font-weight: bold;">';
        contentHtml += SN.INFO.PageLdapServerSetting + '</div>';
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omLdapServerAddr);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omLdapServerPort);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omLdapSecurity);
        contentHtml +=  '<div id="LdapNeedCertificate_div">';
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omLdapHaveCertificate);
        contentHtml += '<div class="' + "step2"  + '">';
        contentHtml += '<div class="leftshow ' + css_float + '"/></div>';
        contentHtml += '<div class="rightshow ' + css_float + '"/>';
        contentHtml +='<input type="button" name="button_certificateconfigure" value="' + SN.INFO.ButtonCertificateConfigure + '"/ >'
        contentHtml += '</div>';
        contentHtml += '</div>';
		contentHtml += '</div>';
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omLdapAuthDeviceUser);
        contentHtml += '<div id="ldap_database_search_setting" style="min-height: 30px; font-weight: bold;">';
        contentHtml += SN.INFO.PageLDAPDataBaseSearchSetting + '</div>';
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omLdapSearchroot);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omLdapMatchName);
        //contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omLdapRetrieveEmail);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omLdapRetrieveUser);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omLdapRetrieveGroup);
        contentHtml += '<div id="ldap_login_test" style="min-height: 30px; font-weight: bold;">';
        contentHtml += SN.INFO.PageLDAPServerLoginTest + '</div>';
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omLdapServerUser);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omLdapServerPswd, false, true);

        div.innerHTML = contentHtml;

        $("[name=omLdapSecurity]").change(
        function () {
            var value = $(this).val();
            var psname = $("#LdapNeedCertificate_div");
            if (1 == value) {
                if($("[name=omLdapServerPort]").val() == 389)
                    $("[name=omLdapServerPort]").val(636);
                if(psname.css("display") == "none")
                    psname.show();

            }
            else if (0 == value ) {
                if($("[name=omLdapServerPort]").val() == 636)
                    $("[name=omLdapServerPort]").val(389);
                if (psname.css("display") != "none")
                    psname.hide();
            }
            else if(2 == value) {
                if($("[name=omLdapServerPort]").val() == 636)
                    $("[name=omLdapServerPort]").val(389);
                if(psname.css("display") == "none")
                    psname.show();
            }
        });
        $("[name=omLdapSecurity]").val(SN.DATA.omLdapSecurity.value);
        $("[name=omLdapSecurity]").change();

        $("[name=omLdapHaveCertificate]").change(
        function () {
            var value = $(this).val();
            if (0 == value) {
                $("[name=button_certificateconfigure]").attr("disabled", true);
            } else {
                $("[name=button_certificateconfigure]").attr("disabled", false);
            }
        });
        $("[name=omLdapHaveCertificate]").val(SN.DATA.omLdapHaveCertificate.value);
        $("[name=omLdapHaveCertificate]").change();

        //input长度限制
        $("[name=omLdapServerAddr]").attr("maxLength", "63");
        $("[name=omLdapServerPort]").attr("maxLength", "5");
        $("[name=omLdapAuthDeviceUser]").attr("maxLength", "63");
        $("[name=omLdapSearchroot]").attr("maxLength", "255");
        $("[name=omLdapMatchName]").attr("maxLength", "63");
        $("[name=omLdapRetrieveEmail]").attr("maxLength", "63");
        $("[name=omLdapRetrieveUser]").attr("maxLength", "63");
        $("[name=omLdapRetrieveGroup]").attr("maxLength", "63");
        $("[name=omLdapServerUser]").attr("maxLength", "63");
        $("[name=omLdapServerPswd]").attr("maxLength", "31");
        //密码显示方式为密文
        $("[name=omLdapServerPswd][type=text]").hide();
        ClearPasswordValue("omLdapServerPswd");
    }
}

function InitWindowsHtml() {
    var div = $("#form_main")[0];
    if (div) {
        var contentHtml = "";

        css_float = ChangeCss('float-left');
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omWindowsLoginEnabled);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omWindowsAuthMode);
        contentHtml += '<div><div id="windows_login_setting" style="min-height: 30px; font-weight: bold;">';
        contentHtml += SN.INFO.PageWindowsLoginSetting + '</div>';
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omWindowsReverseDNS);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omWindowsDNSLookupRealm);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omWindowsDomain1);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omWindowsDomain2);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omWindowsDomain3);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omWindowsDomain4);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omWindowsDomain5);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omWindowsDomain6);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omWindowsDomain7);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omWindowsDomain8);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omWindowsDomain9);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omWindowsDomain10);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omWindowsDefaultDomain);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omWindowsSecurity);
        contentHtml += '<div id="WindowsNeedCertificate_div">';
        contentHtml +=      SN.FUNC.InsertOmDiv(SN.DATA.omWindowsHaveCertificate);
        contentHtml += '    <div class="step2">';
        contentHtml += '        <div class="leftshow ' + css_float + '"/></div>';
        contentHtml += '        <div class="rightshow ' + css_float + '"/>';
        contentHtml += '            <input type="button" name="button_certificateconfigure" value="' + SN.INFO.ButtonCertificateConfigure + '"/ >'
        contentHtml += '        </div>';
        contentHtml += '    </div>';
        contentHtml += '</div>';
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omWindowsMatchName);
        //contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omWindowsRetrieveEmail);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omWindowsRetrieveUser);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omWindowsRetrieveGroup);
        contentHtml += '<div><div id="windows_login_test" style="min-height: 30px; font-weight: bold;">';
        contentHtml += SN.INFO.PageWindowsLoginTest + '</div>';
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omWindowsDomain);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omWindowsLoginUser);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omWindowsLoginPswd, false, true);

        div.innerHTML = contentHtml;
        $("[name=omWindowsDefaultDomain]").attr("class", "div-show-hide");
        $("[name=omWindowsDomain]").attr("class", "div-show-hide");
        //input长度限制
        $("[name=omWindowsDomain1]").attr("maxLength", "63");
        $("[name=omWindowsDomain2]").attr("maxLength", "63");
        $("[name=omWindowsDomain3]").attr("maxLength", "63");
        $("[name=omWindowsDomain4]").attr("maxLength", "63");
        $("[name=omWindowsDomain5]").attr("maxLength", "63");
        $("[name=omWindowsDomain6]").attr("maxLength", "63");
        $("[name=omWindowsDomain7]").attr("maxLength", "63");
        $("[name=omWindowsDomain8]").attr("maxLength", "63");
        $("[name=omWindowsDomain9]").attr("maxLength", "63");
        $("[name=omWindowsDomain10]").attr("maxLength", "63");
        $("[name=omWindowsMatchName]").attr("maxLength", "63");
        $("[name=omWindowsRetrieveEmail]").attr("maxLength", "63");
        $("[name=omWindowsRetrieveUser]").attr("maxLength", "63");
        $("[name=omWindowsRetrieveGroup]").attr("maxLength", "63");
        $("[name=omWindowsLoginUser]").attr("maxLength", "63");
        $("[name=omWindowsLoginPswd]").attr("maxLength", "31");

        //密码显示方式为密文
        $("[name=omWindowsLoginPswd][type=text]").hide();
        ClearPasswordValue("omWindowsLoginPswd");

        var ws = $("[name=omWindowsSecurity]");
        ws.change(
            function () {
                var value = $(this).val();
                var psname = $("#WindowsNeedCertificate_div");
                if (value > 0) {
                    psname.show();
                } else {
                    psname.hide();
                }
            }
        );
        ws.val(SN.DATA.omWindowsSecurity.value);
        ws.change();

        var whc = $("[name=omWindowsHaveCertificate]");
        whc.change(
            function () {
                var value = $(this).val();
                if (0 == value) {
                    $("[name=button_certificateconfigure]").attr("disabled", true);
                } else {
                    $("[name=button_certificateconfigure]").attr("disabled", false);
                }
            });
        whc.val(SN.DATA.omWindowsHaveCertificate.value);
        whc.change();

    }
}
function InitAccessControlHtml() {
    var head = null;
    var div = $("#form_main")[0];

    if (div) {
        var contentHtml = "<div>";
        contentHtml += '<div><div id="panel_access_control" style="height: 30px; font-weight: bold;">';
        contentHtml += SN.INFO.PagePanelAccessControl + '</div></div>';
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omNetUsersLoginEnabled);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omPanelTimeOut);
        contentHtml += '<div><div id="netuser_list" style="height: 30px; font-weight: bold;">';
        contentHtml += SN.INFO.PageNetUserGroupList + '</div></div>';
        contentHtml += '<div style="clear: both;"></div></div>';
        div.innerHTML = contentHtml;

        //input长度限制
        $("[name=omPanelTimeOut]").attr("maxLength", "4");
    }
    //初始化群组列表
    SN.FUNC.LoadWifiScanDB("NETUSERGROUP");
    head = [ [SN.INFO.PageTableNo, SN.DATA.omNetUserGroupsID.info,
              SN.DATA.omNetUserGroupsName.info, SN.DATA.omNetUserGroupsType.info],
             ["", "id", "name", "type"] ];
    var div = $("#id_netusergroupinfo_search")[0];
    if (div) {
        var om = null;
        var contentHtml = "";
        om = new OM('', 'omNetUserSearch', SN.TYPE.InputText, MODULE_EXTERN, 0);
        contentHtml += '<div>' + SN.FUNC.CreateDOM(om);
        om = new OM('', 'omNetUserSearchOpt', SN.TYPE.Selection, MODULE_EXTERN, 36);
        contentHtml += SN.FUNC.CreateSelect(om);
        contentHtml += SN.FUNC.CreateButton(SN.TYPE.Search, SN.INFO.ButtonSearch) + '</div>';
        div.innerHTML = contentHtml;

        $("[name=omNetUserSearch]").attr("maxLength", "15");
        $("#button_search").click(function() {
            var searchval = $("[name=omNetUserSearch]").val();
            var searchopt = $("[name=omNetUserSearchOpt]").val();
            LoadContorlTable(SN.TYPE.TableNetUserSrv, "netusergroupinfo", head, searchopt, searchval);
        });
    }
    LoadContorlTable(SN.TYPE.TableNetUserSrv, "netusergroupinfo", head);
}

function InitFtpSmbEmailHtml() {
    var div = $("#form_main")[0];
    if (div) {
        var contentHtml = "";
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omAddFtpSMBEmailEnabled);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omHideDeleteAllAddrEnabled);
        div.innerHTML = contentHtml;

    }
}

function InitNetContactHtml() {
    var div = $("#form_main")[0];
    css_float = ChangeCss('float-left');
    if (div) {
        var contentHtml = "";

        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omNetContactEnabled);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omNetContactAuthMode);
        contentHtml +=  '<div class="step2 ' + css_float + '" id="Ldap_setting_div">';
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omNetContactLdapAddr);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omNetContactPort);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omNetContactSecurity);
        contentHtml += '</div>';
        contentHtml +=  '<div class="step2 ' + css_float + '" id="Windows_setting_div">';
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omNetContactDomain);
        contentHtml += '</div>';
        contentHtml +=  '<div class="step2 ' + css_float + '" id="user_setting_div">';
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omNetContactUser);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omNetContactPswd, false, true);
        contentHtml += '</div>';
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omNetContactSearchroot);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omNetContactRecipientName);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omNetContactFullName);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omNetContactRecipientEmail);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omNetContactMaxEmailNum);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omNetContactTimeOut);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omNetContactSearchTest);
        contentHtml += '<div class="' + "step2"  + '">';
        contentHtml += '<div class="leftshow float-left" id="usb_drive_step_tips" style="color: #666666;margin-top: -20px">' + SN.INFO.NetContactSearchTestTip + '</div>';
        contentHtml += '</div>';

        div.innerHTML = contentHtml;

        $("[name=omNetContactSecurity]").change(
        function () {
            var value = $(this).val();
            if (1 == value) {
                if($("[name=omNetContactPort]").val() == 389)
                    $("[name=omNetContactPort]").val(636) ;
            }
            else if (0 == value || 2 == value) {
                if($("[name=omNetContactPort]").val() == 636)
                    $("[name=omNetContactPort]").val(389) ;
            }
        });
        $("[name=omNetContactSecurity]").val(SN.DATA.omNetContactSecurity.value);
        $("[name=omNetContactSecurity]").change();

        $("[name=omNetContactAuthMode]").change(
        function () {
            var value = $(this).val();
            if (0 == value) {
                $("#Windows_setting_div").show();
                $("#Ldap_setting_div").hide();
                $("#user_setting_div").show();
            }
            else if (1 == value) {
                $("#Windows_setting_div").hide();
                $("#Ldap_setting_div").show();
                $("#user_setting_div").show();
            }
            else if (2 == value) {
                $("#Ldap_setting_div").show();
                $("#Windows_setting_div").hide();
                $("#user_setting_div").hide();
            }
        });
        $("[name=omNetContactAuthMode]").val(SN.DATA.omNetContactAuthMode.value);
        $("[name=omNetContactAuthMode]").change();

        //input长度限制
        $("[name=omNetContactLdapAddr]").attr("maxLength", "63");
        $("[name=omNetContactPort]").attr("maxLength", "5");
        $("[name=omNetContactDomain]").attr("maxLength", "63");
        $("[name=omNetContactUser]").attr("maxLength", "255");
        $("[name=omNetContactPswd]").attr("maxLength", "31");
        $("[name=omNetContactSearchroot]").attr("maxLength", "255");
        $("[name=omNetContactRecipientName]").attr("maxLength", "31");
        $("[name=omNetContactFullName]").attr("maxLength", "31");
        $("[name=omNetContactRecipientEmail]").attr("maxLength", "31");
        $("[name=omNetContactMaxEmailNum]").attr("maxLength", "3");
        $("[name=omNetContactTimeOut]").attr("maxLength", "3");
        $("[name=omNetContactSearchTest]").attr("maxLength", "31");
        //密码显示方式为密文
        $("[name=omNetContactPswd][type=text]").hide();
        ClearPasswordValue("omNetContactPswd");
    }
}
function InitRebootHtml() {
    var div = $("#form_main")[0];
    css_float = ChangeCss('float-left');
    SN.FUNC.LoadOmDB("LOGIN");
    if (div) {
        var contentHtml = "";
        contentHtml += '<div class="' + "step2"  + '">';
        contentHtml += '<div class="leftshow ' + css_float + '"/>' + SN.INFO.PageReboot + '</div>' ;
        contentHtml += '<div class="rightshow ' + css_float + '"/>';
        contentHtml +='<input type="button" name="button_reboot" value="' + SN.INFO.ButtonReboot + '"/ >'
        contentHtml += '</div>';
        contentHtml += '</div>';
        contentHtml += '</div>';
        div.innerHTML = contentHtml;
    }
}

function InitScanQuickSetHtml() {
    var head = null;
    var contentHtml = "";
    var div = $("#id_scanquicksetinfo_search")[0];
    SN.FUNC.LoadWifiScanDB("SCANQUICKSET");
    head = [ [SN.INFO.PageTableNo, SN.DATA.omScanArgName.info,
              SN.DATA.omScanArgTo.info],
             ["", "name", "type"] ];
    LoadContorlTable(SN.TYPE.TableScanQuickSetSrv, "scanquicksetinfo", head);
}
/*将字符串中的& < > " ' 转换成它们对应的HTML实体*/
function ReplaceHtmlEntities(str) {
    var characters = [/&/g, /</g, />/g, /\"/g, /\'/g];
    var entities = ["&amp;", "&lt;", "&gt;", "&quot;", "&apos;"];

    for(var i = 0; i < characters.length; i++) {
    str = str.replace(characters[i], entities[i]);
    }

    return str;
}
function LoadContorlTable(type, id, head, schopt, sch) {
    var div = $('#id_' + id + '_table')[0];
    if (div) {
        var list = null;
        var callbackfunc = null;
        var submitom = "";
        var contentHtml = "";
        var dbl_enable = 1;

        SN.DATA.omListEmpty = -1;
        switch (type) {
            case SN.TYPE.TableEmlAbs: //address books for E-mail Notice
                if (CheckProductID(3) || CheckProductID(4) || CheckProductID(7)) {
                    list = SN.DATA.omMailinfoList;
                } else {
                    list = SN.DATA.omAddressContent;
                }
                callbackfunc = AddEmailAddress;
                break;
            case SN.TYPE.TableArpUsr: //airprint user
                list = SN.DATA.omAirprintUserList;
                submitom = "omAirprintUserList.";
                callbackfunc = LoadAirprintDialog;
                break;
            case SN.TYPE.TableAddBks: //address books
                list = SN.DATA.omAddressContent;
                submitom = "omAddressContent.";
                callbackfunc = LoadAddrbookDialog;
                break;
            case SN.TYPE.TableSmbSrv: //smb server
                list = SN.DATA.omSmbinfoList;
                submitom = "omSmbinfoList.";
                callbackfunc = LoadSmbinfoDialog;
                SN.DATA.omListEmpty = (list.length >= 60) ? -1 : 60;
                break;
            case SN.TYPE.TableFtpSrv: //ftp server
                list = SN.DATA.omFtpinfoList;
                submitom = "omFtpinfoList.";
                callbackfunc = LoadFtpinfoDialog;
                SN.DATA.omListEmpty = (list.length >= 60) ? -1 : 60;
                break;
            case SN.TYPE.TableEmlSrv: //mail server
                list = SN.DATA.omMailinfoList;
                submitom = "omMailinfoList.";
                callbackfunc = LoadMailinfoDialog;
                SN.DATA.omListEmpty = (list.length >= 60) ? -1 : 60;
                break;
            case SN.TYPE.TableEmlGrp: //mail group
                list = SN.DATA.omMailgroupList;
                submitom = "omMailgroupList.";
                callbackfunc = LoadMailgroupDialog;
                SN.DATA.omListEmpty = (list.length >= 10) ? -1 : 10;
                break;
            case SN.TYPE.TablePhnBks: //phone book
                list = SN.DATA.omPhoneinfoList;
                submitom = "omPhoneinfoList.";
                callbackfunc = LoadPhoneinfoDialog;
                SN.DATA.omListEmpty = (list.length >= 200) ? -1 : 0;
                break;
            case SN.TYPE.TablePhnGrp: //phone group
                list = SN.DATA.omPhonegroupList;
                submitom = "omPhonegroupList.";
                callbackfunc = LoadPhonegroupDialog;
                SN.DATA.omListEmpty = (list.length >= 10) ? -1 : 10;
                break;
            case SN.TYPE.TableNetUserSrv: //Network User Group
                list = SN.DATA.omNetUserGroupList;
                submitom = "omNetUserGroupList.";
                callbackfunc = LoadNetuserDialog;
                SN.DATA.omListEmpty = (list.length >= 100) ? -1 : 100;
                break;
            case SN.TYPE.TableNetEmlAbs: //Network Email
                list = SN.DATA.omNetContactinfoList;
                submitom = "omNetContactinfoList.";
                SN.DATA.omListEmpty = (list.length >= 100) ? -1 : 100;
                break;
            case SN.TYPE.TableScanQuickSetSrv: //Network User Group
                list = SN.DATA.omScanQuickSetList;
                submitom = "omScanQuickSetList.";
                callbackfunc = LoadScanQuickSetDialog;
                SN.DATA.omListEmpty = (list.length >= 10) ? -1 : 10;
                break;
            case SN.TYPE.TableNetPortMan: // net port manager
                list = SN.DATA.omNetPortContent;
                submitom = "omNetPortContent.";
                callbackfunc = LoadNetPortManDialog;
                break;
            case SN.TYPE.TableWhiteList: // white list
                list = SN.DATA.omWhiteListContent;
                submitom = "omWhiteListContent.";
                callbackfunc = LoadWhiteListDialog;
                break;
        case SN.TYPE.TableIpsecList:
            list = SN.DATA.omIpsecListContent;
                submitom = "omIpsecListContent.";
                callbackfunc = LoadIpsecListDialog;
        break;
        case SN.TYPE.TableIPFilterList:
                list = SN.DATA.omIPFilterListContent;
                submitom = "omIPFilterListContent.";
                callbackfunc = LoadIPFilterListDialog;
                break;

            default:
                return ;
        }

        contentHtml += '<table id="user_scan_table" cellpadding="1" class="wifi-step-table">';
        contentHtml += '<tr class="wifi-table-tr">';
        for (var i = 0; i < head[0].length; i++) {
            if (type > SN.TYPE.TableEmlAbs && 0 == i) {
                contentHtml += '<td class="tableColumnHeader">';
                contentHtml += '<lable><input type="checkbox" name="all_tdcheck">';
                contentHtml += '<span id="thead_index' + i + '">' + head[0][i] + '</span></lable></td>';
            } else {
                contentHtml += '<td class="tableColumnHeader" id="thead_index' + i + '">' + head[0][i] + '</td>';
            }
        }
        if (type > SN.TYPE.TableEmlAbs) {
            var btninfo = (type > SN.TYPE.TableAddBks) ? SN.INFO.ButtonNew : SN.INFO.ButtonAdd;

            contentHtml += '</tr></table>';
            contentHtml += '<div style="text-align: center;">';
            contentHtml += SN.FUNC.CreateButton(SN.TYPE.UserNew, btninfo);
            if (SN.TYPE.TableEmlSrv == type) {
                contentHtml += SN.FUNC.CreateButton(SN.TYPE.UserAdd, SN.INFO.ButtonAdd);
            }
            contentHtml += SN.FUNC.CreateButton(SN.TYPE.UserDelete, SN.INFO.ButtonDelete);
            contentHtml += SN.FUNC.CreateButton(SN.TYPE.UserModify, SN.INFO.ButtonModify);
            contentHtml += '</div>';
        }
		else if(type == SN.TYPE.TableIpsecList)
        {
            var btninfo = (type > SN.TYPE.TableAddBks) ? SN.INFO.ButtonNew : SN.INFO.ButtonAdd;
            contentHtml += '</tr></table>';
            contentHtml += '<div style="text-align: center;">';
            contentHtml += SN.FUNC.CreateButton(SN.TYPE.IpseclistUserNew, btninfo);
            contentHtml += SN.FUNC.CreateButton(SN.TYPE.IpseclistDelete, SN.INFO.ButtonIpsecDelete);
            contentHtml += SN.FUNC.CreateButton(SN.TYPE.IpseclistModify, SN.INFO.ButtonModify);
            contentHtml += '</div>';
        }
        div.innerHTML = contentHtml;
        if (list.length > 0) {
            var number = 0;
            var table = $("#user_scan_table")[0];

            for (var i = 0; i < list.length; i++) {
                var jsonObj, tr, td, tmp, checkid;
                jsonObj = GetJson(list[i]); //获取json对象
                if (undefined == jsonObj) {
                    if (-1 == SN.DATA.omListEmpty)
                        SN.DATA.omListEmpty = i;
                    continue;
                }

                //搜索相关处理
                if (schopt != undefined && sch != undefined && sch.length > 0) {
                    var value = jsonObj[schopt];
                    var index = value.indexOf(sch);
                    if (index < 0) {
                        continue;
                    }
                }

                number++;
                tr = table.insertRow(table.rows.length);
                tr.index = i;
                td = tr.insertCell(0);
                td.align = "center";
                if (type > SN.TYPE.TableEmlAbs) {
                    checkid = i;
                    if (type == SN.TYPE.TablePhnBks) {
                      tmp = ((number < 10) ? '00' : (number < 100) ? '0' : '') + number;
                    } else if (type > SN.TYPE.TableArpUsr) {
                        tmp = ((number < 10) ? '0' : '') + number;
                    } else {
                        tmp = number;
                    }
                    //行信息对应后台索引处理
                    if (type >= SN.TYPE.TableSmbSrv && type <= SN.TYPE.TableScanQuickSetSrv) {
                        checkid = jsonObj.idx;
                    }
                    tr.id = checkid;
                    td.innerHTML = '<lable><input type="checkbox" name="tdcheck_' + checkid + '" id="' + i + '">' + tmp + '</lable>';
                } else {
                    td.innerHTML = number;
                }
                for (var j = 1; j < head[1].length; j++) {
                    td = tr.insertCell(j); //用户名
                    if ((1 == j && type != SN.TYPE.TableWhiteList)|| (1==j && type != SN.TYPE.TableIpsecList)) {
                        td.align = SN.DATA.RightReadMode ? "right" : "left";
                    } else {
                        td.align = "center";
                    }
                    var header = head[1][j];
                    if(type == SN.TYPE.TableNetUserSrv && header == "type")
                    {
                        var n = jsonObj[header]-1;
                        td.innerHTML = SN.DATA.omNetUserGroupsTypeSelect[n][0];
                    }
                    else if(type == SN.TYPE.TableScanQuickSetSrv && header == "type")
                    {
                        var n = jsonObj["to"];
                        for(var index = 0; index < 10; index++)
                        if(SN.DATA.ScanToList[index][1] == n) {
                            td.innerHTML = SN.DATA.ScanToList[index][0];
                            break;
                        }
                    }
                    else if(type == SN.TYPE.TableNetPortMan && header == "protocol")
                    {
                        var n = jsonObj[header]-1;
                        td.innerHTML = SN.DATA.NetPortProtocolList[n][0];
                    }
                    else if(type == SN.TYPE.TableNetPortMan && header == "enabled")
                    {
                        var n = jsonObj[header]-1;
                        td.innerHTML = SN.DATA.NetPortEnabledList[n][0];
                    }
                    else
                    {
                        td.innerHTML = ReplaceHtmlEntities(jsonObj[header]);
                    }
                    if ( (1 === j && td.innerHTML === "") && (type === SN.TYPE.TableWhiteList) )
                    {
                        td.innerHTML = SN.INFO.UnBoundIP;
                    }
                }

                $(tr).attr("class", "tablerowunSelected");
                if (type > SN.TYPE.TableEmlAbs) {
                    $(tr).dblclick(function (evt) {
                        var target = evt.srcElement || evt.target;
                        if (!CheckIsLogined() || target.name == 'tdcheck_' + this.index)
                            return;

                        var idx = parseInt(this.id, 10);
                        var json = GetJson(list[this.index]); //获取json对象
                        if (undefined != json) {
                            OPT_ROW_NO = idx;
                            callbackfunc(submitom + idx, OPT_MODIFY, json, this.index);
                        }
                    });
                } else if(type == SN.TYPE.TableEmlAbs) {
                    $(tr).mouseover(function (evt) {
                        $(this).attr("class", "tablerowSelected");
                    });
                    $(tr).mouseout(function (evt) {
                        $(this).attr("class", "tablerowunSelected");
                    });
                    $(tr).mouseup(function (evt) {
                        callbackfunc(list, this.index);
                    });
                }
            }
            if (type == SN.TYPE.TableIpsecList) {
                $("[name^=tdcheck_]").change(
                function() {
                    var select = 0, all = 0;
                    all = $("[name^=tdcheck_]").length;
                    select = $("[name^=tdcheck_]:checked").length;
                    $("#button_ipsec_modify").attr("disabled", (1 != select));//一个个修改
                    $("#button_ipsec_delete").attr("disabled", (select <= 0));//删除个数大于一
                    $("[name=all_tdcheck]").prop("checked", (select == all));//设置属性
                });
                
                $("[name=all_tdcheck]").change(
                function() {
                    var select = 0;
                    $("[name^=tdcheck_]").prop("checked", $(this).prop("checked"));
                    select = $("[name^=tdcheck_]:checked").length;
                    $("#button_ipsec_modify").attr("disabled", (1 != select));
                    $("#button_ipsec_delete").attr("disabled", (select <= 0));
                    //$("#button_useradd").attr("disabled", (select <= 0));
                });
            }
			
            if (type <= SN.TYPE.TableEmlAbs) {
                return ;
            }

            $("[name^=tdcheck_]").change(
            function() {
                var select = 0, all = 0;
                all = $("[name^=tdcheck_]").length;
                select = $("[name^=tdcheck_]:checked").length;
                $("#button_usermodify").attr("disabled", (1 != select));
                $("#button_userdelete").attr("disabled", (select <= 0));
                $("#button_useradd").attr("disabled", (select <= 0));
                $("[name=all_tdcheck]").prop("checked", (select == all));
            });

            $("[name=all_tdcheck]").change(
            function() {
                var select = 0;
                $("[name^=tdcheck_]").prop("checked", $(this).prop("checked"));
                select = $("[name^=tdcheck_]:checked").length;
                $("#button_usermodify").attr("disabled", (1 != select));
                $("#button_userdelete").attr("disabled", (select <= 0));
                $("#button_useradd").attr("disabled", (select <= 0));
            });
        }

        $("#button_usermodify").attr("disabled", true);
        $("#button_useradd").attr("disabled", true);
        $("#button_userdelete").attr("disabled", true);
         //ipsec界面按钮
        $("#button_ipsec_modify").attr("disabled", true);
        $("#button_ipsec_delete").attr("disabled", true);
        $("#button_usernew").click(
        function(){
            if (!CheckIsLogined())
                return ;

            if (-1 == SN.DATA.omListEmpty) {
                if (SN.TYPE.TableEmlGrp == type || SN.TYPE.TablePhnGrp == type) {
                    alert(SN.DATA.GroupOver);
                } else if (SN.TYPE.TableSmbSrv == type) {
                    alert(SN.INFO.ErrSmbAddressOver);
                } else if (SN.TYPE.TableFtpSrv == type) {
                    alert(SN.INFO.ErrFtpAddressOver);
                } else if (SN.TYPE.TableNetUserSrv == type) {
                    alert(SN.INFO.ErrLdapAddressOve);
                } else if (SN.TYPE.TableScanQuickSetSrv == type) {
                    alert(SN.INFO.ErrScanQuickSetOver);
                } else if (SN.TYPE.TableWhiteList === type) {
                    alert(SN.INFO.AddWhiteListOver);
                } else if (SN.TYPE.TableIPFilterList === type) {
                    alert(SN.INFO.AddIPFilterListOver);
                } else if (SN.TYPE.TableNetPortMan == type) {
					alert(SN.INFO.AddNetPortOver);
                } else if(SN.TYPE.TableIpsecList === type) {
					alert(SN.INFO.AddWhiteListOver);
				} else {
                    alert(SN.INFO.AddUserListOver);
                }
                return ;
            }
            if(type == SN.TYPE.TableWhiteList)
            {
                OPT_ROW_NO = SN.DATA.omListEmpty;
                var first = SN.DATA.omListEmpty == 0? 1 : 0;
                callbackfunc(submitom + SN.DATA.omListEmpty, OPT_NEW, undefined, first);
            }
            else
            {
                callbackfunc(submitom + SN.DATA.omListEmpty, OPT_NEW);
            }
        });

        $("#button_useradd").click(
        function(){
            if (!CheckIsLogined())
                return ;

            var i, groupl = SN.DATA.omMailgroupList;
            for (i = 0; i < groupl.length; i++) {
                if (groupl[i] != "" && undefined != groupl[i]) {
                    break;
                }
            }
            if (0 == groupl.length && i == groupl.length) {
                alert(SN.INFO.NoMailgroup);
                return ;
            }

            var checks = $("[name^=tdcheck_]:checked");
            var data = '';
            for(var i = 0; i < checks.length; i++) {
                var name = checks[i].name;
                var index = parseInt(name.substring('tdcheck_'.length, name.length), 10);
                data += submitom + index + '=';
                if (checks.length - 1 > i)
                    data += '&';
            }
            callbackfunc(data, OPT_ADD);
        });

        $("#button_userdelete").click(
        function(){
            if (!CheckIsLogined() || !confirm(SN.INFO.IsDeleteSelected))
                return ;

            var checks = $("[name^=tdcheck_]:checked");
            var data = '';
            for(var i = 0; i < checks.length; i++) {
                var name = checks[checks.length - 1 - i].name;
                var index = parseInt(name.substring('tdcheck_'.length, name.length), 10);

                data += submitom + index + '=';
                data += EncodeBase64('255');
                if (checks.length - 1 > i)
                    data += '&';
            }
            if (SN.TYPE.TableArpUsr == type) {
                var json = GetJson(list[index]);
                var authorStr = SN.Cookie.Get("loginname", "");
                if(json.user == authorStr)
                {
                    MDNS_USER_MODIFY_DELETE_FLAG = 1;
                }
            }

            if(type == SN.TYPE.TableNetPortMan)
            {
                postdata(data, undefined);
            }
            else
            {
                postdata(data, undefined, RefreshCurrentPage);
            }
        });

        $("#button_usermodify").click(
        function(){
            if (!CheckIsLogined())
                return ;

            var check = $("[name^=tdcheck_]:checked")[0];
            var index = parseInt(check.name.substring('tdcheck_'.length, check.name.length), 10);
            var idx = parseInt(check.id, 10);
            var json = GetJson(list[idx]); //获取json对象

            OPT_ROW_NO = index;
            callbackfunc(submitom + index, OPT_MODIFY, json, idx);
        });
	
	if(type == SN.TYPE.TableIPFilterList)
        {
            dbl_enable = SN.DATA.omIPFilterListEnable.value;
            //var enable_ipfilterlist = SN.DATA.omIPFilterListEnable.value;

            $("#button_usernew").attr("disabled", false);
            $("[name^=tdcheck_]").attr("disabled", false);
            $("[name=all_tdcheck]").attr("disabled", false);


            $("[name=omIPFilterListEnable]").click(
                function ()
                {
                    if (!CheckIsLogined()) {
                        return;
                    }

                    var list = SN.DATA.omIPFilterListContent;
                    console.log(list.length)
                    var jsonObj;
                    jsonObj = GetJson(list[0]);
                    if (undefined == jsonObj) {
                        alert(SN.INFO.IPFilterListIsEmptyTips)
                        RefreshCurrentPage()
                        return;
                    }

                    var choose;
                    var checked = $("[name=omIPFilterListEnable]").prop("checked");
                    if(checked)
                    {
                        choose = confirm(SN.INFO.SureSupportIPFilterList);
                        if(choose == true)
                        {
                            dbl_enable = true;
                            var data = SN.DATA.omIPFilterListEnable.name + "=" + EncodeBase64("1");
                            postdata(data, undefined, RefreshCurrentPage);

                            $("[name=omIPFilterListEnable]").prop("checked", true);
                        }
                        else
                        {
                            dbl_enable = false;
                            $("[name=omIPFilterListEnable]").prop("checked", false);
                        }

                    }
                    else
                    {
                        choose = confirm(SN.INFO.SureNonSupportIPFilterList);
                        if(choose == true)
                        {
                            dbl_enable = false;
                            var data = SN.DATA.omIPFilterListEnable.name + "=" + EncodeBase64("0");
                            postdata(data, undefined, RefreshCurrentPage);

                            $("[name=omIPFilterListEnable]").prop("checked", false);
                        }
                        else
                        {
                            dbl_enable = true;
                            $("[name=omIPFilterListEnable]").prop("checked", true);
                        }
                    }
                }
            );

            $("[name=omIPFilterListRule]").click(
                function(){
                    if (!CheckIsLogined())
                        return ;
                    
                        var data = '';
                        var flag = $("[name=omIPFilterListRule]:checked")[0];
                        var data = SN.DATA.omIPFilterListRule.name + "=" + EncodeBase64(flag.value);
                        postdata(data, undefined, RefreshCurrentPage);
             
                }
            );
        }

        //新增 Ipsec增加
        $("#button_ipsec_usernew").click(
        function(){
            if (!CheckIsLogined())
                return ;
                
            if (-1 == SN.DATA.omListEmpty) 
			{
			    if (SN.TYPE.TableWhiteList == type) {
                    alert(SN.INFO.AddIpsecListOver);
                } 
                return ;
            }
			if(type == SN.TYPE.TableIpsecList)
			{
				OPT_ROW_NO = SN.DATA.omListEmpty;
				var first = SN.DATA.omListEmpty == 0? 1 : 0;
				callbackfunc(submitom + SN.DATA.omListEmpty, OPT_NEW, undefined, first);
			}
		});
		 //新增 Ipsec删除
        $("#button_ipsec_delete").click(
        function(){
            if (!CheckIsLogined() || !confirm(SN.INFO.IsDeleteSelected))
                return ;
                
            var checks = $("[name^=tdcheck_]:checked");
            var data = '';
            for(var i = 0; i < checks.length; i++) {
                var name = checks[checks.length - 1 - i].name;
                var index = parseInt(name.substring('tdcheck_'.length, name.length), 10);
                
                data += submitom + index + '=';
                data += EncodeBase64('255');
                if (checks.length - 1 > i)
                    data += '&';
            }
            postdata(data, undefined, RefreshCurrentPage);
        });
		//新增 Ipsec修改
        $("#button_ipsec_modify").click(
        function(){
            if (!CheckIsLogined())
                return ;
                
            var check = $("[name^=tdcheck_]:checked")[0];
            var index = parseInt(check.name.substring('tdcheck_'.length, check.name.length), 10);
            var idx = parseInt(check.id, 10);
            var json = GetJson(list[idx]); //获取json对象
            OPT_ROW_NO = index;
            callbackfunc(submitom + index, OPT_MODIFY, json);
        });
		
        if(type == SN.TYPE.TableWhiteList)
        {
            dbl_enable = SN.DATA.omWhiteListEnable.value;
            //var enable_whitelist = SN.DATA.omWhiteListEnable.value;

            $("#button_usernew").attr("disabled", false);
            $("[name^=tdcheck_]").attr("disabled", false);
            $("[name=all_tdcheck]").attr("disabled", false);


            $("[name=omWhiteListEnable]").click(
                function ()
                {
                    if (!CheckIsLogined()) {
                        return;
                    }

                    var choose;
                    var checked = $("[name=omWhiteListEnable]").prop("checked");
                    if(checked)
                    {
                        choose = confirm(SN.INFO.SureSupportWhiteList);
                        if(choose == true)
                        {
                            dbl_enable = true;
                            var data = SN.DATA.omWhiteListEnable.name + "=" + EncodeBase64("1");
                            postdata(data, undefined, RefreshCurrentPage);

                            $("[name=omWhiteListEnable]").prop("checked", true);
                        }
                        else
                        {
                            dbl_enable = false;
                            $("[name=omWhiteListEnable]").prop("checked", false);
                        }

                    }
                    else
                    {
                        choose = confirm(SN.INFO.SureNonSupportWhiteList);
                        if(choose == true)
                        {
                            dbl_enable = false;
                            var data = SN.DATA.omWhiteListEnable.name + "=" + EncodeBase64("0");
                            postdata(data, undefined, RefreshCurrentPage);

                            $("[name=omWhiteListEnable]").prop("checked", false);
                        }
                        else
                        {
                            dbl_enable = true;
                            $("[name=omWhiteListEnable]").prop("checked", true);
                        }
                    }
                }
            );
        }
        else if (type == SN.TYPE.TableIpsecList)
        {
            dbl_enable = SN.DATA.omIpsecEnable.value;
            var enable_ipseclist = SN.DATA.omIpsecEnable.value;	
        
            $("#button_ipsec_usernew").attr("disabled", false);
            $("[name^=tdcheck_]").attr("disabled", false);
            $("[name=all_tdcheck]").attr("disabled", false);

            $("[name=omIpsecEnable]").click(
                function () 
                {
                    if (!CheckIsLogined()) {
                        return;
                    }

                    var choose;
                    var checked = $("[name=omIpsecEnable]").prop("checked"); 
                    if(checked)
                    {
                        choose = confirm(SN.INFO.SureSupportIpsecList);
                        if(choose == true)
                        {
                            dbl_enable = true;
                            SN.FUNC.SubmitData("form_main");
                            $("[name=omIpsecEnable]").prop("checked", true);
                        }
                        else
                        {
                            dbl_enable = false;
                            $("[name=omIpsecEnable]").prop("checked", false);
                        }
                        
                    }
                    else
                    {
                        choose = confirm(SN.INFO.SureNonSupportIpsecList);
                        if(choose == true)
                        {
                            dbl_enable = false;
                            var data = SN.DATA.omIpsecEnable.name + "=" + EncodeBase64("0");
                            postdata(data, undefined, RefreshCurrentPage);

                            $("[name=omIpsecEnable]").prop("checked", false);
                        }
                        else
                        {
                            dbl_enable = true;
                            $("[name=omIpsecEnable]").prop("checked", true);
                        }
                    }
                }
            );
        }

    }
}
function IsHasAirprint() {
    return (SN.DATA.omEnableIPP.value != 0);
    //return true;
}
function InitMdnsHtml() {
    var div = $("#form_main")[0];
    if (div) {
        var contentHtml = "<div>";

        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omEnableBonjour);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omBonjourPort);
        if (IsHasAirprint()) {
            SN.DATA.omHostName.value += ".local.";
            SN.DATA.omHostName.info = SN.INFO.BonjourDomainName;
            SN.DATA.omBonjourName.info = SN.INFO.BonjourPrinterName;
        }
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omHostName, true);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omBonjourName);

        if (IsHasAirprint()) {
            var head = null;
            var flag = CheckLanguage();
            contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omFirmVersion);
            if (SN.DATA.omFirmName.value == '') {
                SN.DATA.omFirmName.value = SN.DATA.omProductName.value;
            }
            if (flag) {
                SN.DATA.omPrinterLatitude.value = SN.DATA.omPrinterLatitude.value.replace(/(\.)/g, ",");
                SN.DATA.omPrinterLongitude.value = SN.DATA.omPrinterLongitude.value.replace(/(\.)/g, ",");
            }
            contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omFirmName);
            SN.DATA.omConsumerPosition.info = SN.INFO.PrinterLocation;
            contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omConsumerPosition);
            contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omPrinterLatitude);
            contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omPrinterLongitude);
            contentHtml += '<div style="clear: both;"></div></div>';
            div.innerHTML = contentHtml;

            //初始化Airprint用户列表
            SN.FUNC.LoadWifiScanDB("AIRPUSER");
            //head = [ [SN.INFO.PageTableNo, SN.DATA.omAirprintName.info,
            //          SN.DATA.omAirprintPassword.info],
            //         ["", "user", "pswd"] ];
            head = [ [SN.INFO.PageTableNo, SN.DATA.omAirprintName.info],
                     ["", "user"] ];
            LoadContorlTable(SN.TYPE.TableArpUsr, "airprint", head);

            //input长度限制
            $("[name=omPrinterLatitude]").attr("maxLength", "16");
            $("[name=omPrinterLongitude]").attr("maxLength", "16");
            $("[name=omConsumerPosition]").attr("maxLength", "63");
        } else {
            contentHtml += '<div style="clear: both;"></div></div>';
            div.innerHTML = contentHtml;
        }

        $("[name=omEnableBonjour]").click(
        function () {
            $("[name=omBonjourName]").attr("disabled", !this.checked);
            alert(SN.INFO.BonjourRebootAlert);
        });

        //$("[name=omEnableBonjour]").change();
        $("[name=omBonjourName]").attr("disabled", !($("[name=omEnableBonjour]").attr("checked") == "checked"));

        //input长度限制
        $("[name=omBonjourName]").attr("maxLength", "63");
        $("[name=omBonjourName]").mouseover(function(){
            $(this).attr("title", this.value);
        });
        $("[name=omBonjourName]").mouseout(function(){
            $(this).attr("title", "");
        });
    }
}
//此函数在文件上传完成后，返回子页面#upload_iframe js执行
function FileUploadResult(result) {
    var html = '';
    if (result == HTTP_FILE_UPLOAD_TOOBIG) {
        html = SN.INFO.CertificateUploadFail;
        $("#upload_result").html(SN.INFO.CertificateTooBig);
    } else if (result == HTTP_FILE_UPLOAD_FAIL) {
        html = SN.INFO.CertificateUploadFail;
    } else if(result == HTTP_CERT_MAN_IMPORT_WILL_FULL_CA){
        html = SN.INFO.ErrCMImportWillFullCA;
    }else if(result == HTTP_CERT_MAN_IMPORT_OUT_OF_CHAIN_MAX){
        html = SN.INFO.ErrOutOfChainMax;
    }else if(result == HTTP_CERT_MAN_IMPORT_NO_PRIKEY_FILE){
        html = SN.INFO.ErrCMImportCsrNoKey;
    }else if (result == HTTP_CERT_MAN_IMPORT_SUCCESS) {
        html = SN.INFO.CertificateUploadOK;
    }else if (result == HTTP_FILE_UPLOAD_OK) {
        html = SN.INFO.CertificateUploadOK;
    } else if (result == HTTP_CERT_MAN_IMPORT_PASSWORD_FAIL) {
		html = SN.INFO.ErrCMImportPasswdFail;
	} else if (result == HTTP_CERT_MAN_IMPORT_SYS_FAIL) {
		html = SN.INFO.ErrCMImportSys;
    } else if (result == HTTP_CERT_MAN_IMPORT_TIMEOUT) {
		html = SN.INFO.ErrCMImportTimeout;
    } else if (result == HTTP_CERT_MAN_IMPORT_TYPE) {
		html = SN.INFO.ErrCMImportType;
	} else if (result == HTTP_CERT_MAN_IMPORT_PARSE) {
		html = SN.INFO.ErrCMImportParse;
    } else if (result == HTTP_CERT_MAN_IMPORT_CONTENT) {
		html = SN.INFO.ErrCMImportContent;
    } else if (result == HTTP_CERT_MAN_IMPORT_SIZE) {
		html = SN.INFO.ErrCMImportSize;
    } else if (result == HTTP_CERT_MAN_IMPORT_FULL_CA) {
		html = SN.INFO.ErrCMImportFullCA;
    } else if (result == HTTP_CERT_MAN_IMPORT_FULL_CLIENT) {
		html = SN.INFO.ErrCMImportFullClient;
    } else if(result == HTTP_CERT_MAN_IMPORT_EXIST){
		html = SN.INFO.ErrCMImportExist;
	} else if (result == HTTP_CERT_MAN_UNKNOWN_FIND) {
		html = SN.INFO.ErrCMUnknownFind;
	} else if (result == HTTP_CERT_MAN_UNKNOWN_SYS) {
		html = SN.INFO.ErrCMUnknownSys;
	}

    alert(html);
    $("#upload_result").html("");
    RefreshCurrentPage();
}
function ShowOrDeleteFile(operate, flag) {
    var url;
    var button_id, cert_id;
    if(flag == 1 )
    {
        url = '/cacert' + operate;
        button_id = $("#button_delete_ca");
        cert_id = $("#certificate_ca");
    }
    else
    {
        url = '/' + operate + 'ssltls';
        button_id = $("#button_delete");
        cert_id = $("#certificate");
    }
    postdata(operate, url, function(data){
        if (undefined == data || '' == data) {
            alert(SN.INFO.NoReturnMessage);//没有返回数据
            return ;
        }

        var msgJson = AjaxParseJson(data);
        if('delete' == msgJson.Operation && ('/deletessltls' == url || '/cacertdelete' == url)) {
            if (msgJson.Result == HTTP_CERTIFICATE_OK) {
                alert(SN.INFO.CertificateUnloadOk);
                RefreshCurrentPage();
            }
            return ;
        } else if('show' == msgJson.Operation && ('/showssltls' == url || '/cacertshow' == url)) {
            if (1 == msgJson.Firmware) {
                button_id.hide();
            } else {
                button_id.show();
            }

            if (msgJson.Result == HTTP_CERTIFICATE_OK) {
                data = '<p><span id="show_ssl_version" style="font-weight: bold;">' + SN.INFO.CertificateVersion + ':  </span>' + msgJson.Version + '</p>';
                data += '<p><span id="show_ssl_signalg" style="font-weight: bold;">' + SN.INFO.CertificateSignAlg + ':  </span>' + msgJson.SignAlg + '</p>';
                data += '<p><span id="show_ssl_user" style="font-weight: bold;">' + SN.INFO.CertificateUser + ':  </span>' + msgJson.User + '</p>';
                data += '<p><span id="show_ssl_award" style="font-weight: bold;">' + SN.INFO.CertificateAward + ':  </span>' + msgJson.Award + '</p>';
                data += '<p><span id="show_ssl_data" style="font-weight: bold;">' + SN.INFO.CertificateData + ':  </span>' + msgJson.Data + '</p>';
            } else {
                data = '';
                button_id.attr("disabled", true);
            }
            cert_id.html(data);
        }
    }, ('show' == operate) ? true : undefined);
}
function getFileSize(obj)
{
    var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
    var filesize = 0;
    if (isIE ) {
        var fso = new ActiveXObject("Scripting.FileSystemObject");
        filesize = fso.GetFile(obj.value).size
    } else {
        filesize = obj.files[0].size;
    }
    filesize=Math.round(filesize/1024*100)/100;  // 单位为KB
    //alert("文件大小为："+ filesize);
    return filesize;
}

function Init8021XHtml() {
    var div = $("#form_main")[0];
    if (div) {
	    var css_float = ChangeCss("float-left");
        var contentHtml = "";
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.om8021XWiredStatus);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.om8021XAuth);
        contentHtml += "<div id='id_8021xAuthInner' style='display: none'>";
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.om8021XAuthInner);
        contentHtml += "</div>";
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.om8021XUserName);
        contentHtml += "<div id='id_8021xpw'>";
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.om8021XUserPassword);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.om8021XUserPassword2);
        contentHtml += "</div><div id='id_8021xServerConf' style='display: none'>";
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.om8021XServerID);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.om8021XAnonymousID);

        contentHtml += '<div id="8021xNeedCert_div">';
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.om8021XNeedCert);
        contentHtml += '<div class="step2">';
        contentHtml += '<div class="leftshow ' + css_float + '"/></div>';
        contentHtml += '<div class="rightshow ' + css_float + '">';
        contentHtml += '<input type="button" id="button_8021xJumpCertManger" value="' + SN.INFO.ButtonCertificateConfigure + '"/ >'
        contentHtml += '</div>';
        contentHtml += '</div>';
        contentHtml += '</div>';

        contentHtml += "</div>";

        div.innerHTML = contentHtml;

        $("[name=om8021XServerID]").attr("maxLength", "63");
        $("[name=om8021XAnonymousID]").attr("maxLength", "63");
        $("[name=om8021XUserName]").attr("maxLength", "63");
        $("[name=om8021XUserPassword]").attr("maxLength", "32");
        $("[name=om8021XUserPassword2]").attr("maxLength", "32");

        div = $("#om8021XServerID_v")[0];
        div.innerHTML += '<input type="checkbox" id="om8021XServerIdOpChk" name="om8021XServerIdOp" value="' +
            (SN.DATA.om8021XServerIdOp.value == '1' ? '1" checked>' : '0">') +
            '<label for="om8021XServerIdOpChk">' + SN.DATA.om8021XServerIdOp.info +
            '</label>';
        var checkboxServerIdOp = $("[name=om8021XServerIdOp]");
        checkboxServerIdOp.click(
            function () {
                this.value = (this.checked ? "1" : "0");
            }
        );

        $("[name=om8021XNeedCert]").change(
            function () {
                var value = $(this).val();
                if (0 == value) {
                    $("[name=button_certificateconfigure]").attr("disabled", true);
                } else {
                    $("[name=button_certificateconfigure]").attr("disabled", false);
                }
            });
            $("[name=om8021XNeedCert]").val(SN.DATA.om8021XNeedCert.value);
            $("[name=om8021XNeedCert]").change();

        //密码显示方式为密文
        $("[name=om8021XUserPassword][type=text]").hide();

        var omSelectAuth = $("[name=om8021XAuth]");
        omSelectAuth.change(
            function(){
                var omAnonymousID = $("#info_om8021XAnonymousID").parent();
                omAnonymousID.show();
                var omDivAuthInner = $('#id_8021xAuthInner');
                var omSelectAuthInner = $("[name=om8021XAuthInner]");
                var valueSelectAuthInner = SN.DATA.om8021XAuthInner.value;
                var omDivServerConf = $("[id=id_8021xServerConf]");
                var omServerID = $("#info_om8021XServerID").parent();
                var omCertDiv = $("#8021xNeedCert_div");
                var omDivPw = $("[id=id_8021xpw]");

                omCertDiv.show();
                omSelectAuthInner.val(valueSelectAuthInner);
                var value = $(this).val();
                if (1 == value )//PEAP
                {
                    omSelectAuthInner[0].options[0].disabled = false;
                    omSelectAuthInner[0].options[1].disabled = false;
                    omSelectAuthInner[0].options[2].disabled = true;
                    omSelectAuthInner[0].options[3].disabled = true;
                    omSelectAuthInner[0].options[4].disabled = true;
                    omDivAuthInner.show();
                    omDivServerConf.show();
                    omServerID.show();
                    omDivPw.show();
                    if(valueSelectAuthInner != 0 && valueSelectAuthInner != 1)
                        omSelectAuthInner.val(0);
                }
                else if(0 == value)//MD5
                {
                    omDivAuthInner.hide();
                    omDivServerConf.hide();
                    omDivPw.show();
                }
                else if(4 == value)
                {//TTLS:显示MSCHAP、PAP、CHAP、MSCHAP；不可选取GTC
                    omSelectAuthInner[0].options[0].disabled = false;
                    omSelectAuthInner[0].options[1].disabled = true;
                    omSelectAuthInner[0].options[2].disabled = false;
                    omSelectAuthInner[0].options[3].disabled = false;
                    omSelectAuthInner[0].options[4].disabled = false;
                    omDivAuthInner.show();
                    omDivServerConf.show();
                    omServerID.show();
                    omDivPw.show();
                    if(valueSelectAuthInner != 0 && valueSelectAuthInner != 2 && valueSelectAuthInner != 3 && valueSelectAuthInner != 4)
                        omSelectAuthInner.val(0);
                }
                else if(3 == value)
                {//TLS
                    omDivAuthInner.hide();
                    omDivPw.hide();
                    omDivServerConf.show();
                    omServerID.show();
                    omAnonymousID.hide();
                }
                else if(2 == value)
                {//FAST：显示MSCHAPv2、GTC；不可选取MSCHAP、CHAP、PAP;
                    omSelectAuthInner[0].options[0].disabled = false;
                    omSelectAuthInner[0].options[1].disabled = false;
                    omSelectAuthInner[0].options[2].disabled = true;
                    omSelectAuthInner[0].options[3].disabled = true;
                    omSelectAuthInner[0].options[4].disabled = true;
                    omDivAuthInner.show();
                    omDivServerConf.show();
                    omServerID.hide();
                    omCertDiv.hide();
                    omDivPw.show();
                    if(valueSelectAuthInner != 0 && valueSelectAuthInner != 1)
                        omSelectAuthInner.val(0);
                }
            });

        $('#button_8021xJumpCertManger').click(
            function(){
                document.getElementById("CERTMANAGEMENT").click();
            }
        );
    }
}


function LoadStaAPList() {
    var ssidNum = 0;
    var scanResult = SN.DATA.WifiScanResult;//AP信息
    var flag = 0;
    var ssidLen = (SN.DATA.wifiScanStatus.value > 50) ? 0 : SN.DATA.wifiScanStatus.value;//AP个数
    var contentHtml = '';

    var radio = document.getElementsByName("wifiStaModeChoose");
    if(radio[0].checked){
        //personal
        flag = 1;
    }
    else if(radio[1].checked){
        //enterprise
        flag = 2;
    }

    contentHtml = '<table id="ap_scan_table" cellpadding="1" class="wifi-step-table">';
    contentHtml += '<tr class="wifi-table-tr">';
    if(flag == 1){
        for (var i=0; i < SN.DATA.wifiAPTableTitle.length; i++) {
            contentHtml += '<td class="tableColumnHeader" id="wifi_hotp_td' + i + '">';
            contentHtml += SN.DATA.wifiAPTableTitle[i];
            contentHtml += '</td>';
        }
    }
    else if(flag == 2){
        for (var i=0; i < SN.DATA.wifiAPEAPTableTitle.length; i++) {
            contentHtml += '<td class="tableColumnHeader" id="wifi_hotp_td' + i + '">';
            contentHtml += SN.DATA.wifiAPEAPTableTitle[i];
            contentHtml += '</td>';
        }
    }

    contentHtml += '</tr></table>';
    $("#sta_scan_table")[0].innerHTML = contentHtml;




    if (scanResult && ssidLen > 0) {
        for (var i = 0; i < ssidLen; i++) {
            if (  scanResult[i] == ""
               //|| scanResult[i][0] != '{'
               //|| scanResult[i][scanResult[i].length - 1] != '}') {
               || scanResult[i].charAt(0) != '{'
               || scanResult[i].charAt(scanResult[i].length - 1) != '}') {
                continue;
            }

            //if (scanResult[i].match(/\\x/)) {
            //    scanResult[i] = scanResult[i].replace(/\\x/g, '\\\\x');
            //}

            if (scanResult[i].match(/\\/)) {
                scanResult[i] = scanResult[i].replace(/\\/g, '\\\\');
            }

            res = scanResult[i].match(/"/g);
            quotenum = res.length;
            if(quotenum > 28)
            {
            //此逻辑处理ssid中包含双引号
                var strLen = scanResult[i].lastIndexOf(",\"bssid");
                var str1= scanResult[i].substring(9, strLen - 1);

                scanResult[i] = scanResult[i].substring(0, 9) + str1.replace(/(\")/g,"\\\"") + scanResult[i].substring(strLen - 1);
            }

            var table = $("#ap_scan_table")[0];

            var td = null;
            var jsonObj = AjaxParseJson(scanResult[i]); //获取json对象
            var parten;

            jsonObj.signalStrength = jsonObj.signalStrength*20;

            if (jsonObj.ssid == SN.DATA.wifiStaSSID.value) {
                var contentHtml = "";
                $(tr).mousedown();
                SN.DATA.wifiStaSecMode.value = jsonObj.security;
                SN.DATA.wifiStaCommMode.value = jsonObj.mode;
                SN.DATA.wifiStaDbm.value = (0 == jsonObj.signalStrength) ? '5%' : jsonObj.signalStrength + '%';
                contentHtml =  SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiStaSecMode, true);
                contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiStaCommMode);
                contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiStaDbm);
                $('#wifiSsid_status').html(contentHtml);
            }

            if ( ( (flag == 1) && (jsonObj.security == 7) ) ||
                //personal
            ( (flag == 2) && (jsonObj.security != 7) ) ) {
                //enterprise
                continue;
            }

            var tr = table.insertRow(table.rows.length);

            ssidNum++;
            tr.index = i;
            td = tr.insertCell(0);
            td.align = "center";
            td.innerHTML = ssidNum;//序号

            td = tr.insertCell(1); //网络名称(SSID)
            td.align = (SN.DATA.RightReadMode ? "right" : "left");
            parten = /[<>\\\"]+/;
            td.innerHTML = parten.test(jsonObj.ssid) ? ReplaceToHtml(jsonObj.ssid) : jsonObj.ssid;

            td = tr.insertCell(2); //MAC地址
            td.align = "center";
            td.innerHTML = jsonObj.bssid;

            td = tr.insertCell(3); //频道
            td.align = "center";
            td.innerHTML = jsonObj.channel;

            td = tr.insertCell(4); //连接模式
            td.align = "center";
            td.innerHTML = SN.DATA.wifiStaCommModeTran[jsonObj.mode];


            if(jsonObj.security == 7)
            {
                td = tr.insertCell(5); //PMF
                td.align = "center";
                td.innerHTML = SN.DATA.wifiStaPMFTran[jsonObj.pmf];

                td = tr.insertCell(6); //信号强度
                td.align = "center";
                td.innerHTML = (0 == jsonObj.signalStrength) ? '5%' : jsonObj.signalStrength + '%';

            }
            else{
                td = tr.insertCell(5); //安全
                td.align = "center";
                td.innerHTML = SN.DATA.wifiSecModeTran[jsonObj.security];

                td = tr.insertCell(6); //PMF
                td.align = "center";
                td.innerHTML = SN.DATA.wifiStaPMFTran[jsonObj.pmf];

                td = tr.insertCell(7); //信号强度
                td.align = "center";
                td.innerHTML = (0 == jsonObj.signalStrength) ? '5%' : jsonObj.signalStrength + '%';

            }


            $(tr).attr("class", "tablerowunSelected");
            $(tr).mousedown(function () {
                $(".tablerowSelected").attr("class", "tablerowunSelected");
                $(this).attr("class", "tablerowSelected");
                var json = AjaxParseJson(SN.DATA.WifiScanResult[this.index]); //获取json对象
                $("[name=wifiStaSSID]").val(json.ssid);
                SN.FUNC.ShowErrorInfo("wifiStaSSID", "", true);
                var wpa_pswd = $("#wifiStaWPAPassword");

                //Encrypt
                //if (json.security > 4) json.security = 4;
                //SetSelectValue($("[name=wifiStaSecMode]")[0].options, json.security);
                //$("[name=wifiStaSecMode]").change();

                //PMF
                //if (json.pmf > 2) json.pmf = 2;
                //SetSelectValue($("[name=wifiStaPMF]")[0].options, json.pmf);
                //$("[name=wifiStaPMF]").change();
                //

                if (json.ssid == SN.DATA.wifiStaSSID.value) {
                    if (1 == json.security || 2 == json.security || 3 == json.security || 4 == json.security || 5 == json.security){
                        wpa_pswd.show();
                        $("[name=wifiStaWPAPassword]").val(SN.DATA.wifiStaWPAPassword.value);
                    }
                    else if(0 == json.security){
                        wpa_pswd.hide();
                    }
                    else if(7 == json.security){
                        wpa_pswd.hide();

                    }
                    //else if (1 == json.security)
                    //    $("[name=wifiWepCurKeyValue]").val(SN.DATA.wifiWepCurKeyValue.value);
                } else {

                    if (1 == json.security || 2 == json.security || 3 == json.security || 4 == json.security || 5 == json.security)
                    {
                        wpa_pswd.show();
                        $("[name=wifiStaWPAPassword]").val('');
                    }
                    else if(0 == json.security){
                        wpa_pswd.hide();
                    }
                    else if(7 == json.security){
                        wpa_pswd.hide();

                    }
                    //else if (1 == json.security)
                    //    $("[name=wifiWepCurKeyValue]").val('');
                }
            });

        }
    }

    if (ssidNum > 0) {
        $("#sta_ssid_refresh_text").html(StringFormat(SN.INFO.PageApListCount, ssidNum));
    }
    else {
        $("#sta_ssid_refresh_text").html(SN.INFO.PageNoApList);
    }
}
SN.DATA.RefreshAplistTime = -1;
function RefreshAplist() {
    if (-1 == SN.DATA.RefreshAplistTime) {
        $("#sta_ssid_refresh").attr("disabled", false);
        return ;
    }

    SN.FUNC.LoadWifiScanDB('STASCAN');

    if ((SN.DATA.wifiScanStatus.value > 0 && SN.DATA.wifiScanStatus.value <= 50)
        || SN.DATA.RefreshAplistTime > 10) {
        LoadStaAPList();
        $("#sta_ssid_refresh").attr("disabled", false);
        SN.DATA.RefreshAplistTime = -1;
        return ;
    }

    setTimeout("RefreshAplist();",1800);
    SN.DATA.RefreshAplistTime += 2;
}
var WIFI_CHECK_STATUS = 0;
var timer;
function InitStaHtml() {
    var margin = ChangeCss('margin-l-usual');
    var goNext = 0;
    var div = $("#id_sta_status")[0];
    if (div) {
        var tmp = "";
        var contentHtml = "";

        contentHtml += '<div class="wifi-step-title" id="sta_state_title">' + SN.INFO.PageStaStateTitle + '</div>';
        contentHtml += '<div class="wifi-step-up ' + margin + '">';
        contentHtml += SN.FUNC.CreateDOM(SN.DATA.wifiStaEnabled) + '</div>';

        contentHtml += '<div class="wifi-bgd-color ' + margin + '">';
        tmp = SN.FUNC.CreateDOM(SN.DATA.wifiStaStatus, true);
        contentHtml += '<div class="wifi-step-div"><span id="sta_state_info" style="font-weight: bold;">' + tmp + '</span></div>';
        tmp = SN.FUNC.CreateDOM(SN.DATA.wifiStaStatusReason, true);
        if ('' != tmp) {
            contentHtml += '<div class="wifi-step-div" id="sta_state_reason">' + tmp + '</div>';
        }
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiStaSSID, true);
        if ('' != SN.DATA.wifiStaSSID.value) {
            //contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiStaSecMode, true);
            contentHtml += '<div id="wifiSsid_status">';
            contentHtml += '</div></div>';
        }
        div.innerHTML = contentHtml;

        if (SN.DATA.wifiStaEnabled.value == 1) {
            $("#id_sta_table").slideUp(0);
            $("#id_sta_authenticate").slideUp(0);
            $("#id_sta_auth_eap").slideUp(0);
            $("[name=wifiStaEnabled][value=1]")[0].checked = true;
            $("#id_WIFIIP").show();//显示无线IP配置页面
            $("#id_sta_mode").slideDown(0);
        } else {
            $("#id_sta_table").slideUp(0);
            $("#id_sta_authenticate").slideUp(0);
            $("#id_sta_auth_eap").slideUp(0);
            $("[name=wifiStaEnabled][value=0]")[0].checked = true;
            $("#id_WIFIIP").hide();//隐藏无线IP配置页面
            $("#id_sta_mode").slideUp(0);
        }
        if (SN.DATA.wifiStaFreq.value == 99){
            $("#id_sta_freq").hide();  // SN3320 hide 5Gwifi frequecy connent
        }

        $("[name=wifiStaEnabled][value=1]").change(
        function () {
            if (this.checked == true) {
                $("#id_sta_table").slideUp(0);
                $("#id_sta_authenticate").slideUp(0);
                $("#id_sta_mode").slideDown(0);
                $("#id_sta_auth_eap").slideUp(0);
            }
        });
        $("[name=wifiStaEnabled][value=0]").change(
        function () {
            if (this.checked == true) {
                $("#id_sta_table").slideUp(0);
                $("#id_sta_authenticate").slideUp(0);
                $("#id_sta_mode").slideUp(0);
                $("#id_sta_auth_eap").slideUp(0);
            }
        });
    }
    var div = $("#id_sta_freq")[0];
    if (div) {
        var contentHtml = "";

        contentHtml += '<div class="wifi-step-title" id="sta_state_title">' + SN.INFO.PageStaFreqTitle + '</div>';
        contentHtml += '<div class="wifi-step-up ' + margin + '">';
        contentHtml += SN.FUNC.CreateDOM(SN.DATA.wifiStaFreq) + '</div>';
        div.innerHTML = contentHtml;
        if (SN.DATA.wifiStaFreq.value == 0) {
            $("[name=wifiStaFreq][value=0]")[0].checked = true;
        }else if(SN.DATA.wifiStaFreq.value == 1) {
            $("[name=wifiStaFreq][value=1]")[0].checked = true;
        }else{
            $("[name=wifiStaFreq][value=2]")[0].checked = true;
        }
    }

    div = $("#id_sta_mode")[0];
    if(div) {
        var contentHtml = "";
        contentHtml += '<div class="wifi-step-title" id="sta_mode_title">' + SN.INFO.PageStaModeChoose + '</div>';
        contentHtml += '<div class="wifi-bgd-color ' + margin + '">';
        contentHtml += '<div class="wifi-step-up ' + margin + '">';
        contentHtml += SN.FUNC.CreateDOM(SN.DATA.wifiStaModeChoose) + '</div>';
        contentHtml += '<div class="button-tail-container">';
        contentHtml += '<input type="button" class="button-tail" id="button_Next1" value="' + SN.INFO.ButtonNext + '"/>';
        contentHtml += '</div>';
        contentHtml += '</div>';
        div.innerHTML = contentHtml;
        $("#id_content_button").slideUp(0);
        $("[name=wifiStaModeChoose][value=0]").attr("checked", "checked");//初始化radio

    }

    $('#button_Next1').click(
        function(){
            var radio = document.getElementsByName("wifiStaModeChoose");
            if(radio[0].checked){
                //personal
                goNext = 1;
            }
            else if(radio[1].checked)
            {
                //enterprise
                goNext = 2;
            }
            //jump guide page No.2
            if(goNext == 1) {
		        var data = SN.DATA.wifiScanStatus.name + "=" + EncodeBase64("255");
            	SN.DATA.wifiScanStatus.value = 255;
            	SN.DATA.RefreshAplistTime = 0;
            	$("#sta_ssid_refresh").attr("disabled", true);
            	$("#sta_ssid_refresh_text").html(SN.INFO.PageRefreshSta);
            	$("#sta_scan_table")[0].innerHTML = '';
            	postdata(data, "/wifiScanStatusRefresh", RefreshAplist);
                $("#id_sta_table").slideDown(0);//显示
                $("#id_sta_authenticate").slideDown(0);//显示
                if($("[id=wifiStaWPAPassword]").css("display") == "none"){
                    $("[id=wifiStaWPAPassword]").show();
                }
                $("#id_sta_auth_eap").slideUp(0);//隐藏
                $("#id_sta_mode").slideUp(0);//隐藏
                $("#id_content_button").slideDown(0);
            }
            else if(goNext == 2){//button was enterprise
                //enterprise
                $("#id_sta_table").slideUp(0);
                $("#id_sta_authenticate").slideUp(0);
                $("#id_sta_auth_eap").slideDown(0);
                $("#id_content_button").slideUp(0);
                    /*WPA2 内部验证方法显示*/
                $("[name=wifiEapMethod]").change(
                    function(){
                        var value = $(this).val();
                        var omtmp = $("[name=wifiEapType]");
                        var omidtmp = $("[id=wifiEapType]");
                        var omidanony = $("[id=wifiEapAnonymousID]");
                        var omidpasw = $("[id=wifiEapPassword]");
                        var valuetype = $("[name=wifiEapType]").val();

                        var omidserid = $("[id=eapSerID]");
                        var omidserAuth = $("[id=eapSerCertJump]");
                        var omidcliAuth = $("[id=eapCliCertJump]");

                        if(0 == value){     //PEAP：显示MSCHAPv2、GTC；不可选取MSCHAP、CHAP、PAP;
                            omtmp[0].options[0].disabled = false;
                            omtmp[0].options[1].disabled = false;
                            omtmp[0].options[2].disabled = true;
                            omtmp[0].options[3].disabled = true;
                            omtmp[0].options[4].disabled = true;
                            $("[name=wifiEapAnonymousID]").attr("disabled", false);
                            $("[name=wifiEapCliAuth]").attr("disabled", true);
                            $("[name=wifiEapPassword]").attr("disabled", false);
                            $("[name=wifiEapSerAuth]").attr("disabled", false);
                            $("[name=wifiEapServerID]").attr("disabled", false);
                            if(omidtmp.css("display") == "none")
                                omidtmp.show();
                            if(omidanony.css("display") == "none")
                                omidanony.show();
                            if(omidpasw.css("display") == "none")
                                omidpasw.show();
                            if(valuetype != 0 && valuetype != 1)
                                omtmp.val(0);
                            if(omidserAuth.css("display") == "none")
                                omidserAuth.show();
                            if(omidserid.css("display") == "none")
                                omidserid.show();
                            if(omidcliAuth.css("display") != "none")
                                omidcliAuth.hide();
                        }
                        else if(1 == value){//TTLS:显示MSCHAP、PAP、CHAP、MSCHAP；不可选取GTC
                            omtmp[0].options[0].disabled = false;
                            omtmp[0].options[1].disabled = true;
                            omtmp[0].options[2].disabled = false;
                            omtmp[0].options[3].disabled = false;
                            omtmp[0].options[4].disabled = false;
                            $("[name=wifiEapAnonymousID]").attr("disabled", false);
                            $("[name=wifiEapCliAuth]").attr("disabled", true);
                            $("[name=wifiEapPassword]").attr("disabled", false);
                            $("[name=wifiEapSerAuth]").attr("disabled", false);
                            $("[name=wifiEapServerID]").attr("disabled", false);
                            if(omidtmp.css("display") == "none")
                                omidtmp.show();
                            if(omidanony.css("display") == "none")
                                omidanony.show();
                            if(omidpasw.css("display") == "none")
                                omidpasw.show();
                            if(valuetype != 0 && valuetype != 2 && valuetype != 3 && valuetype != 4)
                                omtmp.val(0);
                            if(omidserAuth.css("display") == "none")
                                omidserAuth.show();
                            if(omidserid.css("display") == "none")
                                omidserid.show();
                            if(omidcliAuth.css("display") != "none")
                                omidcliAuth.hide();
                        }
                        else if(2 == value){//TLS:不可选取;LEAP：不可选取
                            $("[name=wifiEapAnonymousID]").attr("disabled", true);
                            $("[name=wifiEapCliAuth]").attr("disabled", false);
                            $("[name=wifiEapPassword]").attr("disabled", true);
                            $("[name=wifiEapSerAuth]").attr("disabled", false);
                            $("[name=wifiEapServerID]").attr("disabled", false);
                            if(omidtmp.css("display") != "none")
                                omidtmp.hide();
                            if(omidpasw.css("display") != "none")
                                omidpasw.hide();
                            if(omidanony.css("display") != "none")
                                omidanony.hide();
                            if(omidserAuth.css("display") == "none")
                                omidserAuth.show();
                            if(omidserid.css("display") == "none")
                                omidserid.show();
                            if(omidcliAuth.css("display") == "none")
                                omidcliAuth.show();
                        }
                        else if(4 == value){//FAST：显示MSCHAPv2、GTC；不可选取MSCHAP、CHAP、PAP;
                            omtmp[0].options[0].disabled = false;
                            omtmp[0].options[1].disabled = false;
                            omtmp[0].options[2].disabled = true;
                            omtmp[0].options[3].disabled = true;
                            omtmp[0].options[4].disabled = true;
                            $("[name=wifiEapAnonymousID]").attr("disabled", false);
                            $("[name=wifiEapCliAuth]").attr("disabled", true);
                            $("[name=wifiEapPassword]").attr("disabled", false);
                            $("[name=wifiEapSerAuth]").attr("disabled", false);
                            $("[name=wifiEapServerID]").attr("disabled", false);
                            if(omidtmp.css("display") == "none")
                                omidtmp.show();
                            if(omidanony.css("display") == "none")
                                omidanony.show();
                            if(omidpasw.css("display") == "none")
                                omidpasw.show();
                            if(omtmp.value != 0 && omtmp.value != 1)
                                omtmp.val(0);
                            if(omidserAuth.css("display") == "none")
                                omidserAuth.show();
                            if(omidserid.css("display") == "none")
                                omidserid.show();
                            if(omidcliAuth.css("display") != "none")
                                omidcliAuth.hide();
                        }
                        else if(3 == value){//LEAP:只可选取用户名和用户密码
                            $("[name=wifiEapAnonymousID]").attr("disabled", true);
                            $("[name=wifiEapCliAuth]").attr("disabled", true);
                            $("[name=wifiEapPassword]").attr("disabled", false);
                            $("[name=wifiEapSerAuth]").attr("disabled", true);
                            $("[name=wifiEapServerID]").attr("disabled", true);
                            if(omidpasw.css("display") == "none")
                                omidpasw.show();
                            if(omidtmp.css("display") != "none")
                                omidtmp.hide();
                            if(omidanony.css("display") != "none")
                                omidanony.hide();
                            if(omidserAuth.css("display") != "none")
                                omidserAuth.hide();
                            if(omidserid.css("display") != "none")
                                omidserid.hide();
                            if(omidcliAuth.css("display") != "none")
                                omidcliAuth.hide();
                        }
                        else{//不会出现这种情况
                            $("[name=wifiEapAnonymousID]").attr("disabled", true);
                            $("[name=wifiEapType]").attr("disabled", true);
                            $("[name=wifiEapCliAuth]").attr("disabled", true);
                            $("[name=wifiEapPassword]").attr("disabled", true);
                            $("[name=wifiEapSerAuth]").attr("disabled", true);
                            $("[name=wifiEapServerID]").attr("disabled", true);

                        }
                    });
                $("[name=wifiEapMethod]").change();
                $("#id_sta_mode").slideUp(0);
            }
            else{

            }

        }
    );


    div = $("#id_sta_auth_eap")[0];
    if(div) {
        var contentHtml = "";
        var css_float = ChangeCss("float-left");
        contentHtml += '<div class="wifi-step-title" id="sta_auth_eap_title">' + SN.INFO.PageStaAuthTitle + '</div>';

        contentHtml += '<div class="wifi-bgd-color ' + margin + '">';

		contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiEapAnonymousID);
		contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiEapUsername);
		contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiEapPassword);
		contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiEapMethod);
		contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiEapType);
        contentHtml += '<div id="eapSerCertJump" class="wifi-step-div">';
        contentHtml += '<div class="wifi-step-left ' + css_float + '" id="eap_ser_config" style="margin-bottom: -20px">' + SN.INFO.wifiEapSerAuth + '</div>';
        contentHtml += '<div class="wifi-step-right ' + css_float + '"/>';
        contentHtml += '<input type="button" id="button_jumpConfigSer" value="' + SN.INFO.ButtonConfig + '"/>';//跳转到证书管理
        contentHtml += '</div>';
        contentHtml += '</div>';
        contentHtml += '<div id="eapSerID">';
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiEapServerID);
        contentHtml += '</div>';
        contentHtml += '<div id="eapCliCertJump" class="wifi-step-div">';
        contentHtml += '<div class="wifi-step-left ' + css_float + '" id="eap_cli_config" style="margin-bottom: -20px">' + SN.INFO.wifiEapCliAuth + '</div>';
        contentHtml += '<div class="wifi-step-right ' + css_float + '"/>';
        contentHtml += '<input type="button" id="button_jumpConfigCli" value="' + SN.INFO.ButtonConfig + '"/>';//跳转到证书管理
        contentHtml += '</div>';
        contentHtml += '</div>';
        contentHtml += '<div class="button-tail-container">';
        contentHtml += '<input type="button" class="button-tail" id="button_BackBegin" value="' + SN.INFO.ButtonBack + '"/>';//回到sta_mode界面
        contentHtml += '<input type="button" class="button-tail" id="button_Next2" value="' + SN.INFO.ButtonNext + '"/>';
        contentHtml += '</div>';
        contentHtml += '<div style="clear: both;"></div></div>';

        div.innerHTML = contentHtml;

        $('#button_jumpConfigSer').click(
            function(){
                document.getElementById("CERTMANAGEMENT").click();
            }
        );
        $('#button_jumpConfigCli').click(
            function(){
                document.getElementById("CERTMANAGEMENT").click();
            }
        );

        // $("[name=wifiEapMethod]").change();
        /*wpa2 eap end*/
        $("#id_content_button").slideUp(0);
        $("[name=wifiEapPassword][type=text]").hide();
		//limit of input length, only for wpa2 enterprise
        $("[name=wifiEapUsername]").attr("maxLength", "64");
        $("[name=wifiEapPassword]").attr("maxLength", "64");
        $("[name=wifiEapServerID]").attr("maxLength", "64");
        $("[name=wifiEapAnonymousID]").attr("maxLength", "64");
    }

    $('#button_BackBegin').click(
        function(){
            $("#id_sta_table").slideUp(0);
            $("#id_sta_authenticate").slideUp(0);
            $("#id_sta_auth_eap").slideUp(0);
            $("#id_sta_mode").slideDown(0);
            $("#id_content_button").slideDown(0);
        }
    );

    $('#button_Next2').click(
        function(){
            var flag = $("[name=wifiEapUsername]").val();
            var len = flag.length;
            if(len == 0)
            {
                return;
            }
            var radio = document.getElementsByName("wifiStaModeChoose");
            if(radio[0].checked){
                //personal
                goNext = 3;
            }
            else if(radio[1].checked)
            {
                //enterprise
                goNext = 4;
            }
            //jump guide page No.2
            if(goNext == 3) {
                $("#id_sta_table").slideDown(0);//显示
                $("#id_sta_authenticate").slideDown(0);//显示
                if($("[id=wifiStaWPAPassword]").css("display") == "none"){
                    $("[id=wifiStaWPAPassword]").show();
                }
                $("#id_sta_auth_eap").slideUp(0);//隐藏
                $("#id_sta_mode").slideUp(0);//隐藏
                $("#id_content_button").slideDown(0);
            }
            else if(goNext == 4){//button was enterprise
                //enterprise
			    var data = SN.DATA.wifiScanStatus.name + "=" + EncodeBase64("255");
            	SN.DATA.wifiScanStatus.value = 255;
            	SN.DATA.RefreshAplistTime = 0;
            	$("#sta_ssid_refresh").attr("disabled", true);
            	$("#sta_ssid_refresh_text").html(SN.INFO.PageRefreshSta);
            	$("#sta_scan_table")[0].innerHTML = '';
            	postdata(data, "/wifiScanStatusRefresh", RefreshAplist);
                $("#id_sta_table").slideDown(0);
                $("#id_sta_authenticate").slideDown(0);
                if($("[id=wifiStaWPAPassword]").css("display") != "none"){
                    $("[id=wifiStaWPAPassword]").hide();
                }

                $("#id_sta_auth_eap").slideUp(0);
                $("#id_sta_mode").slideUp(0);
				$("#id_content_button").slideDown(0);
            }
            else{

            }

        }
    );


    div = $("#id_sta_authenticate")[0];
    if (div) {
        var contentHtml = "";

        var css_float = ChangeCss("float-left");

        contentHtml += '<div class="wifi-step-title" id="sta_auth_title">' + SN.INFO.PageStaAuthTitle + '</div>';

        contentHtml += '<div class="wifi-bgd-color ' + margin + '">';
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiStaSSID);
        //contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiStaSecMode);
		contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiStaWPAPassword, false, true);
        contentHtml += '<div class="button-tail-container">';
        contentHtml += '<input type="button" class="button-tail" id="button_BackBeginPSK" value="' + SN.INFO.ButtonBack + '"/>';//回到sta_mode界面
        contentHtml += '</div>';
        contentHtml += '<div style="clear: both;"></div></div>';
        div.innerHTML = contentHtml;
        $("#id_content_button").slideDown(0);
        //密码域选择显示
        $("[name=wifiStaEnabled][value=" + SN.DATA.wifiStaEnabled.value + "]").attr("checked", "checked");
        $("[name=wifiStaSSID]").val(SN.DATA.wifiStaSSID.value);
        $("[name=wifiStaWPAPassword]").val(SN.DATA.wifiStaWPAPassword.value);
        //$("[name=wifiWepCurKeyValue]").val(SN.DATA.wifiWepCurKeyValue.value);
        $("[name=wifiStaSecMode]").change(
        function () {
            var value = $(this).val();
            //var pswd = $("#wifiWepCurKeyValue");
            var wpa_pswd = $("#wifiStaWPAPassword");
            var omtmp = $("[name=wifiStaPMF]");
            if (0 == value) {
                //if (pswd.css("display") != "none")
                  //  pswd.hide();

                   omtmp[0].options[0].disabled = false;
                   omtmp[0].options[1].disabled = true;
                   omtmp[0].options[2].disabled = true;
                   SetSelectValue(omtmp[0], 0);

            }
            else if (1 == value) {
                //if (wpa_pswd.css("display") != "none")
                    wpa_pswd.show();
                //if (pswd.css("display") == "none")
                  //  pswd.hide();
                if (wpa_pswd.css("display") != "none")
                    wpa_pswd.hide();

                   omtmp[0].options[0].disabled = false;
                   omtmp[0].options[1].disabled = true;
                   omtmp[0].options[2].disabled = true;
                   SetSelectValue(omtmp[0], 0);
            }
            else if(2 == value){
                //if (wpa_pswd.css("display") != "none")
                    wpa_pswd.show();
               // if (pswd.css("display") == "none")
                 //   pswd.hide();
                if (wpa_pswd.css("display") != "none")
                    wpa_pswd.hide();

                    omtmp[0].options[0].disabled = false;
                    omtmp[0].options[1].disabled = false;
                    omtmp[0].options[2].disabled = false;
                    SetSelectValue(omtmp[0], 0);
            }
            else if(3 == value){
                //if (wpa_pswd.css("display") != "none")
                    wpa_pswd.show();
                //if (pswd.css("display") == "none")
                  //  pswd.hide();
                if (wpa_pswd.css("display") != "none")
                    wpa_pswd.hide();

                omtmp[0].options[0].disabled = true;
                omtmp[0].options[1].disabled = false;
                omtmp[0].options[2].disabled = false;
                SetSelectValue(omtmp[0], 1);
            }
            else if(4 == value){
                //if (wpa_pswd.css("display") != "none")
                    wpa_pswd.show();
               // if (pswd.css("display") == "none")
                 //   pswd.hide();
                if (wpa_pswd.css("display") != "none")
                    wpa_pswd.hide();

				omtmp[0].options[0].disabled = true;
				omtmp[0].options[1].disabled = true;
                omtmp[0].options[2].disabled = false;
				SetSelectValue(omtmp[0], 2);
			}
            else if(7 == value){//wpa2-eap
                if (wpa_pswd.css("display") != "none")
                    wpa_pswd.hide();

            }
            else {
                if (wpa_pswd.css("display") == "none")
                    wpa_pswd.show();

                //if (pswd.css("display") != "none")
                  //  pswd.hide();
            }
        });

        //加密方式
        //SetSelectValue($("[name=wifiStaSecMode]")[0].options, SN.DATA.wifiStaSecMode.value);
        //$("[name=wifiStaSecMode]").change();

        //PMF
        //SetSelectValue($("[name=wifiStaPMF]")[0].options, SN.DATA.wifiStaPMF.value);
        //$("[name=wifiStaPMF]").change();

        //选择密文方式显示密码
        $("[name=wifiWepCurKeyValue][type=text]").hide();
        $("[name=wifiStaWPAPassword][type=text]").hide();

        //input长度限制
        $("[name=wifiStaSSID]").attr("maxLength", "32");
        $("[name=wifiStaWPAPassword]").attr("maxLength", "64");
        $("[name=wifiWepCurKeyValue]").attr("maxLength", "63");

    }
    $('#button_BackBeginPSK').click(
        function(){
            var radio = document.getElementsByName("wifiStaModeChoose");
            if(radio[0].checked){
                //personal
                $("#id_sta_table").slideUp(0);
                $("#id_sta_authenticate").slideUp(0);
                $("#id_sta_auth_eap").slideUp(0);
                $("#id_sta_mode").slideDown(0);
                $("#id_content_button").slideUp(0);
            }
            else if(radio[1].checked)
            {
                //enterprise
                $("#id_sta_table").slideUp(0);
                $("#id_sta_authenticate").slideUp(0);
                $("#id_sta_auth_eap").slideDown(0);
                $("#id_sta_mode").slideUp(0);
                $("#id_content_button").slideUp(0);
            }

        }
    );
    div = $("#id_sta_table")[0];
    if (div) {
        var margin_text = SN.DATA.RightReadMode ? 'margin-right' : 'margin-left';
        var contentHtml = "";
        contentHtml += '<div class="wifi-step-title" id="sta_aplist_title">' + SN.INFO.PageStaAPListTitle;
        contentHtml += '</div>';

        contentHtml += '<div class="wifi-step-up ' + margin + '">';
        contentHtml += '<input type="button" id="sta_ssid_refresh" value="' + SN.INFO.ButtonRefresh + '"/>';
        contentHtml += '<label id="sta_ssid_refresh_text" style="' + margin_text + ': 20px;"></label>';
        contentHtml += '</div>';

        contentHtml += '<div id="sta_scan_table" class="' + margin + '"></div>';

        div.innerHTML = contentHtml;

        $("#sta_ssid_refresh").click(
        function () {
            var data = SN.DATA.wifiScanStatus.name + "=" + EncodeBase64("255");
            SN.DATA.wifiScanStatus.value = 255;
            SN.DATA.RefreshAplistTime = 0;
            $("#sta_ssid_refresh").attr("disabled", true);
            $("#sta_ssid_refresh_text").html(SN.INFO.PageRefreshSta);
            $("#sta_scan_table")[0].innerHTML = '';
            postdata(data, "/wifiScanStatusRefresh", RefreshAplist);
        });

        $("#sta_ssid_refresh").click();
        //SN.FUNC.LoadWifiScanDB('STASCAN');
        //LoadStaAPList();
    }
    function CheckWifiStatus(){
        SN.FUNC.LoadWifiOmDB('STA');
        if(SN.DATA.wifiStaStatus.value == 0  || SN.DATA.wifiStaStatus.value == 1)//当前状态为离线或者在线，不再定时检测
        {
            RefreshCurrentPage();
            clearInterval(timer);
            WIFI_CHECK_STATUS = 0;
        }
    }
    $('#button_apply').click(
	function(){
        if(WIFI_CHECK_STATUS == 1)
        {
            clearInterval(timer);
            WIFI_CHECK_STATUS = 0;
        }
        timer = window.setInterval(CheckWifiStatus, 2000);
        WIFI_CHECK_STATUS = 1;
	}
    );
}
function InitStaipHtml() {
    var margin = ChangeCss('margin-l-usual');
    div = $("#id_sta_ipv4setting")[0];
    if (div) {
        var contentHtml = "";
        contentHtml += '<div class="wifi-step-title" id="staipv4_title">' + SN.INFO.PageStaIpv4Title + '</div>';

        contentHtml += '<div class="wifi-bgd-color ' + margin + '">';
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiStaMacAddr);
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiStaIpEnable);
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiStaIpAddr);
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiIPv4SubnetMask);
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiIPv4GatewayAddress);
        contentHtml += '<div style="clear: both;"></div></div>';

        div.innerHTML = contentHtml;

        $("[name=wifiStaIpEnable]").change(
        function() {
            $('[name="wifiStaIpAddr"]').attr("disabled", this.checked);
            $('[name="wifiIPv4SubnetMask"]').attr("disabled", this.checked);
            $('[name="wifiIPv4GatewayAddress"]').attr("disabled", this.checked);
        });
        $("[name=wifiStaIpEnable]").change();

        //input长度限制
        $("[name=wifiStaIpAddr]").attr("maxLength", "15");
        $("[name=wifiIPv4SubnetMask]").attr("maxLength", "15");
        $("[name=wifiIPv4GatewayAddress]").attr("maxLength", "15");

        //清除CKIPPart flag
        SN.DATA.CKIPPart[3] = [0, 0, 0, 0];
    }

    div = $("#id_sta_ipv6setting")[0];
    if (div) {
        var contentHtml = "";
        contentHtml += '<div class="wifi-step-title" id="staipv6_title">' + SN.INFO.PageStaIpv6Title + '</div>';

        contentHtml += '<div class="wifi-bgd-color ' + margin + '">';
        //contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiUseDHCPv6);
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiIPv6LocalAddress);
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiIPv6Address);
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiIPv6GatewayAddress);
        contentHtml += '</div>';

        div.innerHTML = contentHtml;
    }
}
function InitUapHtml() {
    var margin = ChangeCss('margin-l-usual');
    var div = $("#id_uap_status")[0];
    if (div) {
        var contentHtml = "";
        contentHtml += '<div class="wifi-step-title" id="uap_status_title">' + SN.INFO.PageUapStatusTitle + '</div>';
        contentHtml += '<div class="wifi-step-up ' + margin + '">' + SN.FUNC.CreateDOM(SN.DATA.wifiUapEnabled) + '</div>';

        contentHtml += '<div class="wifi-bgd-color ' + margin + '">';
        SN.DATA.wifiUapSSIDAll.value = SN.DATA.wifiSsidPrefix.value + SN.DATA.wifiUapSSID.value;
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiUapSSIDAll);
        SN.DATA.wifiUapSecMode.value = 2; //固定为WPA/WPA2
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiUapSecMode, true);
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiUapMacAddr);
        contentHtml += '</div>';

         div.innerHTML = contentHtml;
    }

    div = $("#id_uap_authenticate")[0];
    if (div) {
        var contentHtml = "";
        contentHtml += '<div class="wifi-step-title" id="uap_auth_title">' + SN.INFO.PageUapAuthenTitle + '</div>';

        contentHtml += '<div class="wifi-bgd-color ' + margin + '">';
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiUapSSID);
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiUapWPAPassword, false, true);
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiUapSecMode);

        contentHtml += '<div style="clear: both;"></div></div>';

        div.innerHTML = contentHtml;

        //选择密文方式显示密码
        $("[name=wifiUapWPAPassword][type=text]").hide();

        //input长度限制
        var length = 32 - SN.DATA.wifiSsidPrefix.value.length - 1;
        $("[name=wifiUapSSID]").attr("maxLength", length.toString());
        $("[name=wifiUapWPAPassword]").attr("maxLength", "63");
    }

    div = $("#id_uap_dhcp")[0];
    if (div) {
        var contentHtml = "";
        contentHtml += '<div class="wifi-step-title" id="uap_dhcp_title">' + SN.INFO.PageUapDhcpTitle + '</div>';

        contentHtml += '<div class="wifi-bgd-color ' + margin + '">';
        SN.DATA.wifiUapDHCPDAddress.value = '192.168.223.1';
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiUapDHCPDAddress);
        SN.DATA.wifiUapDHCPDSubnetAddress.value = '255.255.255.0';
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiUapDHCPDSubnetAddress);
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiUapDHCPEnabled, true);
        SN.DATA.wifiUapDHCPLeaseTime.value = '30m';
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiUapDHCPLeaseTime);
        SN.DATA.wifiUapDHCPStartAddr.value = '192.168.223.100';
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiUapDHCPStartAddr);
        SN.DATA.wifiUapDHCPEndAddr.value = '192.168.223.199';
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiUapDHCPEndAddr);
        contentHtml += '</div>';

        div.innerHTML = contentHtml;
    }

    $("[name=wifiUapEnabled][value=1]").change(
    function () {
        if (this.checked == true) {
            $("#id_uap_authenticate").slideDown(0);
            $("#id_uap_dhcp").slideDown(0);
        }
    });
    $("[name=wifiUapEnabled][value=0]").change(
    function () {
        if (this.checked == true) {
            $("#id_uap_authenticate").slideUp(0);
            $("#id_uap_dhcp").slideUp(0);
        }
    });

    if (SN.DATA.wifiUapEnabled.value == 1) {
        $("#id_uap_authenticate").slideDown(0);
        $("#id_uap_dhcp").slideDown(0);
        $("[name=wifiUapEnabled][value=1]")[0].checked = true;
    } else {
        $("#id_uap_authenticate").slideUp(0);
        $("#id_uap_dhcp").slideUp(0);
        $("[name=wifiUapEnabled][value=0]")[0].checked = true;
    }
}
function InitWpsHtml() {
    var margin = ChangeCss('margin-l-usual');
    var div = $("#id_wps_connect")[0];
    if (div) {
        var contentHtml = "";
        contentHtml += '<div class="wifi-step-title" id="wps_set_title">' + SN.INFO.PageWpsTitle + '</div>';

        if (SN.DATA.wifiWpsSleepTimeEnd < 0) {
            SN.DATA.wifiWpsSleepTime.value = 120;
            SN.DATA.wifiWpsModePin.value = '';
        }
        SN.DATA.wifiWpsSleepTime.info += '(s)';

        contentHtml += '<div class="wifi-bgd-color ' + margin + '">';
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiWpsSecMode);
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiWpsModePin);
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiWpsSleepTime);
        contentHtml += '</div>';

        div.innerHTML = contentHtml;

        if ((SN.DATA.wifiWpsSleepTimeEnd < 0 || SN.DATA.wifiWpsPin < 0)
            && (SN.DATA.wifiWpsSecMode.value != 1)) {
            SN.DATA.wifiWpsPin = -1;
        }
        if (SN.DATA.wifiWpsPin >= 0) {
            $("#wifiWpsModePin").show();
            SN.DATA.wifiWpsSecMode.value = 1;
        } else {
            $("#wifiWpsModePin").hide();
        }

        $("[name=wifiWpsSecMode]").change(
        function () {
            if (this.value == 1) {
                $("#wifiWpsModePin").show();
                SN.DATA.wifiWpsPin = 0;
            } else {
                $("#wifiWpsModePin").hide();
                SN.DATA.wifiWpsPin = -1;
            }
        });
    }
}
function InitWfdHtml() {
    var contentHtml = "";
    var margin = ChangeCss('margin-l-usual');
    var div = $("#id_wfd_status")[0];
    if (div) {
        contentHtml = '<div class="wifi-step-title" id="wfd_set_title">' + SN.INFO.PageWfdTitle + '</div>';
        contentHtml += '<div class="wifi-step-up ' + margin + '">' + SN.FUNC.CreateDOM(SN.DATA.wifiWfdSupported) + '</div>';

        div.innerHTML = contentHtml;
    }

    div = $("#id_wfd_authenticate")[0];
    if (div) {
        contentHtml = '<div class="wifi-bgd-color ' + margin + '">';
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiWfdMacAddr);
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiWfdUapSSID);
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiWfdPassword);
        contentHtml += '<div style="clear: both;"></div></div>';

        div.innerHTML = contentHtml;

        //长度限制
       // $("[name=wifiWfdUapSSID]").attr("maxLength", 31 - SN.DATA.wifiWfdSsidPrefix.value.length).attr(
       //     "disabled", SN.DATA.wifiWfdSupported.value == 0);
        $("[name=wifiWfdPassword]").attr("maxLength", "63").attr(
            "disabled", SN.DATA.wifiWfdSupported.value == 0);
    }

    div = $("#id_wfd_dhcp")[0];
    if (div) {
        contentHtml = '<div class="wifi-step-title" id="uap_dhcp_title">' + SN.INFO.PageUapDhcpTitle + '</div>';
        contentHtml += '<div class="wifi-bgd-color ' + margin + '">';
        SN.DATA.wifiUapDHCPDAddress.value = '192.168.223.1';
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiUapDHCPDAddress);
        SN.DATA.wifiUapDHCPDSubnetAddress.value = '255.255.255.0';
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiUapDHCPDSubnetAddress);
        SN.DATA.wifiUapDHCPEnabled.value = 1;
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiUapDHCPEnabled, true);
        SN.DATA.wifiUapDHCPLeaseTime.value = '30m';
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiUapDHCPLeaseTime);
        SN.DATA.wifiUapDHCPStartAddr.value = '192.168.223.100';
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiUapDHCPStartAddr);
        SN.DATA.wifiUapDHCPEndAddr.value = '192.168.223.199';
        contentHtml += SN.FUNC.InsertWifiOmDiv(SN.DATA.wifiUapDHCPEndAddr);
        contentHtml += '</div>';

        div.innerHTML = contentHtml;
    }

    $("[name=wifiWfdSupported][value=2]").change(
    function () {
        if (this.checked == true) {
            //$("#id_wfd_authenticate").slideUp(0);
            $("#id_wfd_dhcp").slideDown(0);
            $("[name=wifiWfdUapSSID]").attr("disabled", false);
            $("[name=wifiWfdPassword]").attr("disabled", false);
        }
    });
    $("[name=wifiWfdSupported][value=1]").change(
    function () {
        if (this.checked == true) {
            //$("#id_wfd_authenticate").slideDown(0);
            $("#id_wfd_dhcp").slideDown(0);
            $("[name=wifiWfdUapSSID]").attr("disabled", false);
            $("[name=wifiWfdPassword]").attr("disabled", false);
        }
    });
    $("[name=wifiWfdSupported][value=0]").change(
    function () {
        if (this.checked == true) {
            //$("#id_wfd_authenticate").slideUp(0);
            $("#id_wfd_dhcp").slideUp(0);
            $("[name=wifiWfdUapSSID]").attr("disabled", true);
            $("[name=wifiWfdPassword]").attr("disabled", true);
        }
    });

    if (SN.DATA.wifiWfdSupported.value == 2) {
        //$("#id_wfd_authenticate").slideDown(0);
        $("#id_wfd_dhcp").slideDown(0);
        $("[name=wifiWfdSupported][value=2]")[0].checked = true;
    } else if (SN.DATA.wifiWfdSupported.value == 1) {
        //$("#id_wfd_authenticate").slideDown(0);
        $("#id_wfd_dhcp").slideDown(0);
        $("[name=wifiWfdSupported][value=1]")[0].checked = true;
    } else {
        //$("#id_wfd_authenticate").slideUp(0);
        $("#id_wfd_dhcp").slideUp(0);
        $("[name=wifiWfdSupported][value=0]")[0].checked = true;
    }
}
//管理页面初始化
function InitWebLoginHtml() {
    var div = $("#form_main")[0];
    if (div) {
        var contentHtml = "";
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omWebLoginEnabled);

        div.innerHTML = contentHtml;
    }
}
function InitChangeWebPasHtml() {
    var div = $("#form_main")[0];
    if (div) {
        var contentHtml = "";
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omAdminUser);
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omAdminPass);
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omAdminPass1);
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omAdminPass2);

        div.innerHTML = contentHtml;

        //input长度限制
        $("[name=omAdminUser]").attr("maxLength", "63");
        $("[name=omAdminPass]").attr("maxLength", "25");
        $("[name=omAdminPass1]").attr("maxLength", "25");
        $("[name=omAdminPass2]").attr("maxLength", "25");
    }
}
function InitWebLoginTimeoutHtml() {
    var div = $("#form_main")[0];
    if (div) {
        var contentHtml = "";
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omWebLoginTimeout);

        div.innerHTML = contentHtml;

    }
}

function InitPanelLoginHtml() {
    var div = $("#form_main")[0];
    if (div) {
        var contentHtml = "";
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omPanelLoginEnabled);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omPanelPwsdSameAsWeb);

        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omPanelPass1);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omPanelPass2);

        div.innerHTML = contentHtml;
        //input长度限制
        $("[name=omPanelPass1]").attr("maxLength", "25");
        $("[name=omPanelPass2]").attr("maxLength", "25");
        $("[name=omPanelPwsdSameAsWeb]").change(
            function ()
            {
                var checked = $("[name=omPanelPwsdSameAsWeb]").prop("checked");
                $("[name=omPanelPass1]").attr("disabled", checked);
                $("[name=omPanelPass2]").attr("disabled", checked);
            }
        );
        $("[name^=omPanelPwsdSameAsWeb]").change();
    }
}
SN.DATA.UpgradeLoad = 0;
function CheckCandoUpgrade() {
    /*postdata('checkloaded', '/OnlineUpgradeFW',
    function(msg){
        var msgJson = null, data, tmp;
        var progress;
        var d = new Date();
        var second = parseInt((d.getTime() - SN.DATA.TimeData.getTime())/1000);

        //console.log('msg: ' + msg);
        if (msg) {
            data = '';
            msgJson = AjaxParseJson(msg);
            //console.log("==============================");
            //console.log(msgJson);
            if (SN.DATA.UpgradeLoad != msgJson.load) {
                SN.DATA.TimeData = new Date();
            }
            data += "<b>firmware.acl: </b></br>";
            progress = parseInt((msgJson.size - msgJson.load)*50/msgJson.size);
            tmp = "--------------------------------------------------";
            data += "|" + tmp.substr(0, progress).replace(/-/g, "*");
            data += tmp.substr(progress, 50) + "| ";
            data += (msgJson.size - msgJson.load) + " / " + msgJson.size + "</br>";
            $("#fw_progressbar").html(data);
            //console.log("progress: " + data);
            //console.log("second: " + second);
            //console.log("==============================");
            if (msgJson.Result == HTTP_SYSUPGRADE_OK && 0 == msgJson.load) {
                alert(SN.INFO.SystemUpgrading);
                $('#check_main').html(SN.INFO.SystemUpgrading);
                ShowOrHideWaitting(false);
            } else if (msgJson.Result == HTTP_SYSUPGRADE_FAIL || second > 300) {
                alert(SN.INFO.SystemUpgradFail);
                ShowOrHideWaitting(false);
            }
        }
    }, true);*/
}
/*function GetUpgradeConfigXML() {
    postdata("getconfig", '/OnlineUpgradeFW',
    function(msg){
        var msgJson = null;
        if (msg) {
            msgJson = AjaxParseJson(msg);
            if (msgJson.Result == HTTP_SYSUPGRADE_OK) {
                CheckFirmwareUpgrade();
                return ;
            }
        }
        $('#check_main').html(SN.INFO.OnlineNoconnect);
    }, true);
}
function CheckFirmwareUpgrade() {
    var url = null;
    var data = null;

    url = 'config.xml';
    data = SN.FUNC.LoadDataFile(url);
    if ('' == data || '<html><body>No such URL here</body></html>' == data) {
        $('#check_main').html(SN.INFO.OnlineIsLatest);
        return ;
    } else if (data != false) {
        var ver, tmp1, tmp2;
		var xml = $.parseXML(data);

		ver = $(xml).find('Config>Firmware>Version').text();
		tmp1 = ver.split(".");
        tmp2 = SN.DATA.omFirmVersion.value.split(".");
        if (tmp1.length != tmp2.length) {
            $('#check_main').html(SN.INFO.OnlineIsLatest);
            return ;
        } else {
            for(var i = 0; i < tmp1.length; i++) {
                var visonTmp1 = parseInt(tmp1[i], 10);
                var visonTmp2 = parseInt(tmp2[i], 10);
                if ((visonTmp1 < visonTmp2)
                    || (visonTmp1 == visonTmp2 && tmp1.length - 1 == i)) {
                    $('#check_main').html(SN.INFO.OnlineIsLatest);
                    return ;
                } else if (visonTmp1 > visonTmp2) {
                    break;
                }
            }
        }

        $('#check_main').html(SN.INFO.YoucandoUpgrade);
        $('#download_main').show();

        $('#' + SN.TYPE.Upgrade + '_online').click(
        function() {
            if (!CheckIsLogined())
                return ;
            $(this).hide();

            $('#check_main').html(SN.INFO.FirmwareLoading);
            alert(SN.INFO.FirmwareLoading);

            postdata("checkloaded", '/OnlineUpgradeFW',
            function(msg){
                var msgJson = null;
                if (undefined == msg) {
                   alert(SN.INFO.NoReturnMessage);//没有返回数据
                   return;
                }

                msgJson = AjaxParseJson(msg);
                if (msgJson.Result == HTTP_SYSUPGRADE_OK) {
                postdata("checkupgrade", '/OnlineUpgradeFW',
                    function(msg){
                        var msgJson = null;
                        if (undefined == msg) {
                            alert(SN.INFO.NoReturnMessage);//没有返回数据
                            return;
                        }

                        msgJson = AjaxParseJson(msg);
                        if (msgJson.Result == HTTP_SYSUPGRADE_OK) {
                            $('#check_main').html(SN.INFO.SystemUpgrading);
                            alert(SN.INFO.SystemUpgrading);
                            //SN.DATA.TimeData = new Date();
                        } else {
                            $('#check_main').html(SN.INFO.SystemUpgradFail);
                            alert(SN.INFO.SystemUpgradFail);
                        }
                        ShowOrHideWaitting(false);
                    }, true);
               }else {
                    $('#check_main').html(SN.INFO.SystemUpgradFail);
                    alert(SN.INFO.SystemUpgradFail);
               }
           }, true);
        });
    }
}*/
function CheckSubmit() {
    if (!CheckIsLogined())
        return false;

    $("#offline_info").html("");
    if ($("#uploadfile").val() == "") {
        alert(SN.INFO.OfflineNofile);
    } else if(confirm(SN.INFO.OfflineSubmitOK)) {
        $("#offline_info").html(SN.INFO.OfflineUploading);
        $("#offline_button").hide();
        return true;
    }
    return false;
}
function UpgradeProcess(msg) {
    var msgJson, parsemsg, idx;
    if (undefined == msg) {
        alert(SN.INFO.NoReturnMessage);//没有返回数据
        return;
    }
    idx = msg.indexOf("\r\n\r\n{");
    idx = (idx >= 0) ? (idx + 4) : msg.indexOf("{");
    parsemsg = msg.substring(idx);
    msgJson = AjaxParseJson(parsemsg);
    ClearLoginTime(0);

    if (msgJson.Result == HTTP_SYSUPGRADE_OK) {
        $("#offline_info").html(SN.INFO.OfflineUpgrading);
        //$("#offline_button").show();
    } else {
        $("#offline_info").html(SN.INFO.OfflineUploadFiled);
        $("#offline_button").show();
    }
    ShowOrHideWaitting(false);
}
function OfflineOnsubmit(){
    if (!CheckSubmit()){
        return ;
    }
    var backupLogoutTime = SN.DATA.WebUserLogoutTime;
    SN.DATA.WebUserLogoutTime = 5 * 60 * 1000;
    function restoreLogoutTime() {
        SN.DATA.WebUserLogoutTime = backupLogoutTime;
    }
    option = {
        url: "/fwupgrade",
        type: 'POST',
        //dataType: 'text',
        //cache: false,
        //data: new FormData($("#upgrade_form")[0]),
        //processData: false,
        //contentType: false,
        success: function (data) {
            //console.log(data);
            setTimeout(restoreLogoutTime, 30000);
            UpgradeProcess(data);
        },
        //error: function () {
        //    $("#offline_info").html(SN.INFO.OfflineUploadFiled);
        //    $("#offline_button").show();
        //},
        clearForm: true,
        resteForm: true
    }
    ShowOrHideWaitting(true, 1);

    if (  SN.DATA.BrowserDesc != 0
       && SN.DATA.BrowserDesc >= 8  ) {
        $("#uploadfile").upload({
            url: '/fwupgrade',
            dataType: 'text',
            onSend: function () {
                return true;
            },
            onComplate: function (data) {
                setTimeout(restoreLogoutTime, 30000);
                UpgradeProcess(data);
            }
        });
        $("#uploadfile").upload("ajaxSubmit");
    } else {
        //$.ajax(option);
        $("#upgrade_form").ajaxSubmit(option);
    }
}
var checkupgradeVer_res = false;
var internet_protocol_security_build_different = 1;
function parserUpgradeCodeMapping(resultHex) {
    const code = resultHex;
    if(code >= 0x01 && code <= 0x0F)
    {
        return SN.DATA.upgradeWindowInfo[0][0];
    }
    else if(code >= 0x11 && code <= 0x1F)
    {
        if(code == 0x13)//已是最新版本
            return SN.DATA.upgradeWindowInfo[8][0];
        else
            return SN.DATA.upgradeWindowInfo[1][0];
    }
    else if(code >= 0x21 && code <= 0x2F)
    {
        if(code == 0x2F)
            return SN.DATA.upgradeWindowInfo[9][0];
        else
            return SN.DATA.upgradeWindowInfo[2][0];
    }
    else if(code >= 0x31 && code <= 0x3F)
    {
        return SN.DATA.upgradeWindowInfo[3][0];
    }
    else if(code >= 0x41 && code <= 0x4F)
    {
        return SN.DATA.upgradeWindowInfo[4][0];
    }
    else if(code >= 0x51 && code <= 0x5F)
    {
        return SN.DATA.upgradeWindowInfo[5][0];
    }
    else if(code >= 0x61 && code <= 0x6F)
    {
        return SN.DATA.upgradeWindowInfo[6][0];
    }
    else
    {
        return SN.DATA.upgradeWindowInfo[7][0];
    }
}
function CheckFirmwareUpgrade() {
    if (!CheckIsLogined()) {
        return false;
    }

    var backupLogoutTime = SN.DATA.WebUserLogoutTime;
    SN.DATA.WebUserLogoutTime = 5 * 60 * 1000;
    function restoreLogoutTime() {
        SN.DATA.WebUserLogoutTime = backupLogoutTime;
    }
    postdata("getversion", '/OnlineUpgradeFW',
    function(msg){
            var alertMsg = "";
            var msgJson = null;
            if (undefined == msg) {
                alert(SN.INFO.NoReturnMessage);//没有返回数据
                return;
            }
            msgJson = AjaxParseJson(msg);
            if('upgradever' == msgJson.Operation)
            {
                const resultNum = parseInt(msgJson.Result, 16);
                if(resultNum == 0x1F)
                {
                    if(confirm(SN.INFO.YoucandoUpgrade + "(" + msgJson.Version + ")" + SN.INFO.YoucandoUpgradeSub)){
                        alert(SN.INFO.SystemUpgrading);
                        checkupgradeVer_res = true;
                        postdata("checkupgrade", '/OnlineUpgradeFW',
                        function(msg){
                            setTimeout(restoreLogoutTime, 30000);
                            var msgJson = null;
                            if (undefined == msg) {
                                alert(SN.INFO.NoReturnMessage);//没有返回数据
                                return;
                            }
                            msgJson = AjaxParseJson(msg);
                                    if('upgradeload' == msgJson.Operation)
                                    {
                                        const resultNum = parseInt(msgJson.Result, 16);
                                        alertMsg = parserUpgradeCodeMapping(resultNum);
                                        alert(alertMsg);
                                    }
                        }, false);}
                }
                else
                {
                    alertMsg = parserUpgradeCodeMapping(resultNum);
                    alert(alertMsg);
                }
            }
        }, false);
}
function InitUpgradeHtml() {
    var div = $("#form_main")[0];
    if (div) {
        var contentHtml = '<div>';
        contentHtml += SN.FUNC.CreateButton(SN.TYPE.Upgrade + '_online', SN.INFO.UpgradeBtn);

        $("#download_main").html(contentHtml);
        $('#download_main').hide();

        $("#online_title").html(SN.INFO.UpgradeOnline);
        $("#check_update").html(SN.INFO.CheckUpdate);
        /*$("[name=upgrade_form]").submit(
        function(data){
            //console.log("======================");
            //console.log(data);
            ShowOrHideWaitting(true, 1);
            $('form:first').attr('target', "upload_iframe");
        });
        */
        $("#offline_button").html(SN.INFO.UpgradeBtn);
        $("#offline_title").html(SN.INFO.UpgradeOffline);
        $("#upgrade_note").html(SN.INFO.OfflineWarning);
        $("#upgrade_note").css("color", "red");
        $("#id_offline_entry").show();
        $("#check_update").click(function(){
            CheckFirmwareUpgrade();
        });
    }
}

function InitGcpHtml() {
    var div = $("#form_main")[0];
    if (div) {
        var contentHtml = "";
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omGCPEnable);
        contentHtml += '<div><div style="padding: 6px; font"><b>' + SN.INFO.PageGcpStatus;
        contentHtml += '<span id="tip_info">' + SN.INFO.PageGcpNoReg + '</span></b>';
        contentHtml += '</div><div>' + SN.FUNC.CreateButton('gcp_registered', SN.INFO.ButtonGcpReg);
        contentHtml += '</div><div style="padding-left: 8px; padding-right: 8px;">';
        contentHtml += '<div style="margin-top: 10px;" id="claim_url">';
        contentHtml += '</div></div><div style="margin-top: 10px;">';
        contentHtml += SN.FUNC.CreateButton('gcp_registered_cancel', SN.INFO.ButtonGcpCancelReg);
        contentHtml += '</div><div style="margin-top: 10px;">';
        contentHtml += SN.FUNC.CreateButton('gcp_unregistered', SN.INFO.ButtonGcpDelete);
        contentHtml += '</div></div>';
        contentHtml += '<div style="margin-top: 20px;"><div style="height: 30px; font-weight: bold;">';
       // contentHtml += SN.INFO.PageProxyTitle + '</div>';
        //contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omProxyEnable);
        //contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omProxyServer);
        //contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omProxyPort);
        //contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omProxyAuthEnable);
        //contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omProxyName);
        //contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omProxyPassword, false, true);

        div.innerHTML = contentHtml;

        $("[name=omProxyEnable]").change(
        function () {
            $("[name=omProxyServer]").attr("disabled", !this.checked);
            $("[name=omProxyPort]").attr("disabled", !this.checked);
            $("[name=omProxyAuthEnable]").attr("disabled", !this.checked);
            $("[name=omProxyName]").attr("disabled", !this.checked);
            $("[name=omProxyPassword]").attr("disabled", !this.checked);
        });
        $("[name=omProxyEnable]").change();

        $("[name=omGCPEnable]").change(
        function () {
            var registered, ahtml;
            if (1 == SN.DATA.omGCPRegister.value) {
                registered = true;
                if ('' != SN.DATA.omClaimUrl.value) {
                    ahtml = '<span>' + SN.INFO.PageGcpClaimUrl + '</span>';
                    ahtml += '<a target="_blank" href="' + SN.DATA.omClaimUrl.value + '" onselectstart="return false">';
                    ahtml += SN.DATA.omClaimUrl.value + '</a>';
                    $('#claim_url').html(ahtml);
                }
                $("#tip_info").html(SN.INFO.PageGcpDoneReg);
            } else {
                registered = false;
                $("#tip_info").html(SN.INFO.PageGcpNoReg);
            }
            $("#gcp_registered").attr("disabled", !this.checked || registered);
            $("#gcp_unregistered").attr("disabled", !this.checked || !registered);
        });
        $("[name=omGCPEnable]").change();

        $("[name=omProxyAuthEnable]").change(
        function () {
            $("[name=omProxyName]").attr("disabled", !this.checked);
            $("[name=omProxyPassword]").attr("disabled", !this.checked);
        });
        $("[name=omProxyAuthEnable]").change();

        $("#gcp_registered").click(function(){
            if (!CheckIsLogined())
                return ;

            if (confirm(SN.INFO.SureRegister)) {
                $("#gcp_registered").attr("disabled", true);
                $("#gcp_registered_cancel").show();
                $("#tip_info").html(SN.INFO.PageRegistering);
                postdata("register", "/GcpControlOption", function(msg) {
                    var msgJson = null, ahtml;
                    ShowOrHideWaitting(false);
                    //$("#gcp_registered_cancel").hide();
                    if (undefined == msg) {
                        alert(SN.INFO.NoReturnMessage);//没有返回数据
                        return;
                    }
                    msgJson = AjaxParseJson(msg);
                    if (HTTP_GCP_OPT_OK == msgJson.Result) {
                        ahtml = '<span>' + SN.INFO.PageGcpClaimUrl + '</span>';
                        ahtml += '<a target="_blank" href="' + msgJson.Url + '" onselectstart="return false">';
                        ahtml += msgJson.Url + '</a>';
                        $('#claim_url').html(ahtml);
                        alert(SN.INFO.PageGcpRegOK);
                        $("#tip_info").html(SN.INFO.PageGcpRegOK);
                    } else {
                        $("#gcp_registered").attr("disabled", false);
                        alert(SN.INFO.PageGcpOptFailed);
                        $("#tip_info").html(SN.INFO.PageGcpOptFailed);
                        //RefreshCurrentPage();
                    }
                }, true);
            }
        });

        $("#gcp_registered_cancel").click(function(){
            if (!CheckIsLogined())
                return ;

            if (confirm(SN.INFO.PageGcpCancel)) {
                $("#gcp_registered_cancel").hide();
                $("#tip_info").html(SN.INFO.PageGcpCanceling);
                postdata("cancel", "/GcpControlOption", function(msg) {
                    var msgJson = null;
                    ShowOrHideWaitting(false);
                    if (undefined == msg) {
                        alert(SN.INFO.NoReturnMessage);//没有返回数据
                        return;
                    }
                    msgJson = AjaxParseJson(msg);
                    if (HTTP_GCP_OPT_OK == msgJson.Result) {
                        alert(SN.INFO.PageGcpCancelOK);
                        $("#tip_info").html(SN.INFO.PageGcpCancelOK);
                        $('#claim_url').css("display", "none");
                        $("#gcp_registered").attr("disabled", false);
                    } else {
                        alert(SN.INFO.PageGcpCancelFailed);
                        $("#tip_info").html(SN.INFO.PageGcpCancelFailed);
                    }
                    //RefreshCurrentPage();
                });
            }
        });

        $("#gcp_unregistered").click(function(){
            if (!CheckIsLogined())
                return ;

            if (confirm(SN.INFO.SureGcpDelete)) {
                $("#gcp_unregistered").attr("disabled", true);
                $("#tip_info").html(SN.INFO.PageGcpDeleting);
                postdata("delete", "/GcpControlOption", function(msg) {
                    var msgJson = null;
                    ShowOrHideWaitting(false);
                    if (undefined == msg) {
                        alert(SN.INFO.NoReturnMessage);//没有返回数据
                        return;
                    }
                    msgJson = AjaxParseJson(msg);
                    if (HTTP_GCP_OPT_OK == msgJson.Result) {
                        $("#tip_info").html(SN.INFO.PageGcpDeleteOK);
                        alert(SN.INFO.PageGcpDeleteOK);
                    } else {
                        $("#gcp_unregistered").attr("disabled", false);
                        alert(SN.INFO.PageGcpOptFailed);
                        $("#tip_info").html(SN.INFO.PageGcpOptFailed);
                    }
                    //RefreshCurrentPage();
                });
            }
        });

        $("#gcp_registered_cancel").hide();

        //input长度限制
        $("[name=omProxyServer]").attr("maxLength", "15");
        $("[name=omProxyPort]").attr("maxLength", "5");
        $("[name=omProxyName]").attr("maxLength", "63");
        $("[name=omProxyPassword]").attr("maxLength", "63");

        //密码显示方式为密文
        $("[name=omProxyPassword][type=text]").hide();
    }
}




var hashval = null;
var checkhash = null;
function LoadCertManagementList(refrash){
    var certNum = 0;
    var Result = SN.DATA.omCertManagementList;
    var Len = (SN.DATA.certScanStatus.value > 20) ? 0 : SN.DATA.certScanStatus.value;
    var contentHtml = '';

    contentHtml = '<table id="cert_scan_table" cellpadding="1" style="text-align:center">';
    contentHtml += '<tr class="wifi-table-tr">';
    for (var i=0; i < SN.DATA.CertManagementTableTitle.length; i++) {
        contentHtml += '<td class="tableColumnHeader" id="wifi_hotp_td' + i + '">';
        contentHtml += SN.DATA.CertManagementTableTitle[i];
        contentHtml += '</td>';
    }
    contentHtml += '</tr></table>';
    $("#certlist_scan_table")[0].innerHTML = contentHtml;
    // var certRadio = '<input type="radio" >';
    if (Result && Len > 0) {
        for (var i = 0; i < Len; i++) {
            if (  Result[i] == ""
               || Result[i].charAt(0) != '{'
               || Result[i].charAt(Result[i].length - 1) != '}') {
                continue;
            }

            if (Result[i].match(/\\/)) {
                Result[i] = Result[i].replace(/\\/g, '\\\\');
            }


            var table = $("#cert_scan_table")[0];//TODO
            var tr = table.insertRow(table.rows.length);
            var td = null;
            var jsonObj = AjaxParseJson(Result[i]); //获取json对象
            var parten;

            certNum++;
            tr.index = i;
            td = tr.insertCell(0);//todo 去掉index
            td.align = "center";
            td.innerHTML = certNum;

            td = tr.insertCell(1); //subjectCN
            td.align = "left";
            td.innerHTML = jsonObj.subjectCN;

            td = tr.insertCell(2); //issuerCN
            td.align = "left";
            td.innerHTML = jsonObj.issuerCN;

            td = tr.insertCell(3); //validity
            td.align = "left";
            td.innerHTML = jsonObj.validity;

            td = tr.insertCell(4); //constrains
            td.align = "left";
            var thiscont = jsonObj.constraints[0];
            if(thiscont == '-1')
            {
                td.innerHTML = SN.DATA.certManConstrainsTranErr[0];
            }
            else
            {
                td.innerHTML = SN.DATA.certManConstrainsTran[jsonObj.constraints];
            }

            td = tr.insertCell(5); //key usage
            td.align = "left";
			var thischeck = jsonObj.usage[0];
			if(thischeck == 'E')
			{
				td.innerHTML = SN.DATA.certManUsageTran[9];
			}
			else
			{
				for(var j = 0; j < 9; j++){
					var thisval = jsonObj.usage[j];
					if(thisval == '1'){
						td.innerHTML += SN.DATA.certManUsageTran[j];
					}
				}
			}
            td = tr.insertCell(6); //key usage extensions
            td.align = "left";
			var thischeckEX = jsonObj.exusage[0];
			if(thischeckEX == 'E')
			{
				td.innerHTML = SN.DATA.certManExUsageTran[9];
			}
			else
			{
				for(var j = 0; j < 9; j++){
					var thisvalEX = jsonObj.exusage[j];
					if(thisvalEX == '1'){
						td.innerHTML += SN.DATA.certManExUsageTran[j];
					}
				}
			}
            td = tr.insertCell(7); //current usage
            td.align = "left";
			var thischeckCU = jsonObj.current[0];
			if(thischeckCU == 'E' || thischeckCU == '1')
			{
				td.innerHTML = SN.DATA.certManCurrentTran[0];
			}
			else
			{
				for(var j = 1; j < 5; j++){
					var thisvalCU = jsonObj.current[j];
					if(thisvalCU == '1'){
						td.innerHTML += SN.DATA.certManCurrentTran[j];
                        if(j == 3)
                        {
                            checkhash = jsonObj.hash;
                        }
					}
				}
			}


            $(tr).attr("class", "tablerowunSelected");
            $(tr).mousedown(function () {
                $(".tablerowSelected").attr("class", "tablerowunSelected");
                $(this).attr("class", "tablerowSelected");

                $("[id=cert_export]").attr("disabled", false);
                $("[id=cert_remove]").attr("disabled", false);
                $("[id=cert_view]").attr("disabled", false);

                var json = AjaxParseJson(SN.DATA.omCertManagementList[this.index]); //获取json对象
                //获取选中的证书的hash value
                if(json.constraints >= 1 ){
					hashval = json.hash;//CA
                }else{
                    hashval = json.hash;//CLIENT
                }
                if( 0 != json.constraints)
                {
                    $("[id=cert_editUsage]").attr("disabled", true);
                }
                else
                {
                    $("[id=cert_editUsage]").attr("disabled", false);
                }

            });
        }
    }

    if (certNum > 0) {
        $("#cert_list_refresh_text").html(StringFormat(SN.INFO.PageCertCount, certNum));
    }
    else {
        $("#cert_list_refresh_text").html(SN.INFO.PageNoImportCert);
    }

}


SN.DATA.RefreshCertManagementListTime = -1;
function RefreshCertManagementList(){
    if(-1 == SN.DATA.RefreshCertManagementListTime){
        $("#cert_list_refresh").attr("disabled", false);
        return ;
    }

    SN.FUNC.LoadWifiScanDB('CERTMANAGEMENT');

    if((SN.DATA.certScanStatus.value > 0 && SN.DATA.certScanStatus.value <= 20) || SN.DATA.RefreshCertManagementListTime > 10){
        LoadCertManagementList();
        $('#cert_list_refresh').attr("disabled", false);
        return ;
    }

    setTimeout("RefreshCertManagementList();", 1800);
    SN.DATA.RefreshCertManagementListTime += 2;
}


function InitCertManagementHtml(){
    var margin = ChangeCss('margin-l-usual');
    $("#button_export").html(SN.INFO.ButtonExport);
    $("#button_remove").html(SN.INFO.ButtonRemove);
    $("#button_view").html(SN.INFO.ButtonView);//跳页证书详情
    $("#button_editUsage").html(SN.INFO.ButtonEditUsage);//对话框
    SN.FUNC.LoadWifiScanDB("CERTMANAGEMENT");

    div = $("#id_cert_table")[0];
    if (div) {
        var margin_text = SN.DATA.RightReadMode ? 'margin-right' : 'margin-left';
        var contentHtml = "";
        //标题:证书列表
        contentHtml += '<div class="cm-step-title" id="cert_list_title">' + SN.INFO.PageCertManagement;
        contentHtml += '<input type="button" id="cert_assistant" class="snweb-button-cm" value="' + SN.INFO.ButtonAssistant + '"/>';
        contentHtml += '</div>';
        contentHtml += '<div class="cm-step-up ' + margin + '">';
        //刷新按钮后的文本信息
        contentHtml += '<label id="sta_ssid_refresh_text" style="' + margin_text + ': 20px;"></label>';
        contentHtml += '</div>';
        //实际证书列表
        contentHtml += '<div id="certlist_scan_table" style="text-align:center"></div>';
        contentHtml += '<div id="id_cert_button" style="text-align:center">';
        //导出按钮
        contentHtml += SN.FUNC.CreateButton(SN.TYPE.cert_export, SN.INFO.ButtonExport);
        //移除按钮
        contentHtml += SN.FUNC.CreateButton(SN.TYPE.cert_remove, SN.INFO.ButtonRemove);
        //（跳转）查看按钮
        contentHtml += SN.FUNC.CreateButton(SN.TYPE.cert_view, SN.INFO.ButtonView);
        //编辑用途按钮（对话框）
        contentHtml += SN.FUNC.CreateButton(SN.TYPE.cert_editUsage, SN.INFO.ButtonEditUsage);
        //刷新按钮
        contentHtml += '<input type="button" id="cert_list_refresh" value="' + SN.INFO.ButtonRefresh + '"/>';
        contentHtml += '</div>';

        div.innerHTML = contentHtml;

        $("#cert_assistant").click(
        function(){
            LoadCertManAssistantDialog()
        }
        );


        $("#cert_list_refresh").click(
        function () {
            var data = SN.DATA.certScanStatus.name + "=" + EncodeBase64("255");
            SN.DATA.certScanStatus.value = 255;
            SN.DATA.RefreshCertManagementListTime = 0;
            $("#cert_list_refresh").attr("disabled", true);
            $("#cert_list_refresh_text").html(SN.INFO.PageRefreshCert);
            $("#certlist_scan_table")[0].innerHTML = '';
            postdata(data, "/certScanStatusRefresh", RefreshCertManagementList);
        });

        $("[id=cert_export]").attr("disabled", true);
        $("[id=cert_remove]").attr("disabled", true);
        $("[id=cert_view]").attr("disabled", true);
        $("[id=cert_editUsage]").attr("disabled", true);
        $("#cert_list_refresh").click();


        //跳转查看
        $("#cert_view").click(
            function(){
                //拼接字符串
                if (!CheckIsLogined())
                    return ;
                //
				var info = 'omCertHash='+EncodeBase64(hashval);
				postdata(info, "/viewCertMan", function(data){
                    if(data == undefined || data == ''){
                        alert(SN.INFO.NoReturnMessage);
                        return ;
                    }

					var jsonDetail = AjaxParseJson(data);
					LoadCertManagementDialog(jsonDetail);
				}
				);

            }
        );
        //导出
        $("#cert_export").click(
            function() {
                if (!CheckIsLogined())
                    return ;
                var url = '/' + 'export' + 'CertMan';//收到此命令后从OID get 当前选择的证书的hash

				var info = 'omCertHash='+EncodeBase64(hashval);
                postdata(info, url, function(data){
                    if(data == undefined || data == ''){
                        alert(SN.INFO.NoReturnMessage);
                        return ;
                    }

                    var msgJson = AjaxParseJson(data);
					if(HTTP_CERT_MAN_EXPORT_LOCK == msgJson.Result)
					{
						alert(SN.INFO.ErrCMExportLock);
						return ;
					}
					else if(HTTP_CERT_MAN_EXPORT_PARSE == msgJson.Result)
					{
						alert(SN.INFO.ErrCMExportParse);
						return ;
					}
					else if(HTTP_CERT_MAN_EXPORT_TIMEOUT == msgJson.Result)
					{
						alert(SN.INFO.ErrCMExportTimeout);
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

                    if(msgJson.url != 'ERROR'){
                        var userAgent = navigator.userAgent;
                        var isFirefox = userAgent.indexOf("Firefox") > -1;

                        if(isFirefox)
                            window.frames["upload_iframe"].location = msgJson.url;
                        else
                            download(msgJson.url);
                    }
                }
                );
            }
        );
        //移除
        $("#cert_remove").click(
            function(){
                if (!CheckIsLogined())
                    return ;
                var url = '/' + 'delete' + 'CertMan';//收到此命令后从OID get 当前选择的证书的hash

				var info = 'omCertHash='+EncodeBase64(hashval);
                postdata(info, url, function(data){
                    if(undefined == data || '' == data){
                        alert(SN.INFO.NoReturnMessage);
                        return ;
                    }

                    var msgJson = AjaxParseJson(data);

                    if('delete' == msgJson.Operation && '/deleteCertMan' == url){
                        if(msgJson.Result == HTTP_CERT_MAN_REMOVE_SUCCESS){
                            alert(SN.INFO.ErrCMRemoveSuccess);//证书卸载成功弹框
                            //获取和校验该哈希值对应的已启用用途
                            if((checkhash == hashval)&& (window.location.protocol === 'https:'))
                            {
                                window.location.reload();
                            }
                            else
                            {
                                RefreshCurrentPage();//刷新页面
                            }
                        }
						if(HTTP_CERT_MAN_REMOVE_LOCK == msgJson.Result)
						{
							alert(SN.INFO.ErrCMRemoveLock);
                            RefreshCurrentPage();//刷新页面
						}
						else if(HTTP_CERT_MAN_REMOVE_TIMEOUT == msgJson.Result)
						{
							alert(SN.INFO.ErrCMRemoveTimeout);
                            RefreshCurrentPage();//刷新页面
						}
						else if(HTTP_CERT_MAN_UNKNOWN_FIND == msgJson.Result)
						{
							alert(SN.INFO.ErrCMUnknownFind);
                            RefreshCurrentPage();//刷新页面
						}
						else if(HTTP_CERT_MAN_UNKNOWN_SYS == msgJson.Result)
						{
							alert(SN.INFO.ErrCMUnknownSys);
                            RefreshCurrentPage();//刷新页面
						}

                        return ;
                    }
                },undefined);
            }
        );
        //功能编辑
        $("#cert_editUsage").click(
            function() {
				//功能编辑todo
                if(!CheckIsLogined())
                    return;
				submitom = "omCertManagementFuncEditDialog.0"
				LoadCertManagementFuncEditDialog(submitom);
         	}
        );
    }

    //按钮
    $("#button_certificate").html(SN.INFO.CertificateInstall);
    $("#button_certificate_public").html(SN.INFO.CertificateInstall);
    $("#button_certificate").attr("disabled", true);
    $("#button_certificate_public").attr("disabled", true);
    $("#button_certificate_ca").html(SN.INFO.CertificateInstallCA);
    $("#button_certificate_ca").attr("disabled", true);


    //标题和提示
    $("#input_cert_req").html(SN.FUNC.InsertOmDiv(SN.DATA.omCertificateKey));
    $("#install_certificate_private").html(SN.INFO.PageInstallPrivateCert);
    $("#select_prompt").html(SN.INFO.ErrCertFormat);
    $("[name=omCertificateKey]").attr("maxLength", "127");

    $("#install_ca_certificate").html(SN.INFO.PageInstallCACert);
    $("#select_prompt_ca").html(SN.INFO.ErrCertFormatCA);

    $("#install_certificate_public").html(SN.INFO.PageInstallPublicCert);
    $("#select_prompt_public").html(SN.INFO.ErrCertFormatPublic);

    //ShowOrDeleteFile这个接口里带有post，所以不再变动
    ShowOrDeleteFile('show', 0);//identity
    ShowOrDeleteFile('show', 1);//ca
    //ShowOrDeleteFile('show', 2);//csr
    /*load identity cert within private key*/
    $("#input_certificate").change(
    function(){
        var idx = this.value.lastIndexOf(".");
        var type = (idx >= 0) ? this.value.substr(idx) : "";

        if (type != "" && type != ".p12" && type != ".pfx") {
            $("#select_prompt").css("color", "red");
            $("#button_certificate").attr("disabled", true);
            return ;
        } else {
            var filesize = getFileSize(this);
            if(filesize < 50){
                var inpval = $("[name=omCertificateKey]");
                $("#select_prompt").css("color", "black");
                if (inpval && inpval.length > 0 && inpval[0].value.length > 0
                    && SN.FUNC.CheckInput(inpval[0]) && this.value.length > 0) {
                    $("#button_certificate").attr("disabled", false);
                } else {
                    $("#button_certificate").attr("disabled", true);
                }
            } else {
                $("#select_prompt").css("color", "red");
                $("#button_certificate").attr("disabled", true);
                return ;
            }
        }
    });

    $("[name=omCertManagementPriKeyFlag]").change(
        function(){
            if(true == $("[name=omCertManagementPriKeyFlag]").prop('checked'))
                $("#id_prikeyflag").val(1);
            else
                $("#id_prikeyflag").val(0);
        }
    );
    $("[name=omCertManagementPriKeyFlag]").change();

    $("[name=certificate_upload]").submit(function(){
        // $('form:first').attr('target', "upload_iframe");
        $("[name=certificate_upload]").attr('target', "upload_iframe");
        $("#upload_result").html(SN.INFO.CertificateUploading);
    });
    $("#button_certificate").click(
    function(){
        if (!CheckIsLogined())
            return false;

        //var inpval = $("[name=omCertificateKey]").val();
        //postdata("omCertificateKey=" + EncodeBase64(inpval), undefined, function(){ ; });
        //$("[name=certificate_upload]").submit();
    });

    var div = $("#certificate_ssltls")[0];
    if (div) {
        var contentHtml = "";
        var css_float = ChangeCss('float-left');

        contentHtml += '<div><div id="ssltls_cert_self" class="cm-step-title">';
        contentHtml += SN.INFO.SetCertificateSSL + '</div>';
        contentHtml += '<div class="cm-step-up"></div>';
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omCertCommonName);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omCertOrganization);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omCertOrgUnit);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omCertCity);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omCertState);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omCertCountry);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omCertCurrentDate);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omCertNumDaysValid);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omCertSubAlterName);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omCertGenrsaKeyLen);
        contentHtml += SN.FUNC.InsertOmDiv(SN.DATA.omCertShaKeyLen);

        contentHtml += '<div style="clear: both;"></div></div>';

        contentHtml += '<div class="step2">';
        contentHtml += SN.FUNC.CreateDOM(SN.DATA.omCertificateSubmit);
        contentHtml += SN.FUNC.CreateButton('cert_button_submit', SN.INFO.ButtonSubmit);
        contentHtml += '</div>';

        div.innerHTML = contentHtml;
        /*默认使用RSA 2048和SHA 256的长度*/
        var omtmpRSA = $("[name=omCertGenrsaKeyLen]");
        var omtmpSHA = $("[name=omCertShaKeyLen]");

        SetSelectValue(omtmpRSA[0], 1);
        SetSelectValue(omtmpSHA[0], 0);

        //input长度限制
        $("[name=omCertCommonName]").attr("maxLength", "63");
        $("[name=omCertOrganization]").attr("maxLength", "63");
        $("[name=omCertOrgUnit]").attr("maxLength", "63");
        $("[name=omCertCity]").attr("maxLength", "63");
        $("[name=omCertState]").attr("maxLength", "63");
        $("[name=omCertCountry]").attr("maxLength", "2");
        $("[name=omCertCurrentDate]").attr("maxLength", "14");
        $("[name=omCertNumDaysValid]").attr("maxLength", "5");
        $("[name=omCertSubAlterName]").attr("maxLength", "128");
        //禁止编辑
        //$("[name=omCertCommonName]").attr("disabled", true);

        //初始化radio
        $("[name=omCertificateSubmit][value=0]").attr("checked", "checked");

        $('#cert_button_submit').click(
        function(){
            if (!CheckIsLogined())
                return ;

            var oms = $("[name^=omCert][name!=omCertificateSubmit][name!=omCertificateKey][name!=omCertManagementPriKeyFlag]");
            var count = 0;
            var values = '';

            for (var i = 0; i < oms.length; i++) {
                if (!SN.FUNC.CheckInput(oms[i])) {
                    count++;
                } else {
                    if (i == oms.length - 4) {//这个对时间的处理处理的不是6号的开始有效时间，而是7号的有效天数，把天数根据开始有效时间转换为截止日期
                        var tmp = 0;

                        SN.DATA.TimeData.setDate(SN.DATA.TimeData.getDate() + parseInt(oms[i].value, 10));
                        values += '&omCert' + i + '=';
                        tmp = SN.DATA.TimeData.getFullYear();
                        values += (tmp < 10) ? '0' + tmp : tmp;
                        tmp = SN.DATA.TimeData.getMonth() + 1;
                        values += (tmp < 10) ? '0' + tmp : tmp;
                        tmp = SN.DATA.TimeData.getDate();
                        values += (tmp < 10) ? '0' + tmp : tmp;
                        tmp = SN.DATA.TimeData.getHours();
                        values += (tmp < 10) ? '0' + tmp : tmp;
                        tmp = SN.DATA.TimeData.getMinutes();
                        values += (tmp < 10) ? '0' + tmp : tmp;
                        tmp = SN.DATA.TimeData.getSeconds();
                        values += (tmp < 10) ? '0' + tmp : tmp;
                    } else {
                        if(i <= 9){
                            values += '&omCert' + i + '=' + oms[i].value;
                        }
                        else if(i == 10)
                        {
                            values += '&omCert' + 'A' + '=' + oms[i].value;
                        }

                    }
                }
            }

            if (0 == count)
            {
                var data = '';
                var flag = $("[name=omCertificateSubmit]:checked")[0];

                var backupLogoutTime = SN.DATA.WebUserLogoutTime;
                SN.DATA.WebUserLogoutTime = 10 * 60 * 1000;
                function restoreLogoutTime() {
                    SN.DATA.WebUserLogoutTime = backupLogoutTime;
                }
                data = EncodeBase64(flag.value + values);
                postdata(data, "/tlscertmake",
                function(data){
                    setTimeout(restoreLogoutTime, 30000);
                    if (data == undefined || data == '') {
                        alert(SN.INFO.NoReturnMessage);//没有返回数据
                        return ;
                    }

                    var msgJson = AjaxParseJson(data);

                    if (msgJson.url != 'ERROR') {
                        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
                        var isFirefox = userAgent.indexOf("Firefox") > -1;

                        if(isFirefox)
                            window.frames["upload_iframe"].location = msgJson.url;
                        else
                            download(msgJson.url);
                    }

                    if(flag.value == 0 || flag.value == 1) {
                        if (flag.value == 0) {
                            var data = SN.FUNC.LoadDataFile(msgJson.url);
                            if (data != false) {
                                $("#certificate_req").show();
                                $("#certificate_req").html(data);
                            }
                        }
                        //msgJson.url = 'tlscert.pem';
                        //method 1
                        //window.frames["upload_iframe"].location = msgJson.url;
                        //method 2
                        //var alink = '<a href="' + msgJson.url + '" target="_self">' + msgJson.url + '</a>';
                        //$("#certificate_ssltls").append(alink);
                    } else {
                        if(msgJson.url == 'ERROR')
                        {
                            var info = SN.INFO.CertificateUploadFail;
                        }
                        else if(msgJson.url == 'FULL')
                        {
                            info = SN.INFO.ErrCMImportFullClient;
                        }
                        else if(msgJson.url == 'EXIST')
                        {
                            info = SN.INFO.ErrCMImportExist;
                        }
                        else if(msgJson.url == 'UNKNOWN')
                        {
                            info = SN.INFO.ErrCMUnknownSys;
                        }
                        else
                        {
                            info = SN.INFO.CertificateUploadOK;
                        }
                        alert(info);
                        RefreshCurrentPage();
                    }
                });
            }
        });
    }


    /*load ca cert*/
    $("#input_certificate_ca").change(
        function(){
            var idx = this.value.lastIndexOf(".");
            var type = (idx >= 0) ? this.value.substr(idx) : "";

            if (type != "" && type != ".der" && type != ".cer" && type != ".pem" && type != ".p7b") {
                $("#select_prompt_ca").css("color", "red");
                $("#button_certificate_ca").attr("disabled", true);
                return ;
            } else {
                var filesize = getFileSize(this);
                if(filesize < 50){
                    $("#select_prompt_ca").css("color", "black");
                    $("#button_certificate_ca").attr("disabled", false);
                } else {
                    $("#select_prompt_ca").css("color", "red");
                    $("#button_certificate_ca").attr("disabled", true);
                    return ;
                }

            }
    });
    $("[name=certificate_upload_ca]").submit(function(){
        $("[name=certificate_upload_ca]").attr('target', "upload_iframe");
        $("#upload_result").html(SN.INFO.CertificateUploading);
    });
    $("#button_certificate_ca").click(
    function(){
        if (!CheckIsLogined())
            return false;
    });
    /*load identity cert without private key*/
    $("#input_certificate_public").change(
        function(){
            var idx = this.value.lastIndexOf(".");
            var type = (idx >= 0) ? this.value.substr(idx) : "";

            if (type != "" && type != ".der" && type != ".cer"
                && type != ".pem") {
                $("#select_prompt_public").css("color", "red");
                $("#button_certificate_public").attr("disabled", true);
                return ;
            } else {
                var filesize = getFileSize(this);
                if(filesize < 50){
                    $("#select_prompt_public").css("color", "black");
                    $("#button_certificate_public").attr("disabled", false);
                } else {
                    $("#select_prompt_public").css("color", "red");
                    $("#button_certificate_public").attr("disabled", true);
                    return ;
                }

            }
    });
    $("[name=certificate_upload_public]").submit(function(){
        $("[name=certificate_upload_public]").attr('target', "upload_iframe");
        $("#upload_result").html(SN.INFO.CertificateUploading);
    });
    $("#button_certificate_public").click(
    function(){
        if (!CheckIsLogined())
            return false;
    });



}





//第1个：网页文件路径
//第2个：每个模块在DB中的开始结束符, PageID
//第3个：是否为WIFI模块网页(1:是, 0：否)
//第4个：是否需要取参数属性值(1:是, 0：否)
SN.DATA.CurrentPageID = "INFO";
SN.DATA.allUrlParms = [
    ["../test.html", 'TEST', 0, 0],

    ["../src/sta.html", "STA", 1, 1],
    ["../src/uap.html", "UAP", 1, 1],
    ["../src/wps.html", "WPS", 1, 1],
    ["../src/staip.html", "WIFIIP", 1, 1],
    ["../src/wfd.html", "WFD", 1, 1],

    ["../src/info.html", "INFO", 0, 1],
    ["../src/info.html", "ERROR_LOG_INFO", 0, 0],
    ["../src/info.html", "WHITELIST", 0, 0],
    ["../src/info.html", "IPFilterLIST", 0, 0],
    ["../src/ipv4.html", "IPV4", 0, 1],
    ["../src/rawlpd.html", "RAWLPD", 0, 1],
    ["../src/snmp.html", "SNMP", 0, 1],
    ["../src/wsd.html", "WSD", 0, 1],
    ["../src/SMBNTLMV2.html", "SMBNTLMV2", 0, 1],//##jimmy##
    ["../src/SNTP.html", "SNTP", 0, 1],//##jimmy##
    ["../src/smtp.html", "SMTP", 0, 1],
    ["../src/mdns.html", "MDNS", 0, 1],
    ["../src/gcp.html", "GCP", 0, 1],
    ["../src/ssltls.html", "SSLTLS", 0, 1],
    ["../src/8021x.html", "8021X", 0, 1],
    ["../src/ldap.html", "LDAP", 0, 1],
    ["../src/windows.html", "WINDOWS", 0, 1],
    ["../src/system.html", "SYSTEM", 0, 1],
    ["../src/pcl.html", "PCL", 0, 1],
    ["../src/ps.html", "PS", 0, 1],
    ["../src/print.html", "PRINT", 0, 1],
    ["../src/email.html", "EMAIL", 0, 1],
    ["../src/manager.html", "MANAGER", 0, 1],
    ["../src/login.html", "LOGIN", 0, 1],
    ["../src/ipv6.html", "IPV6", 0, 1],
    ["../src/addrbook.html", "ADDRBOOK", 0, 0],
    ["../src/screen.html", "SCREEN", 0, 0],
    ["../src/upgrade.html", "UPGRADE", 0, 0],
    ["../src/smb.html", "SMB", 0, 1],
    ["../src/ftp.html", "FTP", 0, 1],
    ["../src/smbinfo.html", "SMBINFO", 0, 0],
    ["../src/ftpinfo.html", "FTPINFO", 0, 0],
    ["../src/mailinfo.html", "MAILINFO", 0, 0],
    ["../src/mailgroup.html", "MAILGROUP", 0, 0],
    ["../src/phoneinfo.html", "PHONEINFO", 0, 0],
    ["../src/phonegroup.html", "PHONEGROUP", 0, 0],
    ["../src/scan.html", "SCAN", 0, 1],
    ["../src/printset.html", "PRINTSET", 0, 1],
    ["../src/scaninfo.html", "SCANINFO", 0, 1],
    ["../src/copyinfo.html", "COPYINFO", 0, 1],
    ["../src/printinfo.html", "PRINTINFO", 0, 1],
    ["../src/device.html", "DEVICE", 0, 1],
    ["../src/weblogin.html", "WEBLOGIN", 0, 1],
    ["../src/webpas.html", "WEBPSWD", 0, 1],
    ["../src/panellogin.html", "PANELLOGIN", 0, 1],
    ["../src/control.html", "ACCESSCONTROL", 0, 1],
    ["../src/ftpsmbemail.html", "FTPSMBEMAIL", 0, 1],
    ["../src/https.html", "HTTPS", 0, 1],
    ["../src/consumables.html", "CONSUMABLES", 0, 1],
    ["../src/wifi.html", "WIFI", 1, 1],
    ["../src/usbdrive.html", "USBDRIVE", 0, 1],
    ["../src/usb.html", "USB", 0, 1],
    ["../src/memoryreset.html", "MEMORYRESET", 0, 1],
    ["../src/netcontact.html", "NETCONTACT", 0, 1],
    ["../src/CertManagement.html", "CERTMANAGEMENT", 0, 0],/*证书管理页*/
    ["../src/reboot.html", "REBOOT", 0, 0],
    ["../src/scanquickset.html", "SCANQUICKSET", 0, 0],
    ["../src/trayset.html", "TRAYSET", 0, 1],
    ["../src/netport.html", "NETPORTMAN", 0, 1],
    ["../src/webtimeout.html", "WEBTIMEOUT", 0, 1],
    ["../src/ipsec.html", "IPSEC", 0, 0],
    ["../src/scantoman.html", "SCANTOMAN", 0, 1],
];
//获取模块参数
function getUrlByID(id) {
    for (var i=0; i< SN.DATA.allUrlParms.length; i++) {
        if (id != undefined && id == SN.DATA.allUrlParms[i][1]) {
            return SN.DATA.allUrlParms[i][0];
        }
    }
    return null;
}
//

//检查是否属于wifi模块url
function checkWifiSetting(id) {
    for (var i=0; i< SN.DATA.allUrlParms.length; i++) {
        if (id != undefined && id == SN.DATA.allUrlParms[i][1]) {
            return (SN.DATA.allUrlParms[i][2] == 1);
        }
    }
    return false;
}
function checkNeedLoadOMByID(id) {
    for (var i=0; i< SN.DATA.allUrlParms.length; i++) {
        if (id != undefined && id == SN.DATA.allUrlParms[i][1]) {
            return (SN.DATA.allUrlParms[i][3] == 1);
        }
    }
    return null;
}
//登陆页面初始化
function InitLoginHtml() {
    var div = $("#form_main")[0];
    if (div) {
        var contentHtml = "";
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omAdminUser);
        contentHtml += SN.FUNC.InsertOtherOmDiv(SN.DATA.omAdminPass);

        div.innerHTML = contentHtml;

        //input长度限制
        $("[name=omAdminUser]").attr("maxLength", "63");
        $("[name=omAdminPass]").attr("maxLength", "25");

        //获得焦点
        $("[name=omAdminUser]").focus();
    }
}
function InitInformation()
{
    var nodes = [];
    var productInfo = new CreatePageNode(SN.INFO.PageInformation, "INFO", undefined, SN.BOTTON.Refresh, InitInfoHtml, SN.INFO.TipsInfoPage);
    nodes.push(productInfo);

    //if(CheckProductID(9))4020全系列支持扫描信息页等，不区分型号
    //{
    var device = new CreatePageNode(SN.INFO.PageDeviceInfo, "DEVICE", undefined, SN.BOTTON.Refresh, InitDeviceInfoHtml, SN.INFO.TipsDeviceInfo);
    nodes.push(device);

    if (CheckProductID(8))
    {
        var scaninfo = new CreatePageNode(SN.INFO.PageScanInfo, "SCANINFO", undefined, SN.BOTTON.Refresh, InitScanInfoHtml, SN.INFO.TipsScanInfo);
        var copyinfo = new CreatePageNode(SN.INFO.PageCopyInfo, "COPYINFO", undefined, SN.BOTTON.Refresh, InitCopyInfoHtml, SN.INFO.TipsCopyInfo);
        nodes.push(scaninfo);
        nodes.push(copyinfo);
    }
    var printinfo = new CreatePageNode(SN.INFO.PagePrintInfo, "PRINTINFO", undefined, SN.BOTTON.Refresh, InitPrintInfoHtml, SN.INFO.TipsPrintInfo);
    nodes.push(printinfo);
    //}
    nodes.push(new CreatePageNode(SN.INFO.PageErrorLogInfo, "ERROR_LOG_INFO", undefined, (SN.BOTTON.Refresh + SN.FUNC.CreateButton('error_log_export', SN.INFO.ButtonExport)),
        InitErrorLogInfoHtml, SN.INFO.TipsErrorLog));

    CreatePageNodeTree(nodes, SN.INFO.PageInformation, "INFO");
}
function CheckDisabledHtml(id) //屏蔽掉网络模块相关页面的编辑设置功能
{
    if (   id == "WSD" || id == "SMTP" || id == "MDNS"
        || id == "SSLTLS" || checkWifiSetting(id) == 1) {
        $("input").attr("disabled", true);
        $("select").attr("disabled", true);
    }
}
function CheckEnableRemoteCtrlCountry() {
    switch (SN.DATA.omPrinterCountryCode.value) {
        case '74':
            return true;
        default:
            return false;
    }
}
function InitSetting() {
    var nodes = [];
    var protocol = null;
    var addrbook = null;
    var network = new CreatePageNode(SN.INFO.PageNetworkSet, "NETSET", undefined, undefined, undefined);
    var system = new CreatePageNode(SN.INFO.PageSystemSet, "SYSSET", undefined, undefined, undefined);
    var secure = new CreatePageNode(SN.INFO.PageSecureSet,"SECURE",undefined,undefined,undefined);
    // var assistant = new CreatePageNode(SN.INFO.ButtonAssistant, "ASSISTANT", undefined, undefined, undefined);
    if(CheckIsNeedLogin() == 1)
    {
        if(!CheckIsLogined()) //用户未登录时，不可访问设置页
           return;
    }

    flag_login = 0;              //除登录页面以外，其他页面都要和原型机保持一致

    if (IsHasAirprint()) {
        SN.INFO.PageMdns = 'AirPrint';
    }

    if (1 == SN.DATA.wifiEnumerated.value) { //协议设置
        protocol = new CreatePageNode(SN.INFO.PageProtocolSet, "PROTOCOL", network, undefined, undefined);
        network.appendChild(protocol);
    } else {
        protocol = network;
    }
    
    protocol.appendChild(new CreatePageNode(SN.INFO.PageIpv4, "IPV4", protocol, SN.BOTTON.ApplyCancel, InitIpv4Html, SN.INFO.TipsIPv4));
    protocol.appendChild(new CreatePageNode(SN.INFO.PageIpv6, "IPV6", protocol, SN.BOTTON.ApplyCancel, InitIpv6Html, SN.INFO.TipsIPv6));
    protocol.appendChild(new CreatePageNode(SN.INFO.PageRawlpd, "RAWLPD", protocol, SN.BOTTON.ApplyCancel, InitRawlpdHtml, SN.INFO.TipsRaw));
    protocol.appendChild(new CreatePageNode(SN.INFO.PageSnmp, "SNMP", protocol, SN.BOTTON.ApplyCancel, InitSnmpHtml, SN.INFO.TipsSNMP));
    protocol.appendChild(new CreatePageNode(SN.INFO.PageWsd, "WSD", protocol, SN.BOTTON.ApplyCancel, InitWsdHtml, SN.INFO.TipsWSD));
    if (CheckProductID(3) || CheckProductID(4) || CheckProductID(7)) {
        protocol.appendChild(new CreatePageNode(SN.INFO.PageSMB, "SMB", protocol, SN.BOTTON.ApplyCancel, InitSMBHtml, SN.INFO.TipsSMBNTLMV1));//##jimmy##
    }
    protocol.appendChild(new CreatePageNode(SN.INFO.PageSNTP, "SNTP", protocol, SN.BOTTON.ApplyCancel, InitSNTPHtml, SN.INFO.TipsSNTP));//##jimmy##
    protocol.appendChild(new CreatePageNode(SN.INFO.PageSmtp, "SMTP", protocol, SN.BOTTON.ApplyCancelSmtp, InitSmtpHtml, SN.INFO.TipsSMTP));
    protocol.appendChild(new CreatePageNode(SN.INFO.PageMdns, "MDNS", protocol, SN.BOTTON.ApplyCancel, InitMdnsHtml, SN.INFO.TipsMdns));
    if(1 == SN.DATA.omGCPEnumerated.value) {
        protocol.appendChild(new CreatePageNode(SN.INFO.PageGcp, "GCP", protocol, SN.BOTTON.ApplyCancel, InitGcpHtml, SN.INFO.TipsGcp));
    }

    protocol.appendChild(new CreatePageNode(SN.INFO.Page8021X, "8021X", protocol, SN.BOTTON.ApplyCancel, Init8021XHtml, SN.INFO.Tips8021X));
    if (CheckProductID(10)) {
    protocol.appendChild(new CreatePageNode(SN.INFO.PageLdap, "LDAP", protocol, SN.BOTTON.ApplyCancelLdap, InitLdapHtml, SN.INFO.TipsLdap));
    protocol.appendChild(new CreatePageNode(SN.INFO.PageWindowsLogin, "WINDOWS", protocol, SN.BOTTON.ApplyCancelWinLogin, InitWindowsHtml, SN.INFO.TipsWindowsLogin));
	}
    
    //新增IPSec界面
    if(1 === internet_protocol_security_build_different)
    {
       protocol.appendChild(new CreatePageNode(SN.INFO.PageIpsec, "IPSEC", protocol, SN.BOTTON.ApplyCancel, InitIpsecHtml, SN.INFO.TipsIpsec));
    }
    //无线设置
    if (1 == SN.DATA.wifiEnumerated.value) {
        var wireless = new CreatePageNode(SN.INFO.PageWifiSet, "WIFISET", network, undefined, undefined);

        network.appendChild(wireless);
        wireless.appendChild(new CreatePageNode(SN.INFO.PageWifiPort, "WIFI", wireless, SN.BOTTON.ApplyCancel, InitWifiHtml, SN.INFO.TipsWifiPort));
        wireless.appendChild(new CreatePageNode(SN.INFO.PageWifiSta, "STA", wireless, SN.BOTTON.ApplyCancel, InitStaHtml, SN.INFO.TipsSta));
        wireless.appendChild(new CreatePageNode(SN.INFO.PageWifiStaip, "WIFIIP", wireless, SN.BOTTON.ApplyCancel, InitStaipHtml, SN.INFO.TipsStaip));
        //wireless.appendChild(new CreatePageNode(SN.INFO.PageWifiUap, "UAP", wireless, SN.BOTTON.ApplyCancel, InitUapHtml, SN.INFO.TipsUap));
        wireless.appendChild(new CreatePageNode(SN.INFO.PageWifiWps, "WPS", wireless, SN.BOTTON.ApplyCancel, InitWpsHtml, SN.INFO.TipsWPS));
        wireless.appendChild(new CreatePageNode(SN.INFO.PageWifiWfd, "WFD", wireless, SN.BOTTON.ApplyCancel, InitWfdHtml, SN.INFO.TipsWFD));
    }

    //机器设置
    system.appendChild(new CreatePageNode(SN.INFO.PageSystem, "SYSTEM", system, SN.BOTTON.ApplyCancel, InitSystemHtml, SN.INFO.TipsSystem));
    system.appendChild(new CreatePageNode(SN.INFO.PageConsumablesSet, "CONSUMABLES", system, SN.BOTTON.ApplyCancel, InitConsumablesHtml, SN.INFO.TipsConsumablesSet));
    system.appendChild(new CreatePageNode(SN.INFO.PagePrintSet, "PRINTSET", system, SN.BOTTON.ApplyCancel, InitPrintSetHtml, SN.INFO.TipsPrintSet));
    system.appendChild(new CreatePageNode(SN.INFO.PageTraySetup, "TRAYSET", system, SN.BOTTON.ApplyCancel, InitTraySetupHtml,  SN.INFO.TipsTraySetup));
    if (CheckProductID(6)) {
        system.appendChild(new CreatePageNode(SN.INFO.PagePcl, "PCL", system, SN.BOTTON.ApplyCancelPCL, InitPclHtml, SN.INFO.TipsPCL));
        system.appendChild(new CreatePageNode(SN.INFO.PagePs, "PS", system, SN.BOTTON.ApplyCancel, InitPsHtml, SN.INFO.TipsPS));
        system.appendChild(new CreatePageNode(SN.INFO.PagePrint, "PRINT", system, SN.BOTTON.ApplyCancelPrint, InitPrintHtml, SN.INFO.TipsPrint));
    }
    if (CheckProductID(10)) {
        system.appendChild(new CreatePageNode(SN.INFO.PageNetContact, "NETCONTACT", system, SN.BOTTON.ApplyCancelNetContact, InitNetContactHtml, SN.INFO.TipsNetContact));
    }
    if (CheckProductID(3) || CheckProductID(4) || CheckProductID(7)) {
        system.appendChild(new CreatePageNode(SN.INFO.PageSmbinfo, "SMBINFO", system, SN.BOTTON.Refresh, InitSmbInfoHtml, SN.INFO.TipsSmbinfo));
        system.appendChild(new CreatePageNode(SN.INFO.PageFtpinfo, "FTPINFO", system, SN.BOTTON.Refresh, InitFtpInfoHtml, SN.INFO.TipsFtpinfo));

        addrbook = new CreatePageNode(SN.INFO.PageAddrBook, "ADDRBOOKS", system, undefined, undefined);
        system.appendChild(addrbook);
        //addrbook.appendChild(new CreatePageNode(SN.INFO.EmailAddressBook, "ADDRBOOK", addrbook, SN.BOTTON.Refresh, InitAddrBookHtml, SN.INFO.TipsAddrBook));
        addrbook.appendChild(new CreatePageNode(SN.INFO.PageMailinfo, "MAILINFO", addrbook, SN.BOTTON.Refresh, InitMailInfoHtml, SN.INFO.TipsMailinfo));
        addrbook.appendChild(new CreatePageNode(SN.INFO.PageMailgroup, "MAILGROUP", addrbook, SN.BOTTON.Refresh, InitMailgroupHtml, SN.INFO.TipsMailgroup));
        if (CheckProductID(4) || CheckProductID(7)){
            addrbook.appendChild(new CreatePageNode(SN.INFO.PagePhoneinfo, "PHONEINFO", addrbook, SN.BOTTON.Refresh, InitPhoneInfoHtml, SN.INFO.TipsPhoneinfo));
            addrbook.appendChild(new CreatePageNode(SN.INFO.PagePhonegroup, "PHONEGROUP", addrbook, SN.BOTTON.Refresh, InitPhonegroupHtml, SN.INFO.TipsPhonegroup));
        }
    } else {
        system.appendChild(new CreatePageNode(SN.INFO.PageAddrBook, "ADDRBOOK", system, SN.BOTTON.Refresh, InitAddrBookHtml, SN.INFO.TipsAddrBook));
    }
    system.appendChild(new CreatePageNode(SN.INFO.PageEmail, "EMAIL", system, SN.BOTTON.ApplyCancel, InitEmailHtml, SN.INFO.TipsEmail));
    system.appendChild(new CreatePageNode(SN.INFO.PageReboot, "REBOOT", system, undefined, InitRebootHtml, SN.INFO.TipsReboot));
    if (CheckProductID(10) && CheckEnableRemoteCtrlCountry()) {
        system.appendChild(new CreatePageNode(SN.INFO.PageRemoteControl, "SCREEN", system, SN.BOTTON.RefreshDisconnect, undefined, SN.INFO.TipsRemoteControl));
    }
    system.appendChild(new CreatePageNode(SN.INFO.PageUpgrade, "UPGRADE", system, undefined, InitUpgradeHtml, SN.INFO.TipsUpgrade));
    //安全设置
    if (CheckProductID(10)) {
        secure.appendChild(new CreatePageNode(SN.INFO.PageAccesscontrol, "ACCESSCONTROL", secure, SN.BOTTON.ApplyCancel, InitAccessControlHtml, SN.INFO.TipsAccessControl));
    }
    if(CheckProductID(3) || CheckProductID(4)) {
    secure.appendChild(new CreatePageNode(SN.INFO.PageHardwarePort, "USB", secure, SN.BOTTON.ApplyCancel, InitUsbHtml, SN.INFO.TipsHardwarePort));
    } else {
        secure.appendChild(new CreatePageNode(SN.INFO.PageHardwarePort, "USB", secure, SN.BOTTON.ApplyCancel, InitUsbHtml, SN.INFO.TipsHardwarePort_sfp));
    }
    if (CheckProductID(10)) {
        secure.appendChild(new CreatePageNode(SN.INFO.PageFtpSmbEmailManager, "FTPSMBEMAIL", secure, SN.BOTTON.ApplyCancel, InitFtpSmbEmailHtml, SN.INFO.TipsFtpSmbEmailManager));
    }
    secure.appendChild(new CreatePageNode(SN.INFO.HttpsManager, "HTTPS", secure, SN.BOTTON.ApplyCancel, InitHttpsManagerHtml, SN.INFO.TipsHttps));
    secure.appendChild(new CreatePageNode(SN.INFO.PageNetPort, "NETPORTMAN", secure, SN.BOTTON.Refresh, InitNetPortManHtml, SN.INFO.TipsNetPort));
    secure.appendChild(new CreatePageNode(SN.INFO.PageIpWhiteList, "WHITELIST", secure, SN.BOTTON.Refresh, InitWhiteListHtml, SN.INFO.TipsIPWhiteList));
    secure.appendChild(new CreatePageNode(SN.INFO.PageMemoryReset, "MEMORYRESET", secure, SN.BOTTON.ApplyCancel, InitMemoryResetHtml, SN.INFO.TipsMemoryReset));
    secure.appendChild(new CreatePageNode(SN.INFO.PageCertManagementHead, "CERTMANAGEMENT", secure, undefined, InitCertManagementHtml, SN.INFO.TipsCertManagement));
    secure.appendChild(new CreatePageNode(SN.INFO.PageIPFilterList, "IPFilterLIST", secure, SN.BOTTON.Refresh, InitIPFilterListHtml, SN.INFO.TipsIPFilterList));

    nodes.push(network);
    nodes.push(system);
    if (CheckProductID(8))
    {
        var scanset = new CreatePageNode(SN.INFO.PageScanSet,"SCANSET",undefined,undefined,undefined);
        scanset.appendChild(new CreatePageNode(SN.INFO.PageScanDefaultSet, "SCAN", scanset, SN.BOTTON.ApplyCancel, InitScanSetupHtml, SN.INFO.TipsScanSetup));
        scanset.appendChild(new CreatePageNode(SN.INFO.PageScanQuickSet, "SCANQUICKSET", scanset, SN.BOTTON.Refresh, InitScanQuickSetHtml, SN.INFO.TipsScanQuickSet));
        scanset.appendChild(new CreatePageNode(SN.INFO.ScanToManager, "SCANTOMAN", scanset, SN.BOTTON.ApplyCancel, InitScanToManagerHtml, SN.INFO.TipsScanToManager));
        nodes.push(scanset);
    }
    nodes.push(secure);
    CreatePageNodeTree(nodes, SN.INFO.PageSetting, SN.DATA.JumpToAirprint ? "MDNS" : "IPV4");

    if (1 == SN.DATA.wifiEnumerated.value) {
        if (SN.DATA.wifiEnabled.value == 1) {
            if (SN.DATA.wifiStaEnabled.value != 1) {
                $("#id_WIFIIP").hide();//隐藏无线IP配置页面
            } else {
                $("#id_WIFIIP").show();//显示无线IP配置页面
            }
            $("#id_STA").show();//显示无线STA设置页面
            $("#id_WPS").show();//显示无线WPS设置页面
            $("#id_WFD").show();//显示无线WFD设置页面
        } else {
            $("#id_WIFIIP").hide();//隐藏无线IP配置页面
            $("#id_STA").hide();//隐藏无线STA设置页面
            $("#id_WPS").hide();//隐藏无线WPS设置页面
            $("#id_WFD").hide();//隐藏无线WFD设置页面
        }
    }
    if(1 == SN.DATA.omScanToSmbEnabled.value){
        $("#id_SMBINFO").show();
    }else{
        $("#id_SMBINFO").hide();
    }
    if(1 == SN.DATA.omScanToFtpEnabled.value){
        $("#id_FTPINFO").show();
    }else{
        $("#id_FTPINFO").hide();
    }
    if(1 == SN.DATA.omScanShortCutEnabled.value){
        $("#id_SCANQUICKSET").show();
    }else{
        $("#id_SCANQUICKSET").hide();
    }
}
function InitManager() {
    flag_login = 0;              //除登录页面以外，其他页面都要和原型机保持一致
    var nodes = [];
    var webpage = new CreatePageNode(SN.INFO.PageWebManager, "WEBMANAGER", undefined, undefined, undefined);
    var panel = new CreatePageNode(SN.INFO.PageTouchPanelManager, "PANELMANAGER", undefined, undefined, undefined);

    webpage.appendChild(new CreatePageNode(SN.INFO.PageWebLogin, "WEBLOGIN", webpage, SN.BOTTON.ApplyCancel, InitWebLoginHtml, SN.INFO.TipsWebLogin));
    webpage.appendChild(new CreatePageNode(SN.INFO.PageWebChangePassword, "WEBPSWD", webpage, SN.BOTTON.Manager, InitChangeWebPasHtml, SN.INFO.TipsChangeWebPas));
    webpage.appendChild(new CreatePageNode(SN.INFO.PageWebLoginTimeout, "WEBTIMEOUT", webpage, SN.BOTTON.ApplyCancel, InitWebLoginTimeoutHtml, SN.INFO.TipsWebLoginTimeout));
	nodes.push(webpage);

	if (CheckProductID(10)) {
    panel.appendChild(new CreatePageNode(SN.INFO.PagePanelLogin, "PANELLOGIN", panel, SN.BOTTON.ManagerPanelPassWord, InitPanelLoginHtml, SN.INFO.TipsPanelLogin));
	nodes.push(panel);
    }
    CreatePageNodeTree(nodes, SN.INFO.PageManager, "WEBLOGIN");
}
function InitLogin() {
    var nodes = [
        new CreatePageNode(SN.INFO.PageLogin, "LOGIN", undefined, SN.BOTTON.Login, InitLoginHtml, SN.INFO.TipsLoginPage)
    ];
    flag_login = 1;   //登录页面点击登录不提示提交成功
    CreatePageNodeTree(nodes, SN.INFO.PageLogin, "LOGIN");
}
//跳转页面
function GotoUrl(url, open) {
    if (open) {
        window.open(url);
    } else {
        document.location.href = url;
    }
}
function GotoPantum() {
    GotoUrl("http://www.pantum.com", true);
}

//图片缓冲
//flag: 0(postdata操作)，1(检查升级固件是否下载完成)
SN.DATA.HasWaitting = null;
function ShowOrHideWaitting(isShow, flag) {
    if (SN.DATA.HasWaitting != null) {
        clearTimeout(SN.DATA.HasWaitting);
        SN.DATA.HasWaitting = null;
    }

    if (true == isShow) {
        var time = 10000;

        $('.watting').show();
        if (flag && 0 == flag) {
            SN.DATA.HasWaitting = setTimeout("ShowOrHideWaitting(false, 0);", time);
        } else if (flag && 1 == flag) { //在线升级处理
            SN.DATA.HasWaitting = setTimeout("ShowOrHideWaitting(true, 1);", time);
            CheckCandoUpgrade();
        } else {
            SN.DATA.HasWaitting = setTimeout("ShowOrHideWaitting(false);", time);
        }
    } else {
        $('.watting').hide();
        if (flag && 0 == flag) {
            //alert(SN.INFO.NoReturnMessage);//没有返回数据
            if (SN.DATA.CurrentAjax != null) {
                SN.DATA.CurrentAjax.abort();
                //console.log("abort SN.DATA.CurrentAjax!!!\n");
            }
            RefreshCurrentPage();
        }
    }
}
//创建一个子页面节点
SN.DATA.NodeLastClick = 0;
function CreatePageNode(nodeName, id, parnt, buttons, callback, tipstr) {
    this.Name = nodeName;
    this.ID = id;
    this.Parent = (parnt != undefined) ? parnt : null;
    this.Children = [];
    this.Buttons = (buttons !=  undefined) ? buttons : null;
    this.CallbackFunc = callback;
    this.Tips = tipstr;
    this.appendChild = function (node) {
        if (!node || !node.Name) {
            return false;
        }
        this.Children.push(node);
        return true;
    };
    this.GetParentsCount = function () {
        if (this.Parent) {
            return this.Parent.GetParentsCount() + 1;
        }
        return 0;
    };
    this.CreateDom = function (bodyName) {
        var retHtml = '';
        var div = document.createElement("div");
        var pCount = this.GetParentsCount();
        var a = document.createElement("a");
        var node = this;

        a.id = this.ID;
        a.innerHTML = this.Name;
        a.url = getUrlByID(this.ID);
        retHtml = document.createElement("li");
        if (this.Children.length > 0) {
            var fixpx = pCount * 10 + 10;//24
            var padding = 'padding-';
            var margin = 'margin-';
            var bgdpos = ChangeCss('bgdpos-left');
            var ul = document.createElement("ul");

            $(div).addClass('snweb-branch-div arrow-down ' + bgdpos);
            padding += SN.DATA.RightReadMode ? 'right' : 'left';
            margin += SN.DATA.RightReadMode ? 'right' : 'left';
            fixpx = '' + 10 + 'px';
            $(div).css(padding, fixpx);
            fixpx = '' + pCount * 10 + 'px';//24
            $(div).css(margin, fixpx);

            a.className = "tree-a-normal";
            div.appendChild(a);

            for (var i = 0; i < this.Children.length; i++) {
                ul.appendChild(this.Children[i].CreateDom(bodyName));
            }

            $(div).click(function () {
                var branch = this;
                $(ul).slideToggle("normal", function () {
                    if (this.style.display == "none") {
                        $(branch).removeClass('arrow-down');
                        $(branch).addClass(ChangeCss('arrow-right'));
                    }
                    else {
                        $(branch).removeClass(ChangeCss('arrow-right'));
                        $(branch).addClass('arrow-down');
                    }
                });
            });


            retHtml.appendChild(div);
            retHtml.appendChild(ul);
        } else {
            var fixpx = pCount * 10;//24
            var padding = 'padding-';

            $(div).addClass('snweb-leaf-div ' + ChangeCss('margin-left-4'));
            padding += SN.DATA.RightReadMode ? 'right' : 'left';
            fixpx = '' + fixpx + 'px';
            $(div).css(padding, fixpx);

            a.className = "tree-a-normal";
            div.appendChild(a);
            retHtml.appendChild(div);

            var html_id = "id_" + this.ID
            retHtml.id = html_id;

            this.Dom = retHtml;
        }

        $(a).click(
        function () {
            if (null == a.url) {
                return ;
            }
            if ("SCREEN" == a.id && !CheckIsLogined()) {
                return ;
            } else if ("SCREEN" != a.id) {
                clearTimeout(SCREEN_REFRESH_TIMEOUT_HANDLER);/*避免切其它页面后仍在后台刷新*/
            }

            var d = new Date();
            var tick = d.getTime();
            var wpstime = 120;
            var select = $('.tree-a-select');
            if (select.length > 0 && select[0].url == a.url) {
                if(tick < SN.DATA.NodeLastClick + 300) {
                    return ;
                }
            } else if (tick < SN.DATA.NodeLastClick) {
                return;
            }

            SN.DATA.NodeLastClick = tick;
            ShowOrHideWaitting(true);//显示缓冲图片

            $("#id_content_title").html(node.Name);
            $(".tree-a-select.tree-a-normal").attr("class", "tree-a-normal");
            $(a).addClass('tree-a-select');
            if (node.Tips) {
                ShowTips(node.Tips, a.id);
            }

            if (SN.DATA.wifiWpsSleepTimeEnd >= 0 && "WPS" == a.id) {
                wpstime = SN.DATA.wifiWpsSleepTime.value;
            }

            SN.DATA.RefreshAplistTime = -1; //清除Ap列表刷新

            SN.FUNC.Loadfile(a.url,
            function (data) {
                $("#id_content_src").html(data);

                if (data == '')
                    return $(a).click();

                if (data && data.length > 0) {
                    if (checkNeedLoadOMByID(a.id)) {
                        if ( checkWifiSetting(a.id) ) {
                            SN.FUNC.LoadWifiOmDB(a.id);
                        } else {
                            SN.FUNC.LoadOmDB(a.id);
                        }
                    }

                    if (node.Buttons) {
                        $("#id_content_button").slideDown(0);
                        $("#id_content_button").html(node.Buttons);
                    } else {
                        $("#id_content_button").html("");
                    }

                    if (node.CallbackFunc) {
                        node.CallbackFunc();
                    }

                    ButtonReady();
                    OnReady();
                    SN.DATA.CurrentPageID = a.id;

                    //CheckDisabledHtml(a.id);//屏蔽掉网络模块相关页面的编辑设置功能

                    if ("WPS" == a.id) {
                        SN.DATA.wifiWpsSleepTime.value = wpstime;
                        $("#wifiWpsSleepTime_v").val(wpstime);
                        $("[name=wifiWpsSecMode]").attr('disabled', SN.DATA.wifiWpsSleepTimeEnd >= 0);
                    }
                }
                ShowOrHideWaitting(false);//$('.watting').hide();//隐藏缓冲图片
            });
        });

        return retHtml;
    };
}
//创建一个子页面节点树，并跳转到第一个页面
function CreatePageNodeTree(nodes, title, clickid) {
    if (!nodes)
        return;

    //初始化左侧导航栏
    var obj = $("#id_content_left");
    obj.html('');
    for (var i = 0; i < nodes.length; i++) {
        obj[0].appendChild(nodes[i].CreateDom("settingwin"));
    }

    $("#id_tree_title").html(title);

    $(".tree-a-normal").hover(
    function () {
        if (this.className != "tree-a-select tree-a-normal")
            $(this).addClass('tree-a-hover');
    },
    function () {
        if (this.className != "tree-a-select tree-a-normal")
            $(this).removeClass('tree-a-hover');
    });

    //激活默认url
    $("#" + clickid).click();
}
//显示当前页面提示信息
function ShowTips(s, id) {
    if (typeof s == "string" && s.length > 0) {
        $("#id_content_tips").html('<div id="tips_' + id + '" style="word-wrap: break-word">' + s + ' </div>'); //添加word-wrap: break-word，强制换行
    }
}
//初始化所有botton
function InitAllButton() {
    SN.BOTTON.Refresh = SN.FUNC.CreateButton(SN.TYPE.Refresh, SN.INFO.ButtonRefresh);
    SN.BOTTON.ApplyCancel = SN.FUNC.CreateButton(SN.TYPE.Apply, SN.INFO.ButtonApply);
    SN.BOTTON.ApplyCancel += SN.FUNC.CreateButton(SN.TYPE.Cancel, SN.INFO.ButtonCancel);
    SN.BOTTON.ApplyCancelPCL = SN.BOTTON.ApplyCancel + SN.FUNC.CreateButton(SN.TYPE.ResetPCL, SN.INFO.ButtonRecover);
    SN.BOTTON.ApplyCancelPrint = SN.BOTTON.ApplyCancel + SN.FUNC.CreateButton(SN.TYPE.ResetPrint, SN.INFO.ButtonRecover);
    SN.BOTTON.ApplyCancelSmtp = SN.BOTTON.ApplyCancel + SN.FUNC.CreateButton(SN.TYPE.EmailTest, SN.INFO.ButtonEmailTest);
    SN.BOTTON.ApplyCancelSmtp += SN.FUNC.CreateButton(SN.TYPE.ResetSmtp, SN.INFO.ButtonRecover);
    SN.BOTTON.ApplyCancelLdap = SN.BOTTON.ApplyCancel + SN.FUNC.CreateButton(SN.TYPE.LdapTest, SN.INFO.ButtonLoginTest);
    SN.BOTTON.ApplyCancelLdap += SN.FUNC.CreateButton(SN.TYPE.ResetLdap, SN.INFO.ButtonRecover);
    SN.BOTTON.ApplyCancelWinLogin = SN.BOTTON.ApplyCancel + SN.FUNC.CreateButton(SN.TYPE.WinLoginTest, SN.INFO.ButtonLoginTest);
    SN.BOTTON.ApplyCancelWinLogin += SN.FUNC.CreateButton(SN.TYPE.ResetWinLogin, SN.INFO.ButtonRecover);
    SN.BOTTON.Login = SN.FUNC.CreateButton(SN.TYPE.Login, SN.INFO.ButtonLogin);
    SN.BOTTON.Login += SN.FUNC.CreateButton(SN.TYPE.Cancel, SN.INFO.ButtonCancel);
    SN.BOTTON.Manager = SN.FUNC.CreateButton(SN.TYPE.ChangePassWord, SN.INFO.ButtonChange);
    SN.BOTTON.Manager += SN.FUNC.CreateButton(SN.TYPE.Cancel, SN.INFO.ButtonCancel);
    SN.BOTTON.Manager += SN.FUNC.CreateButton(SN.TYPE.ResetAll, SN.INFO.ButtonReset);
    SN.BOTTON.ManagerPanelPassWord = SN.FUNC.CreateButton(SN.TYPE.Apply, SN.INFO.ButtonApply);
    SN.BOTTON.ManagerPanelPassWord += SN.FUNC.CreateButton(SN.TYPE.PanelPassWord, SN.INFO.ButtonChange);
    SN.BOTTON.ManagerPanelPassWord += SN.FUNC.CreateButton(SN.TYPE.Cancel, SN.INFO.ButtonCancel);
    SN.BOTTON.ApplyCancelNetContact = SN.BOTTON.ApplyCancel + SN.FUNC.CreateButton(SN.TYPE.NetContactTest, SN.INFO.ButtonTest);
    SN.BOTTON.ApplyCancelNetContact += SN.FUNC.CreateButton(SN.TYPE.ResetNetContact, SN.INFO.ButtonRecover);
    SN.BOTTON.RefreshDisconnect = SN.BOTTON.Refresh + SN.FUNC.CreateButton(SN.TYPE.Disconnect, SN.INFO.ButtonDisconnect);
}
//首页初始化
SN.DATA.ToolbarLogin = null;
SN.DATA.ToolbarStart = null;
SN.FUNC.InitIndex = function(jump) {
    var toolbar = document.getElementById('id_top_toolbar');
    var mouseup = function() {
        if (!this.className.match('option-select')) {
            $(".option-select").removeClass('option-select');
            $(this).removeClass('option-fouced');
            $(this).addClass('option-select');
        }

        if (this.frameInitFunction) {
            this.frameInitFunction();
        }
    };

    var mouseover = function() {
        if (!this.className.match('option-select')) {
            $(this).addClass('option-fouced');
        }
    };
    var mouseout = function() {
        if (!this.className.match('option-select')) {
            $(this).removeClass('option-fouced');;
        }
    };
    var managerClick = function() {
        if (!this.className.match('option-select')) {
            $(".option-select").removeClass('option-select');
            $(this).removeClass('option-fouced');
            $(this).addClass('option-select');
        }

        if (!CheckIsLogined()) {
            return;
        }

        if (this.frameInitFunction) {
            this.frameInitFunction();
        }
    };
    var loginClick = function() {
        if (!IsAdmin()) {
            if (!this.className.match('option-select')) {
                $(".option-select").removeClass('option-select');
                $(this).removeClass('option-fouced');
                $(this).addClass('option-select');
            }

            if (this.frameInitFunction) {
                this.frameInitFunction();
            }
        } else if(confirm(SN.INFO.IsLogout)) {
            SN.Cookie.Set("autor", "");
            SN.Cookie.Clear("autor");
            //GotoUrl("index.html", false);
            SN.DATA.ToolbarStart.onmouseup();
            SN.DATA.ToolbarLogin.innerHTML = SN.INFO.PageLogin;
        }
    };
    var option = null;
    var css_float = ChangeCss('float-left');

    toolbar.innerHTML = "";
    SN.DATA.JumpToAirprint = jump;
    var linkIcon = "";
    var productID = parseInt(SN.DATA.omProductID.value);
    if (productID == 0x275F || productID == 0x2761) { //2142 FB Legal机型的webpage顶部图标使用favicon_fb_legal.ico
        linkIcon = "favicon_fb_legal.ico";
    }else {
        linkIcon = "favicon.ico";
    }
    if(linkIcon){
        var linkTag = $('<link rel="shortcut icon" href="' + linkIcon + '">');
        $($("head")[0]).append(linkTag);
    }

    //主页
    option = document.createElement("a");
    option.className = "option-home " + css_float;
    option.innerHTML =  '<span style=" visibility:hidden;">' + SN.INFO.PageHome + '</span>';
    option.title = SN.INFO.PageHome;
    option.onclick = function () { GotoUrl("index.html", false); }
    toolbar.appendChild(option);

    //信息
    option = document.createElement("a");
    option.className = "toolbar-option " + css_float;
    option.id = "option_info";
    option.innerHTML = SN.INFO.PageInformation;
    option.onmouseup = mouseup;
    option.onmouseover = mouseover;
    option.onmouseout = mouseout;
    option.frameInitFunction = InitInformation;
    toolbar.appendChild(option);
    SN.DATA.ToolbarStart = option;

    //设置
    option = document.createElement("a");
    option.className = "toolbar-option " + css_float;
    option.id = "option_setting";
    option.innerHTML = SN.INFO.PageSetting;
    option.onmouseup = mouseup;
    option.onmouseover = mouseover;
    option.onmouseout = mouseout;
    option.frameInitFunction = InitSetting;
    toolbar.appendChild(option);
    if (true == SN.DATA.JumpToAirprint) {
        SN.DATA.ToolbarStart = option;
    }

    //管理
    option = document.createElement("a");
    option.className = "toolbar-option "  + css_float;
    option.id = "option_manager";
    option.innerHTML = SN.INFO.PageManager;
    option.onmouseup = managerClick;
    option.onmouseover = mouseover;
    option.onmouseout = mouseout;
    option.frameInitFunction = InitManager;
    toolbar.appendChild(option);

    //登陆
    option = document.createElement("a");
    option.className = "toolbar-option "  + css_float;
    option.id = "option_login";
    option.innerHTML = (!IsAdmin()) ? SN.INFO.PageLogin : SN.INFO.PageLogout;
    option.onmouseup = loginClick;
    option.onmouseover = mouseover;
    option.onmouseout = mouseout;
    option.frameInitFunction = InitLogin;
    toolbar.appendChild(option);
    SN.DATA.ToolbarLogin = option;

    //语言
    option = document.createElement("div");
    option.innerHTML = SN.INFO.PageLanguage;
    option.className = "toolbar-option-language " + ChangeCss('float-right');
    option.innerHTML = SN.FUNC.LanguageSelect(SN.DATA.LanguageList);
    toolbar.appendChild(option);
    $("#id_lang_select").change(
    function() {
        SN.Cookie.Set('lang', this.value);
        GotoUrl("index.html", false);
    });

    //初始化button
    InitAllButton();

    //显示起始页
    SN.DATA.ToolbarStart.onmouseup();

    $("#id_tips_title").html(SN.INFO.PagePrompt);
    SN.DATA.JumpToAirprint = false;
    window.CurrectUrl = "index.html";

    //页面长时间不操作自动退出登录
    if(IsAdmin()){
        CheckLoginTime();
    }
};


