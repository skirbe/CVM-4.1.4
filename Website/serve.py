"""Loopback-only preview server. Does not run the CVM desktop application."""
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from urllib.parse import urlsplit
import argparse,json
ROOT=Path(__file__).resolve().parent/'dist'
BASE=urlsplit(json.loads((ROOT.parent/'site.config.json').read_text(encoding='utf-8'))['origin']).path.rstrip('/')
class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*a,**kw):super().__init__(*a,directory=str(ROOT),**kw)
    def translate_path(self,path):
        if BASE and path.startswith(BASE+'/'):path=path[len(BASE):]
        elif BASE and urlsplit(path).path==BASE:path='/'
        return super().translate_path(path)
    def do_GET(self):
        path=urlsplit(self.path).path
        candidate=Path(self.translate_path(path))
        if not candidate.exists() and '.' not in candidate.name and not path.startswith(BASE+'/api/'):
            self.path='/index.html'
        return super().do_GET()
    def end_headers(self):self.send_header('Cache-Control','no-cache');super().end_headers()
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--port',type=int,default=4317);args=parser.parse_args()
    print(f'Local: http://127.0.0.1:{args.port}{BASE}/',flush=True)
    ThreadingHTTPServer(('127.0.0.1',args.port),Handler).serve_forever()
