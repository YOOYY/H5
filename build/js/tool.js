
function Popup () {
    /* 
        * alert 弹窗 title、text 必传
        */
    var that = this;
    this.alert = function (title,text) {
        var model = document.getElementById('model');
        if (model) {
            var content = document.getElementById('alertContent');
            content.innerText = text;
            model.style.display = 'block';
            return
        }
        var creatediv = document.createElement('div'); // 创建div
        creatediv.className = 'model';  // 添加class
        creatediv.setAttribute('id','model'); // 添加ID
        var contentHtml = '<div class="model_popup" style="">'
                +'<div class="popup-ts">'+title+'</div>'
                +'<div class="popup-text" id="alertContent">'+text+'</div>'
                +'<div class="popup-btn">'
                +'	<span class="sure alert_sure" id="sure-popup">确定</span>'
                // +'	<span class="cancel" id="cancel-popup">取消</span>'
                +'</div>'
            +'</div>'
        creatediv.innerHTML = contentHtml;
        document.body.appendChild(creatediv);
        document.getElementById('sure-popup').addEventListener('click',function(){
            that.sureAlert();
        })
    },

    this.loading = function (percent) {
        var model = document.getElementById('loadingModel');
        if (model) {
            var content = document.getElementById('loadingContent');
            content.innerText = '加载进度：' + percent + '%';
            model.style.display = 'block';
            return;
        }
        var creatediv = document.createElement('div'); // 创建div
        creatediv.className = 'model';  // 添加class
        creatediv.setAttribute('id','loadingModel'); // 添加ID
        var contentHtml = '<div class="model_popup" style="">'
                +'<div class="popup-ts">加载中</div>'
                +'<div class="popup-text" id="loadingContent">加载进度：' + percent + '%</div>'
            +'</div>'
        creatediv.innerHTML = contentHtml;
        document.body.appendChild(creatediv);
    },

    this.sureAlert = function () {
        var model = document.getElementById('model');
        model.style.display = 'none'
    },

    this.sureLoading = function () {
        var model = document.getElementById('loadingModel');
        model.style.display = 'none';
    }
}

function getDate(){
        var date = new Date();  
        var y = date.getFullYear();      
        var m = date.getMonth() + 1;      
        m = m < 10 ? ('0' + m) : m;      
        var d = date.getDate();      
        d = d < 10 ? ('0' + d) : d;         
        return y + '-' + m + '-' + d;
}