import * as XLSX from 'xlsx/xlsx.mjs';
import * as fs from 'fs';
XLSX.set_fs(fs);

async function report(data) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(JSON.parse(JSON.stringify(data)));
  ws['!cols'] = [
    {wch: 10},
    {wch: 10},
    {wch: 10},
    {wch: 10},
    {wch: 22},
    {wch: 10},
    {wch: 12},
    {wch: 12},
    {wch: 22},
    {wch: 22},
  ];
  XLSX.utils.book_append_sheet(wb, ws, "Report");
  XLSX.writeFile(wb, "report.xlsx");
  return ws
}

export default report