import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const TICK_LIMIT = 10;

export default function Chart1Premium({ data }) {
  if (!data) return <div className="loading-state">Loading…</div>;

  const { dates, comex_inr, mcx_inr, summary } = data;

  const step = Math.max(1, Math.floor(dates.length / TICK_LIMIT));
  const tickDates = dates.map((d, i) => (i % step === 0 ? d : ''));

  const chartData = {
    labels: tickDates,
    datasets: [
      {
        label: 'MCX Gold (₹/10g)',
        data: mcx_inr,
        borderColor: '#E8C547',
        backgroundColor: 'rgba(232,197,71,0.06)',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
        fill: false,
      },
      {
        label: 'COMEX → ₹ (Pre-Duty)',
        data: comex_inr,
        borderColor: '#4A9EFF',
        backgroundColor: 'rgba(74,158,255,0.06)',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
        fill: false,
      },
      {
        label: 'MCX Premium Band',
        data: mcx_inr,
        borderColor: 'transparent',
        backgroundColor: 'rgba(232,197,71,0.10)',
        borderWidth: 0,
        pointRadius: 0,
        tension: 0.3,
        fill: { target: 1 },
      },
    ],
  };

  const opts = {
    responsive: true, maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0F1C30',
        borderColor: '#1A2E50', borderWidth: 1,
        titleColor: '#C8D8F0', bodyColor: '#C8D8F0',
        callbacks: {
          label: ctx => {
            const v = ctx.raw;
            return v != null ? `${ctx.dataset.label}: ₹${v.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '';
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(26,46,80,0.6)' },
        ticks: { color: '#5A7090', font: { family: "'JetBrains Mono'", size: 10 }, maxRotation: 0 },
      },
      y: {
        grid: { color: 'rgba(26,46,80,0.6)' },
        ticks: {
          color: '#5A7090',
          font: { family: "'JetBrains Mono'", size: 10 },
          callback: v => `₹${(v / 1000).toFixed(0)}k`,
        },
      },
    },
  };

  const period = summary ? `${summary.period_start} – ${summary.period_end} · ${data.interval} bars` : '';
  const hasMcx = summary?.has_mcx_data;

  return (
    <div className="card chart-full" style={{ marginBottom: 18 }}>
      <div className="card-head">
        <div>
          <div className="card-title">📊 Chart 1 — MCX Gold vs COMEX→₹ Conversion</div>
          <div className="card-desc">
            {hasMcx
              ? 'Actual MCX Gold futures (₹/10g) vs COMEX converted at daily USD/INR rate. Shaded band = MCX premium over COMEX conversion.'
              : 'COMEX price converted at daily USD/INR rate. MCX data not yet available — run the MCX seeder.'}
          </div>
        </div>
        <span className="chart-tag tag-1">Premium View</span>
      </div>
      <div className="period-info">{period}</div>
      <div className="chart-wrap chart-h340">
        <Line data={chartData} options={opts} />
      </div>
      <div className="legend">
        <div className="legend-item"><div className="legend-line" style={{ background: 'var(--gold)' }} /> MCX Gold (₹/10g) — Actual Futures</div>
        <div className="legend-item"><div className="legend-line" style={{ background: 'var(--blue)' }} /> COMEX → ₹ (Pre-Duty Conversion)</div>
        <div className="legend-item"><div className="legend-band" style={{ background: 'rgba(232,197,71,0.18)', border: '1px solid rgba(232,197,71,0.3)' }} /> MCX Premium Band</div>
      </div>
      {summary && (
        <div className="stats-row">
          <div className="stat"><div className="stat-lbl">COMEX Latest</div><div className="stat-val">${summary.comex_usd_latest?.toLocaleString()}</div></div>
          <div className="stat"><div className="stat-lbl">COMEX → ₹</div><div className="stat-val">₹{summary.comex_inr_latest?.toLocaleString('en-IN')}</div></div>
          <div className="stat"><div className="stat-lbl">MCX Gold</div><div className="stat-val">{summary.mcx_inr_latest ? `₹${summary.mcx_inr_latest?.toLocaleString('en-IN')}` : '—'}</div></div>
          <div className="stat"><div className="stat-lbl">MCX Premium</div><div className="stat-val" style={{ color: 'var(--orange)' }}>{summary.mcx_premium_abs != null ? `₹${summary.mcx_premium_abs?.toLocaleString('en-IN')} (${summary.mcx_premium_pct?.toFixed(1)}%)` : '—'}</div></div>
        </div>
      )}
    </div>
  );
}
