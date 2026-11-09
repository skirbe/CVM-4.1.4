"""Build the captured CVMAI frontend with narrowly scoped download changes."""
from pathlib import Path
import hashlib
import json
import re
import shutil
import zipfile
from build_guide import build_guide
from urllib.parse import urlsplit
from github_pages import apply_project_base

PROJECT=Path(__file__).resolve().parent
SOURCE=PROJECT/'source'
DIST=PROJECT/'dist'
DIST.mkdir(exist_ok=True)
config=json.loads((PROJECT/'site.config.json').read_text(encoding='utf-8'))
origin=config['origin'].rstrip('/')
assert urlsplit(origin).scheme in {'http','https'}
shutil.copytree(SOURCE,DIST,dirs_exist_ok=True)

app_path=DIST/'assets/cvm-app-B6dLyArH.js'
app=app_path.read_text(encoding='utf-8')
patches=[]
def patch(before,after,expected=None):
    global app
    count=app.count(before)
    assert count>0,(before,'not found')
    if expected is not None:assert count==expected,(before,count,expected)
    app=app.replace(before,after)
    patches.append({'before':before,'after':after,'count':count})

# Buy becomes Download. Every other original page, animation, asset, language
# switch, hardware preview, layout and stylesheet remains in the captured code.
patch('home:"Home",buy:"Buy",hardware:', 'home:"Home",buy:"Download",hardware:',1)
patch('plans:"View plans"','plans:"Download"')
patch('ctaPlans:"View plans"','ctaPlans:"Download"',1)
patch('plans:"Plans",hardware:','plans:"Downloads",hardware:',1)
patch('F("buy",','F("downloads",',1)
patch('O("buy",','O("downloads",',1)
patch('F("hardware",','F("guides",t.jsx(Iy,{className:"w-4 h-4"}),"Guide"),F("hardware",',1)
patch('O("hardware",','O("guides","Guide",t.jsx(Iy,{className:"w-3.5 h-3.5"})),O("hardware",',1)
patch('function nf(){const e=window.location.pathname;', 'function nf(){const e=window.location.pathname;if(["/guides","/guides/","/guides/index.html"].includes(e))return "guides";',1)
patch('i==="buy"||i==="me"||i==="hardware"', 'i==="guides"||i==="buy"||i==="me"||i==="hardware"',1)
patch('i==="downloads"&&t.jsx(TB,', 'i==="guides"&&t.jsx(CVMAIGuide,{}),i==="downloads"&&t.jsx(TB,',1)
patch('$=j.useCallback(Q=>{l(Q);','$=j.useCallback(Q=>{Q=Q==="buy"?"downloads":Q;l(Q);',1)
patch('window.history.pushState({},"",T),c(T)','window.history.pushState({},"",T),c(T),window.dispatchEvent(new Event("cvmai:navigate"))',1)
patch('href:"/buy"','href:"/downloads"')
patch('buy:"購買卡密"','buy:"下載"',1)
patch('buy:"购买卡密"','buy:"下载"',1)
patch('buy:"Купить"','buy:"Скачать"',1)
patch('buy:"Comprar"','buy:"Baixar"',1)

# Public, anonymous API snapshots make the original homepage and changelog work
# independently. Private account services are not copied or impersonated.
for name in ['me','products','changelog']:
    patch(f'{name}:()=>xe("/api/{name}")',f'{name}:()=>xe("/api/{name}.json")',1)
repo='https://github.com/terrafirma2021/CVMAI'
patch('t.jsxs("button",{onClick:d,"aria-label":h.login,','t.jsxs("a",{href:'+json.dumps(repo)+',target:"_blank",rel:"noopener noreferrer","aria-label":"GitHub",',1)
patch('children:h.login','children:"GitHub"',1)
patch('function B_({','function CVMAIOriginalTrial({',1)
patch('href:"https://discord.gg/6SxKbrdq8C",target:"_blank",rel:"noreferrer",className:Cs,children:$n[e].trial','href:'+json.dumps(repo+'/releases')+',target:"_blank",rel:"noreferrer",className:Cs,children:"Releases"',1)
patch('children:"Discord"','children:"GitHub"',1)
patch('https://discord.gg/6SxKbrdq8C',repo)
patch('const ee=()=>{const Q=`${window.location.pathname}${window.location.search}${window.location.hash}`;window.location.href=`/api/auth/discord/start?returnTo=${encodeURIComponent(Q)}`}','const ee=()=>{window.location.href='+json.dumps(repo)+'}',1)
patch('ctaTrial:"Request a trial key"','ctaTrial:"View on GitHub"',1)
patch('ctaText:"Pick a plan and start now, or open a Discord ticket to request a trial key first."','ctaText:"Download the Windows release or explore the source and guides on GitHub."',1)
patch('ctaTrialNote:"Join the CVM AI Discord server and open a Support Ticket asking for a trial key; staff will help you in the ticket."','ctaTrialNote:"Source, documentation and releases are available in the GitHub repository."',1)
patch('if(["/guides","/guides/","/guides/index.html"].includes(e))return "guides";','if(["/guides","/guides/","/guides/index.html"].includes(e)||e==="/tutorial"||e.startsWith("/tutorial/"))return "guides";',1)
patch('const su="https://www.cvmai.uk"','const su='+json.dumps(origin),1)
patch('iU=["reseller-cn.cvmai.uk","localhost","127.0.0.1"]','iU=["reseller-cn.cvmai.uk"]',1)

# Retain the original authenticated download component in the source. A public
# release component replaces only the download destination of the Buy journey.
patch('function TB({','function CVMAIOriginalDownloads({',1)
app+='\n'+(PROJECT/'downloads-component.js').read_text(encoding='utf-8')+'\n'
app+='\n'+(PROJECT/'guide-component.js').read_text(encoding='utf-8')+'\n'
app+='\nfunction B_(){return null}\n'
app_path.write_text(app,encoding='utf-8')

html=(SOURCE/'index.html').read_text(encoding='utf-8')
html=re.sub(r'<link rel="preconnect" href="https://fonts\.(?:googleapis|gstatic)\.com"[^>]*>', '',html)
html=re.sub(r'<link\s+rel="stylesheet"\s+href="https://fonts.googleapis.com/[^"\n]+"\s*/>', '<link rel="stylesheet" href="/fonts/fonts.css" />',html)
html=html.replace('https://www.cvmai.uk',origin)
html=html.replace('</head>','<link rel="stylesheet" href="/guide.css" />\n</head>')
html=html.replace('<div id="root"></div>', '<div id="root"></div>\n<script>if(/^\\/buy\\/?$/.test(location.pathname))history.replaceState(null,"","/downloads");</script>')
(DIST/'index.html').write_text(html,encoding='utf-8')
# Direct links refresh correctly on ordinary static hosts, as well as Sites.
for route in ['downloads','buy','hardware','changelog','eula','tos','tutorial','tutorial/overview','models','me','register','verification','guides']:
    path=DIST/route/'index.html';path.parent.mkdir(parents=True,exist_ok=True);path.write_text(html,encoding='utf-8')
for name in ['me','products','changelog']:
    dest=DIST/'api'/(name+'.json');dest.parent.mkdir(exist_ok=True)
    shutil.copy2(SOURCE/'api-snapshots'/(name+'.json'),dest)
trace=DIST/'cdn-cgi'/'trace';trace.parent.mkdir(exist_ok=True);trace.write_text('',encoding='utf-8')

release=json.loads((PROJECT/'release.json').read_text(encoding='utf-8'))
url=release.get('downloadUrl')
assert not url or urlsplit(url).scheme in {'http','https'},'Use an HTTP(S) release URL.'
(DIST/'release.json').write_text(json.dumps(release,indent=2),encoding='utf-8')
(DIST/'_redirects').write_text('/buy /downloads 302\n/* /index.html 200\n',encoding='utf-8')
(DIST/'_headers').write_text('/assets/*\n  X-Content-Type-Options: nosniff\n/api/*\n  Content-Type: application/json; charset=utf-8\n/release.json\n  Cache-Control: no-cache\n',encoding='utf-8')
(DIST/'robots.txt').write_text('User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin-backend/\nSitemap: '+origin+'/sitemap.xml\n',encoding='utf-8')
(DIST/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>'+origin+p+'</loc></url>' for p in ['/','/downloads','/hardware','/changelog','/guides/index.html'])+'</urlset>',encoding='utf-8')

# These are the user's rewritten English documents, not account-only resources
# scraped from the reference site. No desktop binaries enter the site deploy.
content=PROJECT/'content'
guide_result=build_guide(PROJECT)
guide_dest=DIST/'guides'
assert guide_dest.resolve().parent==DIST.resolve(),'Generated guides must remain inside dist.'
if guide_dest.exists():shutil.rmtree(guide_dest)
shutil.copytree(content,guide_dest)
(guide_dest/'index.html').write_text(html,encoding='utf-8')
download_dir=DIST/'downloads';download_dir.mkdir(exist_ok=True)
with zipfile.ZipFile(download_dir/'CVMAI-English-Guides.zip','w',compression=zipfile.ZIP_DEFLATED) as z:
    for path in sorted(content.rglob('*')):
        if path.is_file():z.write(path,'CVMAI English Guides/'+str(path.relative_to(content)).replace('\\','/'))

inventory=json.loads((PROJECT/'asset-inventory.json').read_text(encoding='utf-8'))
unchanged=0
for item in inventory['assets']:
    rel=item['path'].lstrip('/')
    if rel in {'index.html','assets/cvm-app-B6dLyArH.js'}:continue
    target=DIST/rel
    assert hashlib.file_digest(target.open('rb'),'sha256').hexdigest()==item['sha256'],rel
    unchanged+=1
(PROJECT/'changes.json').write_text(json.dumps({'reference':'https://www.cvmai.uk/','patches':patches,'byte_identical_original_assets':unchanged,'download_component':'downloads-component.js','account_backend':'Original service; not copied','local_application_archive_not_deployed':True},indent=2,ensure_ascii=False),encoding='utf-8')
apply_project_base(DIST,origin)
print(json.dumps({'dist':str(DIST),'original_assets_verified':unchanged,'scoped_patches':len(patches),'application_download_url_set':bool(url),'guide':guide_result},indent=2))
