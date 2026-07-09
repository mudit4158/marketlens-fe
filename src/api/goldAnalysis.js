export async function fetchGoldAnalysis(range = '1M') {
  const res = await fetch(`/gold/analysis?range=${range}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}
