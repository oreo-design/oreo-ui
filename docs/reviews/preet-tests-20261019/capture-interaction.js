const fs=require('node:fs');
const observe=async()=>{console.log((await snapshot({page:state.app,showDiffSinceLastCall:false})).split('\n').filter(l=>/role=button|heading|status:/.test(l)).slice(-18).join('\n'));};
await ghostCursor.hide({page:state.app});
await observe();
fs.mkdirSync(state.evidence+'/interaction-frames',{recursive:true});
state.cdp=await getCDPSession({page:state.app});state.frames=[];
state.frameHandler=async frame=>{const name=String(state.frames.length).padStart(5,'0')+'.jpg';fs.writeFileSync(state.evidence+'/interaction-frames/'+name,Buffer.from(frame.data,'base64'));state.frames.push({name,time:frame.metadata.timestamp});await state.cdp.send('Page.screencastFrameAck',{sessionId:frame.sessionId});};
state.cdp.on('Page.screencastFrame',state.frameHandler);
await state.cdp.send('Page.startScreencast',{format:'jpeg',quality:85,maxWidth:1440,maxHeight:1200,everyNthFrame:1});
try {
await new Promise(r=>setTimeout(r,500));
await state.app.getByRole('button',{name:'Run test suite',exact:true}).click();await observe();
await new Promise(r=>setTimeout(r,700));
await state.app.screenshot({path:state.evidence+'/after-running-r3.png'});
await state.app.getByRole('button',{name:/src\/cart\/pricing.test.ts/}).click();await observe();
await state.app.getByRole('button',{name:'Rerun failed',exact:true}).waitFor({state:'visible'});await observe();
console.log('Manual file remains collapsed:',await state.app.getByRole('button',{name:/src\/cart\/pricing.test.ts/}).getAttribute('aria-expanded'));
await state.app.getByRole('button',{name:/src\/cart\/pricing.test.ts/}).click();await observe();
await new Promise(r=>setTimeout(r,700));
await state.app.getByRole('button',{name:'Failed 2',exact:true}).click();await observe();await new Promise(r=>setTimeout(r,700));
await state.app.getByRole('button',{name:'Ask to fix failures',exact:true}).click();await observe();
await state.app.getByRole('region',{name:'Proposed sample fix',exact:true}).scrollIntoViewIfNeeded();await new Promise(r=>setTimeout(r,1000));
await state.app.screenshot({path:state.evidence+'/after-fix-proposal-r3.png'});
await state.app.getByRole('button',{name:'Apply sample fix & rerun',exact:true}).click();await observe();
await state.app.getByRole('button',{name:/19 passed, 1 skipped/}).waitFor({state:'visible'});await observe();
await state.app.evaluate(()=>window.scrollTo(0,0));await new Promise(r=>setTimeout(r,1200));
} finally {await state.cdp.send('Page.stopScreencast');state.cdp.off('Page.screencastFrame',state.frameHandler);fs.writeFileSync(state.evidence+'/interaction-frames/timing.json',JSON.stringify(state.frames,null,2));console.log('Frames:',state.frames.length);}
