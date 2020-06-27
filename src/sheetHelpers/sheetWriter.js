const {
    google
} = require('googleapis');

// Spreadsheet ID
const testSheetId = '1pA3PxhiNen5hYtfD9-q74hBLC5tnL0U1yKGqFSV48a8';

function writeSheet(auth, sheetId, data) {
    let spreadsheetId = sheetId || testSheetId

    const sheets = google.sheets({
        version: 'v4',
        auth
    });

    let values = [];
    data.forEach(line => {
        let tmp = [
            line.type,
            line.description,
            line.amount,
            line.checkOthers
        ]
        values.push(tmp);
    });

    return new Promise((resolve, reject) => {
        sheets.spreadsheets.values.append({
            spreadsheetId: spreadsheetId,
            range: 'Foglio2!A1:B',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values
            }
        }, (err, res) => {
            if (err) reject('The API returned an error: ' + err);
            resolve('')
        })
    })
}

module.exports = {
    writeSheet
}