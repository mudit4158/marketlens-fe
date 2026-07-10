function Chip({ label, value, valueColor, sub, subColor }) {
  return (
    <div style={{
      padding: '10px 20px',
      borderRight: '1px solid var(--border)',
      flexShrink: 0,
    }}>
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

export default function PricesBar({ summary, range }) {
  if (!summary) {
    return (
      <div style={{
        display: 'flex', gap: 0,
        background: 'var(--bg2)',
        borderBottom: '1px solid var(--border)',
        padding: '10px 28px',
        color: 'var(--dim)', fontSize: 12, fontFamily: 'var(--mono)',
      }}>
        Loading prices…
      </div>
    );
  }

  const changeBadge = pctBadge(summary.comex_usd_change_pct);
  const mcxPremPct = summary.mcx_premium_pct;

  return (
    <div style={{
      display: 'flex', gap: 0,
      background: 'var(--bg2)',
      borderBottom: '1px solid var(--border)',
      overflowX: 'auto', padding: '0 28px',
    }}>
      <Chip
        label="COMEX Gold ($/oz)"
        value={`$${fmt(summary.comex_usd_latest, 2)}`}
        valueColor="var(--gold)"
        sub={changeBadge.text + ' period'}
        subColor={changeBadge.color}
      />
      <Chip
        label="MCX Gold (₹/10g)"
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
        subColor="var(--dim)"
      />
      <Chip
        label="COMEX→INR (conv.)"
        value={`₹${fmt(summary.comex_inr_latest)}`}
        valueColor="var(--green)"
        sub="Pre-duty conversion /10g"
        subColor="var(--dim)"
      />
      <Chip
        label="MCX Premium"
        value={summary.mcx_premium_abs != null ? `₹${fmt(summary.mcx_premium_abs)}` : '—'}
        valueColor="var(--orange)"
        sub={mcxPremPct != null ? `${mcxPremPct >= 0 ? '+' : ''}${mcxPremPct.toFixed(1)}% over COMEX→₹` : 'No MCX data'}
        subColor="var(--dim)"
      />
      <div style={{ padding: '10px 20px', flexShrink: 0 }}>
        <div style={{ fontSize: 9, color: 'var(--dim)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 3 }}>Period</div>
        <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--purple)' }}>
          {summary.period_start} – {summary.period_end}
        </div>
        <div style={{ fontSize: 10, marginTop: 2, color: 'var(--dim)' }}>{summary.trading_days} data points</div>
      </div>
    </div>
  );
}
