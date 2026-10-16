import assert from 'node:assert/strict';
import {parseDollars,splitSpend,validCents} from '../src/components/support-console/model.ts';
let checks=0; const eq=(actual,expected)=>{assert.deepEqual(actual,expected);checks++};
eq(splitSpend(8100,7000),{within:7000,over:1100});
eq(splitSpend(7000,7000),{within:7000,over:0});
eq(splitSpend(4096,7000),{within:4096,over:0});
eq(splitSpend(4096,0),{within:0,over:4096});
eq(splitSpend(0,0),{within:0,over:0});
for(const n of [-1,NaN,Infinity,1.1,Number.MAX_SAFE_INTEGER+1]){eq(validCents(n),false);eq(splitSpend(n,7000),null);eq(splitSpend(7000,n),null)}
for(const [s,n] of [['70',7000],['0.01',1],['12.30',1230],[' 1.5 ',150],['0',0]])eq(parseDollars(s),n);
for(const s of ['','-1','1e4','12.345','NaN','Infinity','0x10','1,000','1.','999999999999999999'])eq(parseDollars(s),null);
console.log(`${checks} money and threshold assertions passed`);
