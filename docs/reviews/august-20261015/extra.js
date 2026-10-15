const p=state.august,dir='/Users/ziye/Documents/Project/Research/oreo-ui-august-20261015/docs/reviews/august-20261015/';
const see=async()=>{console.log((await snapshot({page:p})).split('\n').filter(x=>/URL:|heading|dialog|tabpanel/.test(x)).slice(-6).join('\n'));console.log(await getLatestLogs({page:p,sinceLastCall:true}));};
const check=(ok,m)=>{if(!ok)throw Error(m);console.log('PASS '+m)};
await p.setViewportSize({width:1440,height:1000});await p.reload();await see();
await p.screenshot({path:dir+'after-desktop-final.png',scale:'css',fullPage:true});
await p.getByRole('button',{name:'Simulate deploy',exact:true}).click();await see();
await p.getByRole('heading',{name:'Deployment #4132',exact:true}).click();await see();await p.keyboard.press('Escape');await see();check(await p.getByRole('dialog').count()===0,'Escape dismisses release detail');console.log('RESTORED FOCUS',await p.locator(':focus').textContent());
for(const width of [1251,1250,851,850,601,600]){await p.setViewportSize({width,height:900});await see();console.log('BOUNDARY '+width,await inspect({locator:p.locator('.edge-observatory'),properties:['width']}));}
await p.setViewportSize({width:390,height:844});await p.getByRole('tab',{name:'Logs',exact:true}).click();await see();console.log('MOBILE LOGS',await inspect({locator:p.locator('.edge-observatory'),properties:['width']}));console.log('TABLE',await inspect({locator:p.getByRole('region',{name:'Request log table',exact:true}),properties:['overflow-x']}));await p.screenshot({path:dir+'after-mobile-logs.png',scale:'css',fullPage:true});
await p.setViewportSize({width:1440,height:1000});await p.goto('http://localhost:5210/edge-monitor?view=docs');await see();await p.screenshot({path:dir+'after-docs.png',scale:'css'});
await p.getByRole('button',{name:'Open playground',exact:true}).click();await see();await p.screenshot({path:dir+'after-playground.png',scale:'css'});
console.log('PLAYGROUND SNAPSHOT', (await snapshot({page:p,showDiffSinceLastCall:false})).slice(-5500));
