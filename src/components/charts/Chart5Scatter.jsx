import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend,
} from 'chart.js';
import InfoTooltip from '../InfoTooltip';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function Chart5Scatter({ data, isLive = false }) {
  if (!data) return <div className="loading-state">Loading…</div>;

  const { comex_inr, mcx_inr, dates, commodity = 'gold' } = data;

  const points = comex_inr?.map((x, i) => {
    const y = mcx_inr?.[i];
    if (x == null || y == null) return null;
    return { x, y, label: dates[i] };
  }).filter(Boolean) ?? [];

  const allX = points.map(p => p.x);
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);

  const mcxLabel   = commodity === 'silver' ? 'MCX Silver (₹/kg)'  : 'MCX Gold (₹/10g)';
  const comexLabel = commodity === 'silver' ? 'COMEX→₹/kg'         : 'COMEX→₹/10g';
  const unit       = commodity === 'silver' ? '₹/kg'               : '₹/10g';

  const chartData = {
    datasets: [
      {
        label: `${comexLabel} vs ${mcxLabel}`,
        data: points,
        backgroundColor: 'rgba(255,112,67,0.6)',
        pointRadius: 5, pointHoverRadius: 7,
      },
      {
        label: 'Fair Value (1:1)',
        data: [{ x: minX, y: minX }, { x: maxX, y: maxX }],
        type: 'line',
        borderColor: 'rgba(90,112,144,0.5)', borderWidth: 1, borderDash: [4, 4],
        pointRadius: 0, fill: false,
      },
    ],
  };

  const opts = {
    responsive: true, maintainAspectRatio: false,
    animation: isLive ? false : { duration: 300 },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0F1C30', borderColor: '#1A2E50', borderWidth: 1,
        titleColor: '#C8D8F0', bodyColor: '#C8D8F0',
        callbacks: {
          title: ctx => ctx[0]?.raw?.label ?? '',
          label: ctx => ctx.raw?.x != null ? [
            `${comexLabel}: ₹${ctx.raw.x?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
            `${mcxLabel}: ₹${ctx.raw.y?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
          ] : '',
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(26,46,80,0.6)' },
        title: { display: true, text: `COMEX → ₹ (${unit})`, color: '#5A7090', font: { size: 10 } },
        ticks: { color: '#5A7090', font: { family: "'JetBrains Mono'", size: 10 }, callback: v => `₹${(v/1000).toFixed(0)}k` },
      },
      y: {
        grid: { color: 'rgba(26,46,80,0.6)' },
        title: { display: true, text: `MCX (${unit})`, color: '#5A7090', font: { size: 10 } },
        ticks: { color: '#5A7090', font: { family: "'JetBrains Mono'", size: 10 }, callback: v => `₹${(v/1000).toFixed(0)}k` },
      },
    },
  };

  const title = commodity === 'silver'
    ? '🔵 Scatter: COMEX-₹ vs MCX Silver'
    : '🔵 Scatter: COMEX-₹ vs MCX Gold';

  return (
    <div className="card">
      <div className="card-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="card-title">{title}</div>
          <InfoTooltip text={`X-axis: COMEX price converted to ₹ at the daily USD/INR rate.\nY-axis: Actual MCX futures closing price.\n\nDashed line = 1:1 fair value (MCX = COMEX→₹).\nPoints above the line → MCX is at a premium (duties, local demand).\nPoints below the line → MCX is at a discount.\n\nAverage MCX premium shown in the stats row below the chart.`} />
        </div>
        <span className="chart-tag tag-5">Scatter</span>
      </div>
      {points.length === 0 ? (
        <div className="loading-state" style={{ color: 'var(--dim)', fontSize: 12 }}>
          No overlapping MCX + COMEX data yet — run the MCX seeder first.
        </div>
      ) : (
        <>
          <div className="chart-wrap chart-h260"><Scatter data={chartData} options={opts} /></div>
          <div className="legend">
            <div className="legend-item"><div className="legend-dot" style={{ background: 'rgba(255,112,67,0.8)' }} /> Daily data points</div>
            <div className="legend-item"><div className="legend-line" style={{ background: 'rgba(90,112,144,0.5)' }} /> 1:1 fair value</div>
          </div>
          <div className="stats-row">
            <div className="stat"><div className="stat-lbl">Data Points</div><div className="stat-val">{points.length}</div></div>
            {points.length > 0 && (() => {
              const avg_prem = points.reduce((s, p) => s + ((p.y - p.x) / p.x * 100), 0) / points.length;
              return <div className="stat"><div className="stat-lbl">Avg MCX Premium</div><div className="stat-val" style={{ color: 'var(--orange)' }}>{avg_prem.toFixed(1)}%</div></div>;
            })()}
          </div>
        </>
      )}
    </div>
  );
}
