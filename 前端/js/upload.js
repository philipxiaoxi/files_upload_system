var upload =new Vue({
    el:"#upload",//VUE要响应的环境，环境为html中的对应的ID，环境指该ID标签【子内容】全部都能使用本环境下的数据和事件
    data:{
        request_adress:window.adress,
        text:""
    },//环境里面的数据，可以在html页面访问，使用方法是{{变量名}}或直接写变量名，具体查找Vue官方手册
    mounted:function(){
        $.ajax({
            type: "POST",
            url:this.request_adress,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            complete:function(data){
                console.log(data.responseText)
                if(data.responseText=="未登录！"){
                    window.location.href="login.html"//跳转到upload网页
                }
            }
        });
    },
    methods:{
       upload:function(){
        console.log(this.$refs.file.files[0])
        var file_ =this.$refs.file.files[0]
        console.log(file_)
        var formData = new FormData();
        formData.append("userfile",file_);
        $.ajax({
            type: "POST",
            url: upload.request_adress+"upload",
            data: formData,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            processData: false,                // jQuery不要去处理发送的数据
            contentType: false,                // jQuery不要去设置Content-Type请求头
            complete:function(data){
                console.log(data.responseText)
                if(data.responseText=="False"){
                    upload.text="上传失败！"
                    $('#tips').modal('show');
                    return;
                }else{
                    upload.text="上传成功！"
                    $('#tips').modal('show');
                    return;
                }
            }
        });
       }
    },
}) //建立新的 Vue环境