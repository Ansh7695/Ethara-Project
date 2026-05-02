import React, {useEffect, useState} from 'react';
import axios from 'axios';

export default function ProjectsList({onSelect}){
  const [projects,setProjects] = useState([]);
  const [error,setError] = useState(null);
  useEffect(()=>{
    async function load(){
      try{
        const res = await axios.get('/api/projects');
        // API should return an array. Guard against error objects or single objects.
        const list = Array.isArray(res.data) ? res.data : (res.data && Array.isArray(res.data.projects) ? res.data.projects : []);
        setProjects(list);
      }catch(err){
        setProjects([]);
        if(err?.response?.status === 401){
          setError('Please sign in to view projects.');
        }else{
          setError('Unable to load projects.');
        }
      }
    }
    load();
  },[]);

  return (
    <div>
      <h3 style={{marginBottom:12}}>Projects</h3>
      <div>
        {error && <div style={{color:'#fca5a5'}}>{error}</div>}
        {!error && projects.length===0 && <div style={{color:'#94a3b8'}}>No projects — seed demo data or sign in.</div>}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:12}}>
          {projects.map(p=> {
            const initials = (p.name||'Project').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase();
            const progress = Math.min(100, Math.max(6, ((p.name||'').length * 7) % 101));
            return (
              <div key={p._id} onClick={() => onSelect && onSelect(p)} style={{background:'linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.01))',padding:14,borderRadius:14,display:'flex',flexDirection:'column',gap:10,boxShadow:'0 6px 18px rgba(2,6,23,0.45)',transition:'transform 220ms ease', cursor: onSelect ? 'pointer' : 'default'}}>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <div style={{width:56,height:56,borderRadius:12,flex:'0 0 56px',background:'linear-gradient(135deg,#06b6d4,#7c3aed)',display:'flex',alignItems:'center',justifyContent:'center',color:'#001018',fontWeight:800,fontSize:18}}>{initials}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:800,fontSize:16}}>{p.name || 'Untitled'}</div>
                    <div style={{fontSize:12,color:'#94a3b8'}}>{p.description || 'No description'}</div>
                  </div>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
                  <div style={{flex:1}}>
                    <div style={{height:8,background:'rgba(255,255,255,0.04)',borderRadius:8,overflow:'hidden'}}>
                      <div style={{width:`${progress}%`,height:'100%',background:'linear-gradient(90deg,#34d399,#60a5fa)'}} />
                    </div>
                    <div style={{fontSize:11,color:'#94a3b8',marginTop:6}}>{progress}% complete</div>
                  </div>
                  <div style={{textAlign:'right',minWidth:120}}>
                    <div style={{fontSize:12,color:'#94a3b8'}}>Members</div>
                    <div style={{fontSize:13}}>{(p.members&&p.members.length)?p.members.map(m=>m.name).slice(0,3).join(', '):'—'}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
