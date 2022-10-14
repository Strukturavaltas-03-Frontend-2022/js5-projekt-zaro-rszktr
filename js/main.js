import { apiUrl, createUser } from "./settings.js";
import { translateForm, translateTableHeader } from "./translation.js";
import { methodAlertInvalid, methodAlertSuccess } from "./toast.js";
import { createFunctionalButton, methodDelete, methodEdit } from "./buttons.js";
import { addLiveValidator, universalValidator } from "./validator.js";


const mainTable = document.querySelector('.dynamic-table')
const tableColumns = ['id', 'name', 'emailAddress', 'address'];

export let editableRowOriginalContent = []
let idNumberHelper = 0;


// Űrlap validátorainak aktiválása
addLiveValidator('.new__name');
addLiveValidator('.new__emailAddress');
addLiveValidator('.new__address');


// Táblázat létrehozása
const createFullTable = (data) => {
  mainTable.innerHTML = '';
  data.forEach(unit => createRow(unit, 'beforeend'))
}

export const createRow = (object, position) => {
  const tableRow = document.createElement('tr');
  tableRow.setAttribute('id', `${object.id}`)
  mainTable.insertAdjacentElement(position, tableRow);

  tableColumns.forEach(column => {
    const td = document.createElement('td');
    tableRow.appendChild(td);
    td.textContent = object[column]
  })

  createFunctionalButton(tableRow, 'edit', methodEdit)
  createFunctionalButton(tableRow, 'delete', methodDelete)
}


// Input mezők létrehozása adatok szerkesztéséhez
export const switchToInputFields = (oneRow) => {
  const editableRow = oneRow.querySelectorAll('td')

  for (let i = 1; i < 4; i += 1) {
    editableRow[i].innerHTML = `<input type="text" class="${tableColumns[i]}" value="${editableRow[i].innerHTML}"></input>`
  }

  addLiveValidator('.name');
  addLiveValidator('.emailAddress');
  addLiveValidator('.address');
};



// Eredeti adatok visszaállítása visszavonás esetén
export function switchBackToOriginalText() {
  const currentRow = document.querySelector('.name').parentElement.parentElement
  const editableRow = currentRow.querySelectorAll('td')

  for (let i = 1; i < 4; i += 1) {
    editableRow[i].innerHTML = '';
    editableRow[i].innerHTML = `${Object.values(editableRowOriginalContent[0])[i]}`
  }
}

// Új adatok megjelenítése mentés esetén
export function switchBackToText(objectFromServer) {
  const currentRow = document.querySelector('.name').parentElement.parentElement
  const editableRow = currentRow.querySelectorAll('td')

  for (let i = 1; i < 4; i += 1) {
    editableRow[i].innerHTML = '';
    editableRow[i].innerHTML = `${Object.values(objectFromServer)[i]}`
  }
}

// Szerkesztés előtti, biztonsági mentéshez szükséges fetch
export const getUserData = async (clickedButton) => {
  try {
    const currentRow = clickedButton.parentElement.parentElement
    const response = await fetch(`${apiUrl}/${currentRow.firstChild.innerHTML}`);
    const data = await response.json();
    return data
  }
  catch (error) {
    console.error(error)
  }
};

// Szerkesztett adatok összegyűjtése
export const getEditedData = () => {
  const currentId = document.querySelector('.name').parentElement.previousElementSibling.textContent
  const newUnit = {
    id: `${currentId}`
  };

  for (let i = 1; i < 4; i += 1) {
    const inputValue = document.querySelector(`.${tableColumns[i]}`).value
    newUnit[tableColumns[i]] = inputValue
  }
  return newUnit;
}

// Űrlapon bevitt adatok összegyűjtése
export const getNewPersonData = () => {
  if (universalValidator('.new__name') == true
    && universalValidator('.new__emailAddress') == true
    && universalValidator('.new__address') == true) {
    const newId = idNumberHelper + 1;
    idNumberHelper += 1
    const newUnit = {
      id: newId
    };

    for (let i = 1; i < 4; i += 1) {
      const inputValue = document.querySelector(`.new__${tableColumns[i]}`).value
      newUnit[tableColumns[i]] = inputValue
    }
    createUser(newUnit)
    methodAlertSuccess()
  } else {
    methodAlertInvalid()
  }
};

export const newUserButton = document.querySelector('.button__newUser')
newUserButton.addEventListener('click', getNewPersonData)


// Táblázat létrehozása betöltéskor
export const createTableAtStartUp = async () => {
  await checkForLocalStorage();
  translateForm()
  translateTableHeader()
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    createFullTable(data)
    idNumberHelper = Math.max(...data.map(object => object.id))
  }
  catch (error) {
    console.error(error)
  }
};


export const checkForLocalStorage = async () => {
  if (localStorage.getItem('language') === null) {
    localStorage.setItem('language', 'hungarian')
  }
}

createTableAtStartUp()
