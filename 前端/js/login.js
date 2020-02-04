var login =new Vue({
    el:"#login",//VUE要响应的环境，环境为html中的对应的ID，环境指该ID标签【子内容】全部都能使用本环境下的数据和事件
    data:{
        request_adress:window.adress,
        inputtext:{"email":"","password":""},//定义了一个对象，对象有两个属性，分别是email password
        text:"",
    },//环境里面的数据，可以在html页面访问，使用方法是{{变量名}}或直接写变量名，具体查找Vue官方手册
    mounted:function(){

        $.ajax({
            type: "POST",
            url: this.request_adress+"",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            complete:function(data){
                console.log(data.responseText)
                if(data.responseText!="未登录！"){
                    window.location.href="upload.html"//跳转到upload网页
                }
            }
        });
    },
    methods:{
        submit:function(){//名为submit的方法
            console.log(login.inputtext);
            if(login.inputtext.email==""){
                login.text="账号尚未填写。"
                $('#tips').modal('show');
                return;
            }
            if(login.inputtext.password=="" ){
                login.text="密码尚未填写。"
                $('#tips').modal('show');
                return;
            }
            $.ajax({
                type: "POST",
                url: login.request_adress+"login",
                data: {
                    username:login.inputtext.email,
                    userpassword:login.inputtext.password
                },
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                dataType: "json",
                complete:function(data){
                    if(data.responseText=="success"){
                        window.location.href="home.html"//跳转
                        return;
                    }else{
                        login.text="账号或密码错误！"
                        $('#tips').modal('show');
                        return;
                    }
                }
            });
            // $.post(login.request_adress+"/login",
            
            // {
            //   username:login.inputtext.email,
            //   userpassword:login.inputtext.password
            // },
            // function(data){
            //     console.log(data);
            //   if(data=="success"){
            //     window.location.href="upload.html"//跳转到upload网页
            //     return;
            //   }else{
            //     login.text="账号或密码错误！"
            //     $('#tips').modal('show');
            //     return;
            //   }
              
            // });
            // if(login.inputtext.email!="1241060595" ||login.inputtext.password!="1241060595" ){
            //     login.text="账号或密码错误！"
            //     $('#tips').modal('show');
            //     return;
            // }
            // window.location.href="upload.html"//跳转到upload网页
        }
    },
}) //建立新的 Vue环境