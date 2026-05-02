import React from 'react';
import {aboutHighlights, timelineSteps} from '../data/demoContent';

export default function AboutPage(){
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
    padding: 24,
  };
  const heading2 = {fontSize: 32, fontWeight: 700, color: colors.text};
  const heading3 = {fontSize: 18, fontWeight: 600, color: colors.text};
  const para = {fontSize: 15, color: colors.textLight, lineHeight: 1.6, margin: 0};

  return (
    <div style={{background: colors.bg}}>
      {/* About Header */}
      <section style={{...section, background: colors.blueLight, paddingTop: 80}}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center'}}>
          <div>
            <div style={{fontSize: 12, color: colors.blue, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 12}}>ℹ️ About</div>
            <h2 style={{...heading2, marginBottom: 16}}>About Ethara</h2>
            <p style={{...para, fontSize: 16, color: colors.textLight, marginBottom: 20}}>A modern, responsive multi-page application built with React and cutting-edge technologies. We showcase professional design, real-time analytics, and seamless user experiences.</p>
            <ul style={{margin: 0, paddingLeft: 20, color: colors.text, lineHeight: 2}}>
              {aboutHighlights.map(item => (
                <li key={item} style={{color: colors.textLight}}>{item}</li>
              ))}
            </ul>
          </div>
          <img alt="Office workspace" src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80" style={{width: '100%', height: 350, objectFit: 'cover', borderRadius: 12}} />
        </div>
      </section>

      {/* Timeline */}
      <section style={{...section, background: colors.bg}}>
        <h2 style={{...heading2, textAlign: 'center', marginBottom: 48}}>Our Development Journey</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24}}>
          {timelineSteps.map(step => (
            <div key={step.step} style={{...card, borderColor: colors.blue, borderWidth: 2}}>
              <div style={{fontSize: 28, fontWeight: 700, color: colors.blue, marginBottom: 12}}>{step.step}</div>
              <h3 style={{...heading3, marginTop: 0, marginBottom: 12}}>{step.title}</h3>
              <p style={para}>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section style={{...section, background: colors.bgAlt, paddingBottom: 80}}>
        <h2 style={{...heading2, textAlign: 'center', marginBottom: 48}}>By The Numbers</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24}}>
          {[
            {number: '6', label: 'Pages'},
            {number: '100%', label: 'Responsive'},
            {number: '24/7', label: 'Available'},
            {number: '∞', label: 'Scalable'},
          ].map((stat, i) => (
            <div key={i} style={{...card, textAlign: 'center', borderColor: colors.coral, borderWidth: 2}}>
              <div style={{fontSize: 48, fontWeight: 700, color: colors.coral, marginBottom: 8}}>{stat.number}</div>
              <div style={{fontSize: 16, fontWeight: 600, color: colors.text}}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
