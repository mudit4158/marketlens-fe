import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function InfoTooltip({ text }) {
  const [pos, setPos] = useState(null);
  const iconRef = useRef(null);

  const show = () => {
    const r = iconRef.current?.getBoundingClientRect();
    if (r) setPos({ x: r.left + r.width / 2, y: r.top - 10 });
  };
  const hide = () => setPos(null);

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {/* Icon */}
      <div ref={iconRef} style={{
        width: 16, height: 16, borderRadius: '50%',
        border: `1px solid ${pos ? 'var(--gold)' : 'var(--dim)'}`,
        color: pos ? 'var(--gold)' : 'var(--dim)',
        fontSize: 10, fontWeight: 700,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'default', flexShrink: 0,
        transition: 'border-color 0.15s, color 0.15s',
      }}>
        i
      </div>

      {/* Tooltip rendered at body level to escape overflow clipping */}
      {pos && createPortal(
        <div style={{
          position: 'fixed',
          left: pos.x,
          top: pos.y,
          transform: 'translate(-50%, -100%)',
          zIndex: 9999,
          width: 280,
          background: '#0A1628',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '10px 12px',
          fontSize: 11,
          color: 'var(--dim)',
          lineHeight: 1.6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          pointerEvents: 'none',
          whiteSpace: 'pre-wrap',
        }}>
          {text}
          <div style={{
            position: 'absolute',
            top: '100%', left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid var(--border)',
          }} />
        </div>,
        document.body
      )}
    </div>
  );
}
