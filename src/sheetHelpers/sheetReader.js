const {
    google
} = require('googleapis');

// Spreadsheet ID
const testSheetId = '1pA3PxhiNen5hYtfD9-q74hBLC5tnL0U1yKGqFSV48a8';

function readSheet(auth, sheetId) {
    let spreadsheetId = sheetId || testSheetId

    const sheets = google.sheets({
        version: 'v4',
        auth
    });

    return new Promise((resolve, reject) => {
        sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: 'Foglio1!A2:E',
        }, (err, res) => {
            if (err) reject('The API returned an error: ' + err);
            const rows = res.data.values;
            if (rows.length) {
                resolve(rows)
            } else {
                reject('No data found. err= ', err);
            }
        })
    })
}

module.exports = {
    readSheet
}