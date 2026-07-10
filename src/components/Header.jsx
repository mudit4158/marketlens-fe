import { useEffect, useState } from 'react';

function Clock({ tz }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    const tzId = tz === 'IST' ? 'Asia/Kolkata' : 'America/Chicago';
    const tick = () => {
      const now = new Date();
      setDate(new Intl.DateTimeFormat('en-US', { timeZone: tzId, month: 'short', day: 'numeric' }).format(now));
      setTime(new Intl.DateTimeFormat('en-US', { timeZone: tzId, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(now));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tz]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 10, color: 'var(--fg)', fontFamily: 'var(--mono)' }}>{date}</div>
      <div style={{ fontSize: 11, color: 'var(--dim)', fontFamily: 'var(--mono)' }}>{time}</div>
    </div>
  );
}

export default function Header({ tz, onTzChange }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 200,
      background: 'rgba(6,13,26,0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      padding: '12px 28px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      {/* Logo + title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 32, height: 32,
          background: 'linear-gradient(135deg,#E8C547,#7A6010)',
          borderRadius: 7,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 800, color: '#060D1A',
        }}>ML</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>
            Market<span style={{ color: 'var(--gold)' }}>Lens</span>
          </div>
          <div style={{ fontSize: 10, color: 'var(--dim)', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: 2 }}>
            Commodity Comparative Analysis
          </div>
        </div>
      </div>

      {/* Clocks + TZ switcher: IST | [toggle] | CT */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Clock tz="IST" />

        <div style={{
          display: 'flex', borderRadius: 20,
          border: '1px solid var(--border)',
          overflow: 'hidden', fontSize: 10, fontWeight: 700,
        }}>
          {['IST', 'CT'].map(t => (
            <button
              key={t}
              onClick={() => onTzChange(t)}
              style={{
                padding: '4px 12px', border: 'none', cursor: 'pointer',
                background: tz === t ? 'var(--gold)' : 'transparent',
                color: tz === t ? '#060D1A' : 'var(--dim)',
                fontWeight: 700, fontSize: 10, letterSpacing: '0.5px',
                transition: 'all 0.15s',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <Clock tz="CT" />
      </div>
    </div>
  );
}
