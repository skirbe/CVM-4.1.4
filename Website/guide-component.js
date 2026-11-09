// English documentation inside the original CVMAI application shell.
function CVMAIGuide() {
  const [data,setData]=j.useState(null),[error,setError]=j.useState(false),[attempt,setAttempt]=j.useState(0);
  const [chapter,setChapter]=j.useState(()=>location.hash.slice(1)||'overview');
  const [query,setQuery]=j.useState(''),[menu,setMenu]=j.useState(false);
  const article=j.useRef(null);
  j.useEffect(()=>{let active=true;setError(false);fetch('/guide-data.json').then(r=>{if(!r.ok)throw Error('guide');return r.json()}).then(d=>{if(active)setData(d)}).catch(()=>{if(active)setError(true)});return()=>{active=false}},[attempt]);
  j.useEffect(()=>{const change=()=>setChapter(location.hash.slice(1)||'overview');addEventListener('hashchange',change);addEventListener('popstate',change);addEventListener('cvmai:navigate',change);return()=>{removeEventListener('hashchange',change);removeEventListener('popstate',change);removeEventListener('cvmai:navigate',change)}},[]);
  const sections=data?.sections||[],index=Math.max(0,sections.findIndex(s=>s.id===chapter)),current=sections[index];
  const go=id=>{history.pushState({},'','/guides#'+id);setChapter(id);setMenu(false);window.scrollTo({top:0,behavior:'instant'})};
  j.useEffect(()=>{if(current){document.title=current.title+' | CVM AI Guide';if(article.current)article.current.focus({preventScroll:true})}},[current?.id]);
  const terms=query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const filtered=sections.filter(s=>terms.every(q=>(s.title+' '+s.text).toLowerCase().includes(q)));
  const nav=t.jsxs('aside',{className:'cvm-guide-sidebar','aria-label':'Guide chapters',children:[
    t.jsx('p',{className:'cvm-guide-label',children:'DOCUMENTATION'}),
    t.jsxs('label',{className:'cvm-guide-search',children:[t.jsx('span',{className:'sr-only',children:'Search the guide'}),t.jsx('svg',{width:18,height:18,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.6,'aria-hidden':true,children:[t.jsx('circle',{cx:10.5,cy:10.5,r:6.5},'c'),t.jsx('path',{d:'m16 16 5 5'},'p')]}),t.jsx('input',{type:'search',placeholder:'Search the guide…',value:query,onChange:e=>{setQuery(e.target.value);setMenu(true)}})]}),
    t.jsxs('button',{className:'cvm-guide-menu',onClick:()=>setMenu(!menu),'aria-expanded':menu,'aria-controls':'guide-chapters',children:['Chapters',t.jsx('span',{'aria-hidden':true,children:menu?'−':'+'})]}),
    t.jsxs('div',{id:'guide-chapters',className:'cvm-guide-chapters'+(menu?' is-open':''),children:[
      terms.length>0&&t.jsxs('div',{className:'cvm-guide-results','aria-live':'polite',children:[t.jsx('span',{children:filtered.length+' matching chapter'+(filtered.length===1?'':'s')}),t.jsx('button',{onClick:()=>setQuery(''),children:'Clear'})]}),
      t.jsx('nav',{children:filtered.map(s=>t.jsxs('a',{href:'/guides#'+s.id,'aria-current':current?.id===s.id?'page':undefined,onClick:e=>{e.preventDefault();go(s.id)},children:[t.jsx('span',{className:'cvm-guide-number',children:String(sections.indexOf(s)+1).padStart(2,'0')}),s.title]},s.id))}),
      !filtered.length&&t.jsx('p',{className:'cvm-guide-empty',children:'No matches. Try capture, model or output.'}),
      t.jsxs('div',{className:'cvm-guide-sidebar-foot',children:[t.jsx('span',{className:'cvm-guide-version',children:'4.1.4 · Windows x64'}),t.jsx('a',{href:'/downloads/CVMAI-English-Guides.zip',download:true,children:'Download offline guides ↗'})]})
    ]})
  ]});
  if(error)return t.jsxs('section',{className:'cvm-guide-error',children:[t.jsx('h1',{children:'The guide could not load.'}),t.jsx('p',{children:'Check your connection and try again.'}),t.jsx('button',{className:'dlv-btn dlv-btn-uv',onClick:()=>setAttempt(attempt+1),children:'Try again'})]});
  if(!current)return t.jsx('p',{className:'cvm-guide-loading',role:'status',children:'Loading the English guide…'});
  const invalid=chapter!==current.id;
  const navigateBody=e=>{const a=e.target.closest('a');if(!a)return;const href=a.getAttribute('href')||'';
    if(href.startsWith('#')&&sections.some(s=>s.id===href.slice(1))){e.preventDefault();go(href.slice(1));return}
    if(href.includes('Legacy%20parameter%20reference.html')||href.includes('Legacy parameter reference.html'))return;
    if(href.includes('Launcher%20source/README.md')){a.setAttribute('href','/guides/Launcher%20source/README.md');return}
    if(href==='START%20HERE.txt')a.setAttribute('href','/guides/START%20HERE.txt');
  };
  return t.jsxs('div',{className:'cvm-guide',children:[nav,t.jsxs('article',{className:'cvm-guide-article',ref:article,tabIndex:-1,'aria-labelledby':'guide-title',children:[
    t.jsxs('header',{className:'cvm-guide-heading',children:[t.jsxs('div',{className:'cvm-guide-breadcrumb',children:[t.jsx('a',{href:'/',children:'CVM AI'}),t.jsx('span',{children:'/'}),t.jsx('span',{children:'English guide'})]}),t.jsxs('div',{className:'cvm-guide-heading-row',children:[t.jsx('p',{className:'cvm-guide-label',children:index<5?'GET UP AND RUNNING':'REFERENCE'}),t.jsx('span',{className:'cvm-guide-count',children:String(index+1).padStart(2,'0')+' / '+String(sections.length).padStart(2,'0')})]}),t.jsx('h1',{id:'guide-title',children:current.title}),t.jsx('p',{className:'cvm-guide-description',children:current.description})]}),
    invalid&&t.jsx('p',{className:'cvm-guide-note',role:'status',children:'That chapter was not found. Here is the guide overview.'}),
    index===0&&t.jsxs('div',{className:'cvm-guide-pipeline','aria-label':'The processing pipeline',children:['Capture','Detect','Select','Output'].map((label,i)=>t.jsxs('a',{href:'/guides#setup',onClick:e=>{e.preventDefault();go('setup')},children:[t.jsx('span',{children:'0'+(i+1)}),t.jsx('strong',{children:label}),t.jsx('small',{children:['Get a clear picture','Load a trained model','Check the target','Connect your device'][i]})]},label))}),
    current.headings.length>0&&t.jsxs('details',{className:'cvm-guide-toc',children:[t.jsx('summary',{children:'On this page'}),t.jsx('nav',{'aria-label':'On this page',children:current.headings.map(h=>t.jsx('a',{href:'#'+h.id,onClick:e=>{e.preventDefault();document.getElementById(h.id)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})},children:h.title},h.id))})]}),
    t.jsx('div',{className:'cvm-guide-prose',onClick:navigateBody,dangerouslySetInnerHTML:{__html:current.html}}),
    t.jsxs('nav',{className:'cvm-guide-pagination','aria-label':'Next and previous chapters',children:[index>0?t.jsxs('a',{href:'/guides#'+sections[index-1].id,onClick:e=>{e.preventDefault();go(sections[index-1].id)},children:[t.jsx('small',{children:'← Previous'}),t.jsx('strong',{children:sections[index-1].title})]}):t.jsx('span',{}),index<sections.length-1&&t.jsxs('a',{href:'/guides#'+sections[index+1].id,onClick:e=>{e.preventDefault();go(sections[index+1].id)},children:[t.jsx('small',{children:'Next →'}),t.jsx('strong',{children:sections[index+1].title})]})]}),
    t.jsx('p',{className:'cvm-guide-updated',children:'CVM AI 4.1.4 · English documentation · Updated 9 November 2026'})
  ]})]});
}
