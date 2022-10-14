import { getUserData, editableRowOriginalContent, switchToInputFields, getNewPersonData, newUserButton, switchBackToOriginalText, switchBackToText, checkForLocalStorage } from "./main.js";
import { getTextFromJson } from "./translation.js";
import { apiUrl, saveNewData } from "./settings.js";
import { methodAlert, methodAlertDelete, methodAlertSuccess, methodAlertInvalid } from "./toast.js";


// Gombok létrehozása
const createEmptyButton = async (parent2) => {
  const td = document.createElement('td');
  parent2.appendChild(td);
  const button = document.createElement('button');
  td.appendChild(button);
  return button
}


export const createFunctionalButton = async (parent1, string, functionToInsert) => {
  const buttonToWrite = await createEmptyButton(parent1);
  buttonToWrite.textContent = await getTextFromJson(string);
  buttonToWrite.addEventListener('click', functionToInsert); // Mivel gomb, ezért az Enter leütésnél is működik
  createButtonClass(string, buttonToWrite)
};


const createButtonClass = async (string, button) => {
  switch (string) {
    case 'edit':
      button.classList.add('button__edit')
      break;
    case 'delete':
      button.classList.add('button__delete')
      break;
    case 'save':
      button.classList.add('button__save')
      break;
    case 'return':
      button.classList.add('button__return')
      break;
    default:
      console.error(`Hiba! Nincs gomb egyezés.`);
  }
}

const createSaveAndCancelButtons = (rowElement) => {
  rowElement.removeChild(rowElement.lastChild);
  rowElement.removeChild(rowElement.lastChild);
  silenceAllButtons();
  activateAlertForAllButtons();

  createFunctionalButton(rowElement, 'save', methodSave)
  createFunctionalButton(rowElement, 'return', methodReturn)
}

const createEditAndDeleteButtons = (rowElement) => {
  rowElement.removeChild(rowElement.lastChild);
  rowElement.removeChild(rowElement.lastChild);

  createFunctionalButton(rowElement, 'edit', methodEdit)
  createFunctionalButton(rowElement, 'delete', methodDelete)

  reactivateAllButtons()
}


// Gombok funkciói
export async function methodDelete() {
  const currentRow = this.parentElement.parentElement
  await fetch(`${apiUrl}/${currentRow.firstChild.innerHTML}`, {
    method: 'DELETE',
  })
  currentRow.parentElement.removeChild(currentRow);
  methodAlertDelete()
}

export async function methodEdit() {
  const currentRow = this.parentElement.parentElement;
  editableRowOriginalContent.push(await getUserData(this))
  switchToInputFields(currentRow)
  createSaveAndCancelButtons(currentRow)
}

export async function methodSave() {
  const currentRow = this.parentElement.parentElement
  const inputs = currentRow.querySelectorAll('input')
  const inputDatas = []
  inputs.forEach(item => inputDatas.push(item.classList.contains('invalid')))
  if (inputDatas.includes(true) === true) {
    methodAlertInvalid()
  } else {
    const dataFromServer = saveNewData();
    switchBackToText(dataFromServer)
    createEditAndDeleteButtons(currentRow);
    methodAlertSuccess()
  }
}

export async function methodReturn() {
  const currentRow = this.parentElement.parentElement;
  switchBackToOriginalText();
  createEditAndDeleteButtons(currentRow);
}


// Gombok eseményfigyelőinek kezelése
const silenceAllButtons = () => {
  const allButtons = document.querySelectorAll('button')

  const deleteButtons = [...allButtons].filter(item => item.classList.contains('button__delete') === true)
  deleteButtons.forEach(item => item.removeEventListener('click', methodDelete))

  const editButtons = [...allButtons].filter(item => item.classList.contains('button__edit') === true)
  editButtons.forEach(item => item.removeEventListener('click', methodEdit))

  newUserButton.removeEventListener('click', getNewPersonData)
}

const activateAlertForAllButtons = () => {
  const allButtons = document.querySelectorAll('button')
  allButtons.forEach(item => item.addEventListener('click', methodAlert))
}

const reactivateAllButtons = () => {
  const allButtons = document.querySelectorAll('button')
  allButtons.forEach(item => item.removeEventListener('click', methodAlert))

  const deleteButtons = [...allButtons].filter(item => item.classList.contains('button__delete') === true)
  deleteButtons.forEach(item => item.addEventListener('click', methodDelete))

  const editButtons = [...allButtons].filter(item => item.classList.contains('button__edit') === true)
  editButtons.forEach(item => item.addEventListener('click', methodEdit))

  newUserButton.addEventListener('click', getNewPersonData)
}

