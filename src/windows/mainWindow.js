const { BrowserWindow } = require('electron')
const url = require("url");
const path = require("path");

let mainWindow

const createMainWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            nodeIntegration: true
        }
    })

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, `../frontend/index.html`),
            protocol: "file:",
            slashes: true
        })
    );
    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function () {
        mainWindow = null
    })

    return mainWindow;
}

module.exports = {
    createWindow: createMainWindow
}