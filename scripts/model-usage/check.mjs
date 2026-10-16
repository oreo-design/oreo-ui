import assert from 'node:assert/strict';
import {aggregateUsage, validUsage, recordSampleRun, usageCsv} from '../../src/components/model-usage/model.ts';
const models=[{id:'a',name:'Model "A"',tone:'purple'},{id:'b',name:'B',tone:'blue'}];
const days=[{id:'2026-09-29',label:'Sep 29',models:{a:{requests:2,tokens:100,costCents:7},b:{requests:3,tokens:200,costCents:11}},latencySamples:[100,300]}, {id:'2026-09-30',label:'Sep 30',models:{a:{requests:4,tokens:300,costCents:19},b:{requests:5,tokens:400,costCents:23}},latencySamples:[200]}];
const baseline=structuredClone(days);
assert.deepEqual(aggregateUsage(days,models).total,{requests:14,tokens:1000,costCents:60});
assert.equal(aggregateUsage(days,models).p95,300);
assert.equal(aggregateUsage(days,models).sampleCount,3);
assert.deepEqual(aggregateUsage(days.slice(-1),models).total,{requests:9,tokens:700,costCents:42});
assert.equal(aggregateUsage([],models).p95,null);
assert.equal(aggregateUsage([],models).total.costCents,0);
const next=recordSampleRun(days,'a');
assert.deepEqual(days,baseline);
assert.equal(next[0],days[0]);
assert.deepEqual(next[1].models.b,days[1].models.b);
assert.deepEqual(aggregateUsage(next,models).total,{requests:15,tokens:2842,costCents:65});
assert.equal(recordSampleRun(days,'missing'),days);
assert.equal(validUsage(days,[models[0],models[0]]),false);
assert.equal(validUsage([days[0],days[0]],models),false);
for(const bad of [-1,NaN,Infinity,0.5,Number.MAX_SAFE_INTEGER]) {
 const invalid=structuredClone(days);invalid[0].models.a.tokens=bad;
 assert.equal(validUsage(invalid,models),false);
 assert.throws(()=>aggregateUsage(invalid,models),RangeError);
}
const incomplete=structuredClone(days);delete incomplete[0].models.b;
assert.equal(validUsage(incomplete,models),false);
assert.equal(usageCsv(days.slice(-1),models),'date,model,requests,tokens,cost_usd\n"2026-09-30","Model ""A""",4,300,0.19\n"2026-09-30","B",5,400,0.23');
console.log('Usage aggregation, filtered totals, p95, immutable sample run, invalid data and CSV checks passed.');
