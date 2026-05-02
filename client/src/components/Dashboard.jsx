import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {CreateProjectModal} from './ProjectModals';

export default function Dashboard(){
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);

  useEffect(() => {
    async function load(){
      try{
        const res = await axios.get('/api/dashboard');
        setData(res.data);
      }catch(error){
        setData({error:true});
      }
    }

    load();
  }, []);

  const card = {background:'rgba(255,255,255,0.04)',padding:18,borderRadius:12,minWidth:140,textAlign:'center'};

  if(!data) return <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}><div style={card}>Loading...</div></div>;
  if(data.error) return <div style={{color:'#fca5a5'}}>Sign in or seed demo data first.</div>;

  return (
    <div>
      <h3 style={{marginBottom:12}}>Dashboard</h3>
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:12,alignItems:'start'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
          <div style={card}>
            <div style={{fontSize:12,color:'#94a3b8'}}>Total Tasks</div>
            <div style={{fontSize:22,fontWeight:800}}>{data.total}</div>
          </div>
          <div style={card}>
            <div style={{fontSize:12,color:'#94a3b8'}}>To Do</div>
            <div style={{fontSize:22,fontWeight:800}}>{data.todo}</div>
          </div>
          <div style={card}>
            <div style={{fontSize:12,color:'#94a3b8'}}>In Progress</div>
            <div style={{fontSize:22,fontWeight:800}}>{data.inprogress}</div>
          </div>
        </div>

        <div style={{background:'rgba(255,255,255,0.03)',padding:14,borderRadius:12,minHeight:100}}>
          <div style={{fontSize:12,color:'#94a3b8',marginBottom:8}}>Status Overview</div>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <svg width="120" height="120" viewBox="0 0 42 42" style={{transform:'rotate(-90deg)'}}>
              <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
              {(() => {
                const total = Math.max(1, data.total || (data.todo + data.inprogress + data.overdue));
                const todoP = ((data.todo || 0) / total) * 100;
                const inP = ((data.inprogress || 0) / total) * 100;
                const overP = ((data.overdue || 0) / total) * 100;
                const todoDash = `${todoP} ${100 - todoP}`;
                const inDash = `${inP} ${100 - inP}`;
                const overDash = `${overP} ${100 - overP}`;
                return (
                  <g>
                    <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#7dd3fc" strokeWidth="6" strokeDasharray={todoDash} strokeDashoffset="0" />
                    <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#60a5fa" strokeWidth="6" strokeDasharray={inDash} strokeDashoffset={`${-todoP}`} />
                    <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#fb7185" strokeWidth="6" strokeDasharray={overDash} strokeDashoffset={`${-(todoP + inP)}`} />
                  </g>
                );
              })()}
            </svg>
            <div>
              <div style={{fontSize:14,fontWeight:700}}>{data.total} Tasks</div>
              <div style={{fontSize:12,color:'#94a3b8'}}>To Do: {data.todo} · In Progress: {data.inprogress} · Overdue: {data.overdue}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{height:12}} />
      <div style={{display:'flex',gap:12}}>
        <div style={{flex:1,background:'rgba(255,255,255,0.02)',padding:14,borderRadius:12}}>
          <div style={{fontSize:13,color:'#94a3b8',marginBottom:8}}>Quick Actions</div>
          <div style={{display:'flex',gap:8}}>
            <button onClick={() => setCreateProjectOpen(true)} style={{flex:1,background:'#06b6d4',border:'none',color:'#001018',padding:10,borderRadius:8,fontWeight:700,cursor:'pointer'}}>Create Project</button>
            <button onClick={() => navigate('/projects')} style={{flex:1,background:'transparent',border:'1px solid rgba(255,255,255,0.06)',color:'#fff',padding:10,borderRadius:8,cursor:'pointer'}}>New Task</button>
          </div>
        </div>
        <div style={{width:260,background:'rgba(255,255,255,0.02)',padding:14,borderRadius:12}}>
          <div style={{fontSize:13,color:'#94a3b8',marginBottom:8}}>Activity</div>
          <div style={{fontSize:12,color:'#cbd5e1'}}>No recent activity — use seed/demo to populate sample events.</div>
        </div>
      </div>

      <CreateProjectModal open={createProjectOpen} onClose={() => setCreateProjectOpen(false)} />
    </div>
  );
}
