import React from 'react';

export default function Gallery(){
  const grid = {display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12};
  const thumb = {background:'linear-gradient(180deg, rgba(18, 35, 70, 0.95) 0%, rgba(16, 25, 48, 0.95) 100%)',minHeight:180,borderRadius:18,display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:16,color:'#e6eef7',border:'1px solid rgba(255,255,255,0.08)',boxShadow:'0 20px 50px rgba(0,0,0,0.22)'};
  return (
    <div>
      <h3 style={{marginBottom:12}}>Demo Gallery</h3>
      <p style={{color:'#94a3b8',marginTop:0}}>These cards preview sample creative assets, feature shots, and campaign moments.</p>
      <div style={grid}>
        <div style={thumb}>
          <div style={{fontSize:12,color:'#94a3b8'}}>Campaign Frame</div>
          <div style={{fontWeight:700,marginTop:8}}>Launch visual with depth and glow</div>
        </div>
        <div style={thumb}>
          <div style={{fontSize:12,color:'#94a3b8'}}>Interface Shot</div>
          <div style={{fontWeight:700,marginTop:8}}>Glass panels and motion cues</div>
        </div>
        <div style={thumb}>
          <div style={{fontSize:12,color:'#94a3b8'}}>Service Card</div>
          <div style={{fontWeight:700,marginTop:8}}>Feature blocks for key offerings</div>
        </div>
        <div style={thumb}>
          <div style={{fontSize:12,color:'#94a3b8'}}>Client Story</div>
          <div style={{fontWeight:700,marginTop:8}}>Proof points and testimonial space</div>
        </div>
      </div>
    </div>
  );
}
