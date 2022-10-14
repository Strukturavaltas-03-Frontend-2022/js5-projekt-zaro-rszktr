const apiUrl = `http://localhost:3000/users`

const buttonHungarian = document.querySelector('.hun')
const buttonEnglish = document.querySelector('.eng')

const title = document.querySelector('header h1')
const labelName = document.querySelector('.label__name')
const labelEmailAddress = document.querySelector('.label__emailAddress')
const labelAddress = document.querySelector('.label__address')

const headerName = document.querySelector('.header__name')
const headerEmailAddress = document.querySelector('.header__emailAddress')
const headerAddress = document.querySelector('.header__address')

const mainTable = document.querySelector('.dynamic-table')
const tableColumns = ['id', 'name', 'emailAddress', 'address'];

let editableRowOriginalContent = ''
let idNumberHelper = 0;

const setLanguageEnglish = async () => {
  localStorage.setItem('language', 'english')
  await translateForm()
  await translateTableHeader()
  createTableAtStartUp()
}

const setLanguageHungarian = async () => {
  localStorage.setItem('language', 'hungarian')
  await translateForm()
  await translateTableHeader()
  createTableAtStartUp()
}

const translateTableHeader = async () => {
  title.textContent = await getTextFromJson('title')
  headerName.textContent = await getTextFromJson('name')
  headerEmailAddress.textContent = await getTextFromJson('emailAddress')
  headerAddress.textContent = await getTextFromJson('address')
}

const translateForm = async () => {
  labelName.textContent = `${await getTextFromJson('name')} :`
  labelEmailAddress.textContent = `${await getTextFromJson('emailAddress')} :`
  labelAddress.textContent = `${await getTextFromJson('address')} :`
}

buttonHungarian.addEventListener('click', setLanguageHungarian)
buttonEnglish.addEventListener('click', setLanguageEnglish)


// Működés Enter leütése esetén is
buttonHungarian.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    setLanguageHungarian()
  }
})

buttonEnglish.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    setLanguageEnglish()
  }
})


//RegExp
const nameRegexp = /^[A-ZÁÉÍÓÖŐÚÜŰa-záéíóöőúüű\'\.\-]{1,30}( [A-ZÁÉÍÓÖŐÚÜŰa-záéíóöőúüű\'\.\-]{1,30})+$/;
const addressRegexp = /^[ A-ZÁÉÍÓÖŐÚÜŰa-záéíóöőúüű\d\-\'\.\,]{6,}$/
// const emailRegexp = /^\S+@\S+\.\S+/;

// src: https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression
const emailRegexp = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;


// POST - új adat létrehozása
function createUser(newData) {
  let data = newData
  let fetchOptions = {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  fetch(`http://localhost:3000/users`, fetchOptions).then(
    resp => resp.json(),
    err => console.error(err)
  ).then(
    createRow(newData, 'afterbegin')
  )
}

// PUT - adat átírása
function saveNewData() {
  let data = getEditedData();
  let fetchOptions = {
    method: "PUT",
    mode: "cors",
    cache: "no-cache",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
  fetch(`http://localhost:3000/users/${data.id}`, fetchOptions).then(
    resp => resp.json(),
    err => console.error(err)
  );
  return data
}

// Táblázat létrehozása
const createFullTable = (data) => {
  mainTable.innerHTML = '';
  data.forEach(unit => createRow(unit, 'beforeend'))
}

const createRow = (object, position) => {
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


// Gombok létrehozása
const createEmptyButton = async (parent2) => {
  const td = document.createElement('td');
  parent2.appendChild(td);
  const button = document.createElement('button');
  td.appendChild(button);
  return button
}

const getCurrentLanguage = async () => {
  return localStorage.getItem('language')
}

async function getTextFromJson(string) {
  try {
    const lang = await getCurrentLanguage()
    const response = await fetch(`./json/${lang}.json`);
    const data = await response.json();
    return data[lang][string]
  }
  catch (error) {
    console.error(error)
  }
}

const createFunctionalButton = async (parent1, string, functionToInsert) => {
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
async function methodDelete() {
  const currentRow = this.parentElement.parentElement
  await fetch(`${apiUrl}/${currentRow.firstChild.innerHTML}`, {
    method: 'DELETE',
  })
  currentRow.parentElement.removeChild(currentRow);
  methodAlertDelete()
}

async function methodEdit() {
  const currentRow = this.parentElement.parentElement
  editableRowOriginalContent = await getUserData(this)
  switchToInputFields(currentRow)
  createSaveAndCancelButtons(currentRow)
}

async function methodSave() {
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

async function methodReturn() {
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


// Input mezők létrehozása adatok szerkesztéséhez
const switchToInputFields = (oneRow) => {
  const editableRow = oneRow.querySelectorAll('td')

  for (let i = 1; i < 4; i += 1) {
    editableRow[i].innerHTML = `<input type="text" class="${tableColumns[i]}" value="${editableRow[i].innerHTML}"></input>`
  }

  addLiveValidator('.name');
  addLiveValidator('.emailAddress');
  addLiveValidator('.address');
};


// Validátorok
function addLiveValidator(inputClass) {
  const inputElementForListener = document.querySelector(inputClass);
  inputElementForListener.addEventListener('keyup', universalValidator)
}

function universalValidator(inputClass) {
  let inputField = '';

  if (this === window) {
    inputField = document.querySelector(inputClass);
  } else {
    inputField = document.querySelector(`.${this.classList.value.split(' ')[0]}`);
  }

  let regexpToUse = inputClassChecker(inputField)
  let typedData = inputField.value.trimEnd()
  return dataValidation(regexpToUse, typedData, inputField)
}

function inputClassChecker(inputElement) {
  let inputClassToCheck = inputElement.classList.value.split(' ')[0]

  if (inputClassToCheck == 'name' || inputClassToCheck == 'new__name') {
    return nameRegexp;
  } else if (inputClassToCheck == 'emailAddress' || inputClassToCheck == 'new__emailAddress') {
    return emailRegexp;
  } else if (inputClassToCheck === 'address' || inputClassToCheck == 'new__address') {
    return addressRegexp;
  }
}

let dataValidation = (regex, scrapedText, inputfield) => {
  if (regex.test(scrapedText)) {
    if (inputfield.classList.contains("invalid")) {
      inputfield.classList.remove("invalid")
    }
    inputfield.classList.add("valid")
    return true
  } else {
    if (inputfield.classList.contains("valid")) {
      inputfield.classList.remove("valid")
    }
    inputfield.classList.add("invalid")
    return false
  }
}

// Űrlap validátorainak aktiválása
addLiveValidator('.new__name');
addLiveValidator('.new__emailAddress');
addLiveValidator('.new__address');


// Eredeti adatok visszaállítása visszavonás esetén
function switchBackToOriginalText() {
  const currentRow = document.querySelector('.name').parentElement.parentElement
  const editableRow = currentRow.querySelectorAll('td')

  for (let i = 1; i < 4; i += 1) {
    editableRow[i].innerHTML = '';
    editableRow[i].innerHTML = `${Object.values(editableRowOriginalContent)[i]}`
  }
}

// Új adatok megjelenítése mentés esetén
function switchBackToText(objectFromServer) {
  const currentRow = document.querySelector('.name').parentElement.parentElement
  const editableRow = currentRow.querySelectorAll('td')

  for (let i = 1; i < 4; i += 1) {
    editableRow[i].innerHTML = '';
    editableRow[i].innerHTML = `${Object.values(objectFromServer)[i]}`
  }
}

// Szerkesztés előtti, biztonsági mentéshez szükséges fetch
const getUserData = async (clickedButton) => {
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
const getEditedData = () => {
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
const getNewPersonData = () => {
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

const newUserButton = document.querySelector('.button__newUser')
newUserButton.addEventListener('click', getNewPersonData)


// Táblázat létrehozása betöltéskor
const createTableAtStartUp = async () => {
  await checkForLocalStorage();
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


const checkForLocalStorage = async () => {
  if (localStorage.getItem('language') === null) {
    localStorage.setItem('language', 'hungarian')
  }
}

createTableAtStartUp()


// Alerts, toasts
// src: https://codepen.io/uxmankabir/pen/YzEmKBZ

// TOAST MESSAGES
async function methodAlert() {
  toastEdit(await getTextFromJson('alertEdit'))
}

async function methodAlertInvalid() {
  toastInvalid(await getTextFromJson('alertInvalid'))
}

async function methodAlertSuccess() {
  toastSuccess(await getTextFromJson('alertSuccess'))
}

async function methodAlertDelete() {
  toastDelete(await getTextFromJson('alertDelete'))
}


// CREATE SUCCESS TOAST
function toastSuccess(content) {
  toastPopup(content, "success");
}

// CREATE SUCCESS TOAST

async function toastEdit(content) {
  toastPopup(content, "edit");
}

function toastInvalid(content) {
  toastPopup(content, "invalidAlert");
}

function toastDelete(content) {
  toastPopup(content, "delete");
}

// CREATE TOAST
async function toastPopup(content, type) {
  // toast stack
  let toastStack = document.querySelector("#toastStack");
  if (!document.body.contains(toastStack)) {
    toastStack = document.createElement("div");
    toastStack.setAttribute("id", "toastStack");
    document.body.appendChild(toastStack);
  }

  // toast container
  let toast = document.createElement("div");
  toast.classList.add("toast");
  toast.classList.add(`toast--${type}`);

  // toast content
  let toastContent = document.createElement("div");
  toastContent.classList.add("toast__content");
  toastContent.textContent = content;
  toast.appendChild(toastContent);

  // close button
  let closeButton = document.createElement("button");
  closeButton.classList.add("toast__close");
  closeButton.textContent = "✕";
  toast.appendChild(closeButton);

  closeButton.addEventListener("click", function (event) {
    event.stopPropagation();
    toast.classList.add("toast--hide");
    setTimeout(function () {
      toast.remove();
    }, 400);
  });

  toastStack.appendChild(toast);

  // automatically remove toast
  setTimeout(function () {
    toast.classList.add("toast--hide");
    setTimeout(function () {
      toast.remove();
    }, 400);
  }, 5000);
}
