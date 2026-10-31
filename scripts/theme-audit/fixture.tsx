/** Local-only audit harness. Imports real registry components; Vite's production
 * entry does not include this page. No mocks of component markup/styles. */
import React, { Component, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import '../../src/index.css';
import { playgroundLoaders } from '../../src/docs/playground/loaders';
import { defaultsFor } from '../../src/docs/playground/schema';
import { variationTokens, presetAppearance } from '../../src/docs/playground/variation';
import { IconLibraryProvider } from '../../src/components/icon';
const routes = Object.keys(playgroundLoaders);
const query = new URLSearchParams(location.search);
const start = Number(query.get('start') ?? 0), count = Number(query.get('count') ?? 6);
const playgrounds = Object.fromEntries(await Promise.all(routes.slice(start, start + count).map(async route => [route, await playgroundLoaders[route]()] as const)));
const appearance = {...presetAppearance('oreo',query.has('dark')), radius:20,variation:{preset:'oreo' as const,density:1.25,accent:'#b45d3a'}};
const properties = {
  spacing: ['padding-top','padding-right','padding-bottom','padding-left','row-gap','column-gap','margin-top','margin-right','margin-bottom','margin-left','width','height'],
  radius:['border-top-left-radius','border-top-right-radius','border-bottom-left-radius','border-bottom-right-radius'],
  color:['color','background-color','border-top-color','outline-color','fill','stroke','accent-color','box-shadow'],
};
const results: Record<string,unknown> = {};
const probes: Record<string,()=>void> = {};
Object.assign(window,{__themeAuditResults:results});
class Boundary extends Component<{children:React.ReactNode;route:string},{error:string}>{state={error:''};static getDerivedStateFromError(error:Error){return {error:error.message}}render(){return this.state.error?<pre role="alert">{this.props.route}: {this.state.error}</pre>:this.props.children}}
function Specimen({route,custom=false}:{route:string;custom?:boolean}) {
 const spec=playgrounds[route], [values,setValues]=useState(defaultsFor(spec)), ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  if(!custom||!ref.current)return;
  probes[route]=()=>{
   if(!ref.current)return;
   const root=ref.current; root.classList.add("audit-probing");
   const read=()=>Array.from(root.querySelectorAll<HTMLElement>('*')).map(el=>{
    const style=getComputedStyle(el);return {tag:el.tagName,classes:typeof el.className==='string'?el.className:'svg',styles:Object.fromEntries(Object.values(properties).flat().map(p=>[p,style.getPropertyValue(p)]))};
   });
   const apply=(a:typeof appearance)=>{root.removeAttribute('style');Object.entries(variationTokens(a)).forEach(([k,v])=>root.style.setProperty(k,v));};
   const base={...appearance,radius:8,variation:{...appearance.variation,density:1,accent:null}};
   apply(base);const baseline=read();const axes:Record<string,unknown>={};
   for(const axis of ['spacing','radius','color'] as const){
    apply(axis==='spacing'?{...base,variation:{...base.variation,density:1.25}}:axis==='radius'?{...base,radius:20}:{...base,variation:{...base.variation,accent:'#b45d3a'}});
    const changed=read().flatMap((node,i)=>properties[axis].filter(p=>node.styles[p]!==baseline[i]?.styles[p]).map(p=>({element:i,tag:node.tag,classes:node.classes,property:p,before:baseline[i]?.styles[p],after:node.styles[p]})));
    axes[axis]={changes:changed.length,examples:changed.slice(0,8)};
   }
   const target=root.querySelector<HTMLElement>('button:not([disabled]),input:not([disabled]),a[href],[tabindex="0"]');
   if(target){
     target.focus({preventScroll:true}); apply(base); const focusedBase=read();
     apply({...base,variation:{...base.variation,accent:'#b45d3a'}});
     axes.focusColor={changes:read().reduce((count,node,i)=>count+properties.color.filter(p=>node.styles[p]!==focusedBase[i]?.styles[p]).length,0)};
     target.blur();
   }
   apply(appearance); root.classList.remove("audit-probing"); results[route]={elements:baseline.length,axes,roundCorners:baseline.filter(n=>properties.radius.some(p=>parseFloat(n.styles[p])>0&&parseFloat(n.styles[p])<100&&!n.styles[p].includes("%"))).map(n=>({tag:n.tag,classes:n.classes,radius:n.styles["border-top-left-radius"]})).slice(0,10)};
  }; return()=>{delete probes[route]};
 },[route,custom]);
 return <div ref={ref} className={'audit-specimen'+(appearance.dark?' theme-dark':'')} style={variationTokens(custom?appearance:presetAppearance('oreo',appearance.dark))}>{spec.render(values,(key,value)=>setValues(v=>({...v,[key]:value})))}</div>
}
function App(){return <IconLibraryProvider library="phosphor"><button className="audit-run" onClick={()=>Object.values(probes).forEach(probe=>probe())}>Run theme checks</button><style>{`
 .audit-probing, .audit-probing * {transition:none!important;animation:none!important} *{box-sizing:border-box}body{margin:0;font-family:'Inter Variable',sans-serif;background:#eee;color:#111}.audit-row{height:470px;background:white;border-bottom:1px solid #bbb;overflow:hidden}.audit-title{height:30px;margin:0;padding:6px 12px;font:12px monospace;display:flex;justify-content:space-between;background:#eee}.audit-pair{display:grid;grid-template-columns:1fr 1fr;height:440px}.audit-specimen{padding:24px;display:flex;justify-content:center;align-items:safe center;overflow:auto;min-width:0;color:var(--color-text-primary);background:var(--color-bg-elevated)}.audit-specimen>*{max-width:100%;flex-shrink:0}.audit-specimen+.audit-specimen{border-left:1px solid #bbb}
`}</style>{routes.slice(start,start+count).map(route=><section className="audit-row" key={route}><h2 className="audit-title"><span>{route} — Oreo default</span><span>Spacing 1.25 / Radius 20 / Accent #b45d3a</span></h2><div className="audit-pair"><Boundary route={route}><Specimen route={route}/></Boundary><Boundary route={route}><Specimen route={route} custom/></Boundary></div></section>)}</IconLibraryProvider>}
createRoot(document.getElementById('root')!).render(<App/>);
