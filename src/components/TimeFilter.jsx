const RANGES = ['1H', '3H', '12H', '2D', '5D', '1M', '6M', '1Y', '5Y', 'YTD'];

export default function TimeFilter({ active, onChange }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 0,
      background: 'var(--bg2)',
      padding: '0 28px',
      borderBottom: '1px solid var(--border)',
      overflowX: 'auto',
    }}>
      <div style={{ fontSize: 10, color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '1px', marginRight: 16, flexShrink: 0 }}>
        Period:
      </div>
      {RANGES.map(r => (
        <button
          key={r}
          onClick={() => onChange(r)}
          style={{
            padding: '10px 16px',
            fontSize: 12, fontWeight: 500,
            color: active === r ? 'var(--gold)' : 'var(--dim)',
            cursor: 'pointer', border: 'none', background: 'none',
            borderBottom: active === r ? '2px solid var(--gold)' : '2px solid transparent',
            transition: 'all 0.15s', whiteSpace: 'nowrap',
            fontFamily: "'Space Grotesk', sans-serif",
            letterSpacing: '0.3px',
          }}
          onMouseEnter={e => { if (active !== r) e.target.style.color = 'var(--text)'; }}
          onMouseLeave={e => { if (active !== r) e.target.style.color = 'var(--dim)'; }}
        >
          {r}
        </button>
      ))}
      <div style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--dim)', padding: '10px 0', flexShrink: 0 }}>
        ⚠ Sub-1M periods require intraday data to be backfilled
      </div>
    </div>
  );
}
