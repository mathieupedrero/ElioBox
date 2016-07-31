# -*- coding: utf-8 -*-

import logging
import os
import uuid

from tornado.ioloop import IOLoop
from tornado.web import Application, RequestHandler
from tornado.websocket import WebSocketHandler

global_rooms = {}


class Room(object):
    def __init__(self, name, clients=[]):
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
        self.write(response)


class EchoWebSocket(WebSocketHandler):
    def check_origin(self, origin):
        return True

    def open(self, slug):
        if slug in global_rooms:
            global_rooms[slug].clients.append(self)
        else:
            global_rooms[slug] = Room(slug, [self])
        self.room = global_rooms[slug]
        if len(self.room.clients) > 2:
            self.write_message('fullhouse')
        elif len(self.room.clients) == 1:
            self.write_message('initiator')
        else:
            self.write_message('not initiator')
        logging.info(
            'WebSocket connection opened from %s', self.request.remote_ip)

    def on_message(self, message):
        logging.info(
            'Received message from %s: %s', self.request.remote_ip, message)
        for client in self.room.clients:
            if client is self:
                continue
            client.write_message(message)

    def on_close(self):
        logging.info('WebSocket connection closed.')
        self.room.clients.remove(self)
        for client in self.room.clients:
            client.write_message('initiator')

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
