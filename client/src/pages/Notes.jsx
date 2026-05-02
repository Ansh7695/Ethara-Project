import React, {useEffect, useState} from 'react';
import axios from 'axios';

export default function NotesPage(){
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [dueAt, setDueAt] = useState('');
  const [loading, setLoading] = useState(false);

  async function load(){
    try{
      setLoading(true);
      const r = await axios.get('/api/notes');
      const data = r.data;
      const list = Array.isArray(data) ? data : (data && Array.isArray(data.notes) ? data.notes : []);
      setNotes(list);
    }catch(e){ console.error(e); }
    finally{ setLoading(false); }
  }

  useEffect(()=>{ load(); }, []);

  async function handleAdd(e){
    e.preventDefault();
    try{
      const r = await axios.post('/api/notes', {title, content, dueAt: dueAt || null});
      setNotes([r.data, ...notes]);
      setTitle(''); setContent(''); setDueAt('');
    }catch(err){ console.error(err); }
  }

  async function handleDelete(id){
    if(!confirm('Delete this note?')) return;
    try{ await axios.delete('/api/notes/' + id); setNotes(notes.filter(n=>n._id!==id)); }catch(e){console.error(e);}  }

  async function handleToggleComplete(note){
    // simple example: append a timestamp to content as completed indicator
    const updated = {...note, content: (note.content||'') + '\n\n[Completed at ' + new Date().toLocaleString() + ']'};
    try{ const r = await axios.put('/api/notes/' + note._id, updated); setNotes(notes.map(n=>n._id===note._id?r.data:n)); }catch(e){console.error(e);} }

  return (
    <div style={{maxWidth:980,margin:'28px auto',padding:20}}>
      <h2>Notes & Todos</h2>
      <form onSubmit={handleAdd} style={{display:'grid',gap:10,marginBottom:18}}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" style={{padding:10,borderRadius:8,border:'1px solid #e2e8f0'}} required />
        <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Details" rows={4} style={{padding:10,borderRadius:8,border:'1px solid #e2e8f0'}} />
        <label style={{display:'flex',gap:8,alignItems:'center'}}>
          <div style={{fontSize:13,color:'#64748b'}}>Due (optional)</div>
          <input type="datetime-local" value={dueAt} onChange={e=>setDueAt(e.target.value)} style={{padding:8,borderRadius:8,border:'1px solid #e2e8f0'}} />
        </label>
        <div>
          <button type="submit" style={{padding:'10px 14px',background:'#0066cc',color:'#fff',border:'none',borderRadius:8}}>Add Note</button>
        </div>
      </form>

      <div>
        {loading && <div>Loading...</div>}
        {!loading && notes.length===0 && <div style={{color:'#94a3b8'}}>No notes yet.</div>}
        <div style={{display:'grid',gap:10}}>
          {notes.map(n=> (
            <div key={n._id} style={{padding:12,borderRadius:8,background:'#fff',border:'1px solid #e6eef7'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <div style={{fontWeight:800}}>{n.title}</div>
                  <div style={{fontSize:12,color:'#64748b'}}>{n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}{n.dueAt ? ' • due ' + new Date(n.dueAt).toLocaleString() : ''}</div>
                </div>
                <div style={{display:'flex',gap:8}}>
                  <button onClick={()=>handleToggleComplete(n)} style={{padding:'8px 10px',borderRadius:8,border:'none',background:'#10b981',color:'#fff'}}>Mark</button>
                  <button onClick={()=>handleDelete(n._id)} style={{padding:'8px 10px',borderRadius:8,border:'none',background:'#ef4444',color:'#fff'}}>Delete</button>
                </div>
              </div>
              <div style={{whiteSpace:'pre-wrap',marginTop:10,color:'#334155'}}>{n.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
