import React, {useEffect, useRef} from 'react';

export default function LiveBackground(){
  const canvasRef = useRef(null);

  useEffect(()=>{
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // draw a light gradient background with subtle accent
    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0,0,w,h);

      // light gradient (white to light blue)
      const lg = ctx.createLinearGradient(0,0,w,h);
      lg.addColorStop(0, '#ffffff');
      lg.addColorStop(0.5, '#f8f9fa');
      lg.addColorStop(1, '#f0f4ff');
      ctx.fillStyle = lg;
      ctx.fillRect(0,0,w,h);

      // very subtle accent glow
      const vg = ctx.createRadialGradient(w/2, h/2, Math.min(w,h)*0.3, w/2, h/2, Math.max(w,h)*1.2);
      vg.addColorStop(0, 'rgba(0, 102, 204, 0.02)');
      vg.addColorStop(0.5, 'rgba(0, 102, 204, 0.01)');
      vg.addColorStop(1, 'rgba(0, 102, 204, 0)');
      ctx.fillStyle = vg;
      ctx.fillRect(0,0,w,h);

      // slow floating light accent
      const t = Date.now() * 0.00008;
      const sweepX = (Math.sin(t) * 0.5 + 0.5) * w;
      const sweep = ctx.createLinearGradient(sweepX - w*0.25, 0, sweepX + w*0.25, 0);
      sweep.addColorStop(0, 'rgba(255,255,255,0)');
      sweep.addColorStop(0.45, 'rgba(255,255,255,0.01)');
      sweep.addColorStop(0.55, 'rgba(255,255,255,0.01)');
      sweep.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = sweep;
      ctx.fillRect(0,0,w,h);

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
