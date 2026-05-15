var SN = SN || {};
SN.Namespace = function () {
    var a = arguments, o = null, i, j, d, rt;
    for (i = 0; i < a.length; ++i) {
        d = a[i].split(".");
        rt = d[0];
        eval('if (typeof ' + rt + ' == "undefined"){' + rt + ' = {};} o = ' + rt + ';');
        for (j = 1; j < d.length; ++j) {
            o[d[j]] = o[d[j]] || {};
            o = o[d[j]];
        }
    }
};

SN.Cookie = {
    Get: function (name, defRet) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return defRet;
    },
    Set: function (name, value) {
        document.cookie = name + "=" + value;
    },
    Clear: function (name) {
        var expires = "";
        var date = new Date();
        date.setTime(date.getTime() + (-7 * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
        document.cookie = name + "=;" + expires + "; path=/";
    }
};

SN.Namespace("SN.DATA");    //数据
SN.Namespace("SN.FUNC");    //函数
SN.Namespace("SN.INFO");    //信息
SN.Namespace("SN.TYPE");    //类型
SN.Namespace("SN.BOTTON");  //按钮
SN.Namespace("SN.ID");      //ID

var HTTP_SET_IPV4_INUSED = -4;
var HTTP_RESERT_NETWORK_OK = -5;
var HTTP_SET_SLEEPTIME_FAIL = -6;
var HTTP_SET_HOSTNAME_INUSED = -7;
var HTTP_WPS_CONNECTION_FAIL = -8;
var HTTP_WPS_CONNECTION_OK = -9;
var HTTP_WPS_CONNECTING = -10;
var HTTP_FILE_UPLOAD_FAIL = -11;
var HTTP_FILE_UPLOAD_OK = -12;
var HTTP_FILE_UPLOAD_TOOBIG = -13;
var HTTP_CERTIFICATE_OK = -14;
var HTTP_CERTIFICATE_FAIL = -15;
var HTTP_SYSUPGRADE_OK = -17;
var HTTP_SYSUPGRADE_FAIL = -18;
var HTTP_SET_OID_FAIL = -19;
var HTTP_GCP_OPT_OK = -20;
var HTTP_GCP_OPT_FAIL = -21;
var HTTP_POWER_ON_RESTART = -22;
var HTTP_CA_CERTIFICATE_FAIL = -26;
var HTTP_STA_CONNECTION_OK = -27;
var HTTP_STA_CONNECTION = -28;
var HTTP_REBOOT_FAIL = -29
var HTTP_REBOOT_OK = -33

var IPP_MANAGER_SET_FAIL = -30;
var IPP_MANAGER_IS_BUSY = -31;

var HTTP_SYSUPGRADE_NETOFFLINE = -121;
var HTTP_SYSUPGRADE_VERUPGRADEING =  -120;
var HTTP_SYSUPGRADE_CONNECTSRVTIMEOUT = -118;
var HTTP_SYSUPGRADE_CLOUDSRVERR  = -117;


/*网络端口配置相关*/
var HTTP_NETPORT_NO_SAME_DEFAULT 	= -116;	//网络端口配置：不允许新增与默认网络端口策略一致的属性。
var HTTP_NETPORT_ONLY_EDIT_ENABLED 	= -115;	//网络端口配置：默认网络端口策略仅允许修改服务状态。
var HTTP_NETPORT_NO_DEL_DEFAULT 	= -114;	//网络端口配置：不允许删除默认网络端口策略。
var HTTP_NETPORT_WEBFORCEENABLE 	= -113;	//网络端口配置：限制修改Web服务已启用，不允许对Web服务(80或443)端口进行配置。

var HTTP_CERT_MAN_IMPORT_WILL_FULL_CA = -112;
var HTTP_CERT_MAN_IMPORT_OUT_OF_CHAIN_MAX = -111;
var HTTP_CERT_MAN_IMPORT_NO_PRIKEY_FILE = -110;
var HTTP_CERT_MAN_IMPORT_SUCCESS = -109;
var HTTP_CERT_MAN_EDIT_SMTP = -108;           //功能编辑：加密电子邮件证书设置失败，该功能不达预期，请取消该勾选后重试
var HTTP_CERT_MAN_EDIT_IPSEC = -107;          //功能编辑：ipsec证书设置失败，该功能不达预期，请取消该勾选后重试
var HTTP_CERT_MAN_EDIT_IPPS_HTTPS = -106;     //功能编辑：ipps HTTPS证书设置失败，该功能不达预期，请取消该勾选后重试
var HTTP_CERT_MAN_EDIT_KERBEROS = -105;       //功能编辑：KERBEROS证书设置失败，该功能不达预期，请取消该勾选后重试
var HTTP_CERT_MAN_EDIT_LDAP = -104;           //功能编辑：ldap证书设置失败，该功能不达预期，请取消该勾选后重试
var HTTP_CERT_MAN_EDIT_8021X_WIRED = -103;    //功能编辑：8021x有线证书设置失败，该功能不达预期，请取消该勾选后重试
var HTTP_CERT_MAN_EDIT_8021X_WIRELESS = -102; //功能编辑：8021x无线证书设置失败，该功能不达预期，请取消该勾选后重试
var HTTP_CERT_MAN_EDIT_SUCCESS = -101;        //功能编辑：设置成功

var HTTP_CERT_MAN_UNKNOWN_SYS = -100;		  //未知错误：操作失败
var HTTP_CERT_MAN_EDIT_FLAT = -94;		  	  //功能编辑：当前证书不能完成预期的功能编辑
var HTTP_CERT_MAN_EDIT_LOCK = -93;			  //功能编辑：锁定证书不支持功能编辑
var HTTP_CERT_MAN_EDIT_TYPE = -92;			  //功能编辑：请选择客户端证书进行编辑
var HTTP_CERT_MAN_UNKNOWN_FIND = -91;		  //未知错误：该证书未找到
var HTTP_CERT_MAN_IMPORT_EXIST = -90;		  //导入失败：证书已存在
var HTTP_CERT_MAN_IMPORT_FULL_CLIENT = -89;   //导入失败：Client证书达到最大数量，请移除不需要的Client证书后重试
var HTTP_CERT_MAN_IMPORT_FULL_CA = -88; 	  //导入失败：CA证书达到最大数量，请移除不需要的CA证书后重试
var HTTP_CERT_MAN_IMPORT_SIZE = -87;		  //导入失败：证书过大
var HTTP_CERT_MAN_IMPORT_CONTENT = -86; 	  //导入失败：不完整的证书内容
var HTTP_CERT_MAN_IMPORT_PARSE = -85;		  //导入失败：证书解析失败
var HTTP_CERT_MAN_IMPORT_TYPE = -84;		  //导入失败：不支持的证书类型
var HTTP_CERT_MAN_IMPORT_TIMEOUT = -83; 	  //导入失败：超时
var HTTP_CERT_MAN_IMPORT_SYS_FAIL = -82;	  //导入失败：系统出错
var HTTP_CERT_MAN_IMPORT_PASSWORD_FAIL = -81; //导入失败：私钥密码错误

var HTTP_CERT_MAN_EXPORT_TIMEOUT = -80; 	  //导出失败：超时
var HTTP_CERT_MAN_EXPORT_PARSE = -79;		  //导出失败：数据传递失败
var HTTP_CERT_MAN_EXPORT_LOCK = -78;		  //导出失败：锁定证书不支持导出

var HTTP_CERT_MAN_VIEW_TIMEOUT = -77;		  //证书查看：超时
var HTTP_CERT_MAN_VIEW_PARSE = -76; 		  //证书查看：数据传递失败
var HTTP_CERT_MAN_VIEW_LOCK = -75;			  //证书查看：锁定证书不支持查看

var HTTP_CERT_MAN_REMOVE_SUCCESS = -74; 	  //证书移除：移除成功
var HTTP_CERT_MAN_REMOVE_TIMEOUT = -73; 	  //移除失败：超时
var HTTP_CERT_MAN_REMOVE_LOCK = -72;		  //移除失败：锁定证书不支持移除

var SCREEN_REFRESH_TIMEOUT_HANDLER;

//属性模块
var MAX_OM_SIZE = 100;
var MODULE_ERROR = 1;                   //错误模块
var MODULE_EXTERN = 1 * MAX_OM_SIZE;    //全局属性模块
var MODULE_INFO = 2 * MAX_OM_SIZE;      //产品信息属性模块
var MODULE_LOGIN = 3 * MAX_OM_SIZE;     //登陆模块
var MODULE_MANAGER = 4 * MAX_OM_SIZE;   //用户管理模块
var MODULE_IPV4 = 5 * MAX_OM_SIZE;      //IPV4模块
var MODULE_IPV6 = 6 * MAX_OM_SIZE;      //IPV6模块
var MODULE_RAWLPD = 7 * MAX_OM_SIZE;    //RAWLPD模块
var MODULE_SNMP = 8 * MAX_OM_SIZE;      //SNMP模块
var MODULE_WSD = 9 * MAX_OM_SIZE;       //WSD模块
var MODULE_SMTP = 10 * MAX_OM_SIZE;     //SMTP模块
var MODULE_MDNS = 11 * MAX_OM_SIZE;     //MDNS模块
var MODULE_SSLTLS = 12 * MAX_OM_SIZE;   //SSLTLS模块
var MODULE_SYSTEM = 13 * MAX_OM_SIZE;   //SYSTEM模块
var MODULE_PCL = 14 * MAX_OM_SIZE;      //PCL模块
var MODULE_PS = 15 * MAX_OM_SIZE;       //PS模块
var MODULE_PRINT = 16 * MAX_OM_SIZE;    //PRINT模块
var MODULE_EMAIL = 17 * MAX_OM_SIZE;    //EMAIL模块
var MODULE_STA = 18 * MAX_OM_SIZE;      //Wifi STA模块
var MODULE_UAP = 19 * MAX_OM_SIZE;      //Wifi UAP模块
var MODULE_WPS = 20 * MAX_OM_SIZE;      //Wifi WPS模块
var MODULE_WIFIIP = 21 * MAX_OM_SIZE;   //Wifi IP配置模块
var MODULE_WFD = 22 * MAX_OM_SIZE;      //WFD模块
var MODULE_GCP = 23 * MAX_OM_SIZE;      //GCP模块
var MODULE_PowerOff = 24 * MAX_OM_SIZE;   //自动关机模块
var MODULE_SCAN = 25 * MAX_OM_SIZE;     //扫描设置模块
var MODULE_SCANINFO = 26 * MAX_OM_SIZE; //扫描信息模块
var MODULE_COPYINFO = 27 * MAX_OM_SIZE;     //复印信息模块
var MODULE_PRINTINFO = 28 * MAX_OM_SIZE; //打印信息模块
var MODULE_DEVICE = 29 * MAX_OM_SIZE;     //设备状态模块
var MODULE_8021X = 30 * MAX_OM_SIZE;   //802.1X模块
var MODULE_POWER_RESTART = 31 * MAX_OM_SIZE;   //打印机上电重启webpage模块
var MODULE_LDAP = 32 * MAX_OM_SIZE;     //LDAP模块
var MODULE_WINDOWS = 33 * MAX_OM_SIZE;     //Windows登录模块
var MODULE_SECURITY = 34 * MAX_OM_SIZE;     //安全设置模块
var MOUDLE_PERMISSION = 35 * MAX_OM_SIZE; //访问控制模块
var MODULE_HTTPS = 36 * MAX_OM_SIZE       //管理协议模块
var MODULE_SMB = 37 * MAX_OM_SIZE;       //SMB模块   ##jimmy##
var MODULE_SNTP = 38 * MAX_OM_SIZE;       //SNTP模块   ##jimmy##
var MODULE_NETCONTACT = 39 * MAX_OM_SIZE;       //网络联系人模块

var MODULE_CERT_MAN = 40 * MAX_OM_SIZE;  //证书管理模块
var MODULE_PRINTSET = 41 * MAX_OM_SIZE;  //打印模块
var MODULE_QUICK_CONFIG = 42 * MAX_OM_SIZE;  //扫描快捷设置模块
var MODULE_TRAY_SET = 43 * MAX_OM_SIZE;  //纸盒设置模块
var MODULE_NETPORT_MAN = 44 * MAX_OM_SIZE;  //网络端口模块
var MODULE_CONSUMABLES = 45 * MAX_OM_SIZE; //耗材设置模块
var MODULE_NET_ALLOW_LIST = 46 * MAX_OM_SIZE;  //网络白名单模块
var MODULE_SCANTO_MAN = 47 * MAX_OM_SIZE;  //扫描功能管理模块

var MODULE_IPFilter_LIST = 48 * MAX_OM_SIZE;  //IPFilter模块
//列表操作
var OPT_MODIFY = 0;
var OPT_NEW = 1;
var OPT_ADD = 2;
var OPT_ROW_NO = -1;

//记录AirPrint用户列表删除/修改对象是否为当前登录账号
var MDNS_USER_MODIFY_DELETE_FLAG = 0;

//状态
var SCAN_STATUS = 89;
var COPY_STATUS = 142;
var FAX_STATUS = 150;
function GetStatusModule() {
    var module = SN.DATA.omStatusModule.value.split("-");
    if (module.length == 3) {
        SCAN_STATUS = parseInt(module[0], 10);
        COPY_STATUS = parseInt(module[1], 10);
        FAX_STATUS = parseInt(module[2], 10);
    }
}

//属性类型type
SN.TYPE.OMType = 0;
//OM类型:
SN.TYPE.OnlyValue = SN.TYPE.OMType + 1;
SN.TYPE.StaticValue = SN.TYPE.OMType + 2;
SN.TYPE.InputText = SN.TYPE.OMType + 3;
SN.TYPE.InputPassword = SN.TYPE.OMType + 4;
SN.TYPE.InputIpaddr = SN.TYPE.OMType + 5;
SN.TYPE.Selection = SN.TYPE.OMType + 6;
SN.TYPE.InputCheckbox = SN.TYPE.OMType + 7;
SN.TYPE.InputShort = SN.TYPE.OMType + 8;
SN.TYPE.InputRadio = SN.TYPE.OMType + 9;
SN.TYPE.InputTextArea = SN.TYPE.OMType + 10;

SN.TYPE.TableNetEmlAbs = SN.TYPE.OMType + 99; //net user or group
SN.TYPE.TableEmlAbs = SN.TYPE.OMType + 100; //address books for E-mail Notice
SN.TYPE.TableArpUsr = SN.TYPE.OMType + 101; //airprint user
SN.TYPE.TableAddBks = SN.TYPE.OMType + 102; //address books
SN.TYPE.TableSmbSrv = SN.TYPE.OMType + 103; //smb server
SN.TYPE.TableFtpSrv = SN.TYPE.OMType + 104; //ftp server
SN.TYPE.TableEmlSrv = SN.TYPE.OMType + 105; //mail server
SN.TYPE.TableEmlGrp = SN.TYPE.OMType + 106; //mail group
SN.TYPE.TablePhnBks = SN.TYPE.OMType + 107; //phone book
SN.TYPE.TablePhnGrp = SN.TYPE.OMType + 108; //phone group
SN.TYPE.TableNetUserSrv = SN.TYPE.OMType + 109; //net user or group
SN.TYPE.TableScanQuickSetSrv = SN.TYPE.OMType + 110; //scan quick settings
SN.TYPE.TableNetPortMan = SN.TYPE.OMType + 111; //net port manager
SN.TYPE.TableWhiteList = SN.TYPE.OMType + 112;
SN.TYPE.TableIpsecList = SN.TYPE.OMType + 113; 
SN.TYPE.TableIPFilterList = SN.TYPE.OMType + 114;
//BOTTON类型:
SN.TYPE.Refresh = "button_refresh";
SN.TYPE.Apply = "button_apply";
SN.TYPE.Cancel = SN.TYPE.Refresh;
SN.TYPE.EmailTest = "button_emailtest";
SN.TYPE.Login = "button_login";
SN.TYPE.ResetAll = "button_resetall";
SN.TYPE.ChangePassWord = "button_changepswd";
SN.TYPE.ResetPCL = "button_resetpcl";
SN.TYPE.ResetPrint = "button_resetprint";
SN.TYPE.ResetSmtp = "button_resetsmtp";
SN.TYPE.UserNew = "button_usernew";
SN.TYPE.UserAdd = "button_useradd";
SN.TYPE.UserDelete = "button_userdelete";
SN.TYPE.UserModify = "button_usermodify";
SN.TYPE.Upgrade = "button_upgrade";
SN.TYPE.Search = "button_search";
SN.TYPE.PanelPassWord = "button_panelpswd";
SN.TYPE.LdapTest = "button_ldaptest";
SN.TYPE.ResetLdap = "button_resetldap";
SN.TYPE.WinLoginTest = "button_winlogintest";
SN.TYPE.ResetWinLogin = "button_resetwinlogin";
SN.TYPE.CertConfigure = "button_certificateconfigure";
SN.TYPE.NetContactTest = "button_netcontacttest";
SN.TYPE.ResetNetContact = "button_resetnetcontact";
SN.TYPE.cert_importJump = "cert_importJump";
SN.TYPE.cert_export = "cert_export";
SN.TYPE.cert_remove = "cert_remove";
SN.TYPE.cert_view   = "cert_view";
SN.TYPE.cert_editUsage   = "cert_editUsage";
SN.TYPE.Reboot   = "button_reboot";
SN.TYPE.Disconnect   = "button_Disconnect";
SN.TYPE.cert_assistant = "cert_assistant";
//为Ipsec新增
SN.TYPE.IpseclistUserNew = "button_ipsec_usernew";
SN.TYPE.IpseclistDelete = "button_ipsec_delete";
SN.TYPE.IpseclistModify = "button_ipsec_modify";

//MODULE_EXTERN
SN.ID.omNoCheck = MODULE_EXTERN + 0;
SN.ID.omErrorFlag = MODULE_EXTERN + 1;
SN.ID.omDrumStatus = MODULE_EXTERN + 2;
SN.ID.omStatusModule = MODULE_EXTERN + 3;
SN.ID.omPaperEmpty = MODULE_EXTERN + 4;
SN.ID.omPaperJam = MODULE_EXTERN + 5;
SN.ID.omPaperMismatch = MODULE_EXTERN + 6;
SN.ID.omPaperSourceMismatch = MODULE_EXTERN + 7;
SN.ID.omPSDataFormat = MODULE_EXTERN + 8;
SN.ID.wifiEnumerated = MODULE_EXTERN + 9;
SN.ID.wifiEthrEnumerated = MODULE_EXTERN + 10;
SN.ID.omEmailUser = MODULE_EXTERN + 11;
SN.ID.omEmailAddress = MODULE_EXTERN + 12;
SN.ID.omFirmVersion = MODULE_EXTERN + 13;
SN.ID.omProductID = MODULE_EXTERN + 14;
SN.ID.omFirmName = MODULE_EXTERN + 15;
SN.ID.omFtpServerName = MODULE_EXTERN + 16;
SN.ID.omFtpServerAddr = MODULE_EXTERN + 17;
SN.ID.omFtpServerPath = MODULE_EXTERN + 18;
SN.ID.omFtpNoAuthFlag = MODULE_EXTERN + 19;
SN.ID.omFtpServerUser = MODULE_EXTERN + 20;
SN.ID.omFtpServerPswd = MODULE_EXTERN + 21;
SN.ID.omFtpServerPort = MODULE_EXTERN + 22;
SN.ID.omGroupName = MODULE_EXTERN + 23;
SN.ID.omGroupNumber = MODULE_EXTERN + 24;
SN.ID.omPhoneSpeed = MODULE_EXTERN + 25;
SN.ID.omPhoneUser = MODULE_EXTERN + 26;
SN.ID.omPhoneNumber = MODULE_EXTERN + 27;
SN.ID.omGCPEnumerated = MODULE_EXTERN + 28;
SN.ID.omSmbServerName = MODULE_EXTERN + 29;
SN.ID.omSmbServerAddr = MODULE_EXTERN + 30;
SN.ID.omSmbServerPath = MODULE_EXTERN + 31;
SN.ID.omSmbNoAuthFlag = MODULE_EXTERN + 32;
SN.ID.omSmbServerUser = MODULE_EXTERN + 33;
SN.ID.omSmbServerPswd = MODULE_EXTERN + 34;
SN.ID.omSmbServerPort = MODULE_EXTERN + 35;
SN.ID.omNetUserGroupsID = MODULE_EXTERN + 36;
SN.ID.omNetUserGroupsName = MODULE_EXTERN + 37;
SN.ID.omNetUserGroupsType = MODULE_EXTERN + 38;
SN.ID.omNetUserPermissionSystemSet = MODULE_EXTERN + 39;
SN.ID.omNetUserPermissionCopy = MODULE_EXTERN + 40;
SN.ID.omNetUserPermissionScan = MODULE_EXTERN + 41;
SN.ID.omNetUserPermissionFax = MODULE_EXTERN + 42;
SN.ID.omNetUserPermissionPswdPrint = MODULE_EXTERN + 43;
SN.ID.omNetUserPermissionUDiskPrint = MODULE_EXTERN + 44;
SN.ID.omWebLoginEnabled = MODULE_EXTERN + 45;
SN.ID.omFtpServerSecurity = MODULE_EXTERN + 47;   //FTPs
SN.ID.omScanArgName = MODULE_EXTERN + 48;
SN.ID.omScanArgTo = MODULE_EXTERN + 49;
SN.ID.omScanArgColor = MODULE_EXTERN + 50;
SN.ID.omScanArgDuplex = MODULE_EXTERN + 51;
SN.ID.omScanArgResolution = MODULE_EXTERN + 52;
SN.ID.omScanArgArea = MODULE_EXTERN + 53;
SN.ID.omScanArgFileFormat = MODULE_EXTERN + 54;
SN.ID.omScanArgNup = MODULE_EXTERN + 55;
SN.ID.omScanArgFileNamePrefix = MODULE_EXTERN + 56;

//新增Ipsec
SN.ID.omIpsecEnable = MODULE_EXTERN + 57;
SN.ID.omIkeCipherSuite = MODULE_EXTERN + 58;
SN.ID.omEspEncrypt = MODULE_EXTERN + 59;
SN.ID.omEspAuthentication = MODULE_EXTERN + 60;
SN.ID.omIKESASurvival = MODULE_EXTERN + 61;
SN.ID.omIpsecSASurvival = MODULE_EXTERN + 62;
SN.ID.omIpsecIPv4 = MODULE_EXTERN + 63;
SN.ID.omIpsecSharedKey = MODULE_EXTERN + 64;

SN.ID.omWebLoginTimeout = MODULE_EXTERN + 65;

//MODULE_INFO
SN.ID.omProductName = MODULE_INFO + 0;
SN.ID.omSerialNumber = MODULE_INFO + 1;
SN.ID.omPrinterStatus = MODULE_INFO + 2;
SN.ID.omTonerRemain = MODULE_INFO + 3;
SN.ID.omCartridgeStatus = MODULE_INFO + 4;

//MODULE_LOGIN
SN.ID.omAdminUser = MODULE_LOGIN + 0;
SN.ID.omAdminPass = MODULE_LOGIN + 1;

//MODULE_MANAGER
SN.ID.omAdminPass1 = MODULE_MANAGER + 0;
SN.ID.omAdminPass2 = MODULE_MANAGER + 1;
SN.ID.omNetworkReset = MODULE_MANAGER + 2;
SN.ID.omPanelLoginEnabled = MODULE_MANAGER + 3;
SN.ID.omPanelPass1 = MODULE_MANAGER + 5;
SN.ID.omPanelPass2 = MODULE_MANAGER + 6;
SN.ID.omPanelPwsdSameAsWeb = MODULE_MANAGER + 7;

//MODULE_IPV4
SN.ID.omHostName = MODULE_IPV4 + 0;
SN.ID.omMACAddress = MODULE_IPV4 + 1;
SN.ID.omUserDHCP = MODULE_IPV4 + 2;
SN.ID.omIPv4Address = MODULE_IPV4 + 3;
SN.ID.omIPv4SubnetMask = MODULE_IPV4 + 4;
SN.ID.omIPv4GatewayAddress = MODULE_IPV4 + 5;
SN.ID.omDomainName = MODULE_IPV4 + 6;
SN.ID.omIPv4MainDNS = MODULE_IPV4 + 7;
SN.ID.omIPv4OtherDNS = MODULE_IPV4 + 8;
SN.ID.omIPv4DNSDHCP = MODULE_IPV4 + 9;

//MODULE_IPV6
SN.ID.omEnableIPv6 = MODULE_IPV6 + 0;
SN.ID.omUseDHCPv6 = MODULE_IPV6 + 1;
SN.ID.omIPv6LocalAddress = MODULE_IPV6 + 2;
SN.ID.omIPv6Address = MODULE_IPV6 + 3;
SN.ID.omIPv6MainDNS = MODULE_IPV6 + 4;
SN.ID.omIPv6OtherDNS = MODULE_IPV6 + 5;
SN.ID.omIPv6GatewayAddress = MODULE_IPV6 + 6;

//MODULE_RAWLPD
SN.ID.omEnable9100PRT = MODULE_RAWLPD + 0;
SN.ID.omEnableLPRPRT = MODULE_RAWLPD + 1;

//MODULE_SNMP
SN.ID.omSnmpComv1 = MODULE_SNMP + 0;
SN.ID.omSnmpComv2c = MODULE_SNMP + 1;
SN.ID.omSnmpComv3 = MODULE_SNMP + 2;
SN.ID.omSnmpV3user = MODULE_SNMP + 3;
SN.ID.omSnmpV3auth = MODULE_SNMP + 4;
SN.ID.omSnmpV3priv = MODULE_SNMP + 5;
SN.ID.omEnableSnmp = MODULE_SNMP + 6;
SN.ID.omEnableSnmpv1v2 = MODULE_SNMP + 7;
SN.ID.omEnableSnmpv3 = MODULE_SNMP + 8;

//MODULE_WSD
SN.ID.omEnableWSD = MODULE_WSD + 0;
SN.ID.omWSDPort = MODULE_WSD + 1;

//MODULE_SMB   ##jimmy##
SN.ID.omEnableSMBNTLMV1 = MODULE_SMB + 0;
SN.ID.omEnableSMBAuto = MODULE_SMB + 1;

//MODULE_SNTP   ##jimmy##
SN.ID.omSNTPStatus = MODULE_SNTP + 0;
SN.ID.omSNTPSync = MODULE_SNTP + 1;
//SN.ID.omSNTPSM = MODULE_SNTP + 2;
SN.ID.omSNTPAddress = MODULE_SNTP + 2;
SN.ID.omSNTPPort = MODULE_SNTP + 3;

//MODULE_SMTP
SN.ID.omSMTPAddress = MODULE_SMTP + 0;
SN.ID.omSMTPPort = MODULE_SMTP + 1;
SN.ID.omSMTPUserName = MODULE_SMTP + 2;
SN.ID.omSMTPUserPassword = MODULE_SMTP + 3;
SN.ID.omSMTPTest = MODULE_SMTP + 4;
SN.ID.omSMTPEmailAddr = MODULE_SMTP + 5;
SN.ID.omSMTPSecurity = MODULE_SMTP + 6;
SN.ID.omSMTPServerAddress = MODULE_SMTP + 7;
SN.ID.omSMTPServerAuth = MODULE_SMTP + 8;

//MODULE_MDNS
SN.ID.omEnableBonjour = MODULE_MDNS + 0;
SN.ID.omBonjourPort = MODULE_MDNS + 1;
SN.ID.omBonjourName = MODULE_MDNS + 2;
SN.ID.omEnableIPP = MODULE_MDNS + 3;
SN.ID.omPrinterLatitude = MODULE_MDNS + 4;
SN.ID.omPrinterLongitude = MODULE_MDNS + 5;
SN.ID.omAirprintName = MODULE_MDNS + 6;
SN.ID.omAirprintPassword = MODULE_MDNS + 7;

//MODULE_SSLTLS
SN.ID.omCertificateKey = MODULE_SSLTLS + 0;
SN.ID.omCertificateSubmit = MODULE_SSLTLS + 1;
SN.ID.omCertCommonName = MODULE_SSLTLS + 2;
SN.ID.omCertOrganization = MODULE_SSLTLS + 3;
SN.ID.omCertOrgUnit = MODULE_SSLTLS + 4;
SN.ID.omCertCity = MODULE_SSLTLS + 5;
SN.ID.omCertState = MODULE_SSLTLS + 6;
SN.ID.omCertCountry = MODULE_SSLTLS + 7;
SN.ID.omCertCurrentDate = MODULE_SSLTLS + 8;
SN.ID.omCertNumDaysValid = MODULE_SSLTLS + 9;
SN.ID.omCertCAeapSubmit = MODULE_SSLTLS + 10;//用于EAP导入CA证书新增
SN.ID.omCertManagementPriKeyFlag = MODULE_SSLTLS + 11;//私钥导出标识
SN.ID.omCertSubAlterName = MODULE_SSLTLS + 12;

//MODULE_CERT_MAN
SN.ID.omCertHash = MODULE_CERT_MAN + 0;//当前选中证书哈希值
SN.ID.certScanStatus = MODULE_CERT_MAN + 1;

SN.ID.omCertManagementWireless  = MODULE_CERT_MAN + 2;
SN.ID.omCertManagementWired     = MODULE_CERT_MAN + 3;
SN.ID.omCertManagementLDAP      = MODULE_CERT_MAN + 4;
SN.ID.omCertManagementKerberos  = MODULE_CERT_MAN + 5;
SN.ID.omCertManagementIPPSHTTPS = MODULE_CERT_MAN + 6;
SN.ID.omCertManagementIPSEC     = MODULE_CERT_MAN + 7;
SN.ID.omCertManagementSMTP      = MODULE_CERT_MAN + 8;
SN.ID.omCertGenrsaKeyLen        = MODULE_CERT_MAN + 9;
SN.ID.omCertShaKeyLen           = MODULE_CERT_MAN + 10;
//MODULE_8021X
SN.ID.om8021XWiredStatus = MODULE_8021X + 0;
SN.ID.om8021XAuth = MODULE_8021X + 1;
SN.ID.om8021XUserName = MODULE_8021X + 2;
SN.ID.om8021XUserPassword = MODULE_8021X + 3;
SN.ID.om8021XUserPassword2 = MODULE_8021X + 4;
SN.ID.om8021XServerID = MODULE_8021X + 7;
SN.ID.om8021XServerIdOp = MODULE_8021X + 8;
SN.ID.om8021XAnonymousID = MODULE_8021X + 9;
SN.ID.om8021XAuthInner = MODULE_8021X + 10;
SN.ID.om8021XNeedCert = MODULE_8021X + 11;
//MODULE_LDAP
SN.ID.omLdapEnabled = MODULE_LDAP + 0;
SN.ID.omLdapServerAddr = MODULE_LDAP + 1;
SN.ID.omLdapServerPort = MODULE_LDAP + 2;
SN.ID.omLdapSecurity = MODULE_LDAP + 3;
SN.ID.omLdapAuthDeviceUser = MODULE_LDAP + 4;
SN.ID.omLdapSearchroot = MODULE_LDAP + 5;
SN.ID.omLdapMatchName = MODULE_LDAP + 6;
SN.ID.omLdapRetrieveEmail = MODULE_LDAP + 7;
SN.ID.omLdapRetrieveUser = MODULE_LDAP + 8;
SN.ID.omLdapRetrieveGroup = MODULE_LDAP + 9;
SN.ID.omLdapServerUser = MODULE_LDAP + 10;
SN.ID.omLdapServerPswd = MODULE_LDAP + 11;
SN.ID.omLdapTest = MODULE_LDAP + 12;
SN.ID.omLdapHaveCertificate = MODULE_LDAP + 13;

//MODULE_WINDOWS
SN.ID.omWindowsLoginEnabled = MODULE_WINDOWS + 0;
SN.ID.omWindowsReverseDNS = MODULE_WINDOWS + 1;
SN.ID.omWindowsDomain1 = MODULE_WINDOWS + 2;
SN.ID.omWindowsDomain2 = MODULE_WINDOWS + 3;
SN.ID.omWindowsDomain3 = MODULE_WINDOWS + 4;
SN.ID.omWindowsDomain4 = MODULE_WINDOWS + 5;
SN.ID.omWindowsDomain5 = MODULE_WINDOWS + 6;
SN.ID.omWindowsDomain6 = MODULE_WINDOWS + 7;
SN.ID.omWindowsDomain7 = MODULE_WINDOWS + 8;
SN.ID.omWindowsDomain8 = MODULE_WINDOWS + 9;
SN.ID.omWindowsDomain9 = MODULE_WINDOWS + 10;
SN.ID.omWindowsDomain10 = MODULE_WINDOWS + 11;
SN.ID.omWindowsDefaultDomain = MODULE_WINDOWS + 12;
SN.ID.omWindowsSecurity = MODULE_WINDOWS + 13;
SN.ID.omWindowsMatchName = MODULE_WINDOWS + 14;
SN.ID.omWindowsAuthMode = MODULE_WINDOWS + 15;
SN.ID.omWindowsDomain = MODULE_WINDOWS + 16;
SN.ID.omWindowsLoginUser = MODULE_WINDOWS + 17;
SN.ID.omWindowsLoginPswd = MODULE_WINDOWS + 18;
SN.ID.omWindowsRetrieveEmail = MODULE_WINDOWS + 19;
SN.ID.omWindowsRetrieveUser = MODULE_WINDOWS + 20;
SN.ID.omWindowsRetrieveGroup = MODULE_WINDOWS + 21;
SN.ID.omWindowsLoginTest = MODULE_WINDOWS + 22;
SN.ID.omWindowsDNSLookupRealm = MODULE_WINDOWS + 23;
SN.ID.omWindowsHaveCertificate = MODULE_WINDOWS + 24;

//MOUDLE_PERMISSION
SN.ID.omNetUsersLoginEnabled = MOUDLE_PERMISSION + 0;
SN.ID.omPanelTimeOut = MOUDLE_PERMISSION + 1;
//SN.ID.omNetUserGroupsID = MOUDLE_PERMISSION + 2;
//SN.ID.omNetUserGroupsName = MOUDLE_PERMISSION + 3;
//SN.ID.omNetUserGroupsType = MOUDLE_PERMISSION + 4;
SN.ID.omNetUserGroupsID1 = MOUDLE_PERMISSION + 5;
SN.ID.omNetUserGroupsName1 = MOUDLE_PERMISSION + 6;
//SN.ID.omNetUserPermissionSystemSet = MOUDLE_PERMISSION + 7;
//SN.ID.omNetUserPermissionCopy = MOUDLE_PERMISSION + 8;
//SN.ID.omNetUserPermissionScan = MOUDLE_PERMISSION + 9;
//SN.ID.omNetUserPermissionFax = MOUDLE_PERMISSION + 10;
//SN.ID.omNetUserPermissionPswdPrint = MOUDLE_PERMISSION + 11;
//SN.ID.omNetUserPermissionUDiskPrint = MOUDLE_PERMISSION + 12;

//MODULE_SYSTEM
SN.ID.omConsumerPosition = MODULE_SYSTEM + 0;
SN.ID.omContactInfo = MODULE_SYSTEM + 1;
SN.ID.omPropertyNumber = MODULE_SYSTEM + 2;
SN.ID.omSleepTime = MODULE_SYSTEM + 3;
SN.ID.omJobTimeOut = MODULE_SYSTEM + 4;
SN.ID.omDate = MODULE_SYSTEM + 5;
//SN.ID.omClocktype = MODULE_SYSTEM + 6;
SN.ID.omTime = MODULE_SYSTEM + 6;
SN.ID.omUTC = MODULE_SYSTEM + 7;
SN.ID.omSNTPserversyn = MODULE_SYSTEM + 8;
SN.ID.omSNTPclicksyn = MODULE_SYSTEM + 9;

//MODULE_PCL
SN.ID.omUserfontnum = MODULE_PCL + 0;
SN.ID.omUserfontpitch = MODULE_PCL + 1;
SN.ID.omUserfontheight = MODULE_PCL + 2;
SN.ID.omUsersymbolset = MODULE_PCL + 3;
SN.ID.omUservmi = MODULE_PCL + 4;
SN.ID.omUserTopMargin = MODULE_PCL + 5;
SN.ID.omUserBottomMargin = MODULE_PCL + 6;
SN.ID.omUserLeftMargin = MODULE_PCL + 7;
SN.ID.omUserRightMargin = MODULE_PCL + 8;
SN.ID.omUserWideA4 = MODULE_PCL + 9;
SN.ID.omUserOffsetX = MODULE_PCL + 10;
SN.ID.omUserOffsetY = MODULE_PCL + 11;

//MODULE_PS
SN.ID.omJobPSErrReportEnable = MODULE_PS + 0;

//MODULE_PRINT
SN.ID.omUserpapersize = MODULE_PRINT + 0;
SN.ID.omUserpapertype = MODULE_PRINT + 1;
SN.ID.omUsercopies = MODULE_PRINT + 2;
SN.ID.omUsermanualfeed = MODULE_PRINT + 3;
SN.ID.omUserduplex = MODULE_PRINT + 4;
SN.ID.omUserorientation = MODULE_PRINT + 5;
SN.ID.omUserdensity = MODULE_PRINT + 6;
SN.ID.omUserresolution = MODULE_PRINT + 7;
SN.ID.omUserbind = MODULE_PRINT + 8;
SN.ID.omUserinputtray = MODULE_PRINT + 9;
SN.ID.omInputtraynumber = MODULE_PRINT + 10;

//MODULE_EMAIL
SN.ID.omSMTPClientAddress1 = MODULE_EMAIL + 0;
SN.ID.omSMTPClientAddress2 = MODULE_EMAIL + 1;
SN.ID.omSMTPClientAddress3 = MODULE_EMAIL + 2;
SN.ID.omSMTPClientAddress4 = MODULE_EMAIL + 3;
SN.ID.omSMTPEnableEmailAddr1 = MODULE_EMAIL + 4;
SN.ID.omSMTPEnableEmailAddr2 = MODULE_EMAIL + 5;
SN.ID.omSMTPEnableEmailAddr3 = MODULE_EMAIL + 6;
SN.ID.omSMTPEnableEmailAddr4 = MODULE_EMAIL + 7;
SN.ID.omSMTPEmailPaperEmpty = MODULE_EMAIL + 8;
SN.ID.omSMTPEmailTonerLowWarning = MODULE_EMAIL + 9;
SN.ID.omSMTPEmailPaperJam = MODULE_EMAIL + 10;
SN.ID.omSMTPEmailCartridgeEnd = MODULE_EMAIL + 11;
SN.ID.omSMTPEmailPaperFew = MODULE_EMAIL + 12;
SN.ID.omSMTPSubject = MODULE_EMAIL + 13;

//MODULE_STA
SN.ID.wifiStaSSID = MODULE_STA + 0;
SN.ID.wifiStaWPAPassword = MODULE_STA + 1;
SN.ID.wifiWepCurKeyValue = MODULE_STA + 2;
SN.ID.wifiStaEnabled = MODULE_STA + 3;
SN.ID.wifiStaCommMode = MODULE_STA + 4;
SN.ID.wifiStaSecMode = MODULE_STA + 5;
SN.ID.wifiScanStatus = MODULE_STA + 6;
SN.ID.wifiStaStatus = MODULE_STA + 7;
SN.ID.wifiStaStatusReason = MODULE_STA + 8;
SN.ID.wifiStaDbm = MODULE_STA + 9;
SN.ID.wifiStaFreq = MODULE_STA + 10;
SN.ID.wifiStaPMF = MODULE_STA + 11;

/*only for wpa2 enterprise, add elements below, such as user's name, password, advanced option, eap method etc*/
SN.ID.wifiEapUsername = MODULE_STA + 12;
SN.ID.wifiEapPassword = MODULE_STA + 13;
SN.ID.wifiEapMethod = MODULE_STA + 14;
SN.ID.wifiEapType = MODULE_STA + 15;
SN.ID.wifiEapSerAuth = MODULE_STA + 16;//后续不再使用
SN.ID.wifiEapCliAuth = MODULE_STA + 17;//后续不再使用
SN.ID.wifiEapAnonymousID = MODULE_STA + 18;
SN.ID.wifiEapServerID = MODULE_STA + 19;
SN.ID.wifiEapButton = MODULE_STA + 20;
SN.ID.wifiEapServerIdOp = MODULE_STA + 21;
// SN.ID.wifiEapFastPacOp = MODULE_STA + 22;

SN.ID.wifiEnabled = MODULE_STA + 22;
SN.ID.wifiStaModeChoose = MODULE_STA + 23;
//MODULE_WIFIIP
SN.ID.wifiStaIpEnable = MODULE_WIFIIP + 0;
SN.ID.wifiStaIpAddr = MODULE_WIFIIP + 1;
SN.ID.wifiIPv4SubnetMask = MODULE_WIFIIP + 2;
SN.ID.wifiIPv4GatewayAddress = MODULE_WIFIIP + 3;
SN.ID.wifiUseDHCPv6 = MODULE_WIFIIP + 4;
SN.ID.wifiIPv6LocalAddress = MODULE_WIFIIP + 5;
SN.ID.wifiIPv6Address = MODULE_WIFIIP + 6;
SN.ID.wifiIPv6GatewayAddress = MODULE_WIFIIP + 7;
SN.ID.wifiStaMacAddr = MODULE_WIFIIP + 8;

//MODULE_UAP
SN.ID.wifiUapSSID = MODULE_UAP + 0;
SN.ID.wifiUapSSIDAll = MODULE_UAP + 1;
SN.ID.wifiUapWPAPassword = MODULE_UAP + 2;
SN.ID.wifiUapEnabled = MODULE_UAP + 3;
SN.ID.wifiUapSecMode = MODULE_UAP + 4;
SN.ID.wifiUapDHCPDAddress = MODULE_UAP + 5;
SN.ID.wifiUapDHCPDSubnetAddress = MODULE_UAP + 6;
SN.ID.wifiUapMacAddr = MODULE_UAP + 7;
SN.ID.wifiUapDHCPEnabled = MODULE_UAP + 8;
SN.ID.wifiUapDHCPLeaseTime = MODULE_UAP + 9;
SN.ID.wifiUapDHCPStartAddr = MODULE_UAP + 10;
SN.ID.wifiUapDHCPEndAddr = MODULE_UAP + 11;
SN.ID.wifiSsidPrefix = MODULE_UAP + 12;

//MODULE_WPS
SN.ID.wifiWpsSecMode = MODULE_WPS + 0;
SN.ID.wifiWpsModePin = MODULE_WPS + 1;
SN.ID.wifiWpsSleepTime = MODULE_WPS + 2;

//MODULE_WFD
SN.ID.wifiWfdSupported = MODULE_WFD + 0;
SN.ID.wifiWfdMacAddr = MODULE_WFD + 1;
SN.ID.wifiWfdUapSSID = MODULE_WFD + 2;
SN.ID.wifiWfdPassword = MODULE_WFD + 3;
SN.ID.wifiWfdSsidPrefix = MODULE_WFD + 4;

//MODULE_GCP
SN.ID.omGCPEnable = MODULE_GCP + 0;
SN.ID.omGCPRegister = MODULE_GCP + 1;
SN.ID.omProxyEnable = MODULE_GCP + 2;
SN.ID.omProxyServer = MODULE_GCP + 3;
SN.ID.omProxyPort = MODULE_GCP + 4;
SN.ID.omProxyAuthEnable = MODULE_GCP + 5;
SN.ID.omProxyName = MODULE_GCP + 6;
SN.ID.omProxyPassword = MODULE_GCP + 7;
SN.ID.omClaimUrl = MODULE_GCP + 8;

//MODULE_Scan
SN.ID.omscanResolution = MODULE_SCAN + 0;
SN.ID.omscanColor = MODULE_SCAN + 1;
SN.ID.omscanFileFormat = MODULE_SCAN + 2;
SN.ID.omscanArea = MODULE_SCAN + 3;
SN.ID.omscanAutoDouble = MODULE_SCAN + 4;
SN.ID.omscanNup = MODULE_SCAN + 5;
SN.ID.omscanNetImgQuality = MODULE_SCAN + 6;
SN.ID.omScanToEmailSubject = MODULE_SCAN + 7;
SN.ID.omScanToEmailBody = MODULE_SCAN + 8;

//MODULE_SCANINFO
SN.ID.flatbedCopyNum = MODULE_SCANINFO + 0;
SN.ID.flatbedHostNum = MODULE_SCANINFO + 1;
SN.ID.ADFCopyNum = MODULE_SCANINFO + 2;
SN.ID.ADFHostNum = MODULE_SCANINFO + 3;

//MODULE_COPYINFO
SN.ID.copyTotalCnt = MODULE_COPYINFO + 0;
SN.ID.copyCntA5 = MODULE_COPYINFO + 1;
SN.ID.copyCntA4 = MODULE_COPYINFO + 2;
SN.ID.copyCntLegal = MODULE_COPYINFO + 3;
SN.ID.copyCntB5 = MODULE_COPYINFO + 4;
SN.ID.copyCntA6 = MODULE_COPYINFO + 5;
SN.ID.copyCntOther = MODULE_COPYINFO + 6;

//MODULE_PRINTINFO
SN.ID.printTotalCnt = MODULE_PRINTINFO + 0;
SN.ID.printAutoDuplex = MODULE_PRINTINFO + 1;
SN.ID.printCntA5 = MODULE_PRINTINFO + 2;
SN.ID.printCntA4 = MODULE_PRINTINFO + 3;
SN.ID.printCntLegal = MODULE_PRINTINFO + 4;
SN.ID.printCntB5 = MODULE_PRINTINFO + 5;
SN.ID.printCntB6 = MODULE_PRINTINFO + 6;
SN.ID.printCntOther = MODULE_PRINTINFO + 7;

//MODULE_DEVICE
SN.ID.TotalPageCnt = MODULE_DEVICE + 0;
SN.ID.CartridgeType = MODULE_DEVICE + 1;
SN.ID.TonerRemain = MODULE_DEVICE + 2;
SN.ID.printedPages = MODULE_DEVICE + 3;
SN.ID.aveCoverage = MODULE_DEVICE + 4;
SN.ID.expectedPrintNum = MODULE_DEVICE + 5;
SN.ID.drumType = MODULE_DEVICE + 6;
SN.ID.drumRemain = MODULE_DEVICE + 7;
SN.ID.drumPrintedNum = MODULE_DEVICE + 8;

//MODULE_POWER_RESTART
SN.ID.omPowerOnRestart = MODULE_POWER_RESTART + 0;
SN.ID.omPowerOnCount = MODULE_POWER_RESTART + 1;

//MODULE_SECURITY
SN.ID.omAddFtpSMBEmailEnabled = MODULE_SECURITY + 0;
SN.ID.omHideDeleteAllAddrEnabled = MODULE_SECURITY + 1;
SN.ID.omUsbDriveEnabled = MODULE_SECURITY + 2;
SN.ID.omUsbEnabled = MODULE_SECURITY + 3;
SN.ID.omMemoryResetEnabled = MODULE_SECURITY + 4;

//MODULE_HTTPS
SN.ID.omHttpsManager = MODULE_HTTPS + 0;
SN.ID.omIppManager = MODULE_HTTPS + 1;

//MODULE_CONSUMABLES
SN.ID.omTownerLowSetting = MODULE_CONSUMABLES + 0;
//MODULE_NETCONTACT
SN.ID.omNetContactEnabled = MODULE_NETCONTACT + 0;
SN.ID.omNetContactLdapAddr = MODULE_NETCONTACT + 1;
SN.ID.omNetContactPort = MODULE_NETCONTACT + 2;
SN.ID.omNetContactSecurity = MODULE_NETCONTACT + 3;
SN.ID.omNetContactAuthMode = MODULE_NETCONTACT + 4;
SN.ID.omNetContactDomain = MODULE_NETCONTACT + 5;
SN.ID.omNetContactUser = MODULE_NETCONTACT + 6;
SN.ID.omNetContactPswd = MODULE_NETCONTACT + 7;
SN.ID.omNetContactSearchroot = MODULE_NETCONTACT + 8;
SN.ID.omNetContactRecipientName = MODULE_NETCONTACT + 9;
SN.ID.omNetContactRecipientEmail = MODULE_NETCONTACT + 10;
SN.ID.omNetContactMaxEmailNum = MODULE_NETCONTACT + 11;
SN.ID.omNetContactTimeOut = MODULE_NETCONTACT + 12;
SN.ID.omNetContactSearchTest = MODULE_NETCONTACT + 13;
SN.ID.omNetContactTest = MODULE_NETCONTACT + 14;
SN.ID.omNetContactFullName = MODULE_NETCONTACT + 15;
//MODULE_PRINTSET
SN.ID.omSkipBlankEnabled = MODULE_PRINTSET + 0;
SN.ID.omA4ToA5Mode = MODULE_PRINTSET + 1;

//MODULE_TRAY_SET
SN.ID.omMultippsTraypsize = MODULE_TRAY_SET + 0;
SN.ID.omMultippsTrayptype = MODULE_TRAY_SET + 1;
SN.ID.omAutoInpTraypsize = MODULE_TRAY_SET + 2;
SN.ID.omAutoInpTrayptype = MODULE_TRAY_SET + 3;
SN.ID.omOptionalTray1psize = MODULE_TRAY_SET + 4;
SN.ID.omOptionalTray1ptype = MODULE_TRAY_SET + 5;
SN.ID.omOptiona2Tray1psize = MODULE_TRAY_SET + 6;
SN.ID.omOptiona2Tray1ptype = MODULE_TRAY_SET + 7;
SN.ID.omInputTrayNum = MODULE_TRAY_SET + 8;
SN.ID.omPrintTaryMediaPrompt = MODULE_TRAY_SET + 9;

//MODULE_NETPORT_MAN
SN.ID.omWebForceEnabled = MODULE_NETPORT_MAN + 0;
SN.ID.omNetPortName     = MODULE_NETPORT_MAN + 1;
SN.ID.omNetPortProtocol = MODULE_NETPORT_MAN + 2;
SN.ID.omNetPortNo       = MODULE_NETPORT_MAN + 3;
SN.ID.omNetPortEnabled  = MODULE_NETPORT_MAN + 4;

//新增网络白名单
SN.ID.omWhiteListEnable = MODULE_NET_ALLOW_LIST;
SN.ID.omWhiteListIP = MODULE_NET_ALLOW_LIST + 1;
SN.ID.omWhiteListMAC = MODULE_NET_ALLOW_LIST + 2;


//MODULE_SCANTO_MAN
SN.ID.omScanToPCEnabled     = MODULE_SCANTO_MAN + 0;
SN.ID.omScanToEmailEnabled  = MODULE_SCANTO_MAN + 1;
SN.ID.omScanToSmbEnabled    = MODULE_SCANTO_MAN + 2;
SN.ID.omScanToFlashEnabled  = MODULE_SCANTO_MAN + 3;
SN.ID.omScanToFtpEnabled    = MODULE_SCANTO_MAN + 4;
SN.ID.omScanShortCutEnabled = MODULE_SCANTO_MAN + 5;

//新增IPFilter
SN.ID.omIPFilterListEnable = MODULE_IPFilter_LIST;
SN.ID.omIPFilterListRule = MODULE_IPFilter_LIST + 1;
SN.ID.omIPFilterListIP    = MODULE_IPFilter_LIST + 2;
SN.ID.omIPFilterListMASK  = MODULE_IPFilter_LIST + 3;


//选项列表
SN.DATA.PclVMarginList = [
    ["0", 0],
    ["0.33", 2400],
    ["0.5", 3600],
    ["1", 7200],
    ["1.5", 10800],
    ["2", 14400]
];
SN.DATA.PclFontSymbol = [   //字体与字符集默认值
    [-1, 629],
    [80, 264], [81, 264],
    [82, 269], [83, 269], [84, 269],
    [85, 269], [86, 269], [87, 269],
    [88, 269], [89, 269], [90, 269],
    [91, 342], [92, 342],
    [43, 621], [57, 621],
    [44, 18540]
];
SN.DATA.PclUserFontNum = [
    ["Albertus ExtraBold", 31],
    ["Albertus Medium", 30],
    ["Antique Olive", 12],
    ["Antique Olive Bold", 14],
    ["Antique Olive Italic", 13],
    ["Arial", 35],
    ["Arial Bold", 37],
    ["Arial Bold Italic", 38],
    ["Arial Italic", 36],
    ["ITC Bookman Light Italic", 63],
    ["ITC Bookman Light", 62],
    ["ITC Bookman Demi", 64],
    ["ITC Bookman Demi Italic", 65],
    ["CG Omega", 15],
    ["CG Omega Bold", 17],
    ["CG Omega Bold Italic", 18],
    ["CG Omega Italic", 16],
    ["CG Times", 0],
    ["CG Times Bold", 2],
    ["CG Times Bold Italic", 3],
    ["CG Times Italic", 1],
    ["Clarendon Condensed", 32],
    ["Coronet", 33],
    ["Courier", 23],
    ["Courier Bold", 25],
    ["Courier Bold Italic", 26],
    ["Courier Italic", 24],
    ["Courier PS", 53],
    ["Courier PS Bold", 55],
    ["Courier PS Bold Oblique", 56],
    ["Courier PS Oblique", 54],
    ["Garamond Antiqua", 19],
    ["Garamond Halbfett", 21],
    ["Garamond Kursiv", 20],
    ["Garamond Kursiv Halbfett", 22],
    ["Helvetica", 49],
    ["Helvetica Bold", 51],
    ["Helvetica Bold Oblique", 52],
    ["Helvetica Narrow", 66],
    ["Helvetica Narrow Bold", 68],
    ["Helvetica Narrow Bold Oblique", 69],
    ["Helvetica Narrow Oblique", 67],
    ["Helvetica Oblique", 50],
    ["HP David", 80],
    ["HP David  Bold", 81],
    ["HP Miryam", 82],
    ["HP Miryam Bold", 84],
    ["HP Miryam Italic", 83],
    ["HP Narkis Tam", 85],
    ["HP Narkis Tam Bold", 86],
    ["ITC Avant Garde Gothic Book", 74],
    ["ITC Avant Garde Gothic Book Oblique", 75],
    ["ITC Avant Garde Gothic Demi", 76],
    ["ITC Avant Garde Gothic Demi Oblique", 77],
    ["ITC Zapf Chancery Medium Italic", 78],
    ["ITC Zapf Dingbats", 79],
    ["Koufi", 89],
    ["Koufi Bold", 90],
    ["Letter Gothic", 27],
    ["Letter Gothic Bold", 29],
    ["Letter Gothic Italic", 28],
    ["Marigold", 34],
    ["Naskh", 87],
    ["Naskh  Bold", 88],
    ["New Century Schoolbook Bold", 72],
    ["New Century Schoolbook Bold Italic", 73],
    ["New Century Schoolbook Italic", 71],
    ["New Century Schoolbook Roman", 70],
    ["Palatino Bold", 60],
    ["Palatino Bold Italic", 61],
    ["Palatino Italic", 59],
    ["Palatino Roman", 58],
    ["Ryadh", 91],
    ["Ryadh Bold", 92],
    ["Symbol PS", 57],
    ["Symbol TT", 43],
    ["Times Bold", 47],
    ["Times Bold Italic", 48],
    ["Times Italic", 46],
    ["Times New Roman", 39],
    ["Times New Roman Bold", 41],
    ["Times New Roman Bold Italic", 42],
    ["Times New Roman Italic", 40],
    ["Times Roman", 45],
    ["Univers Bold", 6],
    ["Univers Bold Italic", 7],
    ["Univers Condensed", 8],
    ["Univers Condensed Bold", 10],
    ["Univers Condensed Bold Italic", 11],
    ["Univers Condensed Italic", 9],
    ["Univers Medium", 4],
    ["Univers Medium Italic", 5],
    ["Wingdings", 44]
];
SN.DATA.PclUserSymbolset = [
    ["Code Page 864 Latin/Arabic ", 342],
    ["DeskTop ", 234],
    ["Greek-8 ", 263],
    ["Hebrew-7 ", 8],
    ["Hebrew-8 ", 264],
    ["HP German ", 7],
    ["HPL ", 181],
    ["ISO 2: Int'l Reference Version ", 85],
    ["ISO 4: United Kingdom ", 37],
    ["ISO 6: ASCII ", 21],
    ["ISO 11: Swedish ", 19],
    ["ISO 15: Italian ", 9],
    ["ISO 17: Spanish ", 83],
    ["ISO 21: German ", 39],
    ["ISO 60: Danish/Norwegian ", 4],
    ["ISO 69: French ", 38],
    ["ISO 8859/1 Latin 1 ", 14],
    ["ISO 8859/2 Latin 2 ", 78],
    ["ISO 8859/4 Latin 4 ", 142],
    ["ISO 8859/5 Latn/Cyrillic ", 334],
    ["ISO 8859/6 Latin/Arabic ", 366],
    ["ISO 8859/7 Latin/Greek ", 398],
    ["ISO 8859/8 Latin/Hebrew ", 232],
    ["ISO 8859/9 Latin 5 ", 174],
    ["Legal ", 53],
    ["Math-8 ", 269],
    ["MC Text ", 394],
    ["Microsoft Publishing ", 202],
    ["OEM-1 ", 245],
    ["PC Cyrillic ", 114],
    ["PC-1004 ", 298],
    ["PC-8 Code Page 437 ", 341],
    ["PC-8 D/N - Danish/Norwegian ", 373],
    ["PC-8 Latin/Greek ", 391],
    ["PC-8 T Turkish ", 308],
    ["PC-850 - Multilingual ", 405],
    ["PC-851 Latin/Greek ", 327],
    ["PC-852 Latin 2 ", 565],
    ["PC-862 Latin/Hebrew ", 488],
    ["Pi Font ", 501],
    ["PS Math ", 173],
    ["PS Text ", 330],
    ["Roman-8 ", 277],
    ["Symbol ", 621],
    ["Ventura ITC Zapf Dingbats ", 300],
    ["Windows 3.0 Latin 1 ", 309],
    ["Windows 3.1 Latin 1 ", 629],
    ["Windows 3.1 Latin 2 ", 293],
    ["Windows 3.1 Latin 5 ", 180],
    ["Windows 3.1 Latin/Cyrillic ", 306],
    ["Windows 3.1 Latin/Greek ", 295],
    ["Wingdings ", 18540]
];
SN.DATA.Userresoultion = [
    [600, 1],
    [1200, 2]
];
SN.DATA.LanguageList = [
    [" English ", "en"],
    [" 简体中文 ", "zh"],
    [" 繁體中文 ", "tw"],
    [" Русский ", "ru"],
    [" Italiano ", "it"],
    [" Español ", "es"],
    [" Français ", "fr"],
    [" Deutsch ", "de"],
    [" Türkçe ", "tr"],
    [" Polski ", "pl"],
    [" עברית ", "he"],
    ["한국어","ko"],
    ["Română ","ro"],
    ["Български","bg"],
    [" العربية ", "ar"],
    [" Português ", "pt"],
    [" ไทย ", "th"],
    [" Čeština ", "cs"],
    [" Ελληνικά ", "el"],
    [" Magyar ", "hu"],
    [" Tiếng Việt ", "vi"],
    [" Azərbaycan ", "az"],//阿塞拜疆语
    [" Қазақстан ", "kk"]//哈萨克语

];

SN.DATA.LanguageList_21 = [
    [" English ", "en"],
    [" 简体中文 ", "zh"],
    [" 繁體中文 ", "tw"],
    [" Русский ", "ru"],
    [" Italiano ", "it"],
    [" Español ", "es"],
    [" Français ", "fr"],
    [" Deutsch ", "de"],
    [" Türkçe ", "tr"],
    [" Polski ", "pl"],
    [" תירבע ", "he"],
    ["한국어","ko"],
    ["Română ","ro"],
    ["Български","bg"],
    [" العربية ", "ar"],
    [" Português ", "pt"],
    [" ไทย ", "th"],
    [" Čeština ", "cs"],
    [" Ελληνικά ", "el"],
    [" Magyar ", "hu"],
    [" Tiếng Việt ", "vi"]
];

SN.INFO.TipsNewLine = '';//'-';//
SN.INFO.TipsEnter = '';//'\n'//

SN.INFO.BR = '<br/>';

//在om信息表中查找对应info
SN.INFO.AllomInfoTable = [];
SN.FUNC.GetInfoById = function(id)
{
    var table = SN.INFO.AllomInfoTable;
    var info = SN.INFO.ErrUndefined;

    for (var i = 0; i < table.length; i++) {
        if (table[i][0] == id) {
            info = table[i][1];
            break;
        }
    }

    return info;
};

//根据模块和索引创建属性对象
//value: OM属性值
//name: OM名字
//type: OM类型
//module: 模块ID
//index: 初始化信息在对应table中下标
function OM(value, name, type, module, index)
{
    if (name) {
        this.id = module + index;   //与SN.ID.XXX相等
        this.name = name;
        this.info = SN.FUNC.GetInfoById(this.id);
        this.type = type;
    } else {
        this.id = MODULE_ERROR;
        this.name = SN.INFO.ErrUndefined;
        this.info = SN.INFO.ErrUndefined;
        this.type = SN.TYPE.OMType;
    }

    this.value = DecodeBase64(value);
}

//检测机型(id为undefined)或者是否为传入产品ID
//type：1(SFP GDI)，2(SFP IPS)，3(MFP 3in1)，4(MFP 4in1)，
//      5(GDI机型)，6(PDL机型), 7(SN5103 FlagShip), 10(触摸屏), 11(无阿塞拜疆和哈萨克语)
//id: 产品ID
//============COSTDOWN GDI===========
var PID_TYPE_P3012NET          = 0x1830
//============COSTDOWN IPS===========
var PID_TYPE_P3100DL_P3255DN   = 0x6830
//=============SN5103 GDI============
var PID_TYPE_P3010D      = 0x0EC4
var PID_TYPE_P3010DW	 = 0x0EC5
var PID_TYPE_P3060DW	 = 0x0EC6
//=============SN5103 IPS============
var PID_TYPE_P3300       = 0x0EC7
var PID_TYPE_P3300DN 	 = 0x0EC8
var PID_TYPE_P3300DW	 = 0x0EC9
//==========SN5103 3in1 GDI==========
var PID_TYPE_M6700D      = 0x0ECA
var PID_TYPE_M6700DN     = 0x0EE1
var PID_TYPE_M6700DW	 = 0x0ECB
var PID_TYPE_M6760D      = 0x0F02
var PID_TYPE_M6760DW	 = 0x0ECC
//==========SN5103 3in1 PDL==========
var PID_TYPE_M7100D      = 0x0EE2
var PID_TYPE_M7100DN	 = 0x0ECF
var PID_TYPE_M7100DW	 = 0x0ED0
var PID_TYPE_M7160DW     = 0x0F03
//==========SN5103 4in1 GDI===========
var PID_TYPE_M6800FDW	 = 0x0ECD
var PID_TYPE_M6860FDW	 = 0x0ECE
//==========SN5103 4in1 PDL==========
var PID_TYPE_M7200FD	 = 0x0ED1
var PID_TYPE_M7200FDN	 = 0x0ED2
var PID_TYPE_M7200FDW	 = 0x0ED3
//==========SN5103 FlagShip==========
var PID_TYPE_M7300FDN	 = 0x0ED4
var PID_TYPE_M7300FDW	 = 0x0ED5
//==========SN3320 SFP===============
var PID_TYPE_BP4000DN    = 0x2704
var PID_TYPE_BP4000DW	 = 0x2705
var PID_TYPE_BP4005DN	 = 0x2706
//==========SN3320 3in1===============
var PID_TYPE_BP4000ADN	 = 0x2733
var PID_TYPE_BP4000ADW	 = 0x2734
var PID_TYPE_BP4005ADN	 = 0x2735
//==========SN3320 4in1===============
var PID_TYPE_BP4000FDN	 = 0xFF39
var PID_TYPE_BP4000FDW	 = 0xFF3A
var PID_TYPE_BP4005FDN	 = 0xFF3B
var PID_TYPE_BP4100FDW	 = 0xFF3C
var PID_TYPE_BP4100FDN	 = 0xFF3D
//==========SN4020 sfp===============
var PID_TYPE_BP5100DN	 = 0x2700
var PID_TYPE_BP5105DN	 = 0x2701
var PID_TYPE_BP5101DN	 = 0x2702
var PID_TYPE_BP5102DN	 = 0x270B
var PID_TYPE_BP5128DN	 = 0x270C
var PID_TYPE_BP5106DN    = 0x270D
var PID_TYPE_BP5106DW    = 0x270E
var PID_TYPE_BP5100DNW	 = 0x2703
//==========SN4020 3in1===============
var PID_TYPE_BP5100ADN	 = 0x2730
var PID_TYPE_BP5105ADN	 = 0x2731
var PID_TYPE_BP5102ADN	 = 0X273C
var PID_TYPE_BP5100ADNW	 = 0x2732
var PID_TYPE_BM5110ADN   = 0x2714
var PID_TYPE_BM5110ADW   = 0x2715
//==========SN4020 4in1===============
var PID_TYPE_BP5100FDN	 = 0x2740
var PID_TYPE_BP5105FDN	 = 0x2741
var PID_TYPE_BP5100FDNW  = 0x2742
// SN4020 RLP SKD
var PID_TYPE_BM5106ADN   = 0x270F
var PID_TYPE_BM5106ADW   = 0x2710
var PID_TYPE_BM5106FDN   = 0x2711
var PID_TYPE_BM5106FDW   = 0x2712

// LP_2142项目
var PID_TYPE_BP5200DN    = 0x2723
var PID_TYPE_BP5200DW    = 0x2724
var PID_TYPE_BM5200ADN   = 0x2725
var PID_TYPE_BM5200ADW   = 0x2726
var PID_TYPE_BP5275DN	 = 0x2755
var PID_TYPE_BM5275ADN	 = 0x2756
var PID_TYPE_BP5208DN	 = 0x272F
var PID_TYPE_BP5208DW	 = 0x2750
var PID_TYPE_BM5208ADN	 = 0x2751
var PID_TYPE_BM5208ADW	 = 0x2752

// LP_2142(2)
var PID_TYPE_BM5220ADN    = 0x2758
var PID_TYPE_BM5220ADW    = 0x2759
var PID_TYPE_BM5225ADN    = 0x275A
var PID_TYPE_BM5225ADW    = 0x275B
var PID_TYPE_BM5210ADN    = 0x275C
var PID_TYPE_BM5210ADW    = 0x275D
var PID_TYPE_BM5285ADN    = 0x275E
var PID_TYPE_BM5218ADN    = 0x2764
var PID_TYPE_BM5218ADW    = 0x2765

// LP_2142(3)
var PID_TYPE_BM5300ADN    = 0x275F
var PID_TYPE_BM5300ADW    = 0x2761

// LP-2142V1R1(1)    42PPM, 512M and 4GB
var PID_TYPE_BM5201ADN   = 0x2762	// BM5200-Series
var PID_TYPE_BM5201ADW   = 0x2763	// BM5200-Series
var PID_TYPE_BM5205ADN	 = 0x2729
var PID_TYPE_BM5205ADW	 = 0x2757

function CheckProductID(type, id)
{
    var ret = false;
    var checkid = parseInt(SN.DATA.omProductID.value);

    switch (checkid) {
        case PID_TYPE_P3010D:
        case PID_TYPE_P3010DW:
        case PID_TYPE_P3060DW:
            ret = (1 == type || 5 == type) ? true : false;
            break;
        case PID_TYPE_P3300:
        case PID_TYPE_P3300DN:
        case PID_TYPE_P3300DW:
        case PID_TYPE_BP4000DN:
        case PID_TYPE_BP4000DW:
        case PID_TYPE_BP4005DN:
        case PID_TYPE_BP5105DN:
        case PID_TYPE_BP5101DN:
        case PID_TYPE_BP5102DN:
        case PID_TYPE_BP5128DN:
            ret = (2 == type || 6 == type) ? true : false;
            break;
        case PID_TYPE_BP5200DN:
        case PID_TYPE_BP5200DW:
        case PID_TYPE_BP5275DN:
		case PID_TYPE_BP5208DN:
		case PID_TYPE_BP5208DW:
            ret = (2 == type || 6 == type || 11 == type) ? true : false;
            break;
        case PID_TYPE_M6700D:
        case PID_TYPE_M6700DN:
        case PID_TYPE_M6700DW:
        case PID_TYPE_M6760D:
        case PID_TYPE_M6760DW:
            ret = (3 == type || 5 == type) ? true : false;
            break;
        case PID_TYPE_M7100D:
        case PID_TYPE_M7100DN:
        case PID_TYPE_M7100DW:
        case PID_TYPE_M7160DW:
        case PID_TYPE_BP4000ADN:
        case PID_TYPE_BP4000ADW:
        case PID_TYPE_BP4005ADN:
            ret = (3 == type || 6 == type) ? true : false;
            break;
        case PID_TYPE_M6800FDW:
        case PID_TYPE_M6860FDW:
            ret = (4 == type || 5 == type) ? true : false;
            break;
        case PID_TYPE_M7200FD:
        case PID_TYPE_M7200FDN:
        case PID_TYPE_M7200FDW:
        case PID_TYPE_BP4000FDN:
        case PID_TYPE_BP4000FDW:
        case PID_TYPE_BP4005FDN:
        case PID_TYPE_BP4100FDW:
        case PID_TYPE_BP4100FDN:
            ret = (4 == type || 6 == type) ? true : false;
            break;
        case PID_TYPE_M7300FDN:
        case PID_TYPE_M7300FDW:
            ret = (7 == type || 6 == type) ? true : false;
            break;
        case PID_TYPE_BP5100DN:
        case PID_TYPE_BP5100DNW:
            ret = (2 == type || 6 == type) ? true : false;
            break;
        case PID_TYPE_BP5100ADN:
        case PID_TYPE_BP5100ADNW:
        case PID_TYPE_BP5105ADN:
        case PID_TYPE_BP5102ADN:
            ret = (3 == type || 6 == type || 8 == type) ? true : false;
            break;
        case PID_TYPE_BM5110ADN:
        case PID_TYPE_BM5110ADW:
            ret = (3 == type || 6 == type || 8 == type|| 10 == type) ? true : false;
            break;
        case PID_TYPE_BP5100FDN:
        case PID_TYPE_BP5100FDNW:
        case PID_TYPE_BP5105FDN:
            ret = (4 == type || 6 == type || 8 == type|| 10 == type) ? true : false;
            break;
        case PID_TYPE_BM5106ADN:
        case PID_TYPE_BM5106ADW:
        case PID_TYPE_BM5106FDN:
        case PID_TYPE_BM5106FDW:
            ret = (8 == type) ? true : false;
            break;
        case PID_TYPE_BM5200ADN:
        case PID_TYPE_BM5200ADW:
        case PID_TYPE_BM5275ADN:
		case PID_TYPE_BM5208ADN:
        case PID_TYPE_BM5208ADW:
		case PID_TYPE_BM5220ADN:
		case PID_TYPE_BM5220ADW:
		case PID_TYPE_BM5225ADN:
		case PID_TYPE_BM5225ADW:
		case PID_TYPE_BM5210ADN:
		case PID_TYPE_BM5210ADW:
		case PID_TYPE_BM5285ADN:
		case PID_TYPE_BM5300ADN:
		case PID_TYPE_BM5300ADW:
		case PID_TYPE_BM5218ADN:
		case PID_TYPE_BM5218ADW:
		case PID_TYPE_BM5201ADN:	// BM5200-Series
		case PID_TYPE_BM5201ADW:	// BM5200-Series
		case PID_TYPE_BM5205ADN:
		case PID_TYPE_BM5201ADW:
            ret = (3 == type || 6 == type || 8 == type || 10 == type || 11 == type) ? true : false;
            break;
        default:
            break;
    }

    return (undefined == id) ? ret : (checkid == id);
}

function isNeedAppendMinus()
{
    let ret = false;
    let checkid = parseInt(SN.DATA.omProductID.value);

    switch (checkid) {
        case PID_TYPE_BM5201ADN:
        case PID_TYPE_BM5201ADW:
            ret = true;
            break;
    }

    return ret;
}

