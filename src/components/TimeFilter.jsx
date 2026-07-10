const RANGES = ['1H', '3H', '12H', '2D', '5D', '1M', '6M', '1Y', '5Y', 'YTD'];
const LIVE_RANGES = new Set(['1H', '3H', '12H']);

export default function TimeFilter({ active, onChange, isLive, onLiveToggle, onRefresh, liveLabel }) {
  const canLive = LIVE_RANGES.has(active);

  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      background: 'var(--bg2)',
      padding: '0 28px',
      borderBottom: '1px solid var(--border)',
    }}>
      {/* Period label */}
      <div style={{ fontSize: 10, color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '1px', marginRight: 16, flexShrink: 0 }}>
        Period:
      </div>

      {/* Range buttons */}
      <div style={{ display: 'flex', flex: 1, overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
              letterSpacing: '0.3px', flexShrink: 0,
            }}
            onMouseEnter={e => { if (active !== r) e.target.style.color = 'var(--text)'; }}
            onMouseLeave={e => { if (active !== r) e.target.style.color = 'var(--dim)'; }}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Right side: Refresh + Live toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, paddingLeft: 16 }}>
        {/* Refresh */}
        <button
          onClick={onRefresh}
          title="Refresh data"
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '4px 12px', borderRadius: 20,
            border: '1px solid var(--border)',
            background: 'transparent', color: 'var(--dim)',
            cursor: 'pointer', fontSize: 11, fontWeight: 600,
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          ↻ Refresh
        </button>

        {/* Live toggle */}
        <button
          onClick={() => canLive && onLiveToggle()}
          title={canLive ? 'Toggle live mode' : 'Live available for 1H · 3H · 12H'}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 14px', borderRadius: 20,
            border: `1px solid ${isLive ? 'rgba(0,212,160,0.5)' : 'var(--border)'}`,
            background: isLive ? 'rgba(0,212,160,0.1)' : 'transparent',
            color: isLive ? 'var(--green)' : 'var(--dim)',
            cursor: canLive ? 'pointer' : 'not-allowed',
            fontSize: 11, fontWeight: 600,
            opacity: canLive ? 1 : 0.35,
            fontFamily: "'Space Grotesk', sans-serif",
            transition: 'all 0.15s',
          }}
        >
          {isLive
            ? <><span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', animation: 'blink 1.4s infinite' }} /> {liveLabel}</>
            : '● Live'
          }
        </button>
      </div>
    </div>
  );
}
