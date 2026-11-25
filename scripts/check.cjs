const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const name of fs.readdirSync(path.join(root,'js')))if(name.endsWith('.js'))execFileSync(process.execPath,['--check',path.join(root,'js',name)]);
if(html.includes('cdn.tailwindcss.com'))throw Error('Browser Tailwind is prohibited in production');
if((html.match(/<h1\b/g)||[]).length!==1)throw Error('Exactly one h1 is required');
for(const m of html.matchAll(/(?:src|href)="([^"#]+)"/g)){
 const url=m[1];if(/^(https?:|mailto:|tel:|data:)/.test(url))continue;
 if(!fs.existsSync(path.join(root,url.split('?')[0])))throw Error(`Missing local resource: ${url}`);
}
for(const name of fs.readdirSync(path.join(root,'css'))){
 const css=fs.readFileSync(path.join(root,'css',name),'utf8');
 for(const m of css.matchAll(/url\(["']?(\.\.[^)'"\s]+)["']?\)/g))if(!fs.existsSync(path.join(root,'css',m[1])))throw Error(`Missing CSS resource: ${m[1]}`);
}
console.log('PASS: JS syntax, local resources, production CSS, heading');
