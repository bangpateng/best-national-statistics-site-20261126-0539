// Number formatting helpers for NusaStat. All output is plain text
// (no network, no locale services); separators are fixed English style.

export function fmtInt(value) {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function fmtOneDecimal(value) {
  return value.toFixed(1);
}

export function fmtPercent(value, decimals) {
  const d = decimals === undefined ? 2 : decimals;
  return value.toFixed(d) + '%';
}

// 281.6 (millions) -> "281.6 million"
export function fmtMillions(value) {
  return value.toFixed(1) + ' million';
}

// Density: people per km2, rounded to a whole number.
export function density(populationMillions, areaKm2) {
  return Math.round((populationMillions * 1000000) / areaKm2);
}

// Escape text that is interpolated into HTML strings.
export function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
