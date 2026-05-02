import React, {useState} from 'react';
import axios from 'axios';

export default function ContactForm(){
  const [form,setForm] = useState({name:'',email:'',message:''});
  const [status,setStatus] = useState(null);
  const [loading,setLoading] = useState(false);
  const onChange = e => setForm({...form,[e.target.name]:e.target.value});
  const onSubmit = async (e)=>{
    e.preventDefault();
    try{
      setLoading(true);
      setStatus(null);
      await axios.post('/api/contact', form);
      setStatus({type:'success', text:'Thanks — message saved.'});
      setForm({name:'',email:'',message:''});
    }catch(err){
      setStatus({type:'error', text:'Error sending message'});
    }finally{
      setLoading(false);
    }
  };

  const input = {padding:12,borderRadius:14,border:'1px solid rgba(255,255,255,0.08)',background:'rgba(255,255,255,0.03)',color:'inherit',width:'100%',outline:'none',boxSizing:'border-box'};
  return (
    <div style={{background:'rgba(255,255,255,0.04)',padding:24,borderRadius:24,border:'1px solid rgba(255,255,255,0.08)',boxShadow:'0 24px 60px rgba(0,0,0,0.28)'}}>
      <h3 style={{marginBottom:12}}>Contact</h3>
      <p style={{color:'#94a3b8'}}>Want this for your project? Email or use the form below.</p>
      <form onSubmit={onSubmit} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        <input name="name" value={form.name} onChange={onChange} placeholder="Your name" required style={input} />
        <input name="email" value={form.email} onChange={onChange} placeholder="Email" type="email" required style={input} />
        <textarea name="message" value={form.message} onChange={onChange} placeholder="Message" rows={4} style={{...input,gridColumn:'1 / -1',resize:'vertical'}}></textarea>
        <button style={{padding:'12px 18px',borderRadius:14,background:'linear-gradient(90deg,#6ee7b7,#5eead4)',color:'#022',border:'none',fontWeight:700,cursor:'pointer',justifySelf:'start',opacity:loading ? 0.75 : 1}} type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send'}</button>
      </form>
      {status && <div style={{marginTop:12,color:status.type === 'success' ? '#6ee7b7' : '#fca5a5'}}>{status.text}</div>}
    </div>
  );
}
