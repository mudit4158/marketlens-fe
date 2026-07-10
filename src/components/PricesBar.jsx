function Chip({ label, value, valueColor, sub, subColor }) {
  return (
    <div style={{ padding: '10px 20px', borderRight: '1px solid var(--border)', flexShrink: 0 }}>
      <div style={{ fontSize: 9, color: 'var(--dim)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 3 }}>
        {label}
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--mono)', color: valueColor }}>
        {value}
      </div>
      <div style={{ fontSize: 10, marginTop: 2, color: subColor || 'var(--dim)' }}>{sub}</div>
    </div>
  );
}

function fmt(n, decimals = 0) {
  if (n == null) return '—';
  return n.toLocaleString('en-IN', { maximumFractionDigits: decimals, minimumFractionDigits: decimals });
}

function pctBadge(pct) {
  if (pct == null) return { text: '—', color: 'var(--dim)' };
  const sign = pct >= 0 ? '▲ +' : '▼ ';
  return { text: `${sign}${Math.abs(pct).toFixed(2)}%`, color: pct >= 0 ? 'var(--green)' : 'var(--red)' };
}

const COMMODITY_CFG = {
  gold: {
    comexLabel:  'COMEX Gold ($/oz)',
    mcxLabel:    'MCX Gold (₹/10g)',
    comexInrLbl: 'COMEX→INR (₹/10g)',
  },
  silver: {
    comexLabel:  'COMEX Silver ($/oz)',
    mcxLabel:    'MCX Silver (₹/kg)',
    comexInrLbl: 'COMEX→INR (₹/kg)',
  },
};

export default function PricesBar({ summary, commodity = 'gold' }) {
  const cfg = COMMODITY_CFG[commodity] || COMMODITY_CFG.gold;

  if (!summary) {
    return (
      <div style={{
        display: 'flex', background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
        padding: '10px 28px', color: 'var(--dim)', fontSize: 12, fontFamily: 'var(--mono)',
      }}>
        Loading prices…
      </div>
    );
  }

  const changeBadge  = pctBadge(summary.comex_usd_change_pct);
  const mcxPremPct   = summary.mcx_premium_pct;

  return (
    <div style={{
      display: 'flex', background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
      overflowX: 'auto', padding: '0 28px',
    }}>
      <Chip
        label={cfg.comexLabel}
        value={`$${fmt(summary.comex_usd_latest, commodity === 'silver' ? 4 : 2)}`}
        valueColor="var(--gold)"
        sub={changeBadge.text + ' period'}
        subColor={changeBadge.color}
      />
      <Chip
        label={cfg.mcxLabel}
        value={summary.mcx_inr_latest ? `₹${fmt(summary.mcx_inr_latest)}` : '—'}
        valueColor="var(--gold2)"
        sub={summary.has_mcx_data ? 'Actual MCX futures' : 'No MCX data yet'}
        subColor={summary.has_mcx_data ? 'var(--green)' : 'var(--dim)'}
      />
      <Chip
        label="USD / INR"
        value={`₹${fmt(summary.usd_inr_latest, 4)}`}
        valueColor="var(--blue)"
        sub="Daily close rate"
      />
      <Chip
        label={cfg.comexInrLbl}
        value={`₹${fmt(summary.comex_inr_latest)}`}
        valueColor="var(--green)"
        sub="Pre-duty conversion"
      />
      <Chip
        label="MCX Premium"
        value={summary.mcx_premium_abs != null ? `₹${fmt(summary.mcx_premium_abs)}` : '—'}
        valueColor="var(--orange)"
        sub={mcxPremPct != null ? `${mcxPremPct >= 0 ? '+' : ''}${mcxPremPct.toFixed(1)}% over COMEX→₹` : 'No MCX data'}
      />
    </div>
  );
}
