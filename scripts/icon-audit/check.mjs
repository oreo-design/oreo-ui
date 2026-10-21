import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
const central='src/components/icon/';
function walk(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):[join(dir,e.name)]);}
for(const file of walk('src').filter(p=>/\.[jt]sx?$/.test(p)&&!p.startsWith(central))){
 const source=readFileSync(file,'utf8');
 assert.ok(!/from ["'](?:lucide-react|@phosphor-icons\/react)["']/.test(source),`${file}: import icons from shared owner`);
 assert.ok(!/(?:prompt-box|keyword-tag|attachment|playground)\/assets\/[^"']+\.svg/.test(source),`${file}: stale asset path`);
}
const slots={chevron:12,preview:14.6667,annotation:14,code:14.6667,desktop:14,tablet:14,sparkles:20,copy:14,randomize:16,reset:16};
const sources=JSON.parse(readFileSync(central+'assets/figma/sources.json','utf8'));
for(const[name,size]of Object.entries(slots)){
 const svg=readFileSync(central+`assets/figma/${name}.svg`,'utf8');
 assert.ok(svg.includes('<svg')&&svg.includes('<path'),`${name}: nonempty SVG geometry`);
 for(const attr of ['width','height']) assert.ok(Math.abs(Number(svg.match(new RegExp(`${attr}="([\\d.]+)"`))?.[1])-size)<.001,`${name}: native ${attr}`);
 assert.ok(sources[name].nodeId,`${name}: source node missing`);
}
assert.ok(!readFileSync(central+'glyphs.lucide.ts','utf8').includes('@phosphor-icons'), 'Lucide must not borrow another operation library');
assert.ok(!readFileSync('src/docs/playground/Tools.tsx','utf8').includes('import.meta.glob'), 'Tools must not own another registry');
console.log('Passed icon import boundary, ten Figma asset slots, provenance, and Lucide isolation.');
