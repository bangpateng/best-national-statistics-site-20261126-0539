// Hand-built SVG charts for NusaStat — no libraries, no network.
// Every chart is a pure function of (years, values) and returns an SVG string.

const NAVY = '#0f2b46';
const GOLD = '#f2a900';
const GREEN = '#1e7a4c';
const RED = '#b3261e';
const GRID = '#e3e6e9';
const MUTED = '#5a6b7c';

function niceTicks(min, max, count) {
  const span = max - min || 1;
  const stepRaw = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(stepRaw)));
  const norm = stepRaw / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * mag;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = lo; v <= hi + step * 0.001; v += step) ticks.push(v);
  return { lo, hi, ticks };
}

function fmtTick(v) {
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}

// Line chart with dots, value labels on the first/last point and a
// readable axis. values may go negative (GDP growth 2020).
export function lineChart(years, values, opts) {
  const o = Object.assign({ width: 960, height: 340, unit: '', decimals: 1, color: NAVY, labelEvery: 2 }, opts || {});
  const padL = 58, padR = 18, padT = 26, padB = 34;
  const w = o.width - padL - padR;
  const h = o.height - padT - padB;
  let min = Math.min.apply(null, values);
  let max = Math.max.apply(null, values);
  if (min > 0) min = Math.max(0, min - (max - min) * 0.15);
  if (max < 0) max = 0;
  const t = niceTicks(min, max, 4);
  min = t.lo; max = t.hi;
  const x = (i) => padL + (i / (years.length - 1)) * w;
  const y = (v) => padT + (1 - (v - min) / (max - min)) * h;
  let g = '';
  t.ticks.forEach((tv) => {
    g += '<line x1="' + padL + '" y1="' + y(tv).toFixed(1) + '" x2="' + (padL + w) + '" y2="' + y(tv).toFixed(1) + '" stroke="' + GRID + '" stroke-width="1"/>';
    g += '<text x="' + (padL - 8) + '" y="' + (y(tv) + 4).toFixed(1) + '" text-anchor="end" font-size="13" fill="' + MUTED + '">' + fmtTick(tv) + o.unit + '</text>';
  });
  years.forEach((yr, i) => {
    if (i % o.labelEvery === 0 || i === years.length - 1) {
      g += '<text x="' + x(i).toFixed(1) + '" y="' + (padT + h + 22) + '" text-anchor="middle" font-size="13" fill="' + MUTED + '">' + yr + '</text>';
    }
  });
  const points = values.map((v, i) => x(i).toFixed(1) + ',' + y(v).toFixed(1)).join(' ');
  g += '<polyline points="' + points + '" fill="none" stroke="' + o.color + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>';
  values.forEach((v, i) => {
    const fill = v < 0 ? RED : o.color;
    g += '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(v).toFixed(1) + '" r="4.5" fill="' + fill + '" stroke="#fff" stroke-width="1.5"/>';
  });
  // Value labels on first and last points so the trend reads at a glance.
  // Anchored inward so they never collide with the y-axis labels.
  const first = values[0], last = values[values.length - 1];
  g += '<text x="' + (x(0) + 6).toFixed(1) + '" y="' + (y(first) - 12).toFixed(1) + '" text-anchor="start" font-size="14" font-weight="700" fill="' + NAVY + '">' + first.toFixed(o.decimals) + o.unit + '</text>';
  g += '<text x="' + (x(values.length - 1) - 6).toFixed(1) + '" y="' + (y(last) - 12).toFixed(1) + '" text-anchor="end" font-size="14" font-weight="700" fill="' + NAVY + '">' + last.toFixed(o.decimals) + o.unit + '</text>';
  return '<svg viewBox="0 0 ' + o.width + ' ' + o.height + '" role="img" aria-label="Line chart, ' + years[0] + ' to ' + years[years.length - 1] + '">' + g + '</svg>';
}

// Vertical bar chart. Negative values draw below the zero line in red.
export function barChart(years, values, opts) {
  const o = Object.assign({ width: 960, height: 340, unit: '%', decimals: 2, color: NAVY, labelEvery: 1 }, opts || {});
  const padL = 58, padR = 18, padT = 30, padB = 34;
  const w = o.width - padL - padR;
  const h = o.height - padT - padB;
  let min = Math.min(0, Math.min.apply(null, values));
  let max = Math.max.apply(null, values);
  const t = niceTicks(min, max, 4);
  min = t.lo; max = t.hi;
  const y = (v) => padT + (1 - (v - min) / (max - min)) * h;
  const slot = w / years.length;
  const bw = Math.min(46, slot * 0.62);
  let g = '';
  t.ticks.forEach((tv) => {
    g += '<line x1="' + padL + '" y1="' + y(tv).toFixed(1) + '" x2="' + (padL + w) + '" y2="' + y(tv).toFixed(1) + '" stroke="' + GRID + '" stroke-width="1"/>';
    g += '<text x="' + (padL - 8) + '" y="' + (y(tv) + 4).toFixed(1) + '" text-anchor="end" font-size="13" fill="' + MUTED + '">' + fmtTick(tv) + o.unit + '</text>';
  });
  years.forEach((yr, i) => {
    const v = values[i];
    const cx = padL + slot * i + slot / 2;
    const top = y(Math.max(v, 0));
    const bot = y(Math.min(v, 0));
    const fill = v < 0 ? RED : (i === years.length - 1 ? GOLD : o.color);
    g += '<rect x="' + (cx - bw / 2).toFixed(1) + '" y="' + top.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + Math.max(1, bot - top).toFixed(1) + '" rx="3" fill="' + fill + '"/>';
    const labelY = v < 0 ? bot + 18 : top - 8;
    g += '<text x="' + cx.toFixed(1) + '" y="' + labelY.toFixed(1) + '" text-anchor="middle" font-size="13" font-weight="700" fill="' + NAVY + '">' + v.toFixed(o.decimals) + '</text>';
    if (i % o.labelEvery === 0 || i === years.length - 1) {
      g += '<text x="' + cx.toFixed(1) + '" y="' + (padT + h + 22) + '" text-anchor="middle" font-size="13" fill="' + MUTED + '">' + yr + '</text>';
    }
  });
  g += '<line x1="' + padL + '" y1="' + y(0).toFixed(1) + '" x2="' + (padL + w) + '" y2="' + y(0).toFixed(1) + '" stroke="' + NAVY + '" stroke-width="1.5"/>';
  return '<svg viewBox="0 0 ' + o.width + ' ' + o.height + '" role="img" aria-label="Bar chart, ' + years[0] + ' to ' + years[years.length - 1] + '">' + g + '</svg>';
}

// Donut chart with a centre label and a legend list beside it.
export function donutChart(parts, opts) {
  const o = Object.assign({ size: 220, colors: [NAVY, GOLD, GREEN, '#7a5a00', '#4a7ba6'] }, opts || {});
  const cx = o.size / 2, cy = o.size / 2, r = o.size / 2 - 14, thick = 34;
  const total = parts.reduce((s, p) => s + p.value, 0);
  let angle = -Math.PI / 2;
  let arcs = '';
  parts.forEach((p, i) => {
    const frac = p.value / total;
    const a0 = angle, a1 = angle + frac * Math.PI * 2;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const large = frac > 0.5 ? 1 : 0;
    arcs += '<path d="M ' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + '" fill="none" stroke="' + o.colors[i % o.colors.length] + '" stroke-width="' + thick + '"/>';
    angle = a1;
  });
  const centre = o.centre || '';
  return '<svg viewBox="0 0 ' + o.size + ' ' + o.size + '" width="' + o.size + '" height="' + o.size + '" role="img" aria-label="Donut chart">' + arcs +
    '<text x="' + cx + '" y="' + (cy - 4) + '" text-anchor="middle" font-size="26" font-weight="800" fill="' + NAVY + '">' + centre + '</text>' +
    '<text x="' + cx + '" y="' + (cy + 18) + '" text-anchor="middle" font-size="12" fill="' + MUTED + '">' + (o.centreLabel || '') + '</text></svg>';
}

export { GREEN, RED };
