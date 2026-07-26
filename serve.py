#!/usr/bin/env python3
"""No-cache HTTP server for MyTools"""
import http.server
import socketserver
import os

PORT = 8766
ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path in ('/', '/index.html', '/html/index.html'):
            self.send_response(302)
            self.send_header('Location', '/home/index.html')
            self.end_headers()
            return
        super().do_GET()

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, fmt, *args):
        pass  # quiet


if __name__ == '__main__':
    with socketserver.TCPServer(('127.0.0.1', PORT), NoCacheHandler) as httpd:
        print(f'Serving on http://127.0.0.1:{PORT}/home/index.html  (no-cache)')
        httpd.serve_forever()
