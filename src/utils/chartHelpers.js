const TZ_ID = {
  IST: 'Asia/Kolkata',
  CT:  'America/Chicago',
};

/**
 * Format a single UTC ISO timestamp string into a display label
 * in the chosen timezone.
 */
export function formatTs(isoStr, interval, tz = 'IST') {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  const tzId = TZ_ID[tz] || 'Asia/Kolkata';

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tzId,
    month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(d);

  const p = {};
  parts.forEach(({ type, value }) => { p[type] = value; });
  const monthDay = `${p.month} ${p.day}`;
  if (interval === '1d') return monthDay;

  const hh = p.hour === '24' ? '00' : p.hour;
  return `${monthDay} ${hh}:${p.minute}`;
}

/**
 * Convert the raw timestamps array from the API into formatted date strings
 * for the chosen timezone. Falls back to the pre-formatted `dates` array
 * if timestamps are unavailable.
 */
export function buildDates(timestamps, dates, interval, tz = 'IST') {
  if (timestamps?.length) return timestamps.map(ts => formatTs(ts, interval, tz));
  return dates ?? [];
}

/**
 * Given a UTC ISO timestamp, extract the hour and minute in the target timezone.
 */
function tzHourMin(isoStr, tz) {
  const d = new Date(isoStr);
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ_ID[tz] || 'Asia/Kolkata',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(d);
  const p = {};
  parts.forEach(({ type, value }) => { p[type] = value; });
  return {
    hour:   parseInt(p.hour   === '24' ? '0' : p.hour,   10),
    minute: parseInt(p.minute ?? '0', 10),
  };
}

/**
 * Extract the 3-letter month abbreviation in the target timezone.
 */
function tzMonth(isoStr, tz) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: TZ_ID[tz] || 'Asia/Kolkata', month: 'short',
  }).format(new Date(isoStr));
}

/**
 * Build a sparse tick label array for Chart.js x-axis.
 * Shows ticks at clean time boundaries appropriate for each range.
 *
 * formattedDates — already-formatted display labels (from buildDates)
 * timestamps     — raw UTC ISO strings (used for tz-aware boundary detection)
 * interval       — "5m" | "1h" | "1d"
 * range          — "1H" | "3H" | "12H" | "2D" | "5D" | "1M" | "6M" | "1Y" | "5Y" | "YTD"
 * tz             — "IST" | "CT"
 */
export function buildTickDates(formattedDates, timestamps, interval, range, tz = 'IST') {
  if (!formattedDates?.length) return [];
  const hasTsRaw = timestamps?.length === formattedDates.length;
  const out = new Array(formattedDates.length).fill('');

  if ((interval === '1m' || interval === '5m') && hasTsRaw) {
    // 1m/1H → every 15 min, 1m/3H → every 30 min, 5m/12H → every 60 min
    const minuteStep = range === '1H' ? 15 : range === '3H' ? 30 : 60;
    timestamps.forEach((ts, i) => {
      const { minute } = tzHourMin(ts, tz);
      if (minute % minuteStep === 0) out[i] = formattedDates[i];
    });
  } else if (interval === '1h' && hasTsRaw) {
    // 2D → every 4h, 5D → every 6h
    const hourStep = range === '2D' ? 4 : 6;
    timestamps.forEach((ts, i) => {
      const { hour, minute } = tzHourMin(ts, tz);
      if (minute === 0 && hour % hourStep === 0) out[i] = formattedDates[i];
    });
  } else if (range === '5Y' && hasTsRaw) {
    // Quarterly: first occurrence of Jan / Apr / Jul / Oct
    const QUARTER_MONTHS = new Set(['Jan', 'Apr', 'Jul', 'Oct']);
    let lastShownQuarter = null;
    timestamps.forEach((ts, i) => {
      const month = tzMonth(ts, tz);
      if (QUARTER_MONTHS.has(month) && month !== lastShownQuarter) {
        out[i] = formattedDates[i];
        lastShownQuarter = month;
      }
    });
  } else {
    // Daily ranges: ~8 evenly spaced ticks
    const step = Math.max(1, Math.floor(formattedDates.length / 8));
    formattedDates.forEach((d, i) => { if (i % step === 0) out[i] = d; });
  }

  // Fallback: if fewer than 3 ticks matched, use even spacing
  if (out.filter(Boolean).length < 3) {
    out.fill('');
    const step = Math.max(1, Math.floor(formattedDates.length / 8));
    formattedDates.forEach((d, i) => { if (i % step === 0) out[i] = d; });
  }

  return out;
}

/**
 * Chart.js tooltip title callback that always shows the exact timestamp
 * for the hovered data point (regardless of axis tick visibility).
 *
 * Pass the full formattedDates array (from buildDates) in a closure:
 *   title: tooltipTitle(formattedDates)
 */
export function tooltipTitle(formattedDates) {
  return (ctxArr) => {
    const idx = ctxArr[0]?.dataIndex;
    return idx != null && formattedDates[idx] ? formattedDates[idx] : '';
  };
}
