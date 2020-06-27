const { BrowserWindow, ipcMain } = require('electron')
const url = require("url");
const path = require("path");

let authWindow

const createAuthWindow = (authUrl, parentWindow) => {
    authWindow = new BrowserWindow({
        parent: parentWindow,
        modal: true,
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    })
    //     width: 1024,
    //     height: 768,
    // })

    authWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, `../frontend/auth.html`),
            protocol: "file:",
            slashes: true
        })
    );
    // authWindow.webContents.openDevTools()
    authWindow.once('ready-to-show', () => {
        authWindow.show()
    })

    authWindow.once('show', () => {
        authWindow.webContents.send('authUrl', authUrl);
    })

    authWindow.on('closed', function () {
        authWindow = null
    })



    return authWindow
}

module.exports = {
    createWindow: createAuthWindow
}