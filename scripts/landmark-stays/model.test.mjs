import test from 'node:test';
import assert from 'node:assert/strict';
import { distanceKm, distanceLabel, filterStays, stayTotal } from '../../src/components/stay-results/model.ts';
import { STAYS, LANDMARKS } from '../../src/patterns/landmark-stays/data.ts';
const defaults={query:'',budget:false,fourStars:false,nearby:false,savedOnly:false,saved:[],sort:'distance'};
test('schematic distances use both scene axes and coincide at origin',()=>{
  const origin={id:'origin',name:'Origin',point:{x:0,y:0}};
  assert.equal(distanceKm({...STAYS[0],point:{x:0,y:0}},origin),0);
  assert.equal(distanceKm({...STAYS[0],point:{x:25,y:0}},origin),1);
  assert.ok(Math.abs(distanceKm({...STAYS[0],point:{x:0,y:100}},origin)-2.24)<1e-12);
  assert.equal(distanceLabel(.411),'411 m');
});
test('intersecting filters and new landmarks change real result set',()=>{
  assert.deepEqual(filterStays(STAYS,LANDMARKS[0],{...defaults,budget:true,fourStars:true}).map(s=>s.id),['atelier','jardin']);
  assert.deepEqual(filterStays(STAYS,LANDMARKS[0],{...defaults,budget:true,fourStars:true,query:' kitchen '}).map(s=>s.id),['jardin']);
  assert.equal(filterStays(STAYS,LANDMARKS[0],{...defaults,nearby:true}).length,4);
  assert.equal(filterStays(STAYS,LANDMARKS[1],defaults)[0].id,'seine');
  assert.equal(filterStays(STAYS,LANDMARKS[0],{...defaults,query:'no such hotel'}).length,0);
});
test('saved view and price sorting preserve input and support empty shortlist',()=>{
  const before=JSON.stringify(STAYS);
  assert.equal(filterStays(STAYS,LANDMARKS[0],{...defaults,savedOnly:true}).length,0);
  assert.deepEqual(filterStays(STAYS,LANDMARKS[0],{...defaults,savedOnly:true,saved:['seine','rue'],sort:'price'}).map(s=>s.id),['rue','seine']);
  assert.equal(JSON.stringify(STAYS),before);
});
test('room subtotals are exact and reject invalid stay lengths',()=>{
  assert.equal(stayTotal(STAYS[0],5),740);
  assert.equal(stayTotal(STAYS[0],1),148);
  for(const nights of [0,-1,1.5,31,NaN,Infinity])assert.throws(()=>stayTotal(STAYS[0],nights),RangeError);
});
