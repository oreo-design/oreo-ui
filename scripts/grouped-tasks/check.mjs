import assert from 'node:assert/strict';
import { filterTasks, reconcileTaskCards, formatTaskDate } from '../../src/components/grouped-tasks/model.ts';
const base={query:'',priority:'all',list:'all',scope:'all',sort:'manual'};
const tasks=[
 {id:'A',title:'Audit flow',status:'backlog',priority:'Low',list:'UI Design',tags:['Sprint 24'],due:'2026-10-20',assigneeIds:['alex','sam']},
 {id:'B',title:'Hidden research',status:'review',priority:'High',list:'Research',tags:[],due:'',assigneeIds:['jules']},
 {id:'C',title:'Create prototype',status:'progress',priority:undefined,list:'UI Design',tags:[],due:'2026-10-19',assigneeIds:['sam']},
];
const original=structuredClone(tasks);
const filter=delta=>filterTasks(tasks,{...base,...delta},'alex').map(t=>t.id);
assert.deepEqual(filter({query:'SPRINT 24'}),['A']);
assert.deepEqual(filter({priority:'unset'}),['C']);
assert.deepEqual(filter({scope:'mine'}),['A']);
assert.deepEqual(filter({scope:'done'}),[]);
assert.deepEqual(filter({sort:'due'}),['C','A','B']);
assert.deepEqual(filter({sort:'priority'}),['B','A','C']);
assert.deepEqual(filter({list:'UI Design',query:'no match'}),[]);
const moved=reconcileTaskCards(tasks,[{id:'C',title:'Create prototype',columnId:'done',assigneeId:'sam'},{id:'A',title:'Audit flow',columnId:'review',assigneeId:'alex'}]);
assert.deepEqual(moved.map(t=>t.id),['C','B','A']);
assert.deepEqual(moved[1],tasks[1]);
assert.equal(moved[0].status,'done');
assert.deepEqual(moved[2].assigneeIds,['alex','sam']);
assert.deepEqual(moved[2].tags,['Sprint 24']);
const reassigned=reconcileTaskCards(tasks,[{id:'A',title:'Audit flow',columnId:'progress',assigneeId:'jules'}]);
assert.deepEqual(reassigned[0].assigneeIds,['jules','sam']);
const promoted=reconcileTaskCards(tasks,[{id:'A',title:'Audit flow',columnId:'progress',assigneeId:'sam'}]);
assert.deepEqual(promoted[0].assigneeIds,['sam']);
const cleared=reconcileTaskCards(tasks,[{id:'A',title:'Audit flow',columnId:'progress'}]);
assert.deepEqual(cleared[0].assigneeIds,[]);
const created=reconcileTaskCards(tasks,[{id:'NEW',title:'New task',columnId:'todo'}]);
assert.equal(created.length,4);assert.equal(created[3].list,'UI Design');
assert.deepEqual(tasks,original);
assert.equal(formatTaskDate('2026-10-19'),'Oct 19');assert.equal(formatTaskDate(''),'No date');
console.log('20 grouped-task assertions passed.');
