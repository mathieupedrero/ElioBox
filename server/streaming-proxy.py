import asyncio
import tornado.escape
import tornado.ioloop
import tornado.web
import tornado.websocket
from tornado import httpclient
from tornado import gen

class IdHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("Hello, world")

@tornado.web.stream_request_body
class MyRedirectHandler(tornado.web.RedirectHandler):

class StreamingHandler(tornado.web.RequestHandler):

    @gen.coroutine
    def get(self, job_id):
        url = 'http://pedrero.org:2121/'+job_id
        client = httpclient.AsyncHTTPClient()

        response = yield client.fetch(httpclient.HTTPRequest(
            url=url,
            header_callback=self._handle_headers,
            streaming_callback=self._handle_chunk))
        if response.code != 200:
            # handle error
            self.finish()

    def _handle_headers(self, headers):
        self._start_line = tornado.httputil.parse_response_start_line(headers[0])

    def _handle_chunk(self, chunk):
        if self._start_line.code == 200:
            self.write(chunk)
            self.flush()

application=tornado.web.Application([
    tornado.web.url(r"/id", IdHandler),
    tornado.web.url(r"/stream/([a-zA-Z0-9\.]+)", StreamingHandler),
    tornado.web.url(r"/streaming/(.*)", MyRedirectHandler,
        dict(url=r"http://pedrero.org:2121/\1"))
])
 
if __name__ == "__main__":
    application.listen(8889)
    tornado.ioloop.IOLoop.instance().start()
