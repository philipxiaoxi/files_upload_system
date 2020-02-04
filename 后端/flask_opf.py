from flask import Flask,request,session,make_response,send_from_directory
from flask_cors import CORS
from threading import Thread  # 创建线程的模块
import os
import files_get_name
import unzip
import _zip
import os.path ,shutil
app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = '!@#$%^&*()11'
share_ID=[]
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return "你想干嘛？！已记录你的IP地址，以及您所有的登录信息。[申诉邮箱：xswork@qq.com] "
    if request.method == 'POST':
        username = request.form['username']
        userpassword = request.form['userpassword']
        if(username=="123456" and userpassword=="123456"):
            session['user']= "123456"
            return "success"
        else:
            return "error"

@app.route('/upload',methods=['POST'])
def upload():
    if session.get("user"):
        try:
            file_obj = request.files['userfile']
            dir_name = request.form['dir_name']
        except:
            return "False"
        file_obj.save(dir_name+str(file_obj.filename))
        return 'Ture'
    else:
        return "False"

@app.route('/getList',methods=['POST'])
def getList():
    if session.get("user"):
        dir_name = request.form['dir_name']
        if(dir_name==""):
            dir_name="files"
        dirdata = files_get_name.dirRead(dir_name)
        return dirdata.make_Json()
    else:
        return "False"

@app.route('/getfile',methods=['GET'])
def getfile():
    if session.get("user"):
        fullfilename = request.args.get("file_name")
        fullfilenamelist = fullfilename.split('/')
        filename = fullfilenamelist[-1]
        filepath = fullfilename.replace('/%s'%filename, '')
        #普通下载
        response = make_response(send_from_directory(filepath, filename, as_attachment=True))
        response.headers["Content-Disposition"] = "attachment; filename={}".format(filepath.encode().decode('latin-1'))
        return send_from_directory(filepath, filename, as_attachment=True)
    else:
        return "False"

@app.route('/unzip',methods=['POST'])
def go_unzip():
    if session.get("user"):
        fullfilename = request.form['file_name']
        p = Thread(target=unzip.un_zip, args=(fullfilename,))
        p.start()
        return "Ture"
    else:
        return "False"

@app.route('/zip',methods=['POST'])
def go_zip():
    if session.get("user"):
        dirpath = request.form['dirpath']
        outFullName = request.form['outFullName']
        p = Thread(target=_zip.zipDir, args=(dirpath,outFullName))
        p.start()
        return "Ture"
    else:
        return "False"

@app.route('/mkdir', methods=['POST'])
def mkdir():
    if session.get("user"):
        dir_name = request.form['dir_name']
        isExists=os.path.exists(dir_name)
        if not isExists:
            # 如果不存在则创建目录
            # 创建目录操作函数
            os.mkdir(dir_name)
            return "True"
        else:
            return "False"
    return "False"

@app.route('/logout', methods=['POST'])
def logout():
    if session.get("user"):
        try:
            session.pop('user')
            return "Ture"
        except:
            return "Flase"
    return "Flase"

@app.route('/movedir', methods=['POST'])
def movedir():
    if session.get("user"):
        form_dir_name = request.form['form_dir_name']
        to_dir_name = request.form['to_dir_name']
        p = Thread(target=shutil.move, args=(form_dir_name,to_dir_name))
        p.start()
        return "Ture"
    return "Flase"

@app.route('/delete', methods=['POST'])
def delete():
    if session.get("user"):
        _type = request.form['_type']
        path = request.form['path']
        if(_type=="file"):
            p = Thread(target=os.remove, args=(path,))
            p.start()
        if(_type=="dir"):
            p = Thread(target=shutil.rmtree, args=(path,))
            p.start()
        return "Ture"
    return "Flase"


@app.route('/rename', methods=['POST'])
def rename():
    if session.get("user"):
        path = request.form['path']
        new_path = request.form['new_path']
        os.rename(path,new_path)
        return "Ture"
    return "Flase"

@app.route('/create_share', methods=['POST'])
def create_share():
    if session.get("user"):
        path = request.form['path']
        share_ID.append(path)
        num =len(share_ID)
        print(path)
        return str(num-1)
    return "Flase"

@app.route('/get_share_name', methods=['POST'])
def get_share_name():
        path="Flase"
        id = int(request.form['id'])
        if(share_ID[id]):
            path =share_ID[id]
            fullfilenamelist = path.split('/')
            filename = fullfilenamelist[-1]
        return filename

@app.route('/view_share', methods=['GET'])
def view_share():
    id = int(request.args.get("id"))
    path =share_ID[id]
    fullfilename = path
    fullfilenamelist = fullfilename.split('/')
    filename = fullfilenamelist[-1]
    filepath = fullfilename.replace('/%s'%filename, '')
    #普通下载
    response = make_response(send_from_directory(filepath, filename))
    response.headers["Content-Disposition"] = "attachment; filename={}".format(filepath.encode().decode('latin-1'))
    return send_from_directory(filepath, filename)

@app.route('/download_share', methods=['GET'])
def download_share():
    path="Flase"
    id = int(request.args.get("id"))
    if(share_ID[id]):
        path =share_ID[id]
        fullfilename = path
        fullfilenamelist = fullfilename.split('/')
        filename = fullfilenamelist[-1]
        filepath = fullfilename.replace('/%s'%filename, '')
        #普通下载
        response = make_response(send_from_directory(filepath, filename, as_attachment=True))
        response.headers["Content-Disposition"] = "attachment; filename={}".format(filepath.encode().decode('latin-1'))
        return send_from_directory(filepath, filename, as_attachment=True)
    return path

@app.route('/pic_view', methods=['GET'])
def pic_view():
    if session.get("user"):
        print("已登录！")
    else:
        return("未登录！")    
    path = request.args.get("path")
    fullfilename = path
    fullfilenamelist = fullfilename.split('/')
    filename = fullfilenamelist[-1]
    filepath = fullfilename.replace('/%s'%filename, '')
    #普通下载
    response = make_response(send_from_directory(filepath, filename))
    response.headers["Content-Disposition"] = "attachment; filename={}".format(filepath.encode().decode('latin-1'))
    return send_from_directory(filepath, filename)

@app.route('/', methods=['POST'])
def index():
    if session.get("user"):
        return session.get("user")
    return "未登录！"


if __name__ == '__main__':
    app.run(host="0.0.0.0")