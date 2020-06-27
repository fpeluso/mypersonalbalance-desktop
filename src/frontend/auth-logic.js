const { ipcRenderer } = require('electron')

const requireAuth = document.getElementById('require-auth')
const memorizeToken = document.getElementById('memorize-token')
const tokenForm = document.querySelector('#token-form')

let authUrl;
let link = document.createElement('P')
link.id = 'authlink'
link.style.color = 'blue'
link.style.textDecoration = 'underline'
link.style.marginTop = '5px'
link.style.cursor = 'pointer'
link.appendChild(document.createTextNode('link'))

ipcRenderer.on('authUrl', (event, args) => {
    authUrl = args
    requireAuth.appendChild(link)
})

link.addEventListener("click", e => {
    e.preventDefault()
    requireAuth.style.display = 'none'
    memorizeToken.style.display = 'block'
    setTimeout(() => {
        require('electron').shell.openExternal(authUrl)
    }, 200)
})

tokenForm.addEventListener("submit", e => {
    e.preventDefault();
    let code = document.getElementById('storeCode').value
    ipcRenderer.send('onSaveToken', code);
})