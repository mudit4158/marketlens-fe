import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function Chart5Scatter({ data }) {
  if (!data) return <div className="loading-state">Loading…</div>;

  const { comex_inr, comex_inr_duty, dates } = data;

  const points = comex_inr?.map((x, i) => {
    const y = comex_inr_duty?.[i];
    if (x == null || y == null) return null;
    return { x, y, label: dates[i] };
  }).filter(Boolean) ?? [];

  // Diagonal "fair value" line: y = x (duty = 0, if premiums compressed)
  const allX = points.map(p => p.x);
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);

  const chartData = {
    datasets: [
      {
        label: 'COMEX-₹ vs MCX Proxy',
        data: points,
        backgroundColor: 'rgba(255,112,67,0.6)',
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: 'Fair Value (1:1)',
        data: [{ x: minX, y: minX }, { x: maxX, y: maxX }],
        type: 'line',
        borderColor: 'rgba(90,112,144,0.5)',
        borderWidth: 1,
        borderDash: [4, 4],
        pointRadius: 0,
        fill: false,
      },
      {
        label: 'Duty Floor (×1.18)',
        data: [{ x: minX, y: minX * 1.18 }, { x: maxX, y: maxX * 1.18 }],
        type: 'line',
        borderColor: 'rgba(232,197,71,0.4)',
        borderWidth: 1,
        borderDash: [4, 4],
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  const opts = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0F1C30',
        borderColor: '#1A2E50', borderWidth: 1,
        titleColor: '#C8D8F0', bodyColor: '#C8D8F0',
        callbacks: {
          label: ctx => {
            if (ctx.raw?.label) {
              return [
                ctx.raw.label,
                `COMEX→₹: ₹${ctx.raw.x?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
                `MCX Proxy: ₹${ctx.raw.y?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
              ];
            }
            return '';
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(26,46,80,0.6)' },
        title: { display: true, text: 'COMEX → ₹ (Pre-Duty, /10g)', color: '#5A7090', font: { size: 10 } },
        ticks: { color: '#5A7090', font: { family: "'JetBrains Mono'", size: 10 }, callback: v => `₹${(v/1000).toFixed(0)}k` },
      },
      y: {
        grid: { color: 'rgba(26,46,80,0.6)' },
        title: { display: true, text: 'MCX Proxy (₹/10g)', color: '#5A7090', font: { size: 10 } },
        ticks: { color: '#5A7090', font: { family: "'JetBrains Mono'", size: 10 }, callback: v => `₹${(v/1000).toFixed(0)}k` },
      },
    },
  };

  return (
    <div className="card">
      <div className="card-head">
        <div>
          <div className="card-title">🔵 Chart 5 — Scatter: COMEX-₹ Converted vs MCX Proxy</div>
          <div className="card-desc">X = COMEX converted to ₹ at daily rate. Y = MCX proxy. Gold dashed line = 1.18× duty floor. Clustering shows consistent premium.</div>
        </div>
        <span className="chart-tag tag-5">Scatter</span>
      </div>
      <div className="chart-wrap chart-h260">
        <Scatter data={chartData} options={opts} />
      </div>
      <div className="legend">
        <div className="legend-item"><div className="legend-dot" style={{ background: 'rgba(255,112,67,0.8)' }} /> Daily data points</div>
        <div className="legend-item"><div className="legend-line" style={{ background: 'rgba(90,112,144,0.5)' }} /> 1:1 fair value</div>
        <div className="legend-item"><div className="legend-line" style={{ background: 'rgba(232,197,71,0.4)' }} /> 1.18× duty floor</div>
      </div>
      <div className="stats-row">
        <div className="stat"><div className="stat-lbl">Data Points</div><div className="stat-val">{points.length}</div></div>
        {points.length > 0 && (() => {
          const avg_prem = points.reduce((s, p) => s + ((p.y - p.x) / p.x * 100), 0) / points.length;
          return <div className="stat"><div className="stat-lbl">Avg Premium</div><div className="stat-val" style={{ color: 'var(--orange)' }}>{avg_prem.toFixed(1)}%</div></div>;
        })()}
      </div>
    </div>
  );
}
