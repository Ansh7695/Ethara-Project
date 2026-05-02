import React from 'react';

export default function BentoGrid(){
  const grid = {display:'grid',gridTemplateColumns:'repeat(6, 1fr)',gridAutoRows:'minmax(120px, auto)',gap:18};
  const cardBase = {background:'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',padding:18,borderRadius:18,color:'#dff7ee',border:'1px solid rgba(255,255,255,0.08)',boxShadow:'0 20px 50px rgba(0,0,0,0.22)',boxSizing:'border-box',overflow:'hidden',display:'flex',flexDirection:'column',justifyContent:'space-between'};
  return (
    <div>
      <h3 style={{marginBottom:12}}>Workspace Highlights</h3>
      <p style={{color:'#94a3b8',marginTop:0}}>Each container below is filled with sample content so the page feels like a real launch page.</p>
      <div style={grid}>
        <article style={{...cardBase, gridColumn:'1 / span 3', gridRow:'1 / span 2'}}> 
          <div style={{fontSize:12,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.08em'}}>01 / Featured Offer</div>
          <h5 style={{margin:'10px 0 8px'}}>Studio Launch Pack</h5>
          <p>Homepage hero, section storytelling, and conversion-focused content system for a premium product or agency launch.</p>
          <div style={{marginTop:18,display:'flex',gap:8,flexWrap:'wrap'}}>
            <span style={{padding:'6px 10px',borderRadius:999,background:'rgba(110,231,183,0.12)'}}>Hero</span>
            <span style={{padding:'6px 10px',borderRadius:999,background:'rgba(96,165,250,0.12)'}}>CTA</span>
            <span style={{padding:'6px 10px',borderRadius:999,background:'rgba(255,255,255,0.08)'}}>Story</span>
          </div>
        </article>
        <article style={{...cardBase, gridColumn:'4 / span 2', gridRow:'1 / span 2'}}>
          <div style={{fontSize:12,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.08em'}}>02 / Release Notes</div>
          <h5 style={{margin:'10px 0 8px'}}>What’s Included</h5>
          <p>Sticky nav, 3D hero, live background, API-backed contact form, and responsive layouts across all sections.</p>
          <div style={{marginTop:18,lineHeight:1.8,color:'#cbd5e1'}}> 
            <div>• Motion-first UI</div>
            <div>• Reusable content cards</div>
            <div>• Working backend form</div>
          </div>
        </article>
        <article style={{...cardBase}}>
          <div style={{fontSize:12,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.08em'}}>03 / KPI</div>
          <h5 style={{margin:'10px 0 8px'}}>Engagement Snapshot</h5>
          <p>Average scroll depth, CTA clicks, and demo inquiries appear here in a future analytics integration.</p>
          <div style={{fontSize:28,fontWeight:800,marginTop:16,color:'#6ee7b7'}}>92%</div>
        </article>
        <article style={{...cardBase}}>
          <div style={{fontSize:12,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.08em'}}>04 / Services</div>
          <h5 style={{margin:'10px 0 8px'}}>Creative Stack</h5>
          <p>Design system, motion, deployment, and content strategy presented as a modular service grid.</p>
        </article>
        <article style={{...cardBase, gridColumn:'1 / span 6'}}>
          <div style={{fontSize:12,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.08em'}}>05 / Timeline</div>
          <h5 style={{margin:'10px 0 8px'}}>Project Roadmap</h5>
          <p>Discovery, UI composition, animation pass, backend integration, and final QA all shown as a clear delivery timeline for clients.</p>
        </article>
      </div>
    </div>
  );
}
