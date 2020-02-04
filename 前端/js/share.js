var share =new Vue({
    el:"#share",//VUE要响应的环境，环境为html中的对应的ID，环境指该ID标签【子内容】全部都能使用本环境下的数据和事件
    data:{
        request_adress:window.adress,
        text:"",
        filename:"",
        id:-1,
        video:false,
        online:false,
    },//环境里面的数据，可以在html页面访问，使用方法是{{变量名}}或直接写变量名，具体查找Vue官方手册
    mounted:function(){
        var url = location.search; //这一条语句获取了包括问号开始到参数的最后，不包括前面的路径
        var params = url.substr(1);//去掉问号
        var pa = params.split("&");
        var s = new Object();
        for(var i = 0; i < pa.length; i ++){
            s[pa[i].split("=")[0]] = unescape(pa[i].split("=")[1]);
        }
        this.id=parseInt(s.id);
        $.ajax({
            type: "POST",
            url: this.request_adress+"get_share_name",
            data: {
                id:this.id,
            },
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            dataType: "json",
            complete:function(data){
                if(data.responseText!="Flase"){
                    share.filename=data.responseText;
                    var name=share.filename;
                    let fileName = name.lastIndexOf(".");//取到文件名开始到最后一个点的长度
                    let fileNameLength = name.length;//取到文件名长度
                    let fileFormat = name.substring(fileName + 1, fileNameLength);//截
                    if(fileFormat=="mp4" ||fileFormat=='png' ||fileFormat== 'jpg' || fileFormat== 'gif' ||fileFormat==  'bmp' ||fileFormat==  'jpeg'){
                        share.fileFormat=fileFormat;
                        share.online=true;
                    }
                    console.log(fileFormat);
                    console.log(data.responseText)
                }else{
                    alert("找不到文件了~！");
                }
            }
        });
    },
    methods:{
        download_share:function(){
            window.location.href=share.request_adress+"download_share?id="+share.id;
        },
        view_share:function(){
            if(share.fileFormat=='png' ||share.fileFormat== 'jpg' || share.fileFormat== 'gif' ||share.fileFormat==  'bmp' ||share.fileFormat==  'jpeg'){
                share.video=false;
                var img =document.getElementById("img");
                img.src=window.adress+"view_share?id="+share.id;
                console.log(window.adress+"view_share?id="+share.id)
                $('#show_img').modal('show');
                return;
            }
            if(share.fileFormat=='mp4'){
                var video_=document.getElementById("video_");
                share.video=true;
                video_.src=window.adress+"view_share?id="+share.id;
                console.log(window.adress+"view_share?id="+share.id)
                $('#show_img').modal('show');
                return;
            }
        },
        close:function(){
            var video_=document.getElementById("video_");
            video_.pause();
            $('#show_img').modal('hide');
        },
    },
}) //建立新的 Vue环境