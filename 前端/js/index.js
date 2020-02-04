var index =new Vue({
    el:"#index",//VUE要响应的环境，环境为html中的对应的ID，环境指该ID标签【子内容】全部都能使用本环境下的数据和事件
    data:{
        text:""
    },//环境里面的数据，可以在html页面访问，使用方法是{{变量名}}或直接写变量名，具体查找Vue官方手册
    mounted:function(){

    },
    methods:{
        gotoUrl:function(url){
            if(url=="" || url == undefined){
                alert("暂未开通，敬请期待。")
                return;
            }
            window.location.href=url+".html";
        }
    },
}) //建立新的 Vue环境