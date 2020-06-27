const {
    app,
    ipcMain
} = require('electron')
const window = require('./windows/mainWindow')
const ipcEvents = require('./ipcEvents')

let mainWindow

function createWindow() {
    mainWindow = window.createWindow();
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    if (mainWindow === null) mainWindow = createWindow()
})

ipcMain.on('onSubmit', (event, args) => {
    ipcEvents.onSubmit(args, mainWindow)
})

ipcMain.on('onAuthShown', (event, args) => {
    ipcEvents.sendAuthUrl(args)
})

ipcMain.on('onSaveToken', (event, args) => {
    ipcEvents.saveToken(args)
})