import React, {useEffect, useState} from 'react';
import axios from 'axios';

function ModalShell({title, subtitle, onClose, children, width = 'min(1120px, 94vw)'}){
  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(2, 6, 23, 0.6)',
        backdropFilter: 'blur(10px)',
        zIndex: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        boxSizing: 'border-box',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        style={{
          width,
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#ffffff',
          color: '#1a1a1a',
          borderRadius: 24,
          border: '1px solid rgba(0, 102, 204, 0.14)',
          boxShadow: '0 30px 80px rgba(2, 6, 23, 0.35)',
        }}
      >
        <div style={{padding: '24px 28px 0'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'start'}}>
            <div>
              <div style={{fontSize: 12, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0066cc', marginBottom: 10}}>{subtitle}</div>
              <h3 style={{fontSize: 30, lineHeight: 1.1, margin: 0, fontWeight: 800}}>{title}</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{
                border: 'none',
                background: 'rgba(15, 23, 42, 0.06)',
                color: '#1a1a1a',
                borderRadius: 999,
                width: 40,
                height: 40,
                fontSize: 18,
                cursor: 'pointer',
              }}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        </div>
        <div style={{padding: 24}}>{children}</div>
      </div>
    </div>
  );
}

function DetailChip({label, value}){
  return (
    <div style={{background: '#f8f9fa', border: '1px solid #e5e7eb', borderRadius: 16, padding: 14}}>
      <div style={{fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0066cc', marginBottom: 6}}>{label}</div>
      <div style={{fontSize: 14, fontWeight: 600, lineHeight: 1.5}}>{value}</div>
    </div>
  );
}

function Field({label, value, onChange, placeholder, type = 'text', textarea = false, rows = 3}){
  const baseStyle = {
    width: '100%',
    boxSizing: 'border-box',
    borderRadius: 14,
    border: '1px solid #dbe3ef',
    background: '#fff',
    color: '#0f172a',
    padding: 14,
    fontSize: 14,
    outline: 'none',
    resize: 'vertical',
    minHeight: textarea ? 110 : 48,
  };

  return (
    <label style={{display: 'grid', gap: 8}}>
      <span style={{fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#475569'}}>{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={rows}
          style={baseStyle}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          style={baseStyle}
        />
      )}
    </label>
  );
}

export function ProjectDetailsModal({project, open, onClose}){
  if (!open || !project) {
    return null;
  }

  const [serverProject, setServerProject] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteStatus, setInviteStatus] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchProject(){
      try{
        if(project && project._id){
          const r = await axios.get('/api/projects/' + project._id);
          if(mounted) setServerProject(r.data);
        } else {
          setServerProject(null);
        }
      }catch(e){
        setServerProject(null);
      }
    }
    if(open) fetchProject();
    return ()=>{ mounted = false; };
  }, [open, project]);

  const title = (serverProject && serverProject.name) || project.title || project.name;
  const subtitle = project.tag || '';
  const description = (serverProject && serverProject.description) || project.description || '';
  const features = project.features || [];
  const team = project.team || [];
  const deliverables = project.deliverables || [];
  const metrics = project.metrics || [];
  const risks = project.risks || [];
  const teamValue = (team && team.length) ? team.join(', ') : (serverProject && serverProject.members ? serverProject.members.map(m => m.name).join(', ') : '');

  return (
    <ModalShell title={title} subtitle={subtitle} onClose={onClose}>
      <div style={{display: 'grid', gap: 20}}>
        <div style={{display: 'grid', gridTemplateColumns: '1.3fr 0.9fr', gap: 20}}>
          <div style={{background: '#f8f9fa', border: '1px solid #e5e7eb', borderRadius: 20, padding: 20}}>
            <div style={{fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#ff6b35', marginBottom: 10}}>Project Summary</div>
            <p style={{margin: 0, fontSize: 15, lineHeight: 1.7, color: '#475569'}}>{description}</p>
            <div style={{height: 16}} />
            <div style={{fontSize: 14, fontWeight: 700, marginBottom: 10}}>What this project covers</div>
            <ul style={{margin: 0, paddingLeft: 18, color: '#334155', lineHeight: 1.7}}>
              {features.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
          </div>
          <div style={{display: 'grid', gap: 12}}>
            <DetailChip label="Status" value={project.status} />
            <DetailChip label="Owner" value={project.owner || (serverProject && serverProject.createdBy && serverProject.createdBy.name)} />
            <DetailChip label="Client" value={project.client} />
            <DetailChip label="Timeline" value={project.timeline} />
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12}}>
          <DetailChip label="Team" value={teamValue} />
          <DetailChip label="Deliverables" value={deliverables.join(', ')} />
          <DetailChip label="Success Metrics" value={metrics.join(', ')} />
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20}}>
          <div style={{background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 20, padding: 20}}>
            <div style={{fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0066cc', marginBottom: 12}}>Work Plan</div>
            <div style={{display: 'grid', gap: 12}}>
              {deliverables.map((item, index) => (
                <div key={item} style={{display: 'flex', gap: 12, alignItems: 'flex-start'}}>
                  <div style={{width: 28, height: 28, borderRadius: 999, display: 'grid', placeItems: 'center', background: '#e6f0ff', color: '#0066cc', fontSize: 12, fontWeight: 800}}>{index + 1}</div>
                  <div style={{fontSize: 14, color: '#334155', lineHeight: 1.6}}>{item}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 20, padding: 20}}>
            <div style={{fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#ff6b35', marginBottom: 12}}>Risks and Notes</div>
            <ul style={{margin: 0, paddingLeft: 18, color: '#334155', lineHeight: 1.8}}>
              {risks.map((risk) => <li key={risk}>{risk}</li>)}
            </ul>
            <div style={{height: 16}} />
            <div style={{fontSize: 13, color: '#64748b', lineHeight: 1.7}}>
              This detail sheet summarizes the full project brief, the execution plan, and the reporting structure for this work stream.
            </div>
          </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <button
            type="button"
            onClick={onClose}
            style={{border: 'none', background: '#0066cc', color: '#fff', padding: '12px 20px', borderRadius: 12, fontWeight: 700, cursor: 'pointer'}}
          >
            Close Details
          </button>
        </div>
        {serverProject && (
          <div style={{marginTop:18, background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:12, padding:16}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div style={{fontSize:13,fontWeight:800,color:'#0f172a'}}>Project Members</div>
              <div style={{fontSize:12,color:'#64748b'}}>Manage members (admins only)</div>
            </div>
            <div style={{height:12}} />
            <div style={{display:'flex', gap:8, marginBottom:12}}>
              <input placeholder="Invite by email" value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)} style={{padding:10,borderRadius:8,border:'1px solid #d1d5db',flex:1}} />
              <button onClick={async ()=>{
                try{
                  setInviteStatus('looking');
                  const userRes = await axios.get('/api/users?email=' + encodeURIComponent(inviteEmail));
                  const user = userRes.data;
                  await axios.post('/api/projects/' + serverProject._id + '/members', {memberId: user._id});
                  const fresh = await axios.get('/api/projects/' + serverProject._id);
                  setServerProject(fresh.data);
                  setInviteStatus('ok'); setInviteEmail('');
                }catch(err){ setInviteStatus('err'); }
              }} style={{padding:'10px 14px', borderRadius:8, border:'none', background:'#0066cc', color:'#fff', fontWeight:700}}>Add</button>
            </div>
            {inviteStatus === 'err' && <div style={{color:'#b91c1c', fontSize:13}}>Invite failed — ensure the user exists.</div>}
            <div style={{display:'grid',gap:8}}>
              {serverProject.members && serverProject.members.map(m => (
                <div key={m._id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 10px',background:'#fff',borderRadius:8,border:'1px solid #e6eef7'}}>
                  <div style={{fontSize:14,fontWeight:700}}>{m.name} <span style={{fontSize:12,fontWeight:600,color:'#64748b'}}> — {m.email}</span></div>
                  <div style={{display:'flex',gap:8}}>
                    <button onClick={async ()=>{
                      try{
                        await axios.delete('/api/projects/' + serverProject._id + '/members/' + m._id);
                        const fresh = await axios.get('/api/projects/' + serverProject._id);
                        setServerProject(fresh.data);
                      }catch(e){ }
                    }} style={{border:'none',background:'#ef4444',color:'#fff',padding:'8px 10px',borderRadius:8,cursor:'pointer'}}>Remove</button>
                    </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ModalShell>
  );
}

export function CreateProjectModal({open, onClose}){
  const formTemplate = {
    projectName: 'New Project',
    projectTag: 'Planning',
    owner: 'Project Owner',
    client: 'Internal Team',
    priority: 'High',
    status: 'Draft',
    startDate: '',
    targetDate: '',
    budget: '$25,000',
    summary: 'Outline the work, expected outcomes, and delivery scope.',
    goals: 'Define the business goal, outcome, and success criteria.',
    team: 'Project manager, designer, developer, reviewer',
    milestones: 'Kickoff, discovery, design, build, QA, launch',
    deliverables: 'Plan, roadmap, milestones, reports, launch summary',
    risks: 'Scope changes, delayed approvals, blocked dependencies',
    successMetrics: 'Delivery date, scope completion, stakeholder approval',
    notes: 'Use this form to capture every project detail before work begins.',
  };

  const [form, setForm] = useState(formTemplate);

  useEffect(() => {
    if (open) {
      setForm(formTemplate);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const update = (field) => (value) => setForm((current) => ({...current, [field]: value}));

  const handleSubmit = (event) => {
    event.preventDefault();
    onClose();
  };

  return (
    <ModalShell title="Create Project" subtitle="Project Intake" onClose={onClose} width="min(1180px, 95vw)">
      <form onSubmit={handleSubmit} style={{display: 'grid', gap: 20}}>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16}}>
          <Field label="Project Name" value={form.projectName} onChange={update('projectName')} placeholder="Enter project name" />
          <Field label="Project Tag" value={form.projectTag} onChange={update('projectTag')} placeholder="Planning, Launch, Growth" />
          <Field label="Owner" value={form.owner} onChange={update('owner')} placeholder="Project owner" />
          <Field label="Client / Team" value={form.client} onChange={update('client')} placeholder="Internal or external client" />
          <Field label="Priority" value={form.priority} onChange={update('priority')} placeholder="High / Medium / Low" />
          <Field label="Status" value={form.status} onChange={update('status')} placeholder="Draft / Active / Review" />
          <Field label="Start Date" value={form.startDate} onChange={update('startDate')} type="date" />
          <Field label="Target Date" value={form.targetDate} onChange={update('targetDate')} type="date" />
          <Field label="Budget" value={form.budget} onChange={update('budget')} placeholder="$0.00" />
          <Field label="Success Metrics" value={form.successMetrics} onChange={update('successMetrics')} placeholder="How success will be measured" />
        </div>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16}}>
          <Field label="Project Summary" value={form.summary} onChange={update('summary')} textarea rows={4} placeholder="High-level summary" />
          <Field label="Goals and Outcomes" value={form.goals} onChange={update('goals')} textarea rows={4} placeholder="What this project should achieve" />
          <Field label="Team and Roles" value={form.team} onChange={update('team')} textarea rows={4} placeholder="Who will work on the project" />
          <Field label="Milestones" value={form.milestones} onChange={update('milestones')} textarea rows={4} placeholder="Major checkpoints and deadlines" />
          <Field label="Deliverables" value={form.deliverables} onChange={update('deliverables')} textarea rows={4} placeholder="What needs to be delivered" />
          <Field label="Risks and Dependencies" value={form.risks} onChange={update('risks')} textarea rows={4} placeholder="Possible blockers or dependencies" />
        </div>

        <Field label="Notes" value={form.notes} onChange={update('notes')} textarea rows={3} placeholder="Additional project notes" />

        <div style={{display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', flexWrap: 'wrap'}}>
          <div style={{fontSize: 13, color: '#64748b', lineHeight: 1.6}}>
            This is a full project intake form for planning and capture. It opens as a modal so you can review everything before moving ahead.
          </div>
          <div style={{display: 'flex', gap: 12}}>
            <button
              type="button"
              onClick={onClose}
              style={{border: '1px solid #dbe3ef', background: '#fff', color: '#1a1a1a', padding: '12px 18px', borderRadius: 12, fontWeight: 700, cursor: 'pointer'}}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{border: 'none', background: '#ff6b35', color: '#fff', padding: '12px 18px', borderRadius: 12, fontWeight: 700, cursor: 'pointer'}}
            >
              Save Project Draft
            </button>
          </div>
        </div>
      </form>
    </ModalShell>
  );
}
