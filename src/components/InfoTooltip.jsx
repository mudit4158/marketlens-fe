import { useState } from 'react';

export default function InfoTooltip({ text }) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {/* Icon */}
      <div style={{
        width: 16, height: 16, borderRadius: '50%',
        border: '1px solid var(--dim)',
        color: 'var(--dim)',
        fontSize: 10, fontWeight: 700,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'default', flexShrink: 0,
        transition: 'border-color 0.15s, color 0.15s',
        ...(visible ? { borderColor: 'var(--gold)', color: 'var(--gold)' } : {}),
      }}>
        i
      </div>

      {/* Tooltip */}
      {visible && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 999,
          width: 280,
          background: '#0A1628',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '10px 12px',
          fontSize: 11,
          color: 'var(--dim)',
          lineHeight: 1.6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          pointerEvents: 'none',
          whiteSpace: 'pre-wrap',
        }}>
          {text}
          {/* Arrow */}
          <div style={{
            position: 'absolute',
            top: '100%', left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid var(--border)',
          }} />
        </div>
      )}
    </div>
  );
}
