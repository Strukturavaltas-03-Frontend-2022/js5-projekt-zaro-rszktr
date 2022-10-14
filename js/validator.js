import { nameRegexp, addressRegexp, emailRegexp } from "./regexp.js";


export function addLiveValidator(inputClass) {
  const inputElementForListener = document.querySelector(inputClass);
  inputElementForListener.addEventListener('keyup', universalValidator)
}

export function universalValidator(inputClass) {
  let inputField = '';

  if (this === undefined) {
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
