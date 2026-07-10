import { useState, useEffect, useCallback, useRef } from 'react';
import './index.css';
import { fetchGoldAnalysis } from './api/goldAnalysis';
import { fetchSilverAnalysis } from './api/silverAnalysis';
import Header from './components/Header';
import Navbar from './components/Navbar';
import PricesBar from './components/PricesBar';
import TimeFilter from './components/TimeFilter';
import Chart1Premium from './components/charts/Chart1Premium';
import Chart2DualAxis from './components/charts/Chart2DualAxis';
import Chart3Indexed from './components/charts/Chart3Indexed';
import Chart4Waterfall from './components/charts/Chart4Waterfall';
import Chart5Scatter from './components/charts/Chart5Scatter';

const FETCHERS    = { gold: fetchGoldAnalysis, silver: fetchSilverAnalysis };
const LIVE_RANGES = new Set(['1H', '3H', '12H']);

// 1H/3H use 1m bars → poll every 30s; 12H uses 5m bars → poll every 2 min
const LIVE_INTERVAL_MS = { '1H': 30_000, '3H': 30_000, '12H': 120_000 };

export default function App() {
  const [commodity, setCommodity] = useState('gold');
  const [range, setRange]         = useState('1M');
  const [tz, setTz]               = useState('IST');
  const [data, setData]           = useState(null);
  const [error, setError]         = useState(null);
  const [loading, setLoading]     = useState(false);
  const [isLive, setIsLive]       = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  // Full load — shows spinner, clears chart (used on range/commodity change)
  const load = useCallback(async (c, r) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await FETCHERS[c](r);
      setData(result);
      setLastRefreshed(new Date());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Silent refresh — updates data in-place without clearing charts (live / manual refresh)
  const silentRefresh = useCallback(async (c, r) => {
    try {
      const result = await FETCHERS[c](r);
      setData(result);
      setLastRefreshed(new Date());
    } catch {
      // silently ignore polling errors
    }
  }, []);

  useEffect(() => { load(commodity, range); }, [commodity, range, load]);

  // Disable live when switching to a non-intraday range
  useEffect(() => {
    if (!LIVE_RANGES.has(range)) setIsLive(false);
  }, [range]);

  // 30-second polling when live mode is on
  useEffect(() => {
    if (!isLive || !LIVE_RANGES.has(range)) return;
    const intervalMs = LIVE_INTERVAL_MS[range] ?? 30_000;
    const id = setInterval(() => silentRefresh(commodity, range), intervalMs);
    return () => clearInterval(id);
  }, [isLive, range, commodity, silentRefresh]);

  const handleCommodity = (c) => { setCommodity(c); setData(null); setIsLive(false); };
  const handleRange     = (r) => { setRange(r); };
  const handleRefresh   = () => silentRefresh(commodity, range); // returns promise for button state

  const canLive = LIVE_RANGES.has(range);

  const refreshedStr = lastRefreshed
    ? new Intl.DateTimeFormat('en-US', {
        timeZone: tz === 'IST' ? 'Asia/Kolkata' : 'America/Chicago',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
      }).format(lastRefreshed) + ` ${tz}`
    : null;

  return (
    <>
      <Header tz={tz} onTzChange={setTz} />
      <Navbar active={commodity} onChange={handleCommodity} />
      <PricesBar summary={data?.summary} commodity={commodity} />
      <TimeFilter
        active={range}
        onChange={handleRange}
        isLive={isLive}
        onLiveToggle={() => setIsLive(v => !v)}
        onRefresh={handleRefresh}
        liveLabel={`Live · every ${range === '12H' ? '2m' : '30s'}`}
      />

      {error && (
        <div style={{
          margin: '20px 28px', padding: '16px 20px',
          background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.3)',
          borderRadius: 10, color: 'var(--red)', fontSize: 13,
        }}>
          ⚠ API error: {error}. Make sure the MarketLens backend is running.
        </div>
      )}

      {loading && !data && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--dim)', fontFamily: 'var(--mono)', fontSize: 13 }}>
          Fetching market data…
        </div>
      )}

      <main style={{ padding: '24px 28px', maxWidth: 1560, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <Chart1Premium data={data} tz={tz} isLive={isLive} range={range} />

        <div className="chart-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
          <Chart2DualAxis data={data} tz={tz} isLive={isLive} range={range} />
          <Chart3Indexed  data={data} tz={tz} isLive={isLive} range={range} />
        </div>

        <div className="chart-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
          <Chart4Waterfall data={data} isLive={isLive} />
          <Chart5Scatter   data={data} isLive={isLive} />
        </div>
      </main>

      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </>
  );
}
