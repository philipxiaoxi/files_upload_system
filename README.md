@[TOC](文件上传下载网盘系统)

# 欢迎使用文件上传下载网盘系统

你好！ 这款网盘系统非常简单，开发目的仅仅是为了香橙派等性能较差的ARM主板提供NAS的作用，如果您的电脑性能较好，建议使用next cloud或者其他开源系统。如果您能一起完善这套简单的文件上传下载网盘系统，我也将欢迎您，谢谢！

## 新的特征

我们对本网盘设计采用no-sql(无数据库)，这意味着我们将会使用真实存储地址以及单人单账号登录的设计。
 1. **全新的界面设计** ，前端使用bootstrap4开发完成；
 2.  **前后端分离** 后端使用python-flask框架，前端可以在任何web服务器搭建；
 3. **极简设计** 去除数据库，去除不要的任何负担；
 4.  **响应式设计** 手机电脑浏览都没问题；

## 目前所有功能

 1. 目录浏览
 2. 新建目录
 3. 文件下载
 4. 文件上传
 5. 文件分享
 6. 文件移动
 7. 文件重命名
 8. 云端压缩
 9. 云端解压
 10. 文件删除
 11. 在线预览图片
 12. 在线预览视频(原画预览，对带宽要求较高)
 13. 分享预览图片
 14. 分享预览视频(原画预览，对带宽要求较高)

## 项目浏览地址
	http://182.92.98.89:82/

## 如何安装本系统
本系统分为前端和后端，前端仅需搭建可以访问即可，简简单单的html+css+js，您可以在任何服务器上运行这套前端系统。
**作者使用nginx在Ubuntu搭建**
==建议不要再nginx的网站目录下启动python后端否则可能可以随意访问您的文件请在其他地方部署您的python后端==
后端您需要安装python，在Ubuntu下
```
sudo apt-get install python3       ----安装python3模块
```
然后
```
sudo apt-get install python-pip3   ----安装 pip3 模块
```
然后安装flask、flask——cors
```
sudo pip3 install flask
```
```
sudo pip3 install flask_cors
```
以上教程来自网络收集，如有错误，请自行判断。
以下列出本系统后端所使用的全部库。
```python
from flask import Flask,request,session,make_response,send_from_directory
from flask_cors import CORS
from threading import Thread  # 创建线程的模块
import os
import os.path ,shutil
```
请根据要求安装所有的库，一般剩余的库都是自带的。
至此，环境已经全部安装完成。
## 如何运行本系统
先运行后端
```
python3 flask_opf.py
```
该文件是启动文件，包含所有请求的方法。
运行后将会得到请求地址
例如（以下地址是示例，请勿直接使用）
```
http://182.92.98.89:5000/
```
==建议修改端口号==
前端请在js文件夹找到一个叫adress.js的文件，打开并修改地址为您运行后端得到的请求地址。
例如（以下地址是示例，请勿直接使用）
```js
var adress="http://182.92.98.89:5000/"
```
然后启动前端，启动方法请参考您安装的web服务器。
**作者使用nginx，重启一下nginx即可**
至此，您的网盘系统已经正常运行了。
## 登录默认密码及修改
默认账号和密码分别是123456、123456
修改请修改==flask_opf.py==文件中的/login的验证部分。
然后重新启动==flask_opf.py==文件。
## 更加专业的使用flask服务器
由于直接运行==flask_opf.py==文件是不能运用在生产环境，您可以使用==uwsgi==启动==flask_opf.py==文件，这样flask服务器将会更加稳定、性能更佳。
您可以参考 [使用Flask+uwsgi+Nginx部署Flask正式环境](https://www.jianshu.com/p/7301aba92f23).
## 文件存储地方
个人文件全部存储到与同级==flask_opf.py==文件下的文件夹==files==
## 后语
欢迎各位大佬前来对本渣渣代码修改的更加安全，更加多功能，偶也！
