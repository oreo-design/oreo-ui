import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { access, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { createServer } from 'vite';
const root=fileURLToPath(new URL('../../',import.meta.url));
let server,cache,loaders,defaultsFor,updateValues,catalog;
before(async()=>{
 cache=await mkdtemp(path.join(tmpdir(),'oreo-adapter-contract-'));
 server=await createServer({root,configFile:false,cacheDir:cache,server:{middlewareMode:true,hmr:false,watch:null},optimizeDeps:{noDiscovery:true,entries:[],include:[]},resolve:{alias:{'@':path.join(root,'src')}},esbuild:{jsx:'automatic'}});
 ({playgroundLoaders:loaders}=await server.ssrLoadModule('/src/docs/playground/loaders.ts'));
 ({defaultsFor,updateValues}=await server.ssrLoadModule('/src/docs/playground/schema.ts'));
 ({CATALOG:catalog}=await server.ssrLoadModule('/src/lib/catalog.ts'));
});
after(async()=>{await server?.close();if(cache)await rm(cache,{recursive:true,force:true});});

test('every declared playground loads a complete family spec without importing an eager registry',async()=>{
 const declared=Object.entries(catalog).filter(([,entry])=>entry.views.includes('playground')).map(([id])=>id).sort();
 assert.deepEqual(Object.keys(loaders).sort(),declared);
 for(const id of declared){
  const spec=await loaders[id]();assert.ok(spec,id);assert.equal(typeof spec.render,'function',id);assert.ok(spec.source,id);assert.ok(Object.keys(spec.exports??{}).length,id);
  await access(path.join(root,'src/components',spec.source));
  for(const [key,control]of Object.entries(spec.controls)){
   if(control.kind==='select')assert.ok(control.options.includes(control.defaultValue),`${id}.${key} has a selectable default`);
  }
  assert.ok(spec.render(defaultsFor(spec),()=>{}),id+' renders its real preview element');
 }
});
function findElement(node, predicate){
 if(!node||typeof node!=='object')return undefined;
 if(Array.isArray(node)){for(const n of node){const found=findElement(n,predicate);if(found)return found;}return;}
 if(predicate(node))return node;
 return findElement(node.props?.children,predicate);
}
test('TreeStepper adapter preserves component-to-inspector and inspector-to-component state',async()=>{
 const spec=await loaders['tree-stepper']();let values=defaultsFor(spec);
 const render=()=>spec.render(values,(key,value)=>{values=updateValues(spec.controls,values,key,value);});
 let tree=findElement(render(),el=>typeof el.props?.onValueChange==='function');
 assert.equal(tree.props.value,'suspicious');tree.props.onValueChange('malware');assert.equal(values.value,'malware');
 tree=findElement(render(),el=>typeof el.props?.onValueChange==='function');assert.equal(tree.props.value,'malware');
 values=updateValues(spec.controls,values,'value','network');
 assert.equal(findElement(render(),el=>typeof el.props?.onValueChange==='function').props.value,'network');
 values=updateValues(spec.controls,values,'empty',true);assert.deepEqual(findElement(render(),el=>typeof el.props?.onValueChange==='function').props.nodes,[]);
 values=updateValues(spec.controls,values,'empty',false);assert.equal(findElement(render(),el=>typeof el.props?.onValueChange==='function').props.value,'network');
});
test('two specimens do not share selected state',async()=>{
 const spec=await loaders['tree-stepper']();const first=defaultsFor(spec),second=defaultsFor(spec);
 const changed=updateValues(spec.controls,first,'value','malware');assert.equal(changed.value,'malware');assert.equal(second.value,'suspicious');
});
