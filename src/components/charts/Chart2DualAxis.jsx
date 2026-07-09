import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Tooltip, Legend, Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const TICK_LIMIT = 8;

export default function Chart2DualAxis({ data }) {
  if (!data) return <div className="loading-state">Loading…</div>;

  const { dates, comex_usd, comex_inr_duty, usd_inr } = data;
  const step = Math.max(1, Math.floor(dates.length / TICK_LIMIT));
  const tickDates = dates.map((d, i) => (i % step === 0 ? d : ''));

  const chartData = {
    labels: tickDates,
    datasets: [
      {
        label: 'MCX Proxy ₹ (Left)',
        data: comex_inr_duty,
        borderColor: '#E8C547',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
        yAxisID: 'yLeft',
      },
      {
        label: 'COMEX $ (Right)',
        data: comex_usd,
        borderColor: '#4A9EFF',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
        yAxisID: 'yRight',
      },
      {
        label: 'USD/INR × 100 (Right)',
        data: usd_inr?.map(v => v != null ? v * 100 : null),
        borderColor: 'rgba(94,234,212,0.5)',
        borderWidth: 1.5,
        pointRadius: 0,
        tension: 0.3,
        yAxisID: 'yRight',
        borderDash: [4, 4],
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
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(26,46,80,0.6)' },
        ticks: { color: '#5A7090', font: { family: "'JetBrains Mono'", size: 10 }, maxRotation: 0 },
      },
      yLeft: {
        position: 'left',
        grid: { color: 'rgba(26,46,80,0.6)' },
        ticks: { color: '#E8C547', font: { family: "'JetBrains Mono'", size: 10 }, callback: v => `₹${(v/1000).toFixed(0)}k` },
      },
      yRight: {
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: { color: '#4A9EFF', font: { family: "'JetBrains Mono'", size: 10 }, callback: v => `$${v.toFixed(0)}` },
      },
    },
  };

  return (
    <div className="card">
      <div className="card-head">
        <div>
          <div className="card-title">📈 Chart 2 — Dual Axis: COMEX ($) + MCX Proxy (₹)</div>
          <div className="card-desc">Left axis MCX proxy in ₹, right axis COMEX in $. USD/INR × 100 dashed. Dual axes can mislead — use for correlation only.</div>
        </div>
        <span className="chart-tag tag-2">Dual Axis</span>
      </div>
      <div className="chart-wrap chart-h260">
        <Line data={chartData} options={opts} />
      </div>
      <div className="legend">
        <div className="legend-item"><div className="legend-line" style={{ background: 'var(--gold)' }} /> MCX Proxy ₹ (Left)</div>
        <div className="legend-item"><div className="legend-line" style={{ background: 'var(--blue)' }} /> COMEX $ (Right)</div>
        <div className="legend-item"><div className="legend-line" style={{ background: 'rgba(94,234,212,0.5)' }} /> USD/INR × 100 (Right)</div>
      </div>
    </div>
  );
}
