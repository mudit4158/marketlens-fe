import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const TICK_LIMIT = 10;

export default function Chart1Premium({ data }) {
  if (!data) return <div className="loading-state">Loading…</div>;

  const { dates, comex_inr, comex_inr_duty, summary } = data;

  const step = Math.max(1, Math.floor(dates.length / TICK_LIMIT));
  const tickDates = dates.map((d, i) => (i % step === 0 ? d : ''));

  const chartData = {
    labels: tickDates,
    datasets: [
      {
        label: 'COMEX → ₹ + Duty (MCX Proxy)',
        data: comex_inr_duty,
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
        label: 'Premium Band',
        data: comex_inr_duty,
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

  return (
    <div className="card chart-full" style={{ marginBottom: 18 }}>
      <div className="card-head">
        <div>
          <div className="card-title">📊 Chart 1 — Premium View: COMEX-in-₹ vs MCX Proxy with Duty Band</div>
          <div className="card-desc">
            COMEX price converted at daily USD/INR rate (pre-duty baseline) vs estimated MCX price (COMEX × 1.18 for duty+GST).
            Shaded band = India duty premium. No live MCX data — proxy only.
          </div>
        </div>
        <span className="chart-tag tag-1">Premium View</span>
      </div>
      <div className="period-info">{period}</div>
      <div className="chart-wrap chart-h340">
        <Line data={chartData} options={opts} />
      </div>
      <div className="legend">
        <div className="legend-item"><div className="legend-line" style={{ background: 'var(--gold)' }} /> MCX Proxy (₹/10g) — COMEX × 1.18 duty factor</div>
        <div className="legend-item"><div className="legend-line" style={{ background: 'var(--blue)' }} /> COMEX → ₹ (Pre-Duty Conversion)</div>
        <div className="legend-item"><div className="legend-band" style={{ background: 'rgba(232,197,71,0.18)', border: '1px solid rgba(232,197,71,0.3)' }} /> Duty Premium Band</div>
      </div>
      {summary && (
        <div className="stats-row">
          <div className="stat"><div className="stat-lbl">COMEX Latest</div><div className="stat-val">${summary.comex_latest?.toLocaleString()}</div></div>
          <div className="stat"><div className="stat-lbl">COMEX → ₹ Latest</div><div className="stat-val">₹{summary.comex_inr_latest?.toLocaleString('en-IN')}</div></div>
          <div className="stat"><div className="stat-lbl">MCX Proxy</div><div className="stat-val">₹{summary.comex_inr_duty_latest?.toLocaleString('en-IN')}</div></div>
          <div className="stat"><div className="stat-lbl">Duty Premium</div><div className="stat-val" style={{ color: 'var(--orange)' }}>₹{summary.india_premium?.toLocaleString('en-IN')} ({summary.india_premium_pct?.toFixed(1)}%)</div></div>
        </div>
      )}
    </div>
  );
}
