// Run from any directory with: node /absolute/path/to/verify-run.cjs
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const source = fs.readFileSync(path.resolve(__dirname, '../../../src/patterns/thinking-workspace/run-state.ts'), 'utf8');
const result = {};
vm.runInNewContext(ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText, {exports:result});
const {runReducer: reduce, initial} = result;

let run = reduce(initial, {type:'start',fail:false});
for(let i=0;i<5;i++) run=reduce(run,{type:'tick'});
run=reduce(run,{type:'pause'});
assert.equal(run.ticks,5); assert.equal(run.status,'paused');
assert.equal(reduce(run,{type:'tick'}),run);
run=reduce(reduce(run,{type:'resume'}),{type:'tick'});
assert.equal(run.ticks,6);
run=reduce(run,{type:'stop'});
assert.equal(run.status,'stopped'); assert.equal(reduce(run,{type:'tick'}),run);
run=reduce(initial,{type:'start',fail:true});
for(let i=0;i<9;i++) run=reduce(run,{type:'tick'});
assert.equal(run.status,'error'); assert.equal(reduce(run,{type:'tick'}),run);
run=reduce(run,{type:'start',fail:false});
for(let i=0;i<18;i++) run=reduce(run,{type:'tick'});
assert.equal(run.status,'complete'); assert.equal(reduce(run,{type:'tick'}),run);
assert.equal(reduce(run,{type:'reset'}),initial);
console.log('PASS: pause preserves progress; paused/stopped/error/completed ignore ticks; resume advances; failure and retry complete; reset returns idle.');
