import { createTableAtStartUp, checkForLocalStorage } from "./main.js";

const buttonHungarian = document.querySelector('.hun')
const buttonEnglish = document.querySelector('.eng')

const title = document.querySelector('header h1')

const labelName = document.querySelector('.label__name')
const labelEmailAddress = document.querySelector('.label__emailAddress')
const labelAddress = document.querySelector('.label__address')
const buttonNewUser = document.querySelector('.button__newUser')

const headerName = document.querySelector('.header__name')
const headerEmailAddress = document.querySelector('.header__emailAddress')
const headerAddress = document.querySelector('.header__address')


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

export const translateForm = async () => {
  title.textContent = await getTextFromJson('title')
  labelName.textContent = `${await getTextFromJson('name')}:`
  labelEmailAddress.textContent = `${await getTextFromJson('emailAddress')}:`
  labelAddress.textContent = `${await getTextFromJson('address')}:`
  buttonNewUser.textContent = await getTextFromJson('addNewButton')
}

export const translateTableHeader = async () => {
  headerName.textContent = await getTextFromJson('name')
  headerEmailAddress.textContent = await getTextFromJson('emailAddress')
  headerAddress.textContent = await getTextFromJson('address')
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

const getCurrentLanguage = async () => {
  return localStorage.getItem('language')
}

export async function getTextFromJson(string) {
  try {
    await checkForLocalStorage()
    const lang = await getCurrentLanguage()
    const response = await fetch(`./json/${lang}.json`);
    const data = await response.json();
    return data[lang][string]
  }
  catch (error) {
    console.error(error)
  }
}