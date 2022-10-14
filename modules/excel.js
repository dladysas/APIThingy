import * as XLSX from 'xlsx/xlsx.mjs';
import * as fs from 'fs';
XLSX.set_fs(fs);

async function report(data) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(JSON.parse(JSON.stringify(data)));
  XLSX.utils.book_append_sheet(wb, ws, "Report");
  XLSX.writeFile(wb, "report.csv");
  return ws
}

export default report