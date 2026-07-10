import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Tooltip, Legend, Filler,
} from 'chart.js';
import { buildDates, buildTickDates, tooltipTitle } from '../../utils/chartHelpers';
import InfoTooltip from '../InfoTooltip';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export default function Chart2DualAxis({ data, tz = 'IST', isLive = false, range: rangeProp }) {
  if (!data) return <div className="loading-state">Loading…</div>;

  const { timestamps, dates: rawDates, comex_usd, mcx_inr, usd_inr, interval, range: dataRange, commodity = 'gold' } = data;
  const range = rangeProp ?? dataRange;

  const dates    = buildDates(timestamps, rawDates, interval, tz);
  const tickDates = buildTickDates(dates, timestamps, interval, range, tz);

  const mcxLabel   = commodity === 'silver' ? 'MCX Silver ₹/kg (Left)' : 'MCX Gold ₹/10g (Left)';
  const comexLabel = commodity === 'silver' ? 'COMEX Silver $ (Right)' : 'COMEX Gold $ (Right)';

  const chartData = {
    labels: tickDates,
    datasets: [
      { label: mcxLabel,   data: mcx_inr,  borderColor: '#E8C547', borderWidth: 2, pointRadius: 0, tension: 0.3, yAxisID: 'yLeft' },
      { label: comexLabel, data: comex_usd, borderColor: '#4A9EFF', borderWidth: 2, pointRadius: 0, tension: 0.3, yAxisID: 'yRight' },
      {
        label: 'USD/INR × 100 (Right)',
        data: usd_inr?.map(v => v != null ? v * 100 : null),
        borderColor: 'rgba(94,234,212,0.5)', borderWidth: 1.5, pointRadius: 0, tension: 0.3,
        yAxisID: 'yRight', borderDash: [4, 4],
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
        backgroundColor: '#0F1C30', borderColor: '#1A2E50', borderWidth: 1,
        titleColor: '#C8D8F0', bodyColor: '#C8D8F0',
        callbacks: { title: tooltipTitle(dates) },
      },
    },
    scales: {
      x: { grid: { color: 'rgba(26,46,80,0.6)' }, ticks: { color: '#5A7090', font: { family: "'JetBrains Mono'", size: 10 }, maxRotation: 0 } },
      yLeft:  { position: 'left',  grid: { color: 'rgba(26,46,80,0.6)' }, ticks: { color: '#E8C547', font: { family: "'JetBrains Mono'", size: 10 }, callback: v => `₹${(v/1000).toFixed(0)}k` } },
      yRight: { position: 'right', grid: { drawOnChartArea: false }, ticks: { color: '#4A9EFF', font: { family: "'JetBrains Mono'", size: 10 }, callback: v => `$${v.toFixed(0)}` } },
    },
  };

  const title = commodity === 'silver'
    ? '📈 Dual Axis: COMEX Silver ($) + MCX Silver (₹/kg)'
    : '📈 Dual Axis: COMEX Gold ($) + MCX Gold (₹/10g)';

  return (
    <div className="card">
      <div className="card-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="card-title">{title}</div>
          <InfoTooltip text={`Left axis: MCX price in ₹ (${commodity === 'silver' ? '₹/kg' : '₹/10g'}).\nRight axis: COMEX price in USD/oz.\nDashed line: USD/INR rate × 100 (scaled to fit).\n\n⚠ Dual-axis charts can be visually misleading — use only to observe correlation direction, not magnitude.`} />
        </div>
        <span className="chart-tag tag-2">Dual Axis</span>
      </div>
      <div className="chart-wrap chart-h260"><Line data={chartData} options={opts} /></div>
      <div className="legend">
        <div className="legend-item"><div className="legend-line" style={{ background: 'var(--gold)' }} /> {mcxLabel}</div>
        <div className="legend-item"><div className="legend-line" style={{ background: 'var(--blue)' }} /> {comexLabel}</div>
        <div className="legend-item"><div className="legend-line" style={{ background: 'rgba(94,234,212,0.5)' }} /> USD/INR × 100 (Right)</div>
      </div>
    </div>
  );
}
