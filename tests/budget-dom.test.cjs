const assert=require('node:assert/strict');
const {init}=require('../js/widget.js');
function element(value=''){return {value,checked:false,textContent:'',attrs:{},classList:{toggle(){}},setAttribute(k,v){this.attrs[k]=v;}};}
function fixture(){const f={destination:element('lisbon'),days:element('5'),people:element('2'),level:element('standard'),excursions:element()};const o={},e={},events={};for(const n of ['total','perPerson','accommodation','food','transport','excursions','summary'])o[n]=element();for(const n of Object.keys(f))e[n]=element();const status=element();const form={addEventListener(n,cb){events[n]=cb;}};const root={querySelector(s){if(s==='form')return form;if(s==='[data-widget-status]')return status;let m=s.match(/\[(name|data-result|data-error)="([^"]+)"\]/);return m?({name:f,'data-result':o,'data-error':e}[m[1]][m[2]]||null):null;}};return {root,f,o,e,status,events};}
const a=fixture(),b=fixture();assert.equal(init(a.root),true);assert.equal(init(a.root),false);assert.equal(init(b.root),true);
assert.match(a.o.total.textContent,/750/);a.f.days.value='-5';a.events.input();assert.equal(a.o.total.textContent,'—');assert.equal(a.f.days.attrs['aria-invalid'],'true');assert.match(a.e.days.textContent,/від 1 до 30/);assert.match(b.o.total.textContent,/750/);
a.f.days.value='5';a.events.input();assert.match(a.o.total.textContent,/750/);assert.equal(a.f.days.attrs['aria-invalid'],'false');assert.equal(a.e.days.textContent,'');a.f.excursions.checked=true;a.events.change();assert.match(a.o.total.textContent,/840/);
a.f.destination.value='<img src=x onerror=alert(1)>';a.events.change();assert.equal(a.o.total.textContent,'—');assert.match(a.e.destination.textContent,/зі списку/);
const broken=fixture();const old=broken.root.querySelector;broken.root.querySelector=s=>s==='[name="days"]'?null:old(s);assert.equal(init(broken.root),false);assert.match(broken.status.textContent,/недоступний/);
console.log('PASS DOM: initial render, error, recovery, checkbox, invalid select, missing node, duplicate init, two isolated instances.');
a.f.destination.value='lisbon';a.f.days.value='5';a.f.excursions.checked=true;a.events.change();
assert.match(a.o.total.textContent,/840/);
let prevented=false;a.events.reset({preventDefault(){prevented=true;}});
assert.equal(prevented,true);
for(const n of ['days','people','destination','level'])assert.equal(a.f[n].value,'');
assert.equal(a.f.excursions.checked,false);assert.equal(a.o.total.textContent,'—');
for(const n of Object.keys(a.f)){assert.equal(a.f[n].attrs['aria-invalid'],'false');assert.equal(a.e[n].textContent,'');}
assert.match(a.status.textContent,/очищено/);
a.f.destination.value='lisbon';a.f.days.value='5';a.f.people.value='2';a.f.level.value='standard';a.events.input();assert.match(a.o.total.textContent,/750/);
a.f.days.value='-5';a.events.input();a.events.reset({preventDefault(){}});assert.equal(a.e.days.textContent,'');assert.equal(a.o.total.textContent,'—');
console.log('PASS reset: all fields empty, checkbox off, no errors, result cleared, recalculation works.');
