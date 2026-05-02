import React, {useState} from 'react';
import ProjectsList from '../components/ProjectsList';
import {ProjectDetailsModal} from '../components/ProjectModals';
import {projectShowcase} from '../data/demoContent';

export default function ProjectsPage(){
  const [selectedProject, setSelectedProject] = useState(null);
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
    transition: 'all 0.3s ease',
  };
  const heading2 = {fontSize: 32, fontWeight: 700, color: colors.text};
  const heading3 = {fontSize: 18, fontWeight: 600, color: colors.text, margin: '12px 0 8px'};
  const para = {fontSize: 15, color: colors.textLight, lineHeight: 1.6, margin: 0};

  return (
    <div style={{background: colors.bg}}>
      {/* Header Section */}
      <section style={{...section, background: colors.blueLight, paddingTop: 80}}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center'}}>
          <div>
            <div style={{fontSize: 12, color: colors.blue, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 12}}>📊 Projects</div>
            <h2 style={{...heading2, marginBottom: 16}}>Manage Your Projects</h2>
            <p style={{...para, fontSize: 16, color: colors.textLight}}>Track progress, view team members, and manage project timelines all in one place. Real-time updates and collaborative features.</p>
          </div>
          <img alt="Project board" src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80" style={{width: '100%', height: 300, objectFit: 'cover', borderRadius: 12}} />
        </div>
      </section>

      {/* Featured Projects Grid */}
      <section style={{...section, background: colors.bg}}>
        <h3 style={{...heading2, marginBottom: 32}}>Featured Projects</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 48}}>
          {projectShowcase.map(item => (
            <div
              key={item.title}
              onClick={() => setSelectedProject(item)}
              style={{...card, cursor: 'pointer'}}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <img alt={item.title} src={item.image} style={{width: '100%', height: 200, objectFit: 'cover'}} />
              <div style={{padding: 20}}>
                <div style={{fontSize: 12, color: colors.coral, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 8}}>{item.tag}</div>
                <h4 style={{...heading3, marginTop: 0}}>{item.title}</h4>
                <p style={para}>{item.description}</p>
                <div style={{marginTop: 12, fontSize: 13, fontWeight: 700, color: colors.blue}}>View project details →</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Active Projects List */}
      <section style={{...section, background: colors.bgAlt, paddingBottom: 80}}>
        <h3 style={{...heading2, marginBottom: 32}}>Active Projects</h3>
        <div style={{background: colors.bg, border: `2px solid ${colors.border}`, borderRadius: 12, padding: 24}}>
          <ProjectsList onSelect={(p) => setSelectedProject(p)} />
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
