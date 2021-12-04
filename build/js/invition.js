$(function(){
    var popup = new Popup(),copyurl = 'http://www.baidu.com';
    var shareConfig = {
        title: '测试标题',
        summary: '描述',
        desc:'描述',
        pic: 'http://qzonestyle.gtimg.cn/aoi/sola/20150617094556_OvfOpoRKRB.png',
        url: 'http://192.168.1.2:3000/html/invition.html',
        link: 'https://github.com/fa-ge/NativeShare',
        icon: 'https://pic3.zhimg.com/v2-080267af84aa0e97c66d5f12e311c3d6_xl.jpg'
    }
    $('#apply').click(function(){
        $('#mask').fadeIn();
    })

    $('.apply-close').click(function(){
        $('#mask').fadeOut();
    })

    $("#invite-btn").on("click",function(){
        copyTextToClipboard(copyurl);
    })

    $("#QQ").on("click",function(){
        if(isPc()){
            var param = jQuery.param(shareConfig),
                url = 'http://connect.qq.com/widget/shareqq/index.html?'+param;
            window.open(url);
        }else{
            var nativeShare = new NativeShare();
            nativeShare.setShareData(shareConfig);
            nativeShare.call('qqFriend');
        }
    });

    $("#weixin1").on("click",function(){
        copyTextToClipboard(copyurl,true);
        window.location.href='weixin://';
    });

    $("#weixin2").on("click",function(){
        var mshare = new mShare(shareConfig);
        // 1 ==> 朋友圈  2 ==> 朋友  0 ==> 直接弹出原生  
        mshare.init(2);
    });

    $("#weixin3").on("click",function(){
        $("#weixinQrcode").attr("src","http://qr.liantu.com/api.php?text="+copyurl).show();
    });

    function copyTextToClipboard(text,locationFlag) {
        var textArea = document.createElement("textarea")
    
        textArea.style.position = 'fixed';
        textArea.style.top = 0;
        textArea.style.left = 0;
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = 0;
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        textArea.value = text;
    
        document.body.appendChild(textArea);
    
        textArea.select();
    
        try {
            if(document.execCommand('copy')){
                if(!locationFlag){
                    popup.alert("成功消息","复制成功！");
                }
            }else{
                popup.alert("失败消息","您的浏览器不支持自动复制，你可以手动复制链接:"+text);
            };
        } catch (err) {
            popup.alert("失败消息","您的浏览器不支持自动复制，你可以手动复制链接:"+text);
        }
    
        document.body.removeChild(textArea);
    }

    function isPc() {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";

        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            return false;
        } else {
            return true;
        }
    }
})