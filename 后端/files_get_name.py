
import os
import json
class dirRead():
    root_dir=""
    sub_dirs=""
    files=""
    def __init__ (self,dir_name):
        for root, dirs, files in os.walk(dir_name):
            self.root_dir=root
            self.sub_dirs=dirs
            self.files=files
            if(root==dir_name):
                break
    def get_file_name_ALL(self,file_name):
        
        return self.root_dir + os.sep + file_name
    def make_Json(self):
        data = []
        data.append(self.sub_dirs)
        data.append(self.files)
        jsonstr = json.dumps(data, ensure_ascii=False)
        return jsonstr
dirdata = dirRead('files')