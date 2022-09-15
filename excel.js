const xl = require('excel4node');
const wb = new xl.Workbook();
const ws = wb.addWorksheet('Worksheet Name'); const data = [
    {
        "name": "Donatas",
        "email": "ladysas.donatas@gmail.com",
        "mobile": "+37063852089"
    }
];
const headingColumnNames = [
    "Name",
    "Email",
    "Mobile",
];

let headingColumnIndex = 1;
headingColumnNames.forEach(heading => {
    ws.cell(1, headingColumnIndex++)
        .string(heading)
});

let rowIndex = 2;
data.forEach(record => {
    let columnIndex = 1;
    Object.keys(record).forEach(columnName => {
        ws.cell(rowIndex, columnIndex++)
            .string(record[columnName])
    });
    rowIndex++;
});
wb.write('data.xlsx');