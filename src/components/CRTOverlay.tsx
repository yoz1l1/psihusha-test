import { useEffect, useState, useRef } from 'react';
import { sfx } from '../sfx';

export function CRTOverlay() {
  const [glitchActive, setGlitchActive] = useState(false);
  const [barTop, setBarTop] = useState(0);
  const [hShake, setHShake] = useState(false);
  const shakeRef = useRef(false);

  useEffect(() => {
    const triggerGlitch = () => {
      setGlitchActive(true);
      sfx.glitch();
      setTimeout(() => setGlitchActive(false), 150 + Math.random() * 200);
    };

    const interval = setInterval(() => {
      if (Math.random() < 0.15) triggerGlitch();
    }, 3000 + Math.random() * 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBarTop((v) => (v + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const triggerShake = () => {
      if (shakeRef.current) return;
      shakeRef.current = true;
      setHShake(true);
      sfx.glitch();
      setTimeout(() => {
        setHShake(false);
        shakeRef.current = false;
      }, 400);
    };

    const interval = setInterval(() => {
      if (Math.random() < 0.1) triggerShake();
    }, 8000 + Math.random() * 12000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className={`fixed inset-0 pointer-events-none z-[100] ${hShake ? 'crt-shake-horizontal' : ''}`}>
        {/* Scanlines */}
        <div className="fixed inset-0 crt-scanline-bg" style={{ opacity: 0.4 }} />

        {/* Rolling bar */}
        <div
          className="fixed left-0 right-0"
          style={{
            top: `${barTop}%`,
            height: '2px',
            background: 'rgba(51, 255, 102, 0.08)',
            boxShadow: '0 0 8px rgba(51, 255, 102, 0.15)',
          }}
        />

        {/* Vignette */}
        <div className="fixed inset-0 crt-vignette" />

        {/* Flicker layer */}
        <div className="fixed inset-0 crt-flicker-slow" style={{ background: 'rgba(51, 255, 102, 0.02)' }} />

        {/* Glitch flash */}
        {glitchActive && (
          <div
            className="fixed inset-0"
            style={{
              background: 'rgba(51, 255, 102, 0.03)',
              transform: 'translateX(2px)',
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
              }}
            />
          </div>
        )}

        {/* Static noise */}
        <div className="fixed inset-0 crt-static-noise" style={{ opacity: 0.03 }} />
      </div>
    </>
  );
}
