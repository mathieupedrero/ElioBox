import sys
import asyncio
import os

from subprocess import Popen

import tornado.escape
import tornado.ioloop
import tornado.web
import tornado.websocket
from elioboxconstants import CONSTANTS
from PIL import Image
from datetime import datetime
from tornado.escape import json_encode
from tornado.escape import json_decode

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

build_tag='BUILD:###BUILD_TAG###'
www_path=sys.argv[3]
refreshWriter=WebsocketWriter()
relativeImagesFolder="/"+sys.argv[1]
imagesFolder=www_path+'/'+relativeImagesFolder
relativeThumbnailFolder="/"+sys.argv[2]
thumbnailFolder=www_path+'/'+relativeThumbnailFolder
thumbnailSize=720,480

def compute_thumbnails_and_files():
    for filename in os.listdir(thumbnailFolder) :
        os.remove(thumbnailFolder + "/" + filename)
    files=os.listdir(imagesFolder)
    resultList=[]
    for i,file in enumerate(files):
        size = imageSize(imagesFolder+'/'+file)
        path = relativeImagesFolder+'/'+file
        try:
            im = Image.open(imagesFolder+"/"+file)
            im.thumbnail(thumbnailSize, Image.ANTIALIAS)
            im.save(thumbnailFolder+"/"+file, "JPEG")
            thumbnailPath=relativeThumbnailFolder+"/"+file
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
        self.write_message(build_tag);
        cecWriter.append(self)

    def on_close(self):
        cecWriter.remove(self)

class MyStaticFileHandler(tornado.web.StaticFileHandler):
    def set_extra_headers(self, path):
        # Disable cache
        self.set_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')

class ConstantsHandler(tornado.web.RequestHandler):
    def get(self):
        self.write(json_encode(CONSTANTS['client.properties']))

class ChatWebsocket(tornado.websocket.WebSocketHandler):
    def __init__(self):
        self.signaling_client=None
        self.chat_config=None
        self.connected_clients=[]
        self.streaming_popen=None

    def check_origin(self, origin):
        return True

    def open(self):
        self.signaling_client=tornado.websocket.websocket_connect(
            CONSTANTS['signaling.url.template'].format(CONSTANTS['signaling.room_name']),
            callback=self.on_signaling_connection,
            on_message_callback=self.on_signaling_message
        )
        self.write_message(json_encode({'message':'chat open'}))

    def on_close(self):
        self.write_message(json_encode({'message':'chat closed'}))
        self.signaling_client.close()
        #close streaming to pedrero.org here
        Popen('notofy-send','Fin de streaming !')

    def on_signaling_connection(self):
        self.write_message(json_encode({'message':'connected to signaling'}))

    def on_signaling_message(self,message):
        if message:
            json_message=json_decode(message)
            if json_message['id']:
                self.chat_config=json_message
                self.streaming_popen=Popen('notofy-send','Début de stream vers {0} - {1}'.format(json_message['audio-feed'],json_message['video-feed']))
                #Do streaming to pedrero.org here
                self.signaling_client.write_message(json_encode({'name':CONSTANTS['env.name']}))
            else:
                if self.chat_config:
                    self.connected_clients.clear()
                    for client_config in json_message['connected-clients']:
                        client_id = client_config['id']
                        self.connected_clients.append({
                            'name':client_config['name'],
                            'audio-stream':CONSTANTS['audio_stream.url.template'].format(client_id),
                            'video-stream':CONSTANTS['video_stream.url.template'].format(client_id)
                        })
                    self.write_message(json_encode({
                        'connected-clients':self.connected_clients,
                        'message':'current clients list'
                    }))

application=tornado.web.Application([
    (r"/refresh", RefreshFolderService),
    (r"/ws-refresh", RefreshFolderWebsocket),
    (r"/cec/([a-zA-Z]+)", CecService),
    (r"/ws-cec", CecWebsocket),
    (r"/constants", ConstantsHandler),
    (r'/(.*)', MyStaticFileHandler, {'path': www_path}),
    (r'/chat',ChatWebsocket)
])
 
if __name__ == "__main__":
    application.listen(CONSTANTS['server.port'])
    tornado.ioloop.IOLoop.instance().start()
