import { useEffect, useState } from 'react';

export default function Header() {
  const [clock, setClock] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const ist = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false, day: '2-digit', month: 'short', year: 'numeric',
      }).format(now);
      setClock(`${ist} IST`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 200,
      background: 'rgba(6,13,26,0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      padding: '14px 28px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 32, height: 32,
          background: 'linear-gradient(135deg,#E8C547,#7A6010)',
          borderRadius: 7,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 800, color: '#060D1A',
        }}>Au</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>
            Gold <span style={{ color: 'var(--gold)' }}>Comparative</span> Analysis
          </div>
          <div style={{ fontSize: 10, color: 'var(--dim)', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: 2 }}>
            COMEX · MCX Proxy · USD/INR — MarketLens
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(0,212,160,0.08)',
          border: '1px solid rgba(0,212,160,0.2)',
          padding: '5px 12px', borderRadius: 20,
          fontSize: 11, color: 'var(--green)', letterSpacing: '0.5px',
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%', background: 'var(--green)',
            animation: 'blink 1.4s infinite',
          }} />
          Live · Source: yfinance / MarketLens API
        </div>
        <div style={{ fontSize: 11, color: 'var(--dim)', fontFamily: 'var(--mono)' }}>{clock}</div>
      </div>

      <style>{`@keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }`}</style>
    </div>
  );
}
