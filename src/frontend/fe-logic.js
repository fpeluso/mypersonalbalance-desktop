const { ipcRenderer } = require('electron')

let myForm = document.querySelector('#myForm');
let expenditureType = document.getElementById("expenditureType");
let description = document.getElementById("description");
let amount = document.getElementById("amount");
let checkOthers = document.getElementById("speseAltrui");


let submitButton = document.getElementById("confirmAndSubmit");

let formData = {}
let payload = []

let rowCounter = 0;
const toSubmitTemplate = (rowCounter, formData) => {
    return (
        `
        <tr id="row${rowCounter}" >
            <td>
                ${formData.type}
            </td>
            <td>
                ${formData.description}
            </td>
            <td>
                ${formData.amount}
            </td>
            <td>
                ${formData.checkOthers ? "SI" : "NO"}
            </td>
        </tr>
    `
    )
}

myForm.addEventListener("submit", (e) => {
    e.preventDefault();

    formData.type = expenditureType.value;
    formData.description = description.value;
    formData.amount = amount.value;
    formData.checkOthers = speseAltrui.checked;

    payload.push(JSON.parse(JSON.stringify(formData)))
    document.getElementById('dataToSubmit').innerHTML += (toSubmitTemplate(rowCounter, formData))
    rowCounter++;
    myForm.reset();
})

submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    ipcRenderer.send('onSubmit', payload);
})

ipcRenderer.on('writeSuccess', (event, args) => {
    document.getElementById('dataToSubmit').innerHTML = ""
})