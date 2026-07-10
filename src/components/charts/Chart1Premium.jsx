import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { buildDates, buildTickDates, tooltipTitle } from '../../utils/chartHelpers';
import InfoTooltip from '../InfoTooltip';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const COMMODITY_CFG = {
  gold:   { mcxLabel: 'MCX Gold (₹/10g)',  comexLabel: 'COMEX → ₹/10g', unit: '₹/10g' },
  silver: { mcxLabel: 'MCX Silver (₹/kg)', comexLabel: 'COMEX → ₹/kg',  unit: '₹/kg'  },
};

export default function Chart1Premium({ data, tz = 'IST', isLive = false, range: rangeProp }) {
  if (!data) return <div className="loading-state">Loading…</div>;

  const { timestamps, dates: rawDates, comex_inr, mcx_inr, summary, interval, range: dataRange, commodity = 'gold' } = data;
  const range = rangeProp ?? dataRange;
  const cfg = COMMODITY_CFG[commodity] || COMMODITY_CFG.gold;

  const dates    = buildDates(timestamps, rawDates, interval, tz);
  const tickDates = buildTickDates(dates, timestamps, interval, range, tz);

  const chartData = {
    labels: tickDates,
    datasets: [
      {
        label: cfg.mcxLabel,
        data: mcx_inr,
        borderColor: '#E8C547',
        backgroundColor: 'rgba(232,197,71,0.06)',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
        fill: false,
      },
      {
        label: cfg.comexLabel,
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
    animation: isLive ? false : { duration: 300 },
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0F1C30',
        borderColor: '#1A2E50', borderWidth: 1,
        titleColor: '#C8D8F0', bodyColor: '#C8D8F0',
        callbacks: {
          title: tooltipTitle(dates),
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

  const hasMcx = summary?.has_mcx_data;
  const title = commodity === 'silver'
    ? '📊 MCX Silver vs COMEX→₹ Conversion'
    : '📊 MCX Gold vs COMEX→₹ Conversion';

  return (
    <div className="card chart-full" style={{ marginBottom: 18 }}>
      <div className="card-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="card-title">{title}</div>
          <InfoTooltip text={hasMcx
            ? `Actual MCX ${commodity === 'silver' ? 'Silver (₹/kg)' : 'Gold (₹/10g)'} futures vs COMEX price converted at the daily USD/INR spot rate.\n\nShaded band = MCX premium over the raw COMEX→INR conversion.\n\nFormula: COMEX→₹ = COMEX ($/oz) × (${commodity === 'silver' ? '1000 / 31.1035' : '10 / 31.1035'}) × USD/INR`
            : `COMEX price converted at daily USD/INR spot rate. MCX data not yet available — run the MCX seeder.`}
          />
        </div>
        <span className="chart-tag tag-1">Premium View</span>
      </div>
      <div className="chart-wrap chart-h340">
        <Line data={chartData} options={opts} />
      </div>
      <div className="legend">
        <div className="legend-item"><div className="legend-line" style={{ background: 'var(--gold)' }} /> {cfg.mcxLabel} — Actual Futures</div>
        <div className="legend-item"><div className="legend-line" style={{ background: 'var(--blue)' }} /> {cfg.comexLabel} (Pre-Duty)</div>
        <div className="legend-item"><div className="legend-band" style={{ background: 'rgba(232,197,71,0.18)', border: '1px solid rgba(232,197,71,0.3)' }} /> MCX Premium Band</div>
      </div>
      {summary && (
        <div className="stats-row">
          <div className="stat"><div className="stat-lbl">COMEX Latest</div><div className="stat-val">${summary.comex_usd_latest?.toLocaleString()}</div></div>
          <div className="stat"><div className="stat-lbl">COMEX → ₹</div><div className="stat-val">₹{summary.comex_inr_latest?.toLocaleString('en-IN')}</div></div>
          <div className="stat"><div className="stat-lbl">MCX {commodity === 'silver' ? 'Silver' : 'Gold'}</div><div className="stat-val">{summary.mcx_inr_latest ? `₹${summary.mcx_inr_latest?.toLocaleString('en-IN')}` : '—'}</div></div>
          <div className="stat"><div className="stat-lbl">MCX Premium</div><div className="stat-val" style={{ color: 'var(--orange)' }}>{summary.mcx_premium_abs != null ? `₹${summary.mcx_premium_abs?.toLocaleString('en-IN')} (${summary.mcx_premium_pct?.toFixed(1)}%)` : '—'}</div></div>
        </div>
      )}
    </div>
  );
}
