import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Hero from '../components/Hero';
import {ProjectDetailsModal} from '../components/ProjectModals';
import {projectShowcase, platformFeatures} from '../data/demoContent';

export default function HomePage(){
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);
  // Color palette: White, Blue, Coral
  const colors = {
    bg: '#ffffff',
    bgAlt: '#f8f9fa',
    text: '#1a1a1a',
    textLight: '#555555',
    textLighter: '#888888',
    blue: '#0066cc',
    blueLight: '#e6f0ff',
    coral: '#ff6b35',
    coralLight: '#ffe6d9',
    border: '#e0e0e0',
    shadow: 'rgba(0, 102, 204, 0.08)',
  };

  const section = {maxWidth: 1200, margin: '0 auto', padding: '60px 24px'};
  const card = {
    background: colors.bg,
    border: `2px solid ${colors.border}`,
    borderRadius: 12,
    boxShadow: `0 4px 12px ${colors.shadow}`,
    padding: 24,
    transition: 'all 0.3s ease',
  };
  const heading2 = {fontSize: 32, fontWeight: 700, color: colors.text, margin: '0 0 16px'};
  const heading3 = {fontSize: 20, fontWeight: 600, color: colors.text, margin: '12px 0 8px'};
  const para = {fontSize: 15, color: colors.textLight, lineHeight: 1.6, margin: 0};

  return (
    <div style={{background: colors.bg}}>
      {/* Hero Section */}
      <section style={{paddingTop: 80, paddingBottom: 40, background: colors.bgAlt, width: '100%', boxSizing: 'border-box'}}>
        <div style={{maxWidth: 1200, margin: '0 auto', padding: '0 24px', boxSizing: 'border-box'}}>
          <Hero />
        </div>
      </section>

      {/* Features Section */}
      <section style={{...section}}>
        <div style={{textAlign: 'center', marginBottom: 48}}>
          <h2 style={heading2}>Platform Features</h2>
          <p style={{...para, fontSize: 16}}>Everything you need to manage projects, track tasks, and collaborate with your team effectively.</p>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24}}>
          {platformFeatures.map((feature, idx) => (
            <div key={idx} style={{...card, borderColor: idx % 2 === 0 ? colors.blue : colors.coral, borderWidth: 2}}>
              <div style={{fontSize: 32, marginBottom: 12}}>{feature.icon}</div>
              <h3 style={{...heading3, marginTop: 0}}>{feature.title}</h3>
              <p style={para}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Showcase Section */}
      <section style={{...section, background: colors.bgAlt}}>
        <h2 style={{...heading2, textAlign: 'center', marginBottom: 48}}>Featured Projects</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24}}>
          {projectShowcase.map(item => (
            <div 
              key={item.title} 
              onClick={() => setSelectedProject(item)} 
              style={{...card, overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'all 0.3s ease'}}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <img alt={item.title} src={item.image} style={{width: '100%', height: 200, objectFit: 'cover', borderRadius: 8, marginBottom: 16}} />
              <div style={{fontSize: 12, color: colors.coral, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 8}}>{item.tag}</div>
              <h3 style={{...heading3, marginTop: 0}}>{item.title}</h3>
              <p style={{...para, marginBottom: 16}}>{item.description}</p>
              <div style={{fontSize: 12, fontWeight: 600, color: colors.textLight, marginBottom: 12}}>Key Features:</div>
              <ul style={{margin: 0, paddingLeft: 20, flex: 1}}>
                {item.features.map((feature, idx) => (
                  <li key={idx} style={{color: colors.textLight, fontSize: 13, lineHeight: 1.5, marginBottom: 6}}>• {feature}</li>
                ))}
              </ul>
              <div style={{marginTop: 12, paddingTop: 12, borderTop: `1px solid ${colors.border}`}}>
                <span style={{color: colors.blue, fontWeight: 600, fontSize: 13}}>View Details →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{...section, textAlign: 'center', background: `linear-gradient(135deg, ${colors.blueLight}, ${colors.coralLight})`}}>
        <h2 style={{...heading2, color: colors.blue}}>Ready to Explore?</h2>
        <p style={{...para, fontSize: 16, marginBottom: 24}}>Check out our dashboard, projects, gallery, and more pages.</p>
        <div style={{display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap'}}>
          <Link to="/dashboard" style={{padding: '12px 32px', background: colors.blue, color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'opacity 0.3s'}}>Dashboard</Link>
          <Link to="/projects" style={{padding: '12px 32px', background: colors.coral, color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'opacity 0.3s'}}>Projects</Link>
          <Link to="/gallery" style={{padding: '12px 32px', background: colors.text, color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'opacity 0.3s'}}>Gallery</Link>
        </div>
      </section>

      <ProjectDetailsModal
        open={Boolean(selectedProject)}
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
