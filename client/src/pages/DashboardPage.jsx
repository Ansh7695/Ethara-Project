import React from 'react';
import {useNavigate} from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import {galleryShots} from '../data/demoContent';

export default function DashboardPage(){
  const navigate = useNavigate();
  const colors = {
    bg: '#ffffff',
    bgAlt: '#f8f9fa',
    text: '#1a1a1a',
    textLight: '#555555',
    blue: '#0066cc',
    blueLight: '#e6f0ff',
    coral: '#ff6b35',
    border: '#e0e0e0',
    shadow: 'rgba(0, 102, 204, 0.08)',
  };

  const section = {maxWidth: 1200, margin: '0 auto', padding: '60px 24px', boxSizing: 'border-box'};
  const card = {
    background: colors.bg,
    border: `2px solid ${colors.border}`,
    borderRadius: 12,
    boxShadow: `0 4px 12px ${colors.shadow}`,
    overflow: 'hidden',
  };
  const heading2 = {fontSize: 32, fontWeight: 700, color: colors.text};
  const heading3 = {fontSize: 18, fontWeight: 600, color: colors.text};
  const para = {fontSize: 15, color: colors.textLight, lineHeight: 1.6, margin: 0};

  return (
    <div style={{background: colors.bg}}>
      {/* Header Section */}
      <section style={{...section, background: colors.blueLight, paddingTop: 80}}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center'}}>
          <div>
            <div style={{fontSize: 12, color: colors.blue, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 12}}>📊 Dashboard</div>
            <h2 style={{...heading2, marginBottom: 16}}>Live Analytics & Metrics</h2>
            <p style={{...para, fontSize: 16, color: colors.textLight}}>Real-time overview of all tasks, project progress, and team activity with interactive charts and detailed insights.</p>
          </div>
          <img alt="Analytics dashboard" src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80" style={{width: '100%', height: 300, objectFit: 'cover', borderRadius: 12}} />
        </div>
      </section>

      {/* Dashboard Component */}
      <section style={{...section, background: colors.bg}}>
        <div style={{background: colors.bg, border: `2px solid ${colors.border}`, borderRadius: 12, padding: 24}}>
          <Dashboard />
        </div>
      </section>

      {/* Related Visuals */}
      <section style={{...section, background: colors.bgAlt, paddingBottom: 80}}>
        <h3 style={{...heading2, marginBottom: 32}}>Related Visuals</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24}}>
          {galleryShots.slice(0, 3).map(shot => (
            <div key={shot.title} onClick={() => navigate('/gallery')} style={{...card, cursor: 'pointer', transition: 'all 0.3s ease', transform: 'translateY(0)'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <img alt={shot.title} src={shot.image} style={{width: '100%', height: 200, objectFit: 'cover'}} />
              <div style={{padding: 16}}>
                <h4 style={{...heading3, margin: 0}}>{shot.title}</h4>
                <p style={{fontSize: 12, color: colors.coral, marginTop: 8, marginBottom: 0}}>→ View Gallery</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
