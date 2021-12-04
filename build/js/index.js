$(function () {
    var popup = new Popup();

    document.addEventListener('touchstart', function (event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    })
    var lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        var now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false)

    //图片说明
    var bannerimgs = $("#banner .bannerbox .mask");
    var bannerlength = bannerimgs.length;
    $("#banner .bannerbox").width(100 * bannerlength + 8 * (bannerlength - 1));
    bannerimgs.click(function () {
        $('#imgMask img').attr('src', $(this).siblings('img').attr('src'));
        $('#imgMask').fadeIn();
        $('#imgMask').css('display', 'flex');
    })
    $('#imgMask').click(function () {
        $(this).fadeOut();
    })

    //表单验证
    $("#phone").blur(function () {
        phoneVerify();
    });

    $("#verifyCode").blur(function () {
        codeVerify();
    });

    //二维码
    var awaitTime = 59,
        timer = '';
    $('#getCode').click(function () {
        $.post(
            "http://47.111.69.211:8080/api/open/user/sendCaptcha", {
                phone: $('#phone').val()
            },
            function (result) {
                if (result.code === 0) {
                    $("#getCode").hide();
                    $("#awaitTime").show();
                    timer = setInterval(function () {
                        if (awaitTime <= 0) {
                            clearInterval(timer);
                            awaitTime = 59;
                            timer = '';
                            $("#getCode").show();
                            $("#awaitTime").hide();
                            $("#awaitTime").html('60s');
                            return;
                        }
                        $("#awaitTime").html(awaitTime + 's');
                        awaitTime = awaitTime - 1;
                    }, 1000)
                    popup.alert("成功消息", "验证码发送成功！");
                } else {
                    popup.alert("失败消息", result.data || '出错!');
                }
            });
    })

    //文件上传
    var uploadImgs = [],
        key = '';
    var observer = {
        next(response) {
            console.log(response);
            popup.loading(response.total.percent);
        },
        error(err) {
            console.log(err);
            popup.alert("失败消息", "上传图片失败！");
        },
        complete(res) {
            var domain = 'http://download.91wyd.com';
            var imgLink = qiniu.watermark({
                mode: 2, // 文字水印
                text: 'hello world !', // 水印文字，mode = 2 时 **必需**
                dissolve: 50, // 透明度，取值范围1-100，非必需，下同
                gravity: 'SouthWest', // 水印位置，同上
                fontsize: 500, // 字体大小，单位: 缇
                font: '黑体', // 水印文字字体
                dx: 100, // 横轴边距，单位:像素(px)
                dy: 100, // 纵轴边距，单位:像素(px)
                fill: '#FFF000' // 水印文字颜色，RGB格式，可以是颜色名称
            }, key, domain)

            $('<div class="bannerItem"><div class="mask">查看图片</div><img src="' + imgLink + '" alt=""></div>').insertBefore('#uploadImgButton').hide().fadeIn(2500);
            var imgs = $(".file-list .bannerItem");
            var length = imgs.length;
            $(".file-list").width(100 * length + 8 * (length - 1));
            uploadImgs.push(imgLink);
            popup.sureLoading();
        }
    }
    var token = '';

    //为上传图片绑定放大事件
    $(".file-list").on("click", ".mask", function () {
        $('#imgMask img').attr('src', $(this).siblings('img').attr('src'));
        $('#imgMask').fadeIn();
        $('#imgMask').css('display', 'flex');
    });

    $("#uploadImgButton").click(function () {
        $("#choose-file").click();
    })

    $("#choose-file").on('change', function (e) {
        var curFile = this.files[0];
        if (!curFile) {
            return false;
        }
        if (curFile && curFile.size > 5 * 1024 * 1024) {
            popup.alert("上传错误", "文件大小必须小于5M！")
            return false;
        }
        var config = {
            useCdnDomain: true,
            disableStatisticsReport: false,
            retryCount: 6
        };
        var putExtra = {
            fname: "",
            params: {},
            mimeType: ["image/png", "image/jpeg", "image/gif", "image/jpg"]
        };
        console.log(curFile);
        $.get(
            "http://47.111.69.211:8080/api/uptoken/default/get",
            function (result) {
                if (result.code === 0) {
                    token = result.data, key = getDate() + "/" + curFile.name;
                    var observable = qiniu.upload(curFile, key, token, putExtra, config);
                    var subscription = observable.subscribe(observer) // 上传开始
                } else {
                    popup.alert("失败消息", "获取token失败！")
                }
            }
        );
    })

    //点击上传按钮事件：
    $("#upload").on('click', function () {
        var phone = phoneVerify(),
            code = codeVerify(),
            taskid = '';
        if (!uploadImgs.length) {
            popup.alert('提交失败', '请上传图片！');
            return false;
        }
        if (phone && code) {
            console.log(taskid, phone, code, uploadImgs);
            $.ajax({
                type: "POST",
                url: "http://47.111.69.211:8080/task/submit",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({
                    taskid: taskid,
                    phone: phone,
                    code: code,
                    uploadImg: uploadImgs
                }),
                dataType: "json",
                success: function (result) {
                    if (result.code === 0) {
                        popup.alert("成功消息", "提交成功!");
                        window.location.href = '/';
                    } else {
                        popup.alert("失败消息", result.data || '提交失败!');
                    }
                },
                error: function (result) {
                    console.log(result);
                    popup.alert("失败消息", '提交失败!');
                }
            });
        };
        return false;
    })

    function phoneVerify() {
        //手机号正则
        var phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/,
            phone = $('#phone'),
            value = $.trim(phone.val());
        //电话
        if (!value) {
            phone.removeClass('success');
            phone.addClass('fail');
            phone.attr('placeholder', '手机号不能为空！');
            return false;
        }

        if (!phoneReg.test(value)) {
            phone.removeClass('success');
            phone.addClass('fail');
            return false;
        }

        phone.addClass('success');
        phone.removeClass('fail');
        return value;
    }

    function codeVerify() {
        var verifyCode = $('#verifyCode'),
            value = $.trim(verifyCode.val()),
            verifyCodeReg = /^\d{4}$/;
        if (value == '') {
            verifyCode.removeClass('success');
            verifyCode.addClass('fail');
            verifyCode.attr('placeholder', '验证码不能为空！');
            return false;
        }
        if (!verifyCodeReg.test(value)) {
            verifyCode.removeClass('success');
            verifyCode.addClass('fail');
            return false;
        }
        verifyCode.removeClass('fail');
        verifyCode.addClass('success');
        return value;
    }
})