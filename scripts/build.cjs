const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'dist');
fs.mkdirSync(out,{recursive:true});
// Publish only the website, never tests, configuration secrets or node_modules.
for(const name of ['index.html','css','js','assets','robots.txt','sitemap.xml'])
  fs.cpSync(path.join(root,name),path.join(out,name),{recursive:true});
console.log('Static release prepared in dist');
