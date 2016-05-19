#!/usr/bin/python3.5
import asyncio
import websockets

async def refresh():
    async with websockets.connect('ws://localhost:8888/ws-refresh') as websocket:
        while True:
            greeting = await websocket.recv()
            print("< {}".format(greeting))

async def cec():
    async with websockets.connect('ws://localhost:8888/ws-cec') as websocket:
        while True:
            greeting = await websocket.recv()
            print("< {}".format(greeting))


asyncio.get_event_loop().run_until_complete(asyncio.wait([refresh(),cec()]))
