// Sortable-table helper for NusaStat.
// buildSortableTable(container, columns, rows, stateKey) renders a table
// whose headers sort on click; state (sort key + direction) lives in the
// caller so a re-render keeps the user's sort. Filtering is done by the
// caller before passing rows in.

import { esc } from './format.js';

export function sortRows(rows, key, dir, numericKeys) {
  const copy = rows.slice();
  const numeric = numericKeys.indexOf(key) !== -1;
  copy.sort((a, b) => {
    const av = a[key], bv = b[key];
    let cmp;
    if (numeric) cmp = Number(av) - Number(bv);
    else cmp = String(av).localeCompare(String(bv));
    return dir === 'asc' ? cmp : -cmp;
  });
  return copy;
}

export function renderSortableTable(columns, rows, sortKey, sortDir, numericKeys) {
  const ordered = sortKey ? sortRows(rows, sortKey, sortDir, numericKeys) : rows;
  let head = '<tr>';
  columns.forEach((col) => {
    const arrow = sortKey === col.key ? (sortDir === 'asc' ? ' &#9650;' : ' &#9660;') : '';
    const cls = ' class="' + (col.num ? 'num ' : '') + 'sortable"';
    head += '<th' + cls + ' data-sort="' + col.key + '" tabindex="0">' + esc(col.label) +
      (sortKey === col.key ? '<span class="arrow">' + arrow + '</span>' : '') + '</th>';
  });
  head += '</tr>';
  let body = '';
  ordered.forEach((row) => {
    body += '<tr>';
    columns.forEach((col) => {
      const cell = col.render ? col.render(row) : esc(row[col.key]);
      body += '<td' + (col.num ? ' class="num"' : '') + '>' + cell + '</td>';
    });
    body += '</tr>';
  });
  return '<div class="table-wrap"><table class="data-table"><thead>' + head + '</thead><tbody>' + body + '</tbody></table></div>';
}

// Attach click (and Enter-key) sorting to a rendered table. onSort(key, dir)
// is called with the new sort; the caller re-renders.
export function attachSorting(root, currentKey, currentDir, onSort) {
  root.querySelectorAll('th.sortable').forEach((th) => {
    const key = th.getAttribute('data-sort');
    const go = () => {
      if (currentKey === key) onSort(key, currentDir === 'asc' ? 'desc' : 'asc');
      else onSort(key, 'asc');
    };
    th.addEventListener('click', go);
    th.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });
}
