$(function () {
    var popup = new _Popup(),
        copyurl = '';
    $('#apply').click(function () {
        $('#mask').fadeIn();
    })

    $('.apply-close').click(function () {
        $('#mask').fadeOut();
    })
    //------------方法一，适用于网速慢的情况下，需要用户多一步点击------------
    // $("#invite-btn").on("click",function(){
    //     $.get(
    //         "/someUrl",
    //         function(result){
    //             if(result.code === 0){
    //                 copyurl = result.data;
    //                 popup.copy("成功消息","复制链接！",copyurl);
    //             }else{
    //                 popup.alert("失败消息","获取链接失败！");
    //             }
    //         }
    //     );
    // });
    //----------------------------------------------------------------------


    //----------------方法2，适用于服务器响应速度快的情况下-------------------
    $("#invite-btn").click(function () {
        popup.loading(50);
        setTimeout(() => {
            $.ajax({
                url: "/someUrl",
                type: "get",
                async: false,
                success: function (result) {
                    popup.sureLoading();
                    if (result.code === 0) {
                        popup.copyTextToClipboard(result.data);
                    } else {
                        popup.alert("失败消息", "获取链接失败！");
                    }
                },
                error: function (xhr, status, error) {
                    popup.sureLoading();
                    popup.alert("失败消息", "获取失败！");
                }
            });
        }, 100);
    })
    //----------------------------------------------------------------------
})