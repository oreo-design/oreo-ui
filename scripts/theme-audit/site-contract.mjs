/** Structural theme ownership checks, not a replacement for rendered QA. */
import assert from 'node:assert/strict';
import {readdirSync,readFileSync} from 'node:fs';
import {join} from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const postcss=require(createRequire(require.resolve('vite/package.json')).resolve('postcss'));
let cssFiles=0,modeConsumers=0;
function walk(dir){for(const entry of readdirSync(dir,{withFileTypes:true})){
 const path=join(dir,entry.name);if(entry.isDirectory()){walk(path);continue;}
 const source=readFileSync(path,'utf8');
 if(path.endsWith('.css')){cssFiles++;postcss.parse(source).walkDecls(d=>{
 if(/^(padding|margin)(-(top|right|bottom|left|inline|block)(-(start|end))?)?$|^(row-|column-)?gap$|^border(-[a-z]+)*-radius$/.test(d.prop))
 assert.ok(!/\d(?:px|rem)\b/.test(d.value),`${path}: fixed geometry ${d.prop}: ${d.value}`);
 });}
 if(path.endsWith('.tsx')){
 assert.ok(!/classList\.(toggle|add|remove)\("theme-dark"/.test(source),`${path}: page owns document mode`);
 assert.ok(!/\[dark,\s*setDark\]\s*=\s*(?:React\.)?useState/.test(source),`${path}: page-local website mode`);
 if(source.includes('useThemeMode('))modeConsumers++;
 }
}}
['src/docs','src/pages','src/patterns'].forEach(walk);
console.log(`Site theme contract: ${cssFiles} stylesheets and ${modeConsumers} shared mode consumers.`);
