"""Build the branded online reader and self-contained offline manual."""
from pathlib import Path
import base64
from html import escape,unescape
import json
import re
import markdown

DESCRIPTIONS={
 'overview':('Start here','Understand the pipeline, what you need and the order to check each stage.'),
 'setup':('Setup and first use','From a complete runtime folder to a working source, detector and output.'),
 'settings':('Settings explained','Know what each control changes before you tune your configuration.'),
 'troubleshooting':('Troubleshooting','Find the earliest failing stage and work forward from there.'),
 'files':('Files and maintenance','Keep dependencies together and know what to back up when you upgrade.')
}

def plain(value):
    return re.sub(r'\s+',' ',unescape(re.sub(r'<[^>]*>',' ',value))).strip()

def build_guide(project):
    content=project/'content'
    chapters={'overview':'README.md','setup':'Guides/Setup.md','settings':'Guides/Settings.md','troubleshooting':'Guides/Troubleshooting.md','files':'Guides/Files and maintenance.md'}
    manual=''.join('<section class="part" id="'+key+'"><h2>'+DESCRIPTIONS[key][0]+'</h2>'+re.sub(r'^<h1>.*?</h1>','',markdown.markdown((content/path).read_text(encoding='utf-8'),extensions=['tables','fenced_code']),count=1,flags=re.S)+'</section>' for key,path in chapters.items())
    sections=[]
    aliases={'Guides/Setup.md':'setup','Guides/Settings.md':'settings','Guides/Troubleshooting.md':'troubleshooting','Guides/Files%20and%20maintenance.md':'files'}
    for key,body in re.findall(r'<section class="part" id="([^"]+)">(.*?)</section>',manual,re.S):
        if key not in DESCRIPTIONS:continue
        title,description=DESCRIPTIONS[key]
        body=re.sub(r'^<h2>.*?</h2>','',body,count=1,flags=re.S)
        if key=='overview':
            body=re.sub(r'<p><strong>Start with .*?</p>','',body,count=1,flags=re.S)
        for path,target in aliases.items():body=body.replace('href="'+path+'"','href="#'+target+'"')
        body=body.replace('href="USER%20GUIDE.html"','href="#overview"')
        body=body.replace('<a href="Launcher%20source/README.md">Launcher source</a>','the included Launcher source documentation')
        headings=[]
        def heading(m):
            level=int(m[1]);label=plain(m[2]);identifier=key+'-'+re.sub('[^a-z0-9]+','-',label.lower()).strip('-')
            if any(h['id']==identifier for h in headings):identifier+='-'+str(len(headings))
            headings.append({'id':identifier,'title':label})
            return '<h'+str(level)+' id="'+identifier+'">'+m[2]+'</h'+str(level)+'>'
        body=re.sub(r'<h([23])>(.*?)</h\1>',heading,body,flags=re.S)
        body=body.replace('<table>','<div class="cvm-guide-table" role="region" aria-label="Reference table" tabindex="0"><table>').replace('</table>','</table></div>')
        sections.append({'id':key,'title':title,'description':description,'html':body,'headings':headings,'text':plain(body)})
    assert len(sections)==5,'Expected all five CVM 4.1.4 chapters'
    dist=project/'dist'
    online=[]
    for section in sections:
        item=dict(section)
        def online_link(m):
            href=m[1]
            return 'href="'+('/guides/'+href if not href.startswith(('#','/')) and ':' not in href else href)+'"'
        item['html']=re.sub(r'href="([^"]+)"',online_link,item['html'])
        online.append(item)
    (dist/'guide-data.json').write_text(json.dumps({'version':'4.1.4','sections':online},ensure_ascii=False),encoding='utf-8')
    css=(project/'guide.css').read_text(encoding='utf-8')
    (dist/'guide.css').write_text(css,encoding='utf-8')
    logo='data:image/svg+xml;base64,'+base64.b64encode((project/'source/logo/cvm_11_logo.svg').read_bytes()).decode()
    # Embed the existing Latin fonts so the offline file has no network dependency.
    fonts=(project/'source/fonts/fonts.css').read_text(encoding='utf-8')
    embedded=[]
    for block in re.findall(r'/\* latin \*/\s*(@font-face\s*\{.*?\})',fonts,re.S):
        if "'Chakra Petch'" not in block and "'Noto Sans TC'" not in block:continue
        if not re.search(r'font-weight: (?:400|600|700);',block):continue
        file=re.search(r'url\(/fonts/([^)]+)\)',block)
        if file:
            b64=base64.b64encode((project/'source/fonts'/file[1]).read_bytes()).decode()
            embedded.append(block.replace(file[0],'url(data:font/woff2;base64,'+b64+')'))
    offline_css='''
    :root{color-scheme:dark;--font-display:"Chakra Petch",sans-serif;--font-sans:"Noto Sans TC",system-ui,sans-serif;--font-mono:Consolas,monospace}
    *{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:100px}body{margin:0;background:#06050d;color:#f4f2ff;font:14px/1.8 var(--font-sans)}
    .cvm-offline-nav{position:sticky;top:0;z-index:10;border-bottom:1px solid #ffffff14;background:#06050dee;backdrop-filter:blur(16px)}
    .cvm-offline-nav>div{max-width:1240px;margin:auto;display:flex;align-items:center;justify-content:space-between;gap:20px;height:80px;padding:0 24px}
    .cvm-offline-brand{display:flex;align-items:center;gap:12px;font:700 22px var(--font-display);letter-spacing:.04em;color:#f4f2ff;text-decoration:none}.cvm-offline-brand img{width:40px;height:40px}
    .cvm-offline-links{display:flex;gap:22px}.cvm-offline-links a{color:#b9b4d3;text-decoration:none;font:600 14px var(--font-display)}.cvm-offline-links a[aria-current]{color:#ff8a2a}
    .cvm-offline-main{max-width:1240px;margin:auto;padding:32px 24px}.cvm-offline-section{scroll-margin-top:110px;margin-bottom:64px}.cvm-offline-footer{max-width:1240px;margin:auto;padding:28px 24px;border-top:1px solid #ffffff14;color:#8f8aad;font-size:11px}
    .cvm-guide-chapters{display:block!important}.cvm-guide-sidebar-foot a{color:#b9b4d3}.cvm-guide-sidebar nav>a{color:#b9b4d3}.cvm-guide-article{max-width:860px}a{color:#ffb36b}
    @media(max-width:767px){.cvm-offline-main{padding:24px 16px}.cvm-offline-nav>div{padding:0 16px}.cvm-offline-links{gap:14px}.cvm-offline-links a{font-size:12px}.cvm-guide-sidebar nav{grid-template-columns:1fr 1fr}.cvm-guide-sidebar{margin-bottom:32px}.cvm-offline-section{margin-bottom:48px}}
    @media print{body{background:#fff;color:#111}.cvm-offline-nav,.cvm-offline-footer{display:none}.cvm-offline-main{max-width:none;padding:0}.cvm-offline-section{break-before:page}.cvm-offline-section:first-child{break-before:auto}}
    '''
    links=''.join('<a href="#'+s['id']+'"><span class="cvm-guide-number">'+str(i+1).zfill(2)+'</span>'+escape(s['title'])+'</a>' for i,s in enumerate(sections))
    articles=''.join('<section class="cvm-offline-section" id="'+s['id']+'"><header class="cvm-guide-heading"><p class="cvm-guide-label">CVM AI / ENGLISH GUIDE</p><h1>'+escape(s['title'])+'</h1><p class="cvm-guide-description">'+escape(s['description'])+'</p></header><div class="cvm-guide-prose">'+s['html']+'</div></section>' for s in sections)
    offline='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#06050d"><title>CVM AI · English guide</title><style>'+''.join(embedded)+css+offline_css+'</style></head><body><header class="cvm-offline-nav"><div><a class="cvm-offline-brand" href="#overview"><img src="'+logo+'" alt="">CVM AI</a><nav class="cvm-offline-links"><a href="#overview" aria-current="page">English guide</a><a href="'+escape(json.loads((project/'site.config.json').read_text())['origin'])+'/downloads">Downloads ↗</a></nav></div></header><main class="cvm-offline-main"><div class="cvm-guide"><aside class="cvm-guide-sidebar"><p class="cvm-guide-label">DOCUMENTATION</p><div class="cvm-guide-chapters is-open"><nav aria-label="Guide chapters">'+links+'</nav><div class="cvm-guide-sidebar-foot"><span class="cvm-guide-version">4.1.4 · Windows x64</span><span>Offline edition · Ctrl+F to search</span></div></div></aside><article class="cvm-guide-article">'+articles+'</article></div></main><footer class="cvm-offline-footer">CVM AI 4.1.4 · English documentation · Updated 9 November 2026</footer></body></html>'
    (content/'USER GUIDE.html').write_text(offline,encoding='utf-8')
    return {'chapters':len(sections),'offline_bytes':len(offline.encode())}
