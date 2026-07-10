const TABS = [
  { id: 'gold',   label: 'Gold',   icon: 'Au', color: 'var(--gold)',   desc: 'COMEX vs MCX Gold' },
  { id: 'silver', label: 'Silver', icon: 'Ag', color: '#C0C0C0',       desc: 'COMEX vs MCX Silver' },
];

export default function Navbar({ active, onChange }) {
  return (
    <div style={{
      display: 'flex', gap: 0,
      background: 'var(--bg)',
      borderBottom: '1px solid var(--border)',
      padding: '0 28px',
    }}>
      {TABS.map(tab => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 20px',
              border: 'none', borderBottom: isActive ? `2px solid ${tab.color}` : '2px solid transparent',
              background: 'transparent', cursor: 'pointer',
              color: isActive ? tab.color : 'var(--dim)',
              fontWeight: isActive ? 700 : 400,
              fontSize: 13,
              transition: 'all 0.15s',
              marginBottom: -1,
            }}
          >
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 22, height: 22, borderRadius: 5,
              background: isActive ? tab.color : 'var(--bg2)',
              color: isActive ? '#060D1A' : 'var(--dim)',
              fontSize: 9, fontWeight: 800,
            }}>{tab.icon}</span>
            {tab.label}
            <span style={{ fontSize: 10, color: 'var(--dim)', fontWeight: 400 }}>{tab.desc}</span>
          </button>
        );
      })}
    </div>
  );
}
