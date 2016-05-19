import sys
import asyncio
import os
import tornado.escape
import tornado.ioloop
import tornado.web
import tornado.websocket
from PIL import Image

def imageSize(filename): 
  with Image.open(filename) as im:
    return im.size

class WebsocketWriter:
    def __init__(self):
        self.websockets=[]

    def append(self,websocket):
        self.websockets.append(websocket)

    def remove(self,websocket):
        self.websockets.remove(websocket)

    def send_message(self,message):
        for websocket in self.websockets:
            websocket.write_message(message)

refreshWriter=WebsocketWriter()
imagesFolder=sys.argv[1]
thumbnailFolder=sys.argv[2]
thumbnailSize=720,480

def compute_thumbnails_and_files():
    for filename in os.listdir(thumbnailFolder) :
        os.remove(thumbnailFolder + "/" + filename)
    files=os.listdir(imagesFolder)
    resultList=[]
    for i,file in enumerate(files):
        size = imageSize(imagesFolder+'/'+file)
        path = "file://"+os.path.abspath(imagesFolder+'/'+file)
        thumbnail=thumbnailFolder+"/"+file
        try:
            im = Image.open(imagesFolder+"/"+file)
            im.thumbnail(thumbnailSize, Image.ANTIALIAS)
            im.save(thumbnail, "JPEG")
            thumbnailPath="file://"+os.path.abspath(thumbnail)
            resultList.append({'id':i,'width':size[0], 'height':size[1],'file':path,'thumbnail':thumbnailPath})
        except IOError:
            print("cannot create thumbnail for '%s'",file)
    return {'files': resultList}

photos = compute_thumbnails_and_files();

async def refresh_folder():
    photos = compute_thumbnails_and_files();
    refreshWriter.send_message(photos);

class RefreshFolderService(tornado.web.RequestHandler):
    async def get(self):
        await refresh_folder()

class RefreshFolderWebsocket(tornado.websocket.WebSocketHandler):
    def check_origin(self, origin):
        return True

    def open(self):
        refreshWriter.append(self)
        self.write_message(photos)

    def on_close(self):
        refreshWriter.remove(self)

cecWriter=WebsocketWriter()
    
async def send_cec(action):
        cecWriter.send_message(action)

class CecService(tornado.web.RequestHandler):        
    async def get(self,action):
        await send_cec(action)

class CecWebsocket(tornado.websocket.WebSocketHandler):
    def check_origin(self, origin):
        return True

    def open(self):
        cecWriter.append(self)

    def on_close(self):
        cecWriter.remove(self)

application=tornado.web.Application([
    (r"/refresh", RefreshFolderService),
    (r"/ws-refresh", RefreshFolderWebsocket),
    (r"/cec/([a-zA-Z]+)", CecService),
    (r"/ws-cec", CecWebsocket)
])
 
if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
