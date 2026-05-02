import React from 'react';
import Gallery from '../components/Gallery';
import {galleryShots} from '../data/demoContent';

export default function GalleryPage(){
  const colors = {
    bg: '#ffffff',
    bgAlt: '#f8f9fa',
    text: '#1a1a1a',
    textLight: '#555555',
    blue: '#0066cc',
    blueLight: '#e6f0ff',
    coral: '#ff6b35',
    coralLight: '#ffe6d9',
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
      {/* Header */}
      <section style={{...section, background: colors.coralLight, paddingTop: 80}}>
        <div style={{maxWidth: 800}}>
          <div style={{fontSize: 12, color: colors.coral, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 12}}>🎨 Gallery</div>
          <h2 style={{...heading2, marginBottom: 16}}>Visual Gallery</h2>
          <p style={{...para, fontSize: 16, color: colors.textLight}}>Explore our curated collection of stunning images and visual assets showcasing our work and creative moments.</p>
        </div>
      </section>

      {/* Gallery Component */}
      <section style={{...section, background: colors.bg}}>
        <Gallery />
      </section>

      {/* Featured Shots Grid */}
      <section style={{...section, background: colors.bgAlt, paddingBottom: 80}}>
        <h3 style={{...heading2, marginBottom: 32}}>Featured Shots</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24}}>
          {galleryShots.map(shot => (
            <div key={shot.title} style={{...card}}>
              <img alt={shot.title} src={shot.image} style={{width: '100%', height: 240, objectFit: 'cover'}} />
              <div style={{padding: 16}}>
                <h4 style={{...heading3, margin: 0, color: colors.text}}>{shot.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
