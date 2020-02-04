import zipfile
import os
def un_zip(file_name):
    """unzip zip file"""
    zip_file = zipfile.ZipFile(file_name)
    if os.path.isdir(file_name + "[熙哥云解压]"):
        pass
    else:
        os.mkdir(file_name + "[熙哥云解压]")
    for names in zip_file.namelist():
        zip_file.extract(names,file_name + "[熙哥云解压]/")
    zip_file.close()