"""Restore read-only downloads below the frozen map, without changing its assets."""
from html import escape
from pathlib import Path
import sys


root = Path(sys.argv[1])
index = root / 'index.html'
html = index.read_bytes()
heading = escape('<h3>Outpost-Liste</h3>').encode()
controls = escape(
    '<p><button type="button" id="export-json" disabled>JSON exportieren</button> '
    '<button type="button" id="export-csv" disabled>CSV exportieren</button></p>'
).encode()
data_loaded = b'data=rows;'
exports = escape("""
const fields = ['id', 'source_key', 'alliance', 'structure_type', 'level', 'coord_x', 'coord_y', 'quadrant'];
const exportRows = data.map(row => ({
  id: row.id, source_key: row.source_key, alliance: row.alliance,
  structure_type: row.structure_type, level: row.level, coord_x: row.coord_x,
  coord_y: row.coord_y, quadrant: quad(row)
}));
function csvCell(value) {
  let text = String(value ?? '');
  if (typeof value === 'string' && /^[=+@\\-\\t\\r\\n]/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
}
function download(format, content, mimeType) {
  // Downloads use the host document; the map iframe keeps its existing sandbox.
  const host = window.parent;
  const link = host.document.createElement('a');
  link.href = host.URL.createObjectURL(new Blob([content], { type: mimeType }));
  link.download = 'PHALANX-Outposts-1885.' + format;
  host.document.body.append(link);
  link.click();
  link.remove();
  host.setTimeout(() => host.URL.revokeObjectURL(link.href), 30000);
}
$('export-json').disabled = $('export-csv').disabled = !exportRows.length;
$('export-json').onclick = () =>
  download('json', JSON.stringify(exportRows, null, 2), 'application/json');
$('export-csv').onclick = () => {
  const lines = [fields.map(csvCell).join(';'), ...exportRows.map(row => fields.map(key => csvCell(row[key])).join(';'))];
  download('csv', '\\ufeff' + lines.join('\\r\\n'), 'text/csv;charset=utf-8');
};
""").encode()

if html.count(heading) != 1 or html.count(data_loaded) != 1 or b'id=&quot;export-json&quot;' in html:
    raise SystemExit('Unexpected Outpost Map export integration anchors')
index.write_bytes(html.replace(heading, heading + controls).replace(data_loaded, data_loaded + exports))
