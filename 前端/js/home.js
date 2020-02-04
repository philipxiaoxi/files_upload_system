

var index =new Vue({
    el:"#index",//VUE要响应的环境，环境为html中的对应的ID，环境指该ID标签【子内容】全部都能使用本环境下的数据和事件
    data:{
        request_adress:window.adress,
        List:[],
        dirList:["files"],
        progressRate:0,
        movetips:false,
        movename:"",
        movepath:"",
        modify_file_num:-1,
        modify_dir_num:-1,
        modify_name_temp:"",
        video:false,
    },//环境里面的数据，可以在html页面访问，使用方法是{{变量名}}或直接写变量名，具体查找Vue官方手册
    mounted:function(){
        $.ajax({
            type: "POST",
            url: this.request_adress,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            complete:function(data){
                console.log(data.responseText)
                if(data.responseText=="未登录！"){
                    window.location.href="login.html"//跳转到upload网页
                    return;
                }
            }
        });
        this.getList("");
    },
    methods:{
        create_share:function(num){
            var path="";
            for(var i=0;i<index.dirList.length;i++){
                path=path+index.dirList[i]+"/";
            }
            console.log(num)
            $.ajax({
                type: "POST",
                url: index.request_adress+"create_share",
                data: {
                    path:path+''+index.List[1][num],
                },
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                dataType: "json",
                complete:function(data){
                    if(data.responseText!="Flase"){
                        console.log("http://182.92.98.89:82/share.html?id="+data.responseText)
                        $('#location3').val("http://182.92.98.89:82/share.html?id="+data.responseText);
                        index.showmodel('downloadlink');
                    }else{
                        alert("创建分享链接失败！");
                    }
                }
            });
        },
        modify_name:function(which,num){
            if(which=='dir'){
                index.modify_name_temp=index.List[0][num];
                index.modify_dir_num=num;
                setTimeout(function(){
                    $("#modify_dir"+num).focus();
                },50)
            }else{
                index.modify_name_temp=index.List[1][num];
                index.modify_file_num=num;
                setTimeout(function(){
                    $("#modify_file"+num).focus();
                },50)
            }

            console.log(num)
        },
        go_modify_name:function(which,num){
            var path="";
            var new_path="";
            for(var i=0;i<index.dirList.length;i++){
                path=path+index.dirList[i]+"/";
            }
            new_path=path;
            path=path+index.modify_name_temp;
            if(which=='dir'){
                new_path=new_path+$('#modify_dir'+num).val();
            }else{
                new_path=new_path+$('#modify_file'+num).val();
            }
            index.modify_file_num=-1;
            index.modify_dir_num=-1;
            console.log(path);
            console.log(new_path);
            $.ajax({
                type: "POST",
                url: index.request_adress+"rename",
                data: {
                    path:path,
                    new_path:new_path
                },
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                dataType: "json",
                complete:function(data){
                    if(data.responseText!="Ture"){
                        alert("修改失败！")
                    }
                    index.refresh();
                }
            });
        },
        getList:function(dir_name){
            $.ajax({
                type: "POST",
                url: this.request_adress+"getList",
                data: {
                    dir_name:dir_name,
                },
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                dataType: "json",
                complete:function(data){
                    var List =JSON.parse(data.responseText)
                    if(List.length>0){
                        index.List=List;
                    }
                }
            });
        },
        
        goto:function(where,num){
            var path="";
            if(index.modify_dir_num>=0 || index.modify_file_num>=0){
                return;
            }
            if(where=='dir'){
                var num2 =index.List[0][num];
                index.dirList.push(num2);
                for(var i=0;i<index.dirList.length;i++){
                    path=path+index.dirList[i]+"/";
                }
                console.log(path);
                this.getList(path);
            }
            if(where=='bread'){
                if(index.dirList.length == num+1){
                    return;
                }
                for(var i=0;i<num+1;i++){
                    path=path+index.dirList[i]+"/";
                }
                end = index.dirList.length-num+1;
                index.dirList.splice(num+1,end);
                console.log(path);
                this.getList(path);
            }

        },
        close:function(){
            var video_=document.getElementById("video_");
            video_.pause();
            $('#show_img').modal('hide');
        },
        check:function(num){
            var name=index.List[1][num];
            let fileName = name.lastIndexOf(".");//取到文件名开始到最后一个点的长度
            let fileNameLength = name.length;//取到文件名长度
            let fileFormat = name.substring(fileName + 1, fileNameLength);//截
            console.log(fileFormat);
            var path="";
            for(var i=0;i<index.dirList.length;i++){
                path=path+index.dirList[i]+"/";
            }
            if(fileFormat=='png' ||fileFormat== 'jpg' || fileFormat== 'gif' ||fileFormat==  'bmp' ||fileFormat==  'jpeg'){
                index.video=false;
                var img =document.getElementById("img");
                var btn =document.getElementById("btn");
                img.src=window.adress+"pic_view?path="+path+''+index.List[1][num];
                btn.setAttribute('v-on:click','download('+num+')')
                index._path=path+''+index.List[1][num]
                console.log(window.adress+"pic_view?path="+path+''+index.List[1][num])
                this.showmodel('show_img');
                return;
            }
            if(fileFormat=='mp4'){
                var video_=document.getElementById("video_");
                var btn =document.getElementById("btn");
                btn.setAttribute('v-on:click','download('+num+')')
                index.video=true;
                video_.src=window.adress+"pic_view?path="+path+''+index.List[1][num];
                index._path=path+''+index.List[1][num]
                console.log(window.adress+"pic_view?path="+path+''+index.List[1][num])
                this.showmodel('show_img');
                return;
            }
            this.download(num);
        },
        download_:function(){
            window.location.href=index.request_adress+"getfile?file_name="+index._path;
            $('#show_img').modal('hide');
        },
        download:function(num){
            var path="";
            if(index.modify_dir_num>=0 || index.modify_file_num>=0){
                return;
            }
            for(var i=0;i<index.dirList.length;i++){
                path=path+index.dirList[i]+"/";
            }
            console.log(num)
            window.location.href=index.request_adress+"getfile?file_name="+path+''+index.List[1][num];
        },
        zip:function(num){
            var path="";
            for(var i=0;i<index.dirList.length;i++){
                path=path+index.dirList[i]+"/";
            }
            console.log(num);
            console.log(path+index.List[0][num]);
            console.log(path+index.List[0][num]+"[熙哥云压缩].zip")
            $.ajax({
                type: "POST",
                url: index.request_adress+"zip",
                data: {
                    dirpath:path+index.List[0][num],
                    outFullName:path+index.List[0][num]+"[熙哥云压缩].zip",
                },
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                dataType: "json",
                complete:function(data){
                    if(data.responseText=="Ture"){
                        alert("压缩申请已提交，请耐心等待。");
                    }else{
                        alert("压缩失败！");
                    }
                }
            });
        },
        unzip:function(num){
            var path="";
            for(var i=0;i<index.dirList.length;i++){
                path=path+index.dirList[i]+"/";
            }
            console.log(num)
            $.ajax({
                type: "POST",
                url: index.request_adress+"unzip",
                data: {
                    file_name:path+''+index.List[1][num],
                },
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                dataType: "json",
                complete:function(data){
                    if(data.responseText=="Ture"){
                        alert("解压申请已提交，请耐心等待。");
                    }else{
                        alert("解压失败！");
                    }
                }
            });
        },
        gotoUrl:function(url){
            if(url=="" || url == undefined){
                alert("暂未开通，敬请期待。")
                return;
            }
            window.location.href=url+".html";
        },
        showmodel:function(which){
            $('#'+which).modal('show');
        },
        upload:function(){
            console.log(this.$refs.file.files[0])
            var file_ =this.$refs.file.files[0]
            console.log(file_)
            var formData = new FormData();
            formData.append("userfile",file_);
            var path="";
            for(var i=0;i<index.dirList.length;i++){
                path=path+index.dirList[i]+"/";
            }
            formData.append("dir_name",path);
            $('#upload').modal('hide');
            $.ajax({
                type: "POST",
                url: index.request_adress+"upload",
                data: formData,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                processData: false,                // jQuery不要去处理发送的数据
                contentType: false,                // jQuery不要去设置Content-Type请求头
                xhr: function() {
                    var xhr = new XMLHttpRequest();
                    //使用XMLHttpRequest.upload监听上传过程，注册progress事件，打印回调函数中的event事件
                    xhr.upload.addEventListener('progress', function (e) {
                        //loaded代表上传了多少
                        //total代表总数为多少
                        var progressRate = (e.loaded / e.total) * 100;
                        console.log(progressRate)
                        index.progressRate=progressRate;
                    })
                    return xhr;
                },
                success:function(){
                    console.log("success")
                    console.log("刷新")
                    index.refresh();
                    index.progressRate=0;
                },
            });
           },
           refresh:function(){
            path="";
            if(path.length==1){
                this.getList("");
            }else{
                for(var i=0;i<index.dirList.length;i++){
                    path=path+index.dirList[i]+"/";
                }
                this.getList(path);
            }
           },
           mkdir:function(name){
            path="";
            if(path.length==1){
                path="files/"+name;
            }else{
                for(var i=0;i<index.dirList.length;i++){
                    path=path+index.dirList[i]+"/";
                }
                path=path+name
            }
            console.log(path)
            $.ajax({
                type: "POST",
                url: index.request_adress+"mkdir",
                data: {dir_name:path},
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                complete:function(data){ 
                    console.log(data.responseText)
                    if(data.responseText=="False"){
                        $('#mkdir').modal('hide');
                        setTimeout(function () {
                            // 这里就是处理的事件
                            console.log("刷新")
                            index.refresh();
                        }, 500);
                    }else{
                        $('#mkdir').modal('hide');
                        setTimeout(function () {
                            // 这里就是处理的事件
                            console.log("刷新")
                            index.refresh();
                        }, 500);
                    }
                }
            });
           },
           logout:function(){
            $.ajax({
                type: "POST",
                url: index.request_adress+"logout",
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                complete:function(data){
                    console.log(data.responseText)
                    if(data.responseText=="Ture"){
                        window.location.href="login.html"//跳转
                        return;
                    }
                    else{
                        alert("退出账号失败！");
                    }
                }
            });
           },
           cancelmove:function(){
               index.movetips=false;
           },
           move:function(which,num){
               var name="";
               var path="";
                for(var i=0;i<index.dirList.length;i++){
                    path=path+index.dirList[i]+"/";
                }
                if(which=="dir"){
                    name = index.List[0][num];
                    path=path+index.List[0][num];
                }else{
                    name = index.List[1][num];
                    path=path+index.List[1][num];
                }
                index.movetips=true;
                index.movename=name;
                index.movepath=path;
                console.log(name);
                console.log(path);
           },
           _delete:function(which,num){
            var name="";
            var path="";
             for(var i=0;i<index.dirList.length;i++){
                 path=path+index.dirList[i]+"/";
             }
             if(which=="dir"){
                 name = index.List[0][num];
                 path=path+index.List[0][num];
             }else{
                 name = index.List[1][num];
                 path=path+index.List[1][num];
             }
             var r = confirm("亲，您真的要删除["+name+"]吗？");
             if(r==true){
                $.ajax({
                    type: "POST",
                    url: index.request_adress+"delete",
                    data: {
                        _type:which,
                        path:path
                    },
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    dataType: "json",
                    complete:function(data){
                        if(data.responseText=="Ture"){
                            alert("删除["+name+"]申请已提交，请耐心等待。");
                        }else{
                            alert("删除失败！");
                        }
                        index.refresh();
                    }
                });
             }
             console.log(name);
             console.log(path);
        },
           go_move:function(){
                var path="";
                for(var i=0;i<index.dirList.length;i++){
                    path=path+index.dirList[i]+"/";
                }
                console.log(path);
                console.log(index.movepath);
                $.ajax({
                    type: "POST",
                    url: index.request_adress+"movedir",
                    data: {
                        form_dir_name: index.movepath,
                        to_dir_name: path
                    },
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    dataType: "json",
                    complete:function(data){
                        if(data.responseText=="Ture"){
                            alert("移动["+index.movename+"]申请已提交，请耐心等待。");
                        }else{
                            alert("移动失败！");
                        }
                        index.refresh();
                        index.movetips=false;
                    }
                });
                
           }
    },
}) //建立新的 Vue环境