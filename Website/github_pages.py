"""Adapt the captured frontend to a GitHub project-site prefix."""
from pathlib import Path
from urllib.parse import urlsplit
import json,re,subprocess

def apply_project_base(dist: Path, origin: str):
    base=urlsplit(origin).path.rstrip('/')
    if not base:return
    assert base.startswith('/') and not base.endswith('/')
    def prefix(value):
        return value if value.startswith(base+'/') else base+value
    def markup(text):
        return re.sub(r'''((?:href|src|content)=["'])(/(?!/)[^"']*)''',lambda m:m[1]+prefix(m[2]),text)
    def data(value):
        if isinstance(value,str):
            if re.match(r'^/[A-Za-z0-9_]',value):return prefix(value)
            return markup(value)
        if isinstance(value,list):return [data(v) for v in value]
        if isinstance(value,dict):return {k:data(v) for k,v in value.items()}
        return value
    for path in dist.rglob('*'):
        if not path.is_file():continue
        if path.suffix=='.html':
            text=markup(path.read_text(encoding='utf-8'))
            text=re.sub(r'<script>if\(/\^.*?history\.replaceState\(null,"","/downloads"\);</script>',lambda m:'<script>if(location.pathname.replace(/\\/$/, "")==='+json.dumps(base+'/buy')+')history.replaceState(null,"",'+json.dumps(base+'/downloads')+');</script>',text)
            path.write_text(text,encoding='utf-8')
        elif path.suffix=='.css':
            text=path.read_text(encoding='utf-8')
            text=re.sub(r'''url\((["']?)(/(?!/)[^)"']+)''',lambda m:'url('+m[1]+prefix(m[2]),text)
            path.write_text(text,encoding='utf-8')
        elif path.suffix=='.json':
            value=data(json.loads(path.read_text(encoding='utf-8')))
            path.write_text(json.dumps(value,ensure_ascii=False),encoding='utf-8')
    subprocess.run(['node',str(Path(__file__).with_name('prefix-assets.cjs')),str(dist),base],check=True)
    (dist/'404.html').write_bytes((dist/'index.html').read_bytes())
    (dist/'.nojekyll').write_text('',encoding='utf-8')
