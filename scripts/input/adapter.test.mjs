import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
import path from 'node:path';
test('Input preview edits and export recipes cover all six compositions',async()=>{
 const root=process.cwd();const server=await createServer({root,configFile:false,cacheDir:'/tmp/oreo-input-adapter-cache',server:{middlewareMode:true,hmr:false,watch:null},optimizeDeps:{noDiscovery:true,entries:[],include:[]},resolve:{alias:{'@':path.join(root,'src')}},esbuild:{jsx:'automatic'}});
 try{
  const {default:adapters}=await server.ssrLoadModule('/src/docs/playground/adapters/input.tsx');
  const {defaultsFor,updateValues}=await server.ssrLoadModule('/src/docs/playground/schema.ts');
  const spec=adapters.input;let values=defaultsFor(spec);
  const render=()=>spec.render(values,(key,value)=>{values=updateValues(spec.controls,values,key,value);});
  render().props.children.props.onChange({target:{value:'ada@example.com'}});
  assert.equal(values.value,'ada@example.com');assert.equal(render().props.children.props.value,'ada@example.com');
  for(const kind of ['text','password','tags','payment','date','counter']){
   values={...values,kind};const result=spec.exportRecipe(values);
   assert.ok(result.imports.some(line=>line.includes('@/components/input')),kind);
   assert.ok(result.jsx.includes('<'),kind);assert.ok(!result.jsx.includes('Connect '),kind);
   assert.ok(!result.jsx.includes('onChange='),kind+' export is standalone uncontrolled');
  }
 }finally{await server.close();}
});
