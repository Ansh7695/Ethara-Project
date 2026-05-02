import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate, Link} from 'react-router-dom';

export default function Signup(){
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState(null);
  const navigate = useNavigate();

  const handle = async (e)=>{
    e.preventDefault();
    try{
      await axios.post('/api/auth/signup',{name,email,password});
      const r = await axios.post('/api/auth/login',{email,password});
      localStorage.setItem('demo_token', r.data.token);
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + r.data.token;
      navigate('/dashboard');
    }catch(err){ setError(err.response?.data?.error || 'Signup failed'); }
  };

  return (
    <div style={{maxWidth:640,margin:'40px auto',padding:24,background:'#fff',borderRadius:12}}>
      <h2 style={{marginTop:0}}>Create account</h2>
      {error && <div style={{color:'#b91c1c'}}>{error}</div>}
      <form onSubmit={handle} style={{display:'grid',gap:12}}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" style={{padding:12,borderRadius:8,border:'1px solid #e2e8f0'}} />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={{padding:12,borderRadius:8,border:'1px solid #e2e8f0'}} />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" style={{padding:12,borderRadius:8,border:'1px solid #e2e8f0'}} />
        <div style={{display:'flex',gap:8}}>
          <button type="submit" style={{padding:'10px 14px',background:'#0066cc',color:'#fff',border:'none',borderRadius:8}}>Create</button>
          <Link to="/login" style={{padding:'10px 14px',background:'#eef2ff',color:'#0f172a',borderRadius:8,textDecoration:'none'}}>Have an account?</Link>
        </div>
      </form>
    </div>
  );
}
