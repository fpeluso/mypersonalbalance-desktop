const window = require('./windows/authWindow')
const authenticate = require('./sheetHelpers/authentication')
const reader = require('./sheetHelpers/sheetReader')
const writer = require('./sheetHelpers/sheetWriter')

let authWindow

const onSubmit = (args, parentWindow) => {
    authenticate.authenticate().then((res) => {
        if (res.err) {
            openGetTokenModal(res.err.url, parentWindow)
        } else {
            writer.writeSheet(res, null, args).then((data) => {
                parentWindow.webContents.send('writeSuccess');
            }).catch((err, authUrl) => {
                console.log('error during write operations ', err);
            })
        }
    })
}

const openGetTokenModal = (authUrl, parentWindow) => {
    authWindow = window.createWindow(authUrl, parentWindow)
}

const sendAuthUrl = (authUrl) => {
    if (authWindow) authWindow.webContents.send('authUrl', authUrl);
    else console.log('authWindow not created')
}

const saveToken = (code) => {
    authenticate.authenticate(code).then((auth) => {
        console.log('ok');
        authWindow.close();
    }).catch((err) => {
        console.log('wtf? ', err);
    })
}

module.exports = {
    onSubmit,
    openGetTokenModal,
    sendAuthUrl,
    saveToken
}