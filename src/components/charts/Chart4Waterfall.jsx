import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend,
} from 'chart.js';
import InfoTooltip from '../InfoTooltip';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Chart4Waterfall({ data, isLive = false }) {
  if (!data) return <div className="loading-state">Loading…</div>;

  const { waterfall } = data;

  if (!waterfall || waterfall.length === 0) {
    return (
      <div className="card">
        <div className="card-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="card-title">🏗 Waterfall: MCX Change Decomposed</div>
            <InfoTooltip text={`Weekly MCX price change broken into three attribution buckets:\n\n• COMEX Effect: how much the USD gold/silver price moved contributed\n• Forex Effect: how much USD/INR movement contributed\n• MCX Premium Change: how much the MCX-specific premium (duties, local demand) shifted\n\nOnly available for 1M / 6M / 1Y / 5Y / YTD ranges (requires weekly grouping).`} />
          </div>
          <span className="chart-tag tag-4">Attribution</span>
        </div>
        <div className="loading-state" style={{ color: 'var(--dim)', fontSize: 12 }}>
          Available for 1M / 6M / 1Y / 5Y / YTD ranges only
        </div>
      </div>
    );
  }

  const labels = waterfall.map(w => w.label);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'COMEX Price Effect',
        data: waterfall.map(w => w.comex_effect),
        backgroundColor: waterfall.map(w => w.comex_effect >= 0 ? 'rgba(74,158,255,0.8)' : 'rgba(74,158,255,0.4)'),
        borderRadius: 4,
      },
      {
        label: 'Forex (USD/INR) Effect',
        data: waterfall.map(w => w.forex_effect),
        backgroundColor: waterfall.map(w => w.forex_effect >= 0 ? 'rgba(255,112,67,0.8)' : 'rgba(255,112,67,0.4)'),
        borderRadius: 4,
      },
      {
        label: 'MCX Premium Change',
        data: waterfall.map(w => w.mcx_premium),
        backgroundColor: waterfall.map(w => (w.mcx_premium ?? 0) >= 0 ? 'rgba(167,139,250,0.8)' : 'rgba(167,139,250,0.4)'),
        borderRadius: 4,
      },
    ],
  };

  const opts = {
    responsive: true, maintainAspectRatio: false,
    animation: isLive ? false : { duration: 300 },
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
            if (v == null) return '';
            const sign = v >= 0 ? '+' : '';
            return `${ctx.dataset.label}: ${sign}₹${Math.abs(v).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(26,46,80,0.6)' },
        ticks: { color: '#5A7090', font: { family: "'JetBrains Mono'", size: 9 }, maxRotation: 30 },
      },
      y: {
        grid: { color: 'rgba(26,46,80,0.6)' },
        ticks: { color: '#5A7090', font: { family: "'JetBrains Mono'", size: 10 }, callback: v => `₹${(v/1000).toFixed(1)}k` },
      },
    },
  };

  return (
    <div className="card">
      <div className="card-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="card-title">🏗 Waterfall: MCX Change Decomposed Weekly</div>
          <InfoTooltip text={`Weekly MCX price change broken into three attribution buckets:\n\n• COMEX Effect: how much the USD gold/silver price move contributed\n• Forex Effect: how much USD/INR movement contributed\n• MCX Premium Change: how much the MCX-specific premium (duties, local demand) shifted\n\nOnly available for 1M / 6M / 1Y / 5Y / YTD ranges.`} />
        </div>
        <span className="chart-tag tag-4">Attribution</span>
      </div>
      <div className="chart-wrap chart-h260">
        <Bar data={chartData} options={opts} />
      </div>
      <div className="legend">
        <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--blue)' }} /> COMEX Price Effect</div>
        <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--orange)' }} /> Forex (USD/INR) Effect</div>
        <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--purple)' }} /> MCX Premium Change</div>
      </div>
    </div>
  );
}
