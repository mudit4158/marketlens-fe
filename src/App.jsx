import { useState, useEffect, useCallback } from 'react';
import './index.css';
import { fetchGoldAnalysis } from './api/goldAnalysis';
import Header from './components/Header';
import PricesBar from './components/PricesBar';
import TimeFilter from './components/TimeFilter';
import Chart1Premium from './components/charts/Chart1Premium';
import Chart2DualAxis from './components/charts/Chart2DualAxis';
import Chart3Indexed from './components/charts/Chart3Indexed';
import Chart4Waterfall from './components/charts/Chart4Waterfall';
import Chart5Scatter from './components/charts/Chart5Scatter';

export default function App() {
  const [range, setRange] = useState('1M');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (r) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchGoldAnalysis(r);
      setData(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(range); }, [range, load]);

  const handleRange = (r) => {
    setRange(r);
  };

  return (
    <>
      <Header />
      <PricesBar summary={data?.summary} range={range} />
      <TimeFilter active={range} onChange={handleRange} />

      {error && (
        <div style={{
          margin: '20px 28px', padding: '16px 20px',
          background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.3)',
          borderRadius: 10, color: 'var(--red)', fontSize: 13,
        }}>
          ⚠ API error: {error}. Make sure the MarketLens backend is running on port 8001.
        </div>
      )}

      {loading && !data && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--dim)', fontFamily: 'var(--mono)', fontSize: 13 }}>
          Fetching market data…
        </div>
      )}

      <main style={{ padding: '24px 28px', maxWidth: 1560, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Chart 1 — full width */}
        <Chart1Premium data={data} />

        {/* Charts 2 & 3 — side by side */}
        <div className="chart-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
          <Chart2DualAxis data={data} />
          <Chart3Indexed data={data} />
        </div>

        {/* Charts 4 & 5 — side by side */}
        <div className="chart-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
          <Chart4Waterfall data={data} />
          <Chart5Scatter data={data} />
        </div>

        {/* Key Info */}
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="card-head">
            <div>
              <div className="card-title">📌 Data Notes</div>
              <div className="card-desc">Methodology and data source information</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {[
              {
                title: 'COMEX Gold',
                color: 'var(--gold)',
                body: 'Continuous futures contract (GC=F) via yfinance. Prices in USD/troy oz. Most recent close used for latest price.',
              },
              {
                title: 'USD/INR Rate',
                color: 'var(--blue)',
                body: 'INR=X spot rate via yfinance. Daily closing rate used to convert COMEX into Indian Rupees.',
              },
              {
                title: 'MCX Proxy Calculation',
                color: 'var(--orange)',
                body: 'No live MCX data available via free APIs. Proxy = (COMEX / 31.1035 × 10 × USD/INR) × 1.18 factor (duty+GST estimate).',
              },
              {
                title: 'India Premium',
                color: 'var(--purple)',
                body: 'Difference between MCX proxy and raw COMEX→₹ conversion. Represents import duty (12.5%) + AIDC (2.5%) + GST (3%) + margins.',
              },
            ].map(card => (
              <div key={card.title} style={{ background: 'var(--bg2)', borderRadius: 10, padding: '14px 16px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: card.color, marginBottom: 8 }}>{card.title}</div>
                <div style={{ fontSize: 11, color: 'var(--dim)', lineHeight: 1.6 }}>{card.body}</div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </>
  );
}
