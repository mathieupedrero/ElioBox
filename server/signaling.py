# -*- coding: utf-8 -*-

import logging
import os
import uuid

from tornado.ioloop import IOLoop
from tornado.web import Application, RequestHandler
from tornado.websocket import WebSocketHandler
from tornado.escape import json_encode
from tornado.escape import json_decode


global_rooms = {}

audio_tag="audio"
video_tag="video"
feed_url="http://pedrero.org:2121/feed-{0}-{1}.ffm"
available_ids = {1,2}

class Room(object):
    def __init__(self, name, clients={}):
        self.name = name
        self.clients = clients

    def __repr__(self):
        return self.name
 
class StatusHandler(RequestHandler):
    def get(self):
        rooms_response=dict()
        for name,room in global_rooms.items():
            room_response=dict()
            room_response['name']=name
            room_clients=[];
            for client in room.clients:
                room_clients.append(client.request.remote_ip)
            room_response['clients']=room_clients
            rooms_response[name]=room_response
        response = { 'rooms':rooms_response} 
        self.write(json_encode(response))

class EchoWebSocket(WebSocketHandler):
    def check_origin(self, origin):
        return True

    def open(self, slug):
        if available_ids:
            self.stream_id=available_ids.pop()
            config={
                'name':'Invité',
                'ws':self
            }
            if slug in global_rooms:
                global_rooms[slug].clients[stream_id]=config
            else:
                global_rooms[slug] = Room(slug, config)
            self.this_room=global_rooms[slug]
            response={
                'id':self.stream_id,
                'audio-feed':feed_url.format(audio_tag,stream_id),
                'video-feed':feed_url.format(video_tag,stream_id)
            }
            self.write_message(json_encode(response))
        else:
            self.close(reason='full_house')
        logging.info(
            'WebSocket connection opened from %s', self.request.remote_ip)

    def on_message(self, message):
        self.this_room.clients[self.stream_id]['name']=message
        self.refresh_others()
        logging.info(
            'Received message from %s: %s', self.request.remote_ip, message)

    def on_close(self):
        logging.info('WebSocket connection closed.')
        del self.this_room.clients[self.stream_id]
        available_ids.add(self.stream_id)
        self.refresh_others()

    def refresh_others(self):
        client_descs_by_id = map( lambda id,config : id,{'id':id,'name':config['name']}, self.this_room.clients.items())
        for client_id,client_config in self.this_room.clients.items():
            other_clients=map(lambda id,desc: desc,filter(lambda id,desc : id != client_id,client_descs_by_id))
            client_config['ws'].write_message(json_encode({'connected-clients':other_clients}))
        

def main():
    settings = dict(
        debug=False
    )

    application = Application([
        (r'/ws/([^/]*)', EchoWebSocket),
        (r'/status', StatusHandler)
    ], **settings)

    application.listen(address='0.0.0.0', port=2323)
    logging.info("Started listening at 0.0.0.0:2323.")
    IOLoop.instance().start()


if __name__ == '__main__':
    main()
