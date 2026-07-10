const BASE = import.meta.env.VITE_API_BASE ?? '';
const API_KEY = import.meta.env.VITE_API_KEY ?? '';

function headers() {
  const h = { 'Content-Type': 'application/json' };
  if (API_KEY) h['X-API-Key'] = API_KEY;
  return h;
}

export async function fetchSilverAnalysis(range = '1M') {
  const res = await fetch(`${BASE}/silver/analysis?range=${range}`, { headers: headers() });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}
