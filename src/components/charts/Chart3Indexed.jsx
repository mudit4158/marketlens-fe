import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

function rebase(arr) {
  const first = arr?.find(v => v != null);
  if (!first) return arr;
  return arr.map(v => v != null ? parseFloat(((v / first) * 100).toFixed(4)) : null);
}

const TICK_LIMIT = 8;

export default function Chart3Indexed({ data }) {
  if (!data) return <div className="loading-state">Loading…</div>;

  const { dates, comex_usd, comex_inr_duty, usd_inr } = data;
  const step = Math.max(1, Math.floor(dates.length / TICK_LIMIT));
  const tickDates = dates.map((d, i) => (i % step === 0 ? d : ''));

  const mcxIdx    = rebase(comex_inr_duty);
  const comexIdx  = rebase(comex_usd);
  const fxIdx     = rebase(usd_inr);

  const lastMcx   = mcxIdx?.at(-1);
  const lastComex = comexIdx?.at(-1);
  const lastFx    = fxIdx?.at(-1);

  const chartData = {
    labels: tickDates,
    datasets: [
      { label: 'MCX Proxy (Indexed)', data: mcxIdx, borderColor: '#E8C547', borderWidth: 2, pointRadius: 0, tension: 0.3 },
      { label: 'COMEX (Indexed)', data: comexIdx, borderColor: '#4A9EFF', borderWidth: 2, pointRadius: 0, tension: 0.3 },
      { label: 'USD/INR (Indexed)', data: fxIdx, borderColor: '#FF7043', borderWidth: 1.5, pointRadius: 0, tension: 0.3, borderDash: [4, 3] },
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
        callbacks: { label: ctx => ctx.raw != null ? `${ctx.dataset.label}: ${ctx.raw.toFixed(2)}` : '' },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(26,46,80,0.6)' },
        ticks: { color: '#5A7090', font: { family: "'JetBrains Mono'", size: 10 }, maxRotation: 0 },
      },
      y: {
        grid: { color: 'rgba(26,46,80,0.6)' },
        ticks: { color: '#5A7090', font: { family: "'JetBrains Mono'", size: 10 }, callback: v => v.toFixed(1) },
      },
    },
  };

  return (
    <div className="card">
      <div className="card-head">
        <div>
          <div className="card-title">📉 Chart 3 — Indexed to 100: Relative Performance</div>
          <div className="card-desc">All three rebased to 100 on Day 1. Divergence between MCX proxy & COMEX lines reveals USD/INR contribution.</div>
        </div>
        <span className="chart-tag tag-3">Indexed</span>
      </div>
      <div className="chart-wrap chart-h260">
        <Line data={chartData} options={opts} />
      </div>
      <div className="legend">
        <div className="legend-item"><div className="legend-line" style={{ background: 'var(--gold)' }} /> MCX Proxy (Indexed)</div>
        <div className="legend-item"><div className="legend-line" style={{ background: 'var(--blue)' }} /> COMEX (Indexed)</div>
        <div className="legend-item"><div className="legend-line" style={{ background: 'var(--orange)' }} /> USD/INR (Indexed)</div>
      </div>
      <div className="stats-row">
        {lastMcx != null && <div className="stat"><div className="stat-lbl">MCX Proxy Δ</div><div className="stat-val" style={{ color: lastMcx >= 100 ? 'var(--green)' : 'var(--red)' }}>{(lastMcx - 100).toFixed(2)}%</div></div>}
        {lastComex != null && <div className="stat"><div className="stat-lbl">COMEX Δ</div><div className="stat-val" style={{ color: lastComex >= 100 ? 'var(--green)' : 'var(--red)' }}>{(lastComex - 100).toFixed(2)}%</div></div>}
        {lastFx != null && <div className="stat"><div className="stat-lbl">USD/INR Δ</div><div className="stat-val" style={{ color: lastFx >= 100 ? 'var(--green)' : 'var(--red)' }}>{(lastFx - 100).toFixed(2)}%</div></div>}
      </div>
    </div>
  );
}
