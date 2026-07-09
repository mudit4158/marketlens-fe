// In production (Vercel), VITE_API_BASE and VITE_API_KEY are set as
// environment variables in the Vercel project dashboard.
// In local dev, the Vite proxy (vite.config.js) forwards /gold → localhost:8001,
// so no key or base URL is needed.

const BASE = import.meta.env.VITE_API_BASE ?? '';
const API_KEY = import.meta.env.VITE_API_KEY ?? '';

function headers() {
  const h = { 'Content-Type': 'application/json' };
  if (API_KEY) h['X-API-Key'] = API_KEY;
  return h;
}

export async function fetchGoldAnalysis(range = '1M') {
  const res = await fetch(`${BASE}/gold/analysis?range=${range}`, { headers: headers() });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}
