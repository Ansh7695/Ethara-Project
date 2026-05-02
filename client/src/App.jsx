import React, {useEffect} from 'react';
import {BrowserRouter, NavLink, Route, Routes, Link, useNavigate} from 'react-router-dom';
import LiveBackground from './components/LiveBackground';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import GalleryPage from './pages/GalleryPage';
import DashboardPage from './pages/DashboardPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import NotesPage from './pages/Notes';
import axios from 'axios';

const navItems = [
  {to:'/', label:'Home', end:true},
  {to:'/dashboard', label:'Dashboard'},
  {to:'/projects', label:'Projects'},
    {to:'/notes', label:'Notes'},
  {to:'/gallery', label:'Gallery'},
  {to:'/about', label:'About'},
  {to:'/contact', label:'Contact'},
];

function Shell(){
  const navigate = useNavigate();

  const appStyle = {
    fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
    background: '#ffffff',
    minHeight: '100vh',
    color: '#1a1a1a',
    position: 'relative',
    overflow: 'hidden',
  };
  const container = {maxWidth:1200, margin:'0 auto', padding:'28px 24px', position:'relative', zIndex:1};
  const navLink = ({isActive}) => ({color:isActive ? '#ffffff' : '#555555', textDecoration:'none', fontWeight:700, padding:'10px 14px', borderRadius:8, background:isActive ? '#0066cc' : 'transparent', transition: 'all 0.3s ease'});
  const navButton = {padding:'10px 16px', borderRadius:8, border:'none', background: '#0066cc', color:'#fff', cursor:'pointer', fontWeight:700, marginLeft: 8, transition: 'all 0.3s ease'};

  useEffect(()=>{
    const token = localStorage.getItem('demo_token');
    if(token){
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    }
  },[]);

  return (
    <div style={appStyle}>
      <LiveBackground />
      <style>{`html { scroll-behavior: smooth; }
        .hero-outer { grid-template-columns: 1fr 1fr; }
        .hero-canvas canvas { width:100% !important; height:100% !important; display:block }

        @media (max-width: 980px) {
          .hero-outer { grid-template-columns: 1fr; gap:16px; }
          main { padding: 20px 0; }
        }

        @media (max-width: 640px) {
          .hero-canvas { min-height: 280px !important; }
          header { position: sticky; }
        }
      `}</style>

      <header style={{position:'sticky',top:0,zIndex:20,padding:'14px 18px',backdropFilter:'blur(18px)',background:'rgba(255,255,255,0.95)',borderBottom:'2px solid #e0e0e0',boxShadow:'0 2px 8px rgba(0,0,0,0.05)'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,maxWidth:1200,margin:'0 auto',flexWrap:'wrap'}}>
          <Link to="/" style={{display:'flex',alignItems:'center',gap:12,textDecoration:'none',color:'#0066cc'}}>
            <img src="/assets/logo.svg" alt="logo" style={{width:42,height:42,borderRadius:8,boxShadow:'0 4px 12px rgba(0,102,204,0.2)'}}/>
            <div>
              <h1 style={{fontSize:18,margin:0,letterSpacing:'0.08em',color:'#0066cc'}}>Ethara</h1>
              <div style={{fontSize:12,color:'#888888'}}>Modern Platform</div>
            </div>
          </Link>

          <nav style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap',justifyContent:'flex-end'}}>
            {navItems.map(item => <NavLink key={item.to} to={item.to} end={item.end} style={navLink}>{item.label}</NavLink>)}
          </nav>

          <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
            {localStorage.getItem('demo_token') ? (
              <button type="button" onClick={() => { localStorage.removeItem('demo_token'); delete axios.defaults.headers.common['Authorization']; navigate('/login'); }} style={{...navButton,background:'#ef4444'}}>Logout</button>
            ) : (
              <>
                <Link to="/login" style={{...navButton,background:'#e6eef7',color:'#0f172a',textDecoration:'none'}}>Login</Link>
                <Link to="/signup" style={{...navButton,background:'#eef2ff',color:'#0f172a',textDecoration:'none'}}>Sign up</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main id="top" style={{position:'relative',zIndex:1}}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
          <Route path="/notes" element={<ProtectedRoute><NotesPage /></ProtectedRoute>} />
          <Route path="/gallery" element={<ProtectedRoute><GalleryPage /></ProtectedRoute>} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>

      <footer style={{padding:28, textAlign:'center', color:'#94a3b8', position:'relative', zIndex:1}}>© NebulaBento — multi-page MERN demo</footer>
    </div>
  );
}

export default function App(){
  const appStyle = {
    fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
    background: 'radial-gradient(circle at top, #0f2346 0%, #071426 45%, #030816 100%)',
    minHeight: '100vh',
    color: '#e6eef7',
    position: 'relative',
    overflow: 'hidden',
  };
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}
