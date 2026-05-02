import React from 'react';
import ContactForm from '../components/ContactForm';

export default function ContactPage(){
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
  const heading2 = {fontSize: 32, fontWeight: 700, color: colors.text};
  const para = {fontSize: 15, color: colors.textLight, lineHeight: 1.6, margin: 0};

  return (
    <div style={{background: colors.bg}}>
      {/* Header */}
      <section style={{...section, background: colors.coralLight, paddingTop: 80}}>
        <div style={{maxWidth: 600}}>
          <div style={{fontSize: 12, color: colors.coral, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 12}}>✉️ Contact Us</div>
          <h2 style={{...heading2, marginBottom: 16}}>Get In Touch</h2>
          <p style={{...para, fontSize: 16, color: colors.textLight}}>Have questions or want to work with us? We'd love to hear from you. Fill out the form below and we'll get back to you shortly.</p>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{...section, background: colors.bg, paddingBottom: 80}}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'stretch'}}>
          {/* Image */}
          <div style={{overflow: 'hidden', borderRadius: 12}}>
            <img alt="Office workspace" src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80" style={{width: '100%', height: '100%', minHeight: 400, objectFit: 'cover'}} />
          </div>

          {/* Form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
