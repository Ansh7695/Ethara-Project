import React, {useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import * as THREE from 'three';

export default function Hero(){
  const navigate = useNavigate();
  const mountRef = useRef(null);
  useEffect(()=>{
    const container = mountRef.current;
    if(!container) return;
    const width = container.clientWidth;
    const height = 460;

    const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 100);
    camera.position.set(0,0,6);

    const light = new THREE.DirectionalLight(0xffffff,1.1);
    light.position.set(5,10,7.5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff,0.25));

    // build a 3D bar chart that matches the analytics / project theme
    const chart = new THREE.Group();

    const baseMat = new THREE.MeshStandardMaterial({color:0xf0f4ff, metalness:0.08, roughness:0.9});
    const axisMat = new THREE.MeshStandardMaterial({color:0x0066cc, metalness:0.15, roughness:0.35});
    const barMats = [
      new THREE.MeshStandardMaterial({color:0x0066cc, emissive:0x003366, emissiveIntensity:0.15, metalness:0.22, roughness:0.35}),
      new THREE.MeshStandardMaterial({color:0x0099ff, emissive:0x003366, emissiveIntensity:0.15, metalness:0.22, roughness:0.35}),
      new THREE.MeshStandardMaterial({color:0xff6b35, emissive:0x663300, emissiveIntensity:0.15, metalness:0.22, roughness:0.35}),
      new THREE.MeshStandardMaterial({color:0xffa366, emissive:0x663300, emissiveIntensity:0.13, metalness:0.22, roughness:0.35}),
    ];

    const base = new THREE.Mesh(new THREE.BoxGeometry(4.9, 0.18, 2.8), baseMat);
    base.position.set(0, -1.2, 0);
    chart.add(base);

    const gridGeo = new THREE.BoxGeometry(0.02, 2.0, 0.02);
    for(let i = 0; i < 5; i++){
      const line = new THREE.Mesh(gridGeo, axisMat);
      line.position.set(-1.8 + i * 0.9, -0.15, -0.9);
      chart.add(line);
    }

    const axisX = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.04, 0.04), axisMat);
    axisX.position.set(0, -0.2, -0.9);
    const axisY = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.4, 0.04), axisMat);
    axisY.position.set(-1.8, 0.9, -0.9);
    chart.add(axisX);
    chart.add(axisY);

    const barValues = [1.15, 1.8, 1.35, 2.05];
    const bars = [];
    barValues.forEach((value, index) => {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.55, value, 0.55), barMats[index % barMats.length]);
      bar.position.set(-1.05 + index * 0.9, value / 2 - 0.2, 0.05);
      bar.castShadow = false;
      chart.add(bar);
      bars.push(bar);

      const labelCap = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.08, 0.7), axisMat);
      labelCap.position.set(bar.position.x, value + 0.02 - 0.2, 0.05);
      chart.add(labelCap);
    });

    const glowRing = new THREE.Mesh(
      new THREE.RingGeometry(1.5, 2.35, 72),
      new THREE.MeshBasicMaterial({color:0x0066cc, transparent:true, opacity:0.06, side:THREE.DoubleSide})
    );
    glowRing.rotation.x = Math.PI / 2.4;
    glowRing.position.set(0, 0.15, -1.0);
    chart.add(glowRing);

    chart.scale.set(0.95, 0.95, 0.95);
    chart.rotation.x = -0.14;
    chart.rotation.y = 0.22;
    scene.add(chart);

    const pointer = {x:0,y:0};
    function onPointerMove(e){
      const r = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      pointer.y = (((e.clientY - r.top) / r.height - 0.5) * -2);
    }
    window.addEventListener('pointermove', onPointerMove);

    let then = 0;
    function animate(now){
      now *= 0.001; const delta = now - then; then = now;
      chart.rotation.y += 0.24 * delta;
      chart.position.y = Math.sin(now * 1.2) * 0.05 - 0.03;
      bars.forEach((bar, index) => {
        bar.scale.y = 0.96 + Math.sin(now * 2 + index * 0.9) * 0.03;
      });
      glowRing.rotation.z += 0.04 * delta;
      camera.position.x += (pointer.x*1.2 - camera.position.x) * 0.06;
      camera.position.y += (pointer.y*0.8 - camera.position.y) * 0.06;
      camera.lookAt(0,0,0);
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    function onResize(){
      const w = container.clientWidth;
      renderer.setSize(w, height);
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', onResize);

    return ()=>{
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if(container && renderer.domElement.parentNode === container){
        container.removeChild(renderer.domElement);
      }
    }
  },[]);

  const heroOuter = {display:'grid',gridTemplateColumns:'minmax(0, 1.05fr) minmax(320px, 0.95fr)',alignItems:'center',gap:40, minHeight:460};
  const content = {background:'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(248,249,250,0.95))', padding:40, borderRadius:16, zIndex:3, maxWidth:560, border:'2px solid #e0e0e0', boxShadow:'0 8px 24px rgba(0,102,204,0.1)'};

  return (
    <div className="hero-outer" style={heroOuter}>
      <div style={content}>
        <div style={{color:'#0066cc', fontWeight:800, letterSpacing:'0.1em', textTransform:'uppercase', fontSize:12}}>Ethara Platform Demo</div>
        <h2 style={{margin:'12px 0 16px', fontSize:32, fontWeight:700, color:'#1a1a1a'}}>Modern Multi-Page Application</h2>
        <p style={{color:'#555555', lineHeight:1.6, marginBottom:20}}>A fully responsive, feature-rich platform built with React. Explore analytics, projects, gallery, and seamless user experiences.</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3, minmax(0, 1fr))',gap:12,marginTop:20}}>
          <div style={{background:'#f8f9fa',padding:16,borderRadius:12,border:'2px solid #e0e0e0'}}>
            <div style={{fontSize:12,color:'#888888', fontWeight:600}}>Analytics</div>
            <div style={{fontWeight:700,marginTop:6, color:'#0066cc'}}>Real-time data</div>
          </div>
          <div style={{background:'#f8f9fa',padding:16,borderRadius:12,border:'2px solid #e0e0e0'}}>
            <div style={{fontSize:12,color:'#888888', fontWeight:600}}>Projects</div>
            <div style={{fontWeight:700,marginTop:6, color:'#0066cc'}}>Team collaboration</div>
          </div>
          <div style={{background:'#f8f9fa',padding:16,borderRadius:12,border:'2px solid #e0e0e0'}}>
            <div style={{fontSize:12,color:'#888888', fontWeight:600}}>Gallery</div>
            <div style={{fontWeight:700,marginTop:6, color:'#ff6b35'}}>Visual showcase</div>
          </div>
        </div>
        <div style={{display:'flex',gap:12,marginTop:20}}>
          <button onClick={() => navigate('/projects')} style={{padding:'12px 24px',borderRadius:8,background:'#0066cc',color:'#fff',fontWeight:600,border:'none',cursor:'pointer'}}>Explore Projects</button>
          <button onClick={() => navigate('/contact')} style={{padding:'12px 24px',borderRadius:8,border:'2px solid #e0e0e0',color:'#0066cc',background:'#f8f9fa',cursor:'pointer',fontWeight:600}}>Contact Us</button>
        </div>
      </div>
      <div ref={mountRef} className="hero-canvas" style={{minHeight:460, borderRadius:12, overflow:'hidden', alignSelf:'stretch', border:'2px solid #e0e0e0', background:'radial-gradient(circle at center, rgba(0,102,204,0.05), rgba(248,249,250,0.08) 58%, rgba(255,255,255,0))'}} />
    </div>
  );
}
