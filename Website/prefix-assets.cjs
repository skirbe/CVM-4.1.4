// Rewrite parsed string/template literals, preserving JavaScript regexes.
const fs=require('node:fs');
const path=require('node:path');
const acorn=require('acorn');
const [directory,base]=process.argv.slice(2);
const prefix=value=>value.startsWith(base+'/')?value:base+value;
const markup=value=>value.replace(/((?:href|src|content)=["'])(\/(?!\/)[^"']*)/g,(_,lead,url)=>lead+prefix(url));
function walk(node,visit){
  if(!node||typeof node!=='object')return;
  if(typeof node.type==='string')visit(node);
  for(const value of Object.values(node)){
    if(Array.isArray(value))for(const child of value)walk(child,visit);
    else if(value&&typeof value==='object')walk(value,visit);
  }
}
function run(file){
  let text=fs.readFileSync(file,'utf8');
  const ast=acorn.parse(text,{ecmaVersion:'latest',sourceType:'module'}),edits=[];
  walk(ast,node=>{
    if(node.type==='Literal'&&typeof node.value==='string'){
      const value=markup(/^\/[A-Za-z0-9_]/.test(node.value)?prefix(node.value):node.value);
      if(value!==node.value)edits.push({start:node.start,end:node.end,value:JSON.stringify(value)});
    }
    if(node.type==='TemplateLiteral'){
      for(const [index,quasi] of node.quasis.entries()){
        let value=markup(quasi.value.raw);
        if(index===0&&(/^\/[A-Za-z0-9_]/.test(value)||(value==='/'&&node.expressions.length)))value=prefix(value);
        if(value!==quasi.value.raw)edits.push({start:quasi.start,end:quasi.end,value});
      }
    }
  });
  edits.sort((a,b)=>b.start-a.start);
  for(const edit of edits)text=text.slice(0,edit.start)+edit.value+text.slice(edit.end);
  text=text.replaceAll('href:"/"','href:"'+base+'/"').replaceAll('e==="home"?"/":','e==="home"?"'+base+'/":').replaceAll('QS=function(e){return"/"+e}','QS=function(e){return"'+base+'/"+e}');
  acorn.parse(text,{ecmaVersion:'latest',sourceType:'module'});
  fs.writeFileSync(file,text);
}
function visit(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const name=path.join(dir,item.name);if(item.isDirectory())visit(name);else if(item.name.endsWith('.js'))run(name);}}
visit(directory);
