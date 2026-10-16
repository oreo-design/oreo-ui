import test from 'node:test';
import assert from 'node:assert/strict';
import {parseMinor,convertMinor,balanceTotal,applyOperation,cashFlowDays,visibleEntries} from '../../src/components/currency-finance/model.ts';
import {INITIAL_WALLET} from '../../src/patterns/cross-currency/data.ts';
const base={kind:'out',currency:'USD',amount:'100.25',recipient:'Alex',to:'GBP',date:'2026-10-20'};
test('decimal parsing rejects ambiguous, negative and fractional-minor amounts',()=>{
 assert.equal(parseMinor('100.25'),10025);assert.equal(parseMinor(' 0.01 '),1);assert.equal(parseMinor('2.5'),250);
 for(const text of ['0','-1','1e3','1,000','.5','1.001','Infinity','99999999999',''])assert.equal(parseMinor(text),null,text);
});
test('rational conversion rounds half up once and identity is exact',()=>{
 assert.equal(convertMinor(10000,'USD','GBP'),8000);assert.equal(convertMinor(10000,'GBP','USD'),12500);
 assert.equal(convertMinor(800,'NGN','USD'),1);assert.equal(convertMinor(799,'NGN','USD'),0);
 assert.equal(convertMinor(6879450000,'NGN','NGN'),6879450000);
 assert.equal(balanceTotal(INITIAL_WALLET.accounts,'USD'),21178926);
 assert.throws(()=>convertMinor(Number.MAX_SAFE_INTEGER,'GBP','NGN'),RangeError);
});
test('conversion changes both accounts atomically without mutating baseline',()=>{
 const before=JSON.stringify(INITIAL_WALLET);const result=applyOperation(INITIAL_WALLET,{...base,kind:'exchange',amount:'100'},'x');
 assert.equal(result.accounts.find(a=>a.currency==='USD').balance,9990000);assert.equal(result.accounts.find(a=>a.currency==='GBP').balance,3725472);
 assert.equal(result.entries[0].received,8000);assert.equal(JSON.stringify(INITIAL_WALLET),before);
 for(const op of [{...base,kind:'exchange',to:'USD'},{...base,kind:'exchange',to:'EUR'},{...base,amount:'100000.01'},{...base,recipient:' '}])assert.throws(()=>applyOperation(INITIAL_WALLET,op,'bad'));
 assert.throws(()=>applyOperation(INITIAL_WALLET,{...base,kind:'exchange',currency:'NGN',to:'USD',amount:'0.01'},'dust'));
});
test('posted add/send changes balances; drafts never move or reserve funds',()=>{
 const sent=applyOperation(INITIAL_WALLET,base,'send');assert.equal(sent.accounts.find(a=>a.currency==='USD').balance,9989975);
 const added=applyOperation(INITIAL_WALLET,{...base,kind:'in'},'add');assert.equal(added.accounts.find(a=>a.currency==='USD').balance,10010025);
 for(const kind of ['request','scheduled']){const result=applyOperation(INITIAL_WALLET,{...base,kind},kind);assert.deepEqual(result.accounts,INITIAL_WALLET.accounts);assert.equal(result.entries.length,10);}
 for(const date of ['2026-10-16','2026-02-30','2026-13-20','bad'])assert.throws(()=>applyOperation(INITIAL_WALLET,{...base,kind:'scheduled',date},'bad'));
});
test('filters include conversion destinations and bound the week; cash flow excludes all drafts/conversions',()=>{
 let wallet=applyOperation(INITIAL_WALLET,{...base,kind:'exchange',amount:'100'},'exchange');
 wallet=applyOperation(wallet,{...base,kind:'scheduled'},'scheduled');wallet=applyOperation(wallet,{...base,kind:'request'},'request');
 assert.equal(visibleEntries(wallet.entries,'converted','GBP','week').length,1);
 assert.equal(visibleEntries(wallet.entries,'scheduled','all','week').length,0);
 assert.equal(visibleEntries(wallet.entries,'scheduled','all','all').length,1);
 assert.deepEqual(cashFlowDays(wallet.entries,'all'),cashFlowDays(INITIAL_WALLET.entries,'all'));
 assert.equal(cashFlowDays(wallet.entries,'week').length,7);
 assert.deepEqual(cashFlowDays(wallet.entries,'week').find(d=>d.date==='2026-10-15'),{date:'2026-10-15',incoming:62500,outgoing:0});
});
