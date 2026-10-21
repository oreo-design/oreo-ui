import React from 'react';
import { createRoot } from 'react-dom/client';
import { Icon, ICON_NAMES } from '@/components/icon';
import { PlusGlyph, CodeGlyph, LinkGlyph, TextGlyph, FolderGlyph } from '@/components/keyword-tag';
import { Attachment, SpinnerDots } from '@/components/attachment';
import { Tag } from '@/components/tag';
import { KeywordTag } from '@/components/keyword-tag';
import '@/index.css';
const dark = new URLSearchParams(location.search).has('dark');
function Sheet() { return <main className={dark?'theme-dark':''} style={{padding:32,background:'var(--color-bg-base)',color:'var(--color-text-primary)',fontFamily:'sans-serif'}}>
<h1>Registered operation icons</h1><p>Real Icon adapter and component consumers. Default website library.</p>
<div style={{display:'grid',gridTemplateColumns:'repeat(10,1fr)',gap:16}}>{ICON_NAMES.map(name=><div key={name} style={{height:64,display:'flex',alignItems:'center',flexDirection:'column',gap:8}}><Icon name={name}/><span style={{fontSize:11}}>{name}</span></div>)}</div>
<h2>Preserved Figma kit consumers</h2><div style={{display:'flex',gap:24,alignItems:'center'}}><PlusGlyph className="size-4"/><CodeGlyph className="size-4"/><LinkGlyph className="size-4"/><TextGlyph className="size-4"/><FolderGlyph className="size-4"/><SpinnerDots className="size-4"/><Tag onRemove={()=>{}}>Removable tag</Tag><KeywordTag onRemove={()=>{}}>Keyword</KeywordTag></div>
<div style={{display:'flex',gap:16,marginTop:24}}>{(['doc','text','code','json','music','unknown','link','pdf'] as const).map(type=><Attachment key={type} type={type} label={`${type} file`} onRemove={()=>{}}/>)}</div>
</main> };
createRoot(document.getElementById('root')!).render(<Sheet/>);
